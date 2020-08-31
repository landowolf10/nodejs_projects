var express = require('express');
var server = require('http').Server(app);
var io = require('socket.io')(server);

var app = express();

var msg = "Prueba del servidor"

var startTime = 0, endTime = 0, latency = 0;

io.on('connection', function(socket)
{
    startTime = (new Date()).getTime();

    socket.on("message", function(data)
    {
        console.log(data);
        
        endTime = (new Date()).getTime();

        latency = (endTime - startTime) / 1000;

        console.log("Latency: " + latency);
        console.log("");

        latency = 0;
        endTime = (new Date()).getTime();

        io.sockets.emit("message", msg);
    });
});

server.listen(8080, function()
{
  console.log("Servidor corriendo en http://localhost:8080");
  console.log("");
});