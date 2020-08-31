/*var
    dgram = require("dgram");

var
    SERVER_PORT = 33333;

var
    nReceived = 0,
    nSent = 0,
    server = dgram.createSocket("udp4");

var bytes = 0;

server.on("error", function (err) {
    console.log("server error:\n" + err.stack);
    server.close();
});

server.on("message", function (msg, rinfo) {
    nReceived++;
    //console.log("server got: " + msg + " from " + rinfo.address + ":" + rinfo.port);
    server.send(msg, 0, msg.length, rinfo.port, rinfo.address);

    bytes = msg.length;
});

server.on("listening", function () {
    var address = server.address();
    console.log("Server listening " +
        address.address + ":" + address.port);
});

setInterval(function () {
    console.info("Paquetes recibidos: " + nReceived);
    console.info("Bytes recibidos desde el cliente: " + bytes);

    nReceived = 0;
    bytes = 0;
}, 1000);

server.bind(SERVER_PORT);*/


var dgram = require("dgram");

var server = dgram.createSocket("udp4");

var PORT = 33333, SERVER = "127.0.0.1", recv_count = 0;

var timeStampRecieve = Buffer.from(Math.floor(new Date() / 1000) + " ");

//var external = require("./udp_client")

server.on("message", function (msg, rinfo)
{
    recv_count++;

    console.log("Bytes recibidos desde el cliente: " + msg.length)
    console.log("");
    console.log(recv_count + " paquetes recibidos desde el cliente " + rinfo.address + ":" + rinfo.port);
    console.log("Tiempo que tarda en recibirse el paquete: " + timeStampRecieve);
    //console.log("Tiempo que tardó el paquete en mandarse desde el cliente: " + time);

    recv_count = 0;
});

server.on("listening", function () {
  var address = server.address();
  console.log("server listening " +
      address.address + ":" + address.port);
});

server.bind(PORT, SERVER);