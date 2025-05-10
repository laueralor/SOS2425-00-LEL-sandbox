import express from "express";
import { loadBackendLEL } from "./src/back/home-buying-selling-stats.js";


const app = express();
const PORT = process.env.PORT || 16078;


app.use(express.json());
app.use("/", express.static("./about"));
app.get("/", (_, res) => res.sendStatus(200));   // → devuelve 200 OK


loadBackendLEL(app);

app.listen(PORT,()=>{
    console.log(`Server running on port ${PORT}!`);
});
