<svelte:head>
  <!-- AmCharts 5 core + XY + tema Animated -->
  <script src="https://cdn.amcharts.com/lib/5/index.js"></script>
  <script src="https://cdn.amcharts.com/lib/5/xy.js"></script>
  <script src="https://cdn.amcharts.com/lib/5/themes/Animated.js"></script>
</svelte:head>

<script lang="ts">
  import { onMount } from 'svelte';
  import { dev } from '$app/environment';

  /* ───────────── CONFIG ───────────── */
  const YEAR = 2022;                     // ← cámbialo si necesitas otro
  let root: any;
  let API = '/api/v1/home-buying-selling-stats';
  if (dev) API = 'http://localhost:16078' + API;

  /* ───────── FUNCIÓN PRINCIPAL ────── */
  async function fetchAndRenderBar() {
    const res  = await fetch(API);
    const raw: Array<Record<string, any>> = await res.json();

    /* 1) Filtrar por año y agrupar por provincia */
    interface Acc {
      total: number;
      second: number;
      protected: number;
      new: number;
    }
    const grouped: Record<string, Acc> = {};

    raw.forEach(r => {
      if (Number(r.year) !== YEAR) return;           // descartar otros años
      const prov     = String(r.province).toLowerCase();
      const acc      = grouped[prov] ||= { total:0, second:0, protected:0, new:0 };
      acc.total     += Number(r.transaction_total)               || 0;
      acc.second    += Number(r.transaction_secondhand)          || 0;
      acc.protected += Number(r.transaction_protected_housing)   || 0;
      acc.new       += Number(r.transaction_new_housing)         || 0;
    });

    /* 2) Transformar a array y ordenar por total desc */
    const chartData = Object.entries(grouped)
      .map(([province, v]) => ({
        category: province,
        total:     v.total,
        second:    v.second,
        protected: v.protected,
        new:       v.new
      }))
      .sort((a, b) => b.total - a.total);

    /* 3) Destruir gráfico anterior si existe */
    if (root) root.dispose();

    /* 4) Instancias AmCharts */
    const am5      = (window as any).am5;
    const am5xy    = (window as any).am5xy;
    const Animated = (window as any).am5themes_Animated;

    root = am5.Root.new('bars-container');
    root.setThemes([Animated.new(root)]);

    const chart = root.container.children.push(
      am5xy.XYChart.new(root, {
        panX: true,
        panY: false,
        wheelX: 'panX',
        wheelY: 'zoomX',
        layout: root.verticalLayout
      })
    );

    /* 5) Ejes */
    const xAxis = chart.xAxes.push(
      am5xy.CategoryAxis.new(root, {
        categoryField: 'category',
        renderer: am5xy.AxisRendererX.new(root, { minGridDistance: 20 }),
        tooltip: am5.Tooltip.new(root, {})
      })
    );
    xAxis.data.setAll(chartData);

    const yAxis = chart.yAxes.push(
      am5xy.ValueAxis.new(root, {
        renderer: am5xy.AxisRendererY.new(root, {})
      })
    );

    /* 6) Helper para crear serie */
    function makeSeries(field: string, name: string, colorIndex: number) {
      const series = chart.series.push(
        am5xy.ColumnSeries.new(root, {
          name,
          xAxis,
          yAxis,
          valueYField: field,
          categoryXField: 'category',
          clustered: true
        })
      );
      series.columns.template.setAll({
        tooltipText: `[bold]{categoryX}[/]\n{name}: {valueY}`,
        width: am5.percent(90)
      });
      series.data.setAll(chartData);
      series.set('fill', root.interfaceColors.get('alternative' + colorIndex));
      series.set('stroke', root.interfaceColors.get('alternative' + colorIndex));
    }

    /* 7) Crear las cuatro series */
    makeSeries('total',     'Total',               0);
    makeSeries('second',    'Segunda mano',        1);
    makeSeries('protected', 'Vivienda protegida',  2);
    makeSeries('new',       'Obra nueva',          3);

    /* 8) Leyenda */
    chart.children.push(
      am5.Legend.new(root, { centerX: am5.percent(50), x: am5.percent(50) })
    ).data.setAll(chart.series.values);
  }

  /* ───────────── Ciclo de vida ──────────── */
  onMount(() => {
    fetchAndRenderBar().catch(e => alert(e.message));
    const id = setInterval(fetchAndRenderBar, 60000);   // refresca cada minuto
    return () => { clearInterval(id); root && root.dispose(); };
  });
</script>

<figure>
  <h2 style="text-align:center; margin-top:1rem;">
    Transacciones de vivienda por provincia — {YEAR}
  </h2>

  <div id="bars-container"
       style="width:100%; height:600px; max-width:900px; margin:0 auto;">
  </div>

  <p style="text-align:center; color:#555; margin:1rem 0;">
    Barras agrupadas con los cuatro tipos de transacción para cada provincia
    (datos {YEAR} API <code>home-buying-selling-stats</code>). Se actualiza cada minuto.
  </p>
</figure>
