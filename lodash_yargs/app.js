const _ = require('lodash');
const argv = require('yargs').argv;

//let comando = process.argv[2];

if (argv.usuario === 'Orlando')
{

    let x = { "nombre": "Orlando" }
    let y = { "apodo": "Lando" }
    let z = [
        { nombre: "Orlando", apellido: "Avila", edad: 26 },
        { nombre: "Lando", apellido: "Wolf", edad: 26 }
    ]

    //let resultado = _.assign(x, y);
    //console.log(resultado);

    //_.times(3, () => console.log('Lando Wolf'));

    let resultado = _.find(z, { nombre: "Orlando", apellido: "Avila" });
    console.log(resultado);
}
else
{
    console.log('Usuario no válido');
}