const client = require('dgram').createSocket('udp4')

var buffer = new Buffer.alloc(100); //100 bytes

var recv_count = 0
var sent_count = 0
var last_sent = 0
var last_loss = 0

var PORT = 33333;
var HOST = '127.0.0.1';

client.on("message", (msg, rinfo)=> {
    recv_count++
})

setInterval(()=> {
    sent_count++;

    client.send(buffer, PORT, HOST, function(error)
    {
        if(error)
        {
            client.close();
        }
        else
        {
            console.log("Total de paquetes enviados: %d, Total de paquetes recibidos: %d, Bytes enviados: %d, Tasa de envío: %d package/sec, Tasa de pérdida%: %d ",
            sent_count,
            recv_count,
            buffer.length,
            sent_count - last_sent,
            ((sent_count - recv_count - last_loss) * 100 / (sent_count - last_sent)).toFixed(3))
    
            last_sent = sent_count
            last_loss = sent_count - recv_count
        }
    });
}, 1000)