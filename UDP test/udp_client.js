var udp = require('dgram');
var client = udp.createSocket('udp4');

var PORT = 33333;
var HOST = '127.0.0.1';


client.on('message',function(msg,info){
  console.log('Data received from server: ' + msg.toString());
  console.log('Received %d bytes from %s:%d\n', msg.length, info.address, info.port);
});

/*var data1 = Buffer.from('Prueba 1 ');
var data2 = Buffer.from('Prueba 2 ');
var data3 = Buffer.from('Prueba 3 ');
var data4 = Buffer.from('Prueba 4 ');*/

var bufferData = new Buffer(5);

bufferData.write("Prueba 1 ", "Prueba 2 ", "Prueba 3 ", "Prueba 4 ", "Prueba 5 ");

//var data = Buffer.from(["Prueba 1 ", "Prueba 2 ", "Prueba 3 ", "Prueba 4 "]);

for (var i = 0 ; i < 5; i++)
{
    setTimeout( function timer()
    {
        client.send(0, bufferData, PORT, HOST, function(error)
        {
            if(error)
            {
                client.close();
            }else
            {
                console.log('Data sent!!!');
            }
        });
    }, i * 2000);
}