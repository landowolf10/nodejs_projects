var io = require('socket.io-client');
var socket = io.connect('http://localhost:8080');

socket.on("message", function(data)
{
    console.log(data);
    console.log("");
});

setInterval(function()
{
    socket.emit("message", "Prueba del cliente");
}, 1000);

socket.on("pong", function(latency)
{
    console.log("Latencia: " + latency);
});