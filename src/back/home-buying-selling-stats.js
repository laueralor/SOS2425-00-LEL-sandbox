import dataStore from "nedb";
const BASE_API = "/api/v1";

let db_LEL = new dataStore({filename: "homeBuyingSellingStats.db", autoload:true});
const RESOURCE = "home-buying-selling-stats";

const initialDataLEL = [
    { year: 2024, province: "alicante", transaction_total: 42176, transaction_protected_housing: 998, transaction_new_housing: 4687, transaction_secondhand_housing: 37489 },
    { year: 2024, province: "las palmas", transaction_total: 10702, transaction_protected_housing: 216, transaction_new_housing: 612, transaction_secondhand_housing: 10090 },
    { year: 2024, province: "madrid", transaction_total: 63218, transaction_protected_housing: 1203, transaction_new_housing: 5720, transaction_secondhand_housing: 57498 },
    { year: 2024, province: "malaga", transaction_total: 27791, transaction_protected_housing: 377, transaction_new_housing: 3482, transaction_secondhand_housing: 24309 },
    { year: 2024, province: "pontevedra", transaction_total: 5874, transaction_protected_housing: 49, transaction_new_housing: 607, transaction_secondhand_housing: 5267 },
    { year: 2024, province: "barcelona", transaction_total: 49950, transaction_protected_housing: 913, transaction_new_housing: 4268, transaction_secondhand_housing: 45682 },
    { year: 2024, province: "zaragoza", transaction_total: 9529, transaction_protected_housing: 165, transaction_new_housing: 821, transaction_secondhand_housing: 8708 },
    { year: 2024, province: "badajoz", transaction_total: 5471, transaction_protected_housing: 440, transaction_new_housing: 168, transaction_secondhand_housing: 5303 },
    { year: 2019, province: "alicante", transaction_total: 42418, transaction_protected_housing: 1152, transaction_new_housing: 5456, transaction_secondhand_housing: 36962 },
    { year: 2019, province: "las palmas", transaction_total: 12883, transaction_protected_housing: 428, transaction_new_housing: 1004, transaction_secondhand_housing: 11879 },
    { year: 2019, province: "madrid", transaction_total: 78634, transaction_protected_housing: 3628, transaction_new_housing: 10598, transaction_secondhand_housing: 68036 },
    { year: 2019, province: "malaga", transaction_total: 30876, transaction_protected_housing: 908, transaction_new_housing: 3657, transaction_secondhand_housing: 27219 },
    { year: 2019, province: "pontevedra", transaction_total: 6554, transaction_protected_housing: 113, transaction_new_housing: 529, transaction_secondhand_housing: 6025 },
    { year: 2019, province: "barcelona", transaction_total: 59554, transaction_protected_housing: 1186, transaction_new_housing: 5017, transaction_secondhand_housing: 54537 },
    { year: 2019, province: "zaragoza", transaction_total: 10787, transaction_protected_housing: 280, transaction_new_housing: 1278, transaction_secondhand_housing: 9509 },
    { year: 2019, province: "badajoz", transaction_total: 5795, transaction_protected_housing: 567, transaction_new_housing: 263, transaction_secondhand_housing: 5532 },
    { year: 2015, province: "alicante", transaction_total: 31677, transaction_protected_housing: 594, transaction_new_housing: 3769, transaction_secondhand_housing: 27908 },
    { year: 2015, province: "las palmas", transaction_total: 10745, transaction_protected_housing: 341, transaction_new_housing: 1097, transaction_secondhand_housing: 9648 },
    { year: 2015, province: "madrid", transaction_total: 57431, transaction_protected_housing: 3255, transaction_new_housing: 6820, transaction_secondhand_housing: 50611 },
    { year: 2015, province: "malaga", transaction_total: 25798, transaction_protected_housing: 600, transaction_new_housing: 2636, transaction_secondhand_housing: 23162 },
    { year: 2015, province: "pontevedra", transaction_total: 4421, transaction_protected_housing: 128, transaction_new_housing: 700, transaction_secondhand_housing: 3721 },
    { year: 2015, province: "barcelona", transaction_total: 41342, transaction_protected_housing: 888, transaction_new_housing: 3472, transaction_secondhand_housing: 37870 },
    { year: 2015, province: "zaragoza", transaction_total: 7952, transaction_protected_housing: 191, transaction_new_housing: 848, transaction_secondhand_housing: 7104 },
    { year: 2015, province: "badajoz", transaction_total: 4044, transaction_protected_housing: 622, transaction_new_housing: 587, transaction_secondhand_housing: 3457 }
];

