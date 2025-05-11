// index.js, parte superior
import express from 'express';
import cors from 'cors';
import { loadBackendLEL } from './src/back/home-buying-selling-stats.js';
import { handler } from './src/front/build/handler.js';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

const app = express();
const PORT = process.env.PORT || 16078;

app.use(express.json());
app.use(cors());

// 1) Proxy AL PRINCIPIO, antes de SvelteKit
app.use("/api-proxy", (req, res) => {
  if (req.url.startsWith("/api/v1/registrations-stats")) {
    const target = "https://sos2425-10.onrender.com" + req.url;
    return req.pipe(require("request")(target)).pipe(res);

  } else if (req.url.startsWith("/api/v1/fines")) {
    const target = "https://sos2425-20.onrender.com" + req.url;
    return req.pipe(require("request")(target)).pipe(res);

  } else if (req.url.startsWith("/api/v1/autonomy-dependence-applications")) {
    const target = "https://sos2425-11.onrender.com" + req.url;
    return req.pipe(require("request")(target)).pipe(res);

  } else if (req.url.startsWith("/api/v1/home-buying-selling-stats")) {
    // Al ser tu propia API montada en el mismo Express, la dejamos pasar al handler:
    return res.redirect(req.url.replace("/api-proxy", ""));
  }

  return res.status(404).send("Ruta de proxy no válida");
});

// 2) Tu API LEL
loadBackendLEL(app);

// 3) Finalmente SvelteKit
app.use(handler);

app.listen(PORT, () => {
  console.log(`Server running port ${PORT}!`);
});

