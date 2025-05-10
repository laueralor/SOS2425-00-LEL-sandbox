import express from "express";
import cors from "cors";
import { loadBackendLEL } from "./src/back/home-buying-selling-stats.js";
import { handler } from "./src/front/build/handler.js";

const app = express();
const PORT = process.env.PORT || 16078;


app.use(express.json());
app.use(cors());

loadBackendLEL(app);

app.listen(PORT,()=>{
    console.log(`Server running port ${PORT}!`);
});

app.use(handler);
