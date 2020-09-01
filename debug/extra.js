let mensaje = 'Debugueando';

function saludar()
{
    debugger;
    console.log(mensaje);
}

module.exports = {
    saludar: saludar
}