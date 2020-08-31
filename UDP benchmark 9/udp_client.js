var SERVER_ADDRESS = '127.0.0.1', SERVER_PORT = 33333;

var sent_count = 0, recv_count = 0, latencia = 0, lostBytes = 0, lostPackets = 0;
var startRecieveTime, endTime, buffer, metrics, recievedBytes, jsonData, jsonBuffer;

//var imageAddr = "http://www.kenrockwell.com/contax/images/g2/examples/31120037-5mb.jpg"; 
var downloadSize = 5000000; //bytes = 5 MB

function startSocket()
{

    client = require('dgram').createSocket("udp4");

    client.on("message", function (msg, rinfo)
    {
        recv_count++; //Cuando se recibe de vuelta el mensaje desde el servidor(pong), este contador aumenta.

        startRecieveTime = new Date().getTime();

        //Timestamp de recepción - timestamp de envío.
        //En ocasiones, el tiempo que estoy recibiendo del servidor es mayor al tiempo de envío del cliente (en muy raras ocasiones),
        //por eso puse esta condición, no se si sea debido a que estoy haciendo las pruebas en local y por ende es muy rápido el envío
        //y recepción. De hecho, en las pruebas que he estado haciendo, la latencia es entre 0 y 1 ms, casi nada, pero todo lo he hecho
        //local, tal ves cambie cuando se pase al servidor.
        if (startRecieveTime >= endTime)
            latencia = startRecieveTime - endTime;
        else
            latencia = endTime - startRecieveTime;

        lostBytes = buffer.length - msg.length; //Se calcula si hubo perdida de bytes de regreso desde el server con respecto a los que
                                                       //mandó el cliente.

        lostPackets = sent_count - recv_count; //Se calcula si hubo perdida de paquetes de regreso desde el server con respecto a los que
                                               //mandó el cliente.

        recievedBytes = msg.length;

        var throughput = (buffer.length / latencia) * 8;

        console.log("Paquetes recibidos desde el servidor: %d", recv_count);
        console.log("Bytes recibidos desde el servidor: %d", msg.length);
        console.log("Latencia: " + latencia + "ms");
        console.log("Bytes perdidos: " + lostBytes);
        console.log("Paquetes perdidos: " + lostPackets);
        console.log("Tiempo de envío devuelta del servidor: " + startRecieveTime);
        console.log("Rendimiento(throughput): " + throughput.toFixed(2) + "Kbps")
        console.log("");

        metrics = {
            "paquetes_recibidos": recv_count,
            "bytes_recibidos": recievedBytes,
            "latencia": latencia,
            "bytes_perdidos": lostBytes,
            "paquetes_perdidos": lostPackets,
            "rendimiento": throughput.toFixed(2),
        };

        jsonData = JSON.stringify(metrics);
        console.log(jsonData);

        console.log("");  
        
        //client.send(jsonData, 0, msg.length, rinfo.port, rinfo.address);
    });
}

//Método para obtener el total de ancho de banda, se usan 5 megabytes de bajada como ejemplo.
function MeasureConnectionSpeed()
{
    var startTime, endTime;

    const http = require('http');
    const fs = require('fs');

    startTime = (new Date()).getTime();

    //const file = fs.createWriteStream("file.jpg");
    const request = http.get("http://i3.ytimg.com/vi/J---aiyznGQ/mqdefault.jpg", function(response)
    {
        //response.pipe(file);

        if (response.statusCode == 200)
        {
            endTime = (new Date()).getTime();
        
            var duration = (endTime - startTime) / 1000;
            var bitsLoaded = downloadSize * 8;
            var speedBps = (bitsLoaded / duration).toFixed(2);
            var speedKbps = (speedBps / 1024).toFixed(2);
            var speedMbps = (speedKbps / 1024).toFixed(2);
            console.log(
                "Tu velocidad de conexión es:", 
                speedBps + " bps, ", 
                speedKbps + " Kbps, ", 
                speedMbps + " Mbps"
            );
    
            console.log("");
            console.log("");
        }
    });
}

function sendPackets()
{
    //Cada segundo el cliente manda un paquete de un tamaño de bytes aleatorio al servidor con su timestamp correspondiente(ping).
    //setInterval(()=> {
        var startTime = new Date().getTime(); //Se inicia el tiempo antes de mandar los paquetes.

        //var jsonBuffer = Buffer.from(jsonData); //Buffer para mandar el tiempo al servidor.
        buffer = new Buffer.alloc(Math.floor(Math.random() * 500) + 1); //Buffer para mandar un paquete de un tamaño de bytes aleatorio al servidor (entre 1 y 500 bytes).
    
        //console.log(jsonBuffer.length);

        client.send([jsonData, buffer].toString(), SERVER_PORT, SERVER_ADDRESS, function(error)
        {
            if(error)
            {
                client.close();
            }
            else
            {
                endTime = new Date().getTime(); //Si se envía el paquete satisfactoriamente, se obtiene el tiempo en milisegundos de cuando se mandó cada paquete.

                var diffTime = endTime - startTime; //Se obtiene la diferencia entre el tiempo que tardó en enviarse y el tiempo antes de enviarse (milisegundos).

                sent_count++; //Los paquetes enviados al servidor aumentan en 1 si se envió un paquete satisfactoriamente.

                //console.log("Buffer: " + buffer.length);

                //totalBytes = totalBytes + buffer.length;

                //console.log("Total bytes: " + totalBytes);
    
                console.log("Bytes enviados al servidor: %d, Paquetes enviados al servidor: %d, Tiempo de envío al servidor: %dms",
                buffer.length,
                sent_count,
                diffTime);
                console.log("");

                throughput = 0;
            }
        });
    //}, 1000)
}

function start()
{
    MeasureConnectionSpeed();
    startSocket(); //Se inicia el socket UDP.
    sendPackets(); //Se mandan los paquetes cada segundo.
}

start();