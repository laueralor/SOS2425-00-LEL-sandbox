import express from "express";
import { loadBackendLEL } from "./src/back/home-buying-selling-stats.js";
import { handler } from "./src/front/build/handler.js";

const app = express();
const PORT = process.env.PORT || 16078;


app.use(express.json());


loadBackendLEL(app);

app.use(handler);

app.listen(PORT,()=>{
    console.log(`Server running on port ${PORT}!`);
});
