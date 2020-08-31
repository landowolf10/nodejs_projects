const exportar = require('./exportar')

let resultado = exportar.sumar(10, 5);
console.log(resultado);

let resultado2 = exportar.mostrar(10);
console.log(resultado2);

setTimeout(() => {
    console.log("Terminé");
}, 2000);