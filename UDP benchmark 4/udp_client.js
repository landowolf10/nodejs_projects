var SERVER_ADDRESS = '127.0.0.1', SERVER_PORT = 33333;

//var timeStamp;

var sent_count = 0, recv_count = 0/*, packetsFromServer = 0*/;
var startTime;

function startSocket() {

    client = require('dgram').createSocket("udp4");

    client.on("message", function (msg, rinfo)
    {
        recv_count++;
        //packetsFromServer = msg.length;

        //Realizar el cálculo de latencia aquí, el servidor tiene que mandar el tiempo y recibirlo aquí.

        var packetsFromServer = msg.length - startTime.toString().length;

        console.log("Paquetes recibidos desde el servidor: %d", recv_count);
        console.log("Bytes recibidos desde el servidor: %d", packetsFromServer);
        console.log("");
    });
}

function sendPackets()
{
    setInterval(()=> {
        startTime = + new Date();

        var buffer = new Buffer.alloc(Math.floor(Math.random() * 500) + 1);
        var bufferTime = new Buffer.from(startTime.toString());

        //console.log("Tam: " + startTime.toString().length);
        //console.log("Buffer size: " + buffer);
    
        client.send([bufferTime, buffer], SERVER_PORT, SERVER_ADDRESS, function(error)
        {
            if(error)
            {
                client.close();
            }
            else
            {
                var endTime = + new Date();

                var diffTime = endTime - startTime;

                sent_count++;
    
                console.log("Bytes enviados al servidor: %d, Paquetes enviados al servidor: %d, Tiempo de envío al servidor: %d",
                buffer.length,
                sent_count,
                diffTime);
                console.log("");
            }
        });
    }, 1000)
}

function start()
{
    startSocket();
    sendPackets();
}

start();