var dgram = require("dgram");

var SERVER_PORT = 33333, SERVER_ADDRESS = '127.0.0.1';

var packetsReceived = 0, server = dgram.createSocket("udp4");

//var timeStampRecieve = Buffer.from(Math.floor(new Date() / 1000) + " ");

server.on("error", function (err) {
    console.log("server error:\n" + err.stack);
    server.close();
});

server.on("message", function (msg, rinfo)
{
    server.send(msg, 0, msg.length, rinfo.port, rinfo.address);
    packetsReceived++;

    var startTime = msg.toString().substr(0, 13);
    var endTime = + new Date();

    //console.log("Start: " + startTime);
    console.log("Start size: " + startTime.toString().length);

    var diffTime = endTime - startTime;
    var msgLength = msg.length - startTime.toString().length;

    console.log("Bytes recibidos desde el cliente: " + msgLength)
    console.log(packetsReceived + " paquetes recibidos desde el cliente " + rinfo.address + ":" + rinfo.port);
    console.log("Tiempo que tarda en recibirse el paquete: " + diffTime);
    console.log("");
    //console.log(startTime);
});

server.on("listening", function () {
    var address = server.address();
    console.log("server listening " +
        address.address + ":" + address.port);
});

setInterval(function ()
{
    //packetsReceived = 0;
}, 1000);

server.bind(SERVER_PORT, SERVER_ADDRESS);