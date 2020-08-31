var dgram = require("dgram");

var SERVER_PORT = 33333, SERVER_ADDRESS = '127.0.0.1';

var packetsReceived = 0, server = dgram.createSocket("udp4");

var timeStampRecieve = Buffer.from(Math.floor(new Date() / 1000) + " ");

server.on("error", function (err) {
    console.log("server error:\n" + err.stack);
    server.close();
});

server.on("message", function (msg, rinfo) {
    packetsReceived++;
    server.send(msg, 0, msg.length, rinfo.port, rinfo.address);

    console.log("Bytes recibidos desde el cliente: " + msg.length)
    console.log(packetsReceived + " paquetes recibidos desde el cliente " + rinfo.address + ":" + rinfo.port);
    console.log("Tiempo que tarda en recibirse el paquete: " + timeStampRecieve);
    console.log("");
});

server.on("listening", function () {
    var address = server.address();
    console.log("server listening " +
        address.address + ":" + address.port);
});

setInterval(function ()
{
    packetsReceived = 0;
}, 1000);

server.bind(SERVER_PORT, SERVER_ADDRESS);