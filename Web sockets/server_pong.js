var express = require('express');
var server = require('http').Server(app);
var io = require('socket.io')(server, {
    pingInterval: 1000
});

var app = express();

var msg = "Prueba del servidor";

io.on('connection', function(socket)
{
    socket.on("message", function(data)
    {
        console.log(data);

        io.sockets.emit("message", msg);
    });
});

server.listen(8080, function()
{
  console.log("Servidor corriendo en http://localhost:8080");
  console.log("");
});