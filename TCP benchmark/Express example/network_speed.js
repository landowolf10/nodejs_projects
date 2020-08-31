const NetworkSpeed = require('./measurement');
var JSAlert = require("js-alert");

const testNetworkSpeed = new NetworkSpeed();

var tcpp = require('tcp-ping');
var downloadSPeed, uploadSpeed;

const server = "tortops.com", port = 80;

tcpp.probe(server, port, function(err, available)
{
    if (available)
    {
        console.log("Servidor disponible");
        console.log("Servidor: " + server);
        console.log("Puerto: " + port);
    }
    else
    {
        console.log("Servidor no disponible");
        console.log("Error: " + err);
    }
});
 
tcpp.ping({ address: server }, function(err, data)
{
    //console.log(data);
    console.log("Latencia: " + data.avg.toFixed(2) + "ms");
    console.log("");
});

//verificar si es posible apuntar al servidor
async function getNetworkDownloadSpeed()
{
  const baseUrl = 'https://pruebasbotanax.000webhostapp.com/videos/13-138039_4k-ultra-hd-dragon.jpg';
  const fileSizeInBytes = 50000000;

  const downloadSPeed = await testNetworkSpeed.checkDownloadSpeed(baseUrl, fileSizeInBytes);

  console.log(downloadSPeed);
}
 
async function getNetworkUploadSpeed() {
  const options = {
    hostname: server,
    port: port,
    path: '/catchers/544b09b4599c1d0200000289',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const fileSizeInBytes = 2000000
  const uploadSpeed = await testNetworkSpeed.checkUploadSpeed(options, fileSizeInBytes);

  console.log(uploadSpeed);

  JSAlert.alert("Velocidad de subida: " + uploadSpeed);
}

getNetworkDownloadSpeed();
getNetworkUploadSpeed();