//Insertar datos iniciales si la db esta vacia
db_LEL.find({}, (err, records) => {
    if (err){
        console.error("Error al obtener los registros:", err);
        return;
    }
    if (records.length === 0){
        console.log("Insertando datos iniciales...");
        db_LEL.insert(initialDataLEL, (err) => {
            if (err){
                console.error("Error al insertar los datos iniciales:", err);
            }else{
                console.log("Datos iniciales insertados correctamente");
            }
        });
    }
});

function loadBackendLEL(app){
    //Endpoint para cargar los datos iniciales desde el CSV
    app.get(`${BASE_API}/${RESOURCE}/loadInitialData`, (request, response) => {
        db_LEL.find({}, (err, records) => {
            if (err){
                response.status(500).send("Error code 01");
                console.error(`ERROR:${err}`);
            }else if(records.length > 0){
                response.sendStatus(200);
            }else if(records.sendStatus < 1){
                db_LEL.insert(initialDataLEL);
                response.sendStatus(200);
            }
        });
    })

    //GET - Todos los datos con paginacion y filtrado
    app.get(`${BASE_API}/${RESOURCE}`, (request, response) => {
        const limit = parseInt(request.query.limit, 10) || 0;
        const offset = parseInt(request.query.offset, 10) || 0;
        const query = {};

        if (request.query.year) query.year = parseInt(request.query.year, 10);
        if (request.query.province) query.province = new RegExp(`${request.query.province}`, "i");
        if (request.query.transaction_total) query.transaction_total = parseInt(request.query.transaction_total, 10);
        if (request.query.transaction_protected_housing) query.transaction_protected_housing = parseInt(request.query.transaction_protected_housing, 10);
        if (request.query.transaction_new_housing) query.transaction_new_housing = parseInt(request.query.transaction_new_housing, 10);
        if (request.query.transaction_secondhand_housing) query.transaction_secondhand_housing = parseInt(request.query.transaction_secondhand_housing, 10);

        db_LEL
            .find(query, {_id:0})
            .skip(offset)
            .limit(limit)
            .exec((err, docs) =>{
                if (err){
                    return response.status(500).json({error: "Error al obtener los datos."});
                }
                response.status(200).json(docs);
            });
    });

    // GET - Documentación
    app.get(`${BASE_API}/${RESOURCE}/docs`, (req, res) => {
        res.redirect("https://documenter.getpostman.com/view/42241739/2sB2j98UnV");
    });

    //GET - Todos los datos de una provincia
    app.get(`${BASE_API}/${RESOURCE}/:province`, (request, response) => {
        const province = request.params.province;
        db_LEL.find(
            {province: new RegExp(`^${province}$`, "i")},
            (err, docs) => {
                if (err){
                    return response.status(500).json({error: "Error al buscar la provincia."});
                }
                if(!docs || docs.length === 0){
                    return response.status(404).json({error: "Provincia no encontrada."});
                }
                const cleanDocs = docs.map(({_id, ...rest}) => rest);
                response.status(200).json(cleanDocs);
            }
        );
    });

    //GET - Datos de una provincia en un año concreto
    app.get(`${BASE_API}/${RESOURCE}/:province/:year`, (request, response)=>{
        const province = request.params.province;
        const year = parseInt(request.params.year, 10);
        db_LEL.find(
            {province: new RegExp(`^${province}$`, "i"), year},
            (err, docs) => {
                if (err) return response.status(500).json({error: "Error al buscar la estadistica."});
                if (!docs || docs.length === 0) return response.status(404).json({error: "Estadistica no encontrada."});

                const cleanDocs = docs.map(({_id, ...rest}) => rest);
                response.status(200).json(cleanDocs);
            }
        );
    });

    //POST - Crear nuevo dato
    app.post(`${BASE_API}/${RESOURCE}`, (request, response) => {
        const newData = request.body;
        if (
            typeof newData.year !== "number" ||
            typeof newData.province !== "string" ||
            typeof newData.transaction_total !== "number" ||
            typeof newData.transaction_protected_housing !== "number" ||
            typeof newData.transaction_protected_housing !== "number" ||
            typeof newData.transaction_secondhand_housing !== "number"
        ){
            return response.status(400).json({error: "Faltan campos requeridos o son incorrectos"});
        }
        db_LEL.find(
            {province: new RegExp(`^${newData.province}$`, "i"), year: newData.year},
            (err, existing) => {
                if (err) return response.status(500).json({error: "Error al encontrar duplicados"});
                if (existing.length > 0) return response.status(409).json({error: "El recurso ya existe"});

                db_LEL.insert(newData, (err, inserted) =>{
                    if (err) return response.status(500).json({error: "Error al insertar datos"});
                    const { _id, ...clean } = inserted;
                    response.status(201).json(clean);
                });
            }
        );
    });

    //PUT - Actualizar un dato existente
    app.put(`${BASE_API}/${RESOURCE}/:province/:year`, (request, response) =>{
        const province = request.params.province.toLowerCase();
        const year = parseInt(request.params.year, 10);
        const newData = request.body;

        if (
            typeof newData.year !== "number" ||
            typeof newData.province !== "string" ||
            typeof newData.transaction_total !== "number" ||
            typeof newData.transaction_protected_housing !== "number" ||
            typeof newData.transaction_protected_housing !== "number" ||
            typeof newData.transaction_secondhand_housing !== "number"
        ){
            return response.status(400).json({error: "Faltan campos requeridos o son incorrectos"});
        }
        if (newData.province.toLowerCase() != province || newData.year !== year){
            return response.status(400).json({error: "El identificador de la URL y del cuerpo deben coincidir."});
        }

        db_LEL.update(
            {province: new RegExp(`^${province}$`, "i"), year},
            newData,
            {},
            (err, numReplaced) => {
                if (err) return response.status(500).json({error: "Error al actualizar"});
                if (numReplaced === 0) return response.status(404).json({error: "estadistica no encontrada"});
                response.status(200).json(newData);
            }
        );
    });

    //DELETE - Borrar todos los datos
    app.delete(`${BASE_API}/${RESOURCE}/:province/:year`, (request, response) =>{
        const province = request.params.province.toLowerCase();
        const year = parseInt(request.params.year, 10);

        db_LEL.remove(
            {province: new RegExp(`^${province}$`, "i"), year},
            {},
            (err, numRemoved) => {
                if (err) return response.status(500).json({error: "Error al eliminar la estadistica."});
                if (numRemoved === 0) return response.status(404).json({error: "Estadistica no encontrada"});
                response.status(200).json({message: "Datos eliminados correctamente"});
            }
        );
    });

    // Métodos no permitidos
    app.all(`${BASE_API}/${RESOURCE}`, (req, res) => {
        if (!["GET", "POST", "DELETE"].includes(req.method)) {
        return res.status(405).json({ error: "Método no permitido." });
        }
    });
    app.all(`${BASE_API}/${RESOURCE}/:province/:year`, (req, res) => {
        if (!["GET", "PUT", "DELETE"].includes(req.method)) {
        return res.status(405).json({ error: "Método no permitido." });
        }
    });
}

export { loadBackendLEL };


