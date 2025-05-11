// index.js  ─ servidor Express + proxy + SvelteKit
//-------------------------------------------------
import express from 'express';
import cors    from 'cors';

import { loadBackendLEL } from './src/back/home-buying-selling-stats.js';
import { handler }        from './src/front/build/handler.js';

import { createRequire }  from 'module';
const require = createRequire(import.meta.url);   // para usar request()

const app  = express();
const PORT = process.env.PORT || 16078;

app.use(express.json());
app.use(cors());

/*──────────────────────────── 1) PROXY ────────────────────────────*/
app.use('/api-proxy', async (req, res) => {

  /* grupo 10 · registration-stats */
  if (req.url.startsWith('/api/v1/registrations-stats')) {
    const target = 'https://sos2425-10.onrender.com' + req.url;
    return req.pipe(require('request')(target)).pipe(res);

  /* grupo 20 · fines */
  } else if (req.url.startsWith('/api/v1/fines')) {
    const target = 'https://sos2425-20.onrender.com' + req.url;
    return req.pipe(require('request')(target)).pipe(res);

  /* grupo 11 · autonomy-dependence-applications */
  } else if (req.url.startsWith('/api/v1/autonomy-dependence-applications')) {
    const target = 'https://sos2425-11.onrender.com' + req.url;
    return req.pipe(require('request')(target)).pipe(res);

  /* Eurostat HPI proxy */
  } else if (req.url.startsWith('/eurostat-hpi')) {
    const year = String(req.query.year || new Date().getFullYear());

    // solo geo y time → Eurostat devuelve todas las dimensiones restantes
    const url =
      'https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/' +
      'prc_hpi_a?geo=ES&time=' + year;

    try {
      const json = await (await fetch(url)).json();

      /* json.value es un objeto { '0': 100, '1': 112.3, ... }
        Tomamos la primera observación */
      const values = Object.values(json.value);
      const hpi    = values.length ? Number(values[0]) : null;

      return res.json({ hpi });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Eurostat fetch error' });
    }
  } else if (req.url.startsWith('/api/v1/home-buying-selling-stats')) {
    // quitamos el prefijo /api-proxy para que llegue a loadBackendLEL
    return res.redirect(req.url.replace('/api-proxy', ''));
  }

  // cualquier otra ruta → 404
  return res.status(404).send('Ruta de proxy no válida');
});

/*──────────────────────────── 2) API LEL ───────────────────────────*/
loadBackendLEL(app);

/*──────────────────────────── 3) SvelteKit ─────────────────────────*/
app.use(handler);

/*────────────────────────── Lanzar servidor ───────────────────────*/
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
