const fs = require('fs');
const { error } = require('console');

console.log('Iniciado');

/*fs.readFile('data.txt', 'utf-8', (error, data) => {
    if(error)
        console.log(`Error ${error}`);
    else
        console.log(data)
});*/

let data = fs.readFileSync('data.txt', 'utf-8');
console.log(data);

/*fs.rename('data.txt', 'data_renombrado.txt', (error) => {
    if(error)
        throw error;

    console.log('Archivo renombrado');
});*/

/*fs.appendFile('data.txt', '\nHola Lando', (error) => {
    if (error)
        console.log(`Error ${error}`);
});

fs.unlink('data2.txt', (error) => {
    if (error)
        throw error

    console.log('Archivo eliminado');
});*/

//fs.createReadStream('data.txt').pipe(fs.createWriteStream('data3.txt'));

fs.readdir('../../file_system/file_system', (error, file) => {
    file.forEach(file => {
        console.log(file);
    });
});

/*fs.readdirSync('../../file_system/file_system').forEach(file => {
    console.log(file);
});*/

console.log('Finalizado');

