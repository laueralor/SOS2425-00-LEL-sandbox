<svelte:head>
  <!-- amCharts 5 -->
  <script src="https://cdn.amcharts.com/lib/5/index.js"></script>
  <script src="https://cdn.amcharts.com/lib/5/xy.js"></script>
  <script src="https://cdn.amcharts.com/lib/5/radar.js"></script>
  <script src="https://cdn.amcharts.com/lib/5/themes/Animated.js"></script>
</svelte:head>

<script lang="ts">
  import { onMount } from 'svelte';
  import { dev } from '$app/environment';

  // Tu API
  const MY_API = dev
    ? 'http://localhost:16078/api/v1/home-buying-selling-stats'
    : '/api/v1/home-buying-selling-stats';

  // Idealista RapidAPI
  const IDE_HOST = 'idealista7.p.rapidapi.com';
  const IDE_KEY  = '30dc95fca9msh69341c1646ebba5p10258ajsne34d0462ecf4';

  interface Trans { province: string; transaction_total: number; }

  let provinces: string[] = [];
  const transByProv = new Map<string, number>();
  const adsByProv   = new Map<string, number>();

  // 1) Carga tus transacciones
  async function loadTransactions() {
    const res  = await fetch(MY_API);
    const data: Trans[] = await res.json();
    data.forEach(d => {
      transByProv.set(
        d.province,
        (transByProv.get(d.province) || 0) + d.transaction_total
      );
    });
    provinces = Array.from(transByProv.keys());
  }

  // 2) Carga Idealista correctamente
  async function loadIdealista() {
    adsByProv.clear();
    for (const prov of provinces) {
      try {
        // Suggestions: GET /api/locations/search
        const suggRes = await fetch(
          `https://${IDE_HOST}/api/locations/search?locale=es&query=${encodeURIComponent(prov)}`,
          {
            headers: {
              'X-RapidAPI-Host': IDE_HOST,
              'X-RapidAPI-Key':  IDE_KEY
            }
          }
        );
        const sb = await suggRes.json();
        // Real estructura: { data: { suggestions: [ ... ] } }
        const suggs = sb.data?.suggestions || sb.suggestions || [];
        const loc    = suggs.find((x:any)=>x.type==='province') || suggs[0];
        if (!loc) { adsByProv.set(prov, 0); continue; }

        // Sublocations: GET /api/locations/{id}/sublocations
        const subRes = await fetch(
          `https://${IDE_HOST}/api/locations/${loc.locationId}/sublocations?locale=es&propertyType=homes&operation=sale`,
          {
            headers: {
              'X-RapidAPI-Host': IDE_HOST,
              'X-RapidAPI-Key':  IDE_KEY
            }
          }
        );
        const sb2 = await subRes.json();
        const items = sb2.data?.sublocations || sb2.sublocations || [];

        // Sumamos `total` por provincia extraída de `item.name`
        const sumByProv: Record<string,number> = {};
        items.forEach((it:any) => {
          // it.name viene "Municipio, Provincia"
          const parts = it.name.split(',');
          const pname = parts.slice(-1)[0].trim();
          sumByProv[pname] = (sumByProv[pname] || 0) + (it.total||0);
        });

        adsByProv.set(prov, sumByProv[prov]||0);
      } catch {
        adsByProv.set(prov, 0);
      }
    }
  }

  // 3) Render del Radar
  function renderChart() {
    document.getElementById('chartdiv')!.innerHTML = '';

    const am5      = (window as any).am5;
    const am5xy    = (window as any).am5xy;
    const am5radar = (window as any).am5radar;
    const am5theme = (window as any).am5themes_Animated;

    am5.ready(() => {
      const root = am5.Root.new('chartdiv');
      root.setThemes([am5theme.new(root)]);

      const chart = root.container.children.push(
        am5radar.RadarChart.new(root, {
          panX: false, panY: false,
          wheelX: 'panX', wheelY: 'zoomX',
          innerRadius: am5.percent(30)
        })
      );

      // Leyenda
      chart.children.unshift(
        am5.Legend.new(root, {
          centerX: am5.percent(50), x: am5.percent(50),
          marginBottom: 12
        })
      );

      // Ejes
      const xRenderer = am5radar.AxisRendererCircular.new(root, { minGridDistance: 20 });
      xRenderer.labels.template.setAll({
        radius: 5, fontSize: 12, textType: 'circular', fill: am5.color(0x555555)
      });
      xRenderer.grid.template.setAll({ stroke: am5.color(0xdddddd), strokeOpacity: 0.5 });

      const xAxis = chart.xAxes.push(
        am5xy.CategoryAxis.new(root, {
          categoryField: 'category', renderer: xRenderer
        })
      );

      const yAxis = chart.yAxes.push(
        am5xy.ValueAxis.new(root, {
          renderer: am5radar.AxisRendererRadial.new(root, {}),
          min: 0, extraMax: 0.2
        })
      );
      yAxis.renderer.labels.template.setAll({ visible: false });
      yAxis.renderer.grid.template.setAll({ strokeOpacity: 0.2 });

      // Datos
      xAxis.data.setAll(provinces.map(p=>({category:p})));
      const dataTrans = provinces.map(p=>({category:p, value:transByProv.get(p)!}));
      const dataAds   = provinces.map(p=>({category:p, value:adsByProv.get(p)!}));

      function makeSeries(name:string, data:any[], idx:number) {
        const color = chart.get('colors').getIndex(idx);
        const series = chart.series.push(
          am5radar.RadarLineSeries.new(root, {
            name, xAxis, yAxis,
            valueYField:'value', categoryXField:'category',
            stroke:color, fill:color
          })
        );
        series.strokes.template.setAll({ strokeWidth:3 });
        series.bullets.push(()=>am5.Bullet.new(root,{
          sprite:am5.Circle.new(root,{radius:4, fill:color, strokeWidth:1})
        }));
        series.data.setAll(data);
        chart.legend.data.push(series);
      }

      makeSeries('Transacciones', dataTrans, 0);
      makeSeries('Anuncios',      dataAds,   1);

      chart.appear(1000,100);
    });
  }

  onMount(async()=>{
    await loadTransactions();
    await loadIdealista();
    renderChart();
  });
</script>

<style>
  h1 { text-align:center; margin-top:1rem; font-size:2rem; }
  #chartdiv {
    width:100%; height:500px; max-width:900px; margin:1.5rem auto;
    background:#fff; border-radius:8px; box-shadow:0 4px 16px rgba(0,0,0,0.1);
  }
</style>

<h1>Radar: Transacciones vs Anuncios (Idealista)</h1>
<div id="chartdiv"></div>
