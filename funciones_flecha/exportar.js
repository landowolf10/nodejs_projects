console.log("Este mensaje viene desde otro archivo");

let subscriptores = 22000;

function saludar()
{
    console.log("Hola desde otro archivo");
}

module.exports = {
    subs: subscriptores,
    saludar: saludar(),
    sumar: (a, b) => {
        return a + b;
    },
    mostrar: (a) => a + 10
}