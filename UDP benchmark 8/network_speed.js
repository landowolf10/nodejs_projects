const NetworkSpeed = require('network-speed');
const testNetworkSpeed = new NetworkSpeed();
 
var downloadSPeed, uploadSpeed;

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
    hostname: 'tortops.com',
    port: 80,
    path: '/catchers/544b09b4599c1d0200000289',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const fileSizeInBytes = 2000000
  const uploadSpeed = await testNetworkSpeed.checkUploadSpeed(options, fileSizeInBytes);

  console.log(uploadSpeed);
}

getNetworkDownloadSpeed();
getNetworkUploadSpeed();