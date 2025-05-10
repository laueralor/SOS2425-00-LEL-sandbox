<svelte:head>
  <!-- AmCharts 5 -->
  <script src="https://cdn.amcharts.com/lib/5/index.js"></script>
  <script src="https://cdn.amcharts.com/lib/5/percent.js"></script>
  <script src="https://cdn.amcharts.com/lib/5/themes/Animated.js"></script>
</svelte:head>

<script lang="ts">
  import { onMount } from 'svelte';
  import { dev } from '$app/environment';

  let root: any;
  let API = '/api/v1/home-buying-selling-stats';
  if (dev) {
    API = 'http://localhost:16078' + API;
  }

  async function fetchAndRenderPyramid() {
    const res = await fetch(API);
    const raw: Array<Record<string, any>> = await res.json();

    // Agrupar y sumar viviendas nuevas por provincia
    const grouped: Record<string, number> = {};
    raw.forEach(r => {
      const prov = String(r.province).toLowerCase();
      const v = Number(r.transaction_new_housing) || 0;
      grouped[prov] = (grouped[prov] || 0) + v;
    });

    // Convertir a array y ordenar ASC para invertir la pirámide
    const pyramidData = Object.entries(grouped)
      .map(([province, value]) => ({ category: province, value }))
      .sort((a, b) => a.value - b.value);

    // Destruir anterior instancia si existe
    if (root) {
      root.dispose();
    }

    // Referencias a AmCharts desde window
    const am5 = (window as any).am5;
    const am5percent = (window as any).am5percent;
    const am5themes_Animated = (window as any).am5themes_Animated;

    // Crear root y tema
    root = am5.Root.new('pyramid-container');
    root.setThemes([am5themes_Animated.new(root)]);

    // Crear el chart
    const chart = root.container.children.push(
      am5percent.SlicedChart.new(root, {
        layout: root.verticalLayout
      })
    );

    // Serie de tipo funnel (vertical)
    const series = chart.series.push(
      am5percent.FunnelSeries.new(root, {
        categoryField: 'category',
        valueField: 'value',
        orientation: 'vertical',
        alignLabels: true
      })
    );

    // Etiquetas y tooltips
    series.labels.template.setAll({
      text: '{category}'
    });
    series.slices.template.setAll({
      tooltipText: '{category}: {value} viviendas nuevas',
      interactive: true
    });

    // Asignar datos
    series.data.setAll(pyramidData);
  }

  onMount(() => {
    fetchAndRenderPyramid();
    const interval = setInterval(fetchAndRenderPyramid, 5000);
    return () => {
      clearInterval(interval);
      root && root.dispose();
    };
  });
</script>
<figure>
    <h2 style="text-align:center; margin-top:1rem;">
        Pirámide Viviendas Nuevas por Provincia
    </h2>
    <div
        id="pyramid-container"
        style="width:100%; height:600px; max-width:800px; margin:0 auto;"
    ></div>
    <p style="text-align:center; color:#555; margin:1rem 0;">
        Total de viviendas nuevas agrupadas por provincia, ordenadas de menor a mayor.
    </p>
</figure>


