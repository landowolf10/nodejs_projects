const os = require("os");
const fs = require("fs");

let cpu = os.cpus();
let system = os.platform();
let user = os.hostname();

//console.log(cpu);
//console.log(system);
//console.log(user);

let cpu_string = JSON.stringify(cpu)

fs.appendFile('mitocode.txt', `Información del CPU: ${cpu_string}` , function(error) {
    if(error)
        console.log('Error al crear archivo');
});