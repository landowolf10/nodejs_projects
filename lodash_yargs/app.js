const _ = require('lodash');

let x = { "nombre": "Orlando" }
let y = { "apodo": "Lando" }
let z = [
    { nombre: "Orlando", apellido: "Avila", edad: 26 },
    { nombre: "Lando", apellido: "Wolf", edad: 26 }
]

//let resultado = _.assign(x, y);
//console.log(resultado);

//_.times(3, () => console.log('Lando Wolf'));

let resultado = _.find(z, {nombre: "Orlando", apellido: "Avila"});
console.log(resultado);