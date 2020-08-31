const NetworkSpeed = require("./measurement");
var mqtt = require("mqtt");

var client  = mqtt.connect("mqtts://master.tortops.com");

const testNetworkSpeed = new NetworkSpeed();

var tcpp = require("tcp-ping");
var downloadSPeed, uploadSpeed, latency;

const server = "tortops.com", port = 80;

function doPing()
{
  tcpp.probe(server, port, function(err, available)
  {
      if (available)
      {
          console.log("");
          console.log("");
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
    latency = data.avg.toFixed(2)

    console.log("Latencia: " + latency + " ms");
    console.log("");
  });
}

//verificar si es posible apuntar al servidor
async function getNetworkDownloadSpeed()
{
  const baseUrl = "https://pruebasbotanax.000webhostapp.com/videos/13-138039_4k-ultra-hd-dragon.jpg";
  const fileSizeInBytes = 50000000;

  downloadSPeed = await testNetworkSpeed.checkDownloadSpeed(baseUrl, fileSizeInBytes);

  console.log("Velocidad de bajada: ", downloadSPeed["mbps"] + " Mbps");
}
 
async function getNetworkUploadSpeed() {
  const options = {
    hostname: server,
    port: port,
    //path: "/catchers/544b09b4599c1d0200000289",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  };

  const fileSizeInBytes = 2000000
  uploadSpeed = await testNetworkSpeed.checkUploadSpeed(options, fileSizeInBytes);

  console.log("Velocidad de subida: " + uploadSpeed["mbps"] + " Mbps");
}

setInterval(function()
{
  doPing();
  getNetworkDownloadSpeed();
  //getNetworkUploadSpeed();
}, 15000);

setInterval(function()
{
  getNetworkUploadSpeed();
}, 15000);

client.on("connect", function ()
{
    setInterval(function()
    {
      var data = JSON.stringify({"latencia": latency, "velocidad_subida": uploadSpeed, "velocidad_bajada": downloadSPeed});
      var jsonData = JSON.parse(data);
      
      console.log(JSON.stringify(jsonData));

      client.publish("metrics/teleops-server", JSON.stringify(jsonData));

    }, 15000);
});