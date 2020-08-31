var
    dgram = require("dgram");

var
    SERVER_PORT = 33333;

var
    nReceived = 0,
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
    console.log("server listening " +
        address.address + ":" + address.port);
});

setInterval(function () {
    console.info(nReceived);
    console.info("Bytes recibidos desde el cliente: " + bytes);
    nReceived = 0;
    bytes = 0;
}, 1000);

server.bind(SERVER_PORT);