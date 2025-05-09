
let datos = [
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

module.exports = datos;

function calcularMediaPorProvincia(datos) {
    cantidad = 0;
    sumaTransacciones = 0;
    datos.forEach(element => {
        sumaTransacciones += parseInt(element.transaction_total);
        cantidad += 1;
    });
    return sumaTransacciones/cantidad;
};

console.log(calcularMediaPorProvincia(datos));
