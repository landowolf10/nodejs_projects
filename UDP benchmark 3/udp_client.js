const client = require('dgram').createSocket('udp4')

var curentTime = new Date();

var timeStamp = Buffer.from(Math.floor(new Date() / 1000) + " ");

var sent_count = 0;

var PORT = 33333;
var HOST = '127.0.0.1';

client.on("message", (msg, rinfo) => {
    console.log("Bytes recibidos desde el servidor: " + msg.length)
})

var buffer = new Buffer.alloc(Math.floor(Math.random() * 500) + 1);

function sendPacket()
{
    client.send(buffer, PORT, HOST, function (error)
    {
        startTime = new Date();

        if (error)
        {
            client.close();
        }
        else
        {
            sent_count++;

            console.log("Paquetes enviados: %d, Bytes enviados al servidor: %d, Tiempo de envío: %d ",
                sent_count,
                buffer.length,
                timeStamp);
        }
    });
}

setInterval(()=> {
    sendPacket();
}, 1000);

//module.exports.timeStamp = timeStamp;