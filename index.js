import express from "express";
import cors from "cors";
import { loadBackendLEL } from "./src/back/home-buying-selling-stats.js";


const app = express();
const PORT = process.env.PORT || 16078;

const BASE_API = "/api/v1";

app.use(express.json());
app.use(cors());
app.get("/", (_, res) => res.sendStatus(200));   // → devuelve 200 OK


loadBackendLEL(app);

app.listen(PORT,()=>{
    console.log(`Server running on port ${PORT}!`);
});
