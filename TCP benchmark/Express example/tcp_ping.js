var tcpp = require('tcp-ping');

    const server = "tortops.com", port = 51686;
    var latencia;

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

        latencia = data.avg.toFixed(2) + "ms";
    });

exports.latencia = latencia;

