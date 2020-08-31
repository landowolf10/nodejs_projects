var dgram = require("dgram");

var SERVER_PORT = 33333, SERVER_ADDRESS = '127.0.0.1';

var packetsReceived = 0, server = dgram.createSocket("udp4");

server.on("error", function (err) {
    console.log("server error:\n" + err.stack);
    server.close();
});

server.on("message", function (msg, rinfo)
{
    server.send(msg, 0, msg.length, rinfo.port, rinfo.address); //El servidor, cada que recibe un paquete desde el cliente, manda de regreso 
                                                                //al cliente los bytes que recibió el servidor por parte del cliente (pong).
    packetsReceived++; //Cada que se recibe un paquete desde el cliente

    var jsonData = msg.toString();

    //var value = JSON.parse(jsonData);

    console.log(jsonData);
    console.log(jsonData.length);

    console.log("Bytes recibidos desde el cliente: " + msg.length);
    
    if (packetsReceived == 1)
        console.log(packetsReceived + " paquete recibido desde el cliente " + rinfo.address + ":" + rinfo.port);
    else
        console.log(packetsReceived + " paquetes recibidos desde el cliente " + rinfo.address + ":" + rinfo.port);

    console.log("Bytes enviados de vuelta al cliente: " + msg.length);

    console.log("");
    console.log("");
    console.log("Latencia: ");
});

server.on("listening", function () {
    var address = server.address();
    console.log("server listening " + address.address + ":" + address.port);
    console.log("");
    console.log("");
});

setInterval(function ()
{
}, 1000);

server.bind(SERVER_PORT, SERVER_ADDRESS);