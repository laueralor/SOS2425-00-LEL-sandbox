const express = require("express");
const path = require("path");
const cool = require("cool-ascii-faces");
const app = express();
const PORT = process.env.PORT || 16078;

// Servir archivos estáticos desde la carpeta "public"
app.use(express.static(path.join(__dirname, "/about")));

app.get("/", (req, res) => {
    res.send(`
        <h1>Bienvenido a la API de Laura</h1>
       
    `);
});
// Ruta para servir "about.html" en "/about"
app.get("/about", (req, res) => {
    res.sendFile(path.join(__dirname, "/about/about.html"));
});

app.get("/hello",(request,response)=>{
    response.send("Hello from the server!");
});

app.get("/cool",(request,response)=>{
    response.send(cool());
});


const datos = require("./samples/index.js");

app.get("/samples/index.js", (req,res) => {
    let resultado = "<h2>Media Total Transacciones Provincias:</h2>";
    resultado += calcularMediaPorProvincia(datos);
    res.send(`<h1>Resultado del cálculo</h1>${resultado}<p></p>`)
    });

function calcularMediaPorProvincia(datos) {
    cantidad = 0;
    sumaTransacciones = 0;
    datos.forEach(element => {
        sumaTransacciones += parseInt(element.transaction_total);
        cantidad += 1;
    });
    return sumaTransacciones/cantidad;
}

app.listen(PORT,()=>{
    console.log(`Server running on port ${PORT}!`);
});

    