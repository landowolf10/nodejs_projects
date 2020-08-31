var express = require('express');
var tcpp = require('tcp-ping');

const NetworkSpeed = require('./measurement');
const testNetworkSpeed = new NetworkSpeed();

var app = express();

var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

app.post('/', function (req, res)
{
        const server = "tortops.com", port = 80;

        var latencia = 0;

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
         
        tcpp.ping({ address: server }, async function(err, data)
        {
                console.log("Latencia: " + data.avg.toFixed(2) + "ms");
                console.log("");

                latencia = data.avg.toFixed(2) + "ms";

                const baseUrl = 'https://pruebasbotanax.000webhostapp.com/videos/13-138039_4k-ultra-hd-dragon.jpg';
                const fileSizeInBytes = 50000000;
              
                const downloadSPeed = await testNetworkSpeed.checkDownloadSpeed(baseUrl, fileSizeInBytes);
              
                console.log(downloadSPeed);

                res.send("Latencia: " + latencia + ",     Velocidad de bajada: ", downloadSPeed["mbps"]);
        });

        //var name = req.body.firstName + ' ' + req.body.lastName;
        //console.log(latencia);
});

app.post('/', function (req, res)
{


        res.send("Hola");

        //var name = req.body.firstName + ' ' + req.body.lastName;
        //console.log(latencia);
});

var server = app.listen(5000, function () {
    console.log('Node server is running..');
});