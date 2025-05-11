import express from "express";
import cors from "cors";
import { loadBackendLEL } from "./src/back/home-buying-selling-stats.js";
import { handler }          from "./src/front/build/handler.js";
import { createRequire }    from "module";
const require = createRequire(import.meta.url);

const app = express();
const PORT = process.env.PORT || 16078;

app.use(express.json());
app.use(cors());

// 1) Proxy (registration-stats) → https://sos2425-10.onrender.com
app.use("/api-proxy", (req, res) => {
  if (req.url.startsWith("/api/v1/registrations-stats")) {
    const target = "https://sos2425-10.onrender.com" + req.url;
    return req.pipe(require("request")(target)).pipe(res);
  } else {
    return res.status(404).send("Ruta de proxy no válida");
  }
});

// 2) Tu API local (home-buying-selling-stats)
loadBackendLEL(app);

// 3) SvelteKit
app.use(handler);

// 4) Arranca
app.listen(PORT, () => {
  console.log(`Server running port ${PORT}!`);
});


