var dgram = require("dgram");

var server = dgram.createSocket("udp4");

var PORT = 33333, HOST = "127.0.0.1", recv_count = 0;

var timeStampRecieve = Buffer.from(Math.floor(new Date() / 1000) + " ");

//var external = require("./udp_client")

server.on("error", function (err)
{
    console.log("server error:\n" + err.stack);
    server.close();
});

server.on("message", function (msg, rinfo)
{
    recv_count++;

    console.log("Bytes recibidos desde el cliente: " + msg.length)
    console.log(recv_count + " paquetes recibidos desde el cliente " + rinfo.address + ":" + rinfo.port);
    console.log("Tiempo que tarda en recibirse el paquete: " + timeStampRecieve);
    console.log("");
    //console.log("Tiempo que tardó el paquete en mandarse desde el cliente: " + time);

    server.send(msg, 0, msg.length, PORT, HOST);
});

/*server.on("message", function (msg, rinfo)
{
    server.send(msg, 0, msg.length, PORT, HOST);
});*/


server.on("listening", function ()
{
  var address = server.address();

  console.log("server listening " +
      address.address + ":" + address.port);
});

server.bind(PORT, HOST);