var dgram = require("dgram");

var SERVER_PORT = 33333, SERVER_ADDRESS = '127.0.0.1';

var packetsReceived = 0, server = dgram.createSocket("udp4");

server.on("error", function (err) {
    console.log("server error:\n" + err.stack);
    server.close();
});

server.on("message", function (msg, rinfo)
{
    var recieveTimeServer = new Date().getTime(); //Se obtiene el tiempo de cuando se recibe cada paquete desde
                                                  //el cliente.

    var bufferServerTime = new Buffer.from(recieveTimeServer.toString()); //Buffer para mandar el tiempo de recepción de paquetes al cliente
                                                                          //para el cálculo de latencia.

    //console.log("msg: " + msg.toString().length);
    //console.log("bufferServerTime: " + bufferServerTime.toString().length);

    server.send([bufferServerTime, msg].toString(), 0, msg.length, rinfo.port, rinfo.address); //El servidor, cada que recibe un paquete desde el cliente, manda de regreso 
                                                                                               //al cliente el timestamp(tiempo que tardó en recibir el paquete) y los bytes
                                                                                               //que recibió el servidor por parte del cliente (pong).
    packetsReceived++; //Cada que se recibe un paquete desde el cliente

    var startTime = msg.toString().substr(0, 13); //Tiempo en que tardó el cliente en mandar (esto viene desde el cliente ya calculado).
                                                 //Se hace uso del substring ya que en el array de buffer viene concatenado el timestamp con
                                                 //el mensaje (bytes), así que obtengo los primeros 13 bytes, que son los correspondientes al
                                                 //timestamp que viene desde el array de buffer del cliente para poder procesar solo el tiempo
                                                 //en milisegundos y que sea lo más preciso posible.

    var msgLength = msg.length - startTime.toString().length; //Hago esta resta ya que, como comentaba arriba, el array de buffer se
                                                              //concatena, y le suma los bytes del tiempo a los bytes que se recben
                                                              //realmente desde el cliente, desfasando el resultado real.

    console.log("Bytes recibidos desde el cliente: " + msgLength)
    
    if (packetsReceived == 1)
        console.log(packetsReceived + " paquete recibido desde el cliente " + rinfo.address + ":" + rinfo.port);
    else
        console.log(packetsReceived + " paquetes recibidos desde el cliente " + rinfo.address + ":" + rinfo.port);

    console.log("Bytes enviados de vuelta al cliente: " + msgLength);

    console.log("");
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