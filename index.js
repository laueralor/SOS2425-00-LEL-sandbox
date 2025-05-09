import express from "express";
import {loadBackendLEL} from "src/back/home-buying-selling-stats.js";
app.use(express.json);


const app = express();
const PORT = process.env.PORT || 16078;

const BASE_API = "/api/v1";

app.use(express.json);

loadBackendLEL(app);

app.listen(PORT,()=>{
    console.log(`Server running on port ${PORT}!`);
});

    