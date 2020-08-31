var SERVER_ADDRESS = '127.0.0.1', SERVER_PORT = 33333;

var timeStamp = Buffer.from(Math.floor(new Date() / 1000) + " ");

var sent_count = 0, packetsFromServer;

function startSocket() {

    client = require('dgram').createSocket("udp4");

    client.on("message", function (msg, rinfo)
    {
        //console.log("Bytes recibidos desde el servidor: " + msg.length)
        packetsFromServer = msg.length;
        //metrics.received++;
    });
}

function sendPackets() {
    setInterval(()=> {
        var buffer = new Buffer.alloc(Math.floor(Math.random() * 500) + 1);
    
        client.send(buffer, SERVER_PORT, SERVER_ADDRESS, function(error)
        {
            if(error)
            {
                client.close();
            }
            else
            {
                sent_count++;
    
                console.log("Paquetes enviados al servidor: %d, Bytes enviados al servidor: %d, Tiempo de envíoal servidor: %d, Bytes recibidos desde el servidor: %d",
                sent_count,
                buffer.length,
                timeStamp,
                packetsFromServer);
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