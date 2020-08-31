var SERVER_ADDRESS = '35.188.102.95', SERVER_PORT = 51700;

var sent_count = 0, recv_count = 0, latencia = 0, lostBytes = 0, lostPackets = 0, totalBytes = 0;
var startRecieveTime, endTime, packetsFromServer;
var bufferTime, buffer, N;

//var imageAddr = "http://www.kenrockwell.com/contax/images/g2/examples/31120037-5mb.jpg"; 
var downloadSize = 5000000; //bytes = 5 MB

function startSocket()
{

    client = require('dgram').createSocket("udp4");

    client.on("message", function (msg, rinfo)
    {
        recv_count++; //Cuando se recibe de vuelta el mensaje desde el servidor(pong), este contador aumenta.

        startRecieveTime = msg.toString().substr(0, 13); //Tiempo en que tardó el servidor en recibir (esto viene desde el servidor ya calculado).
                                                        //Se hace uso del substring ya que en el array de buffer viene concatenado el timestamp con
                                                        //el mensaje (bytes), así que obtengo los primeros 13 bytes, que son los correspondientes al
                                                        //timestamp que viene desde el array de buffer del servidor para poder procesar solo el tiempo
                                                        //en milisegundos y que sea lo más preciso posible.

        //var recieveTime = Math.floor(startRecieveTime);

        //console.log("endTime: " + endTime); //Timestamp de envío.
        //console.log("startRecieveTime: " + startRecieveTime); //Timestamp de recepción.


        //Timestamp de recepción - timestamp de envío.
        //En ocasiones, el tiempo que estoy recibiendo del servidor es mayor al tiempo de envío del cliente (en muy raras ocasiones),
        //por eso puse esta condición, no se si sea debido a que estoy haciendo las pruebas en local y por ende es muy rápido el envío
        //y recepción. De hecho, en las pruebas que he estado haciendo, la latencia es entre 0 y 1 ms, casi nada, pero todo lo he hecho
        //local.
        if (startRecieveTime >= endTime)
            latencia = startRecieveTime - endTime;
        else
            latencia = endTime - startRecieveTime;

        packetsFromServer = msg.length - bufferTime.toString().length; //Hago esta resta ya que, como comentaba arriba, el array de buffer se
                                                                       //concatena, y le suma los bytes del tiempo a los bytes que se recben
                                                                       //realmente desde el servidor, desfasando el resultado real.

        lostBytes = buffer.length - packetsFromServer; //Se calcula si hubo perdida de bytes de regreso desde el server con respecto a los que
                                                       //mandó el cliente.

        lostPackets = sent_count - recv_count; //Se calcula si hubo perdida de paquetes de regreso desde el server con respecto a los que
                                               //mandó el cliente.

        console.log("Paquetes recibidos desde el servidor: %d", recv_count);
        console.log("Bytes recibidos desde el servidor: %d", packetsFromServer);
        console.log("Latencia: " + latencia + "ms");
        console.log("Bytes perdidos: " + lostBytes);
        console.log("Paquetes perdidos: " + lostPackets);
        console.log("");
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

MeasureConnectionSpeed();

function sendPackets()
{
    //Cada segundo el cliente manda un paquete de un tamaño de bytes aleatorio al servidor con su timestamp correspondiente(ping).
    setInterval(()=> {
        var startTime = new Date().getTime(); //Se inicia el tiempo antes de mandar los paquetes.

        bufferTime = new Buffer.from(startTime.toString()); //Buffer para mandar el tiempo al servidor.
        buffer = new Buffer.alloc(Math.floor(Math.random() * 500) + 1); //Buffer para mandar un paquete de un tamaño de bytes aleatorio al servidor (entre 1 y 500 bytes).

        //console.log("bufferTime: " + bufferTime.toString().length);
    
        client.send([bufferTime, buffer], SERVER_PORT, SERVER_ADDRESS, function(error)
        {
            if(error)
            {
                client.close();
            }
            else
            {
                endTime = new Date().getTime(); //Si se envía el paquete satisfactoriamente, se obtiene el tiemp en milisegundos de cuando se mandó cada paquete.

                var diffTime = endTime - startTime; //Se obtiene la diferencia entre el tiempo que tardó en enviarse y el tiempo antes de enviarse (milisegundos).

                sent_count++; //Los paquetes enviados al servidor aumentan en 1 si se envió un paquete satisfactoriamente.

                //console.log("Buffer: " + buffer.length);

                //totalBytes = totalBytes + buffer.length;

                //console.log("Total bytes: " + totalBytes);

                var throughput = (buffer.length / latencia) * 8;
    
                console.log("Bytes enviados al servidor: %d, Paquetes enviados al servidor: %d, Tiempo de envío al servidor: %dms, Rendimiento (throughput): %dKbps",
                buffer.length,
                sent_count,
                diffTime,
                throughput);
                console.log("");

                throughput = 0;
                //totalBytes = 0;
            }
        });
    }, 1000)
}

function start()
{
    startSocket(); //Se inicia el socket UDP.
    sendPackets(); //Se mandan los paquetes cada segundo.
}

start();