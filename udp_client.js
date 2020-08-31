var PORT = 33333;
var HOST = '127.0.0.1';

var dgram = require('dgram');
var buffer1 = new Buffer.from('Mensaje de prueba 1');
var buffer2 = new Buffer.from('Mensaje de prueba 2');
var buffer3 = new Buffer.from('Mensaje de prueba 3');
var buffer4 = new Buffer.from('Mensaje de prueba 4');

var completeBuffer = [buffer1, buffer2, buffer3, buffer4];

var client = dgram.createSocket('udp4');

client.send([buffer1, buffer2, buffer3, buffer4], 0, completeBuffer.length, PORT, HOST, function(err, bytes)
{
  if (err)
    throw err;

  console.log('UDP package sent to ' + HOST +':'+ PORT);
  console.log("Longitud del mensaje: " + completeBuffer.length);
  console.log("Cantidad de bytes del paquete: " + completeBuffer.byteLength);

  client.close();
});