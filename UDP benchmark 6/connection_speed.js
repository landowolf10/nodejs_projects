client = require('dgram').createSocket("udp4");
var SERVER_ADDRESS = '127.0.0.1', SERVER_PORT = 33333;

//JUST AN EXAMPLE, PLEASE USE YOUR OWN PICTURE!
var imageAddr = "http://www.kenrockwell.com/contax/images/g2/examples/31120037-5mb.jpg"; 
var downloadSize = 4995374; //bytes

function MeasureConnectionSpeed() {
    var startTime, endTime;

    const http = require('http');
    const fs = require('fs');

    const file = fs.createWriteStream("file.jpg");
    const request = http.get("http://i3.ytimg.com/vi/J---aiyznGQ/mqdefault.jpg", function(response) {
    response.pipe(file);
    });
    
    startTime = (new Date()).getTime();
    var cacheBuster = "?nnn=" + startTime;
    download.src = imageAddr + cacheBuster;
    
        var duration = (endTime - startTime) / 1000;
        var bitsLoaded = downloadSize * 8;
        var speedBps = (bitsLoaded / duration).toFixed(2);
        var speedKbps = (speedBps / 1024).toFixed(2);
        var speedMbps = (speedKbps / 1024).toFixed(2);
        console.log(
            "Your connection speed is:", 
            speedBps + " bps", 
            speedKbps + " kbps", 
            speedMbps + " Mbps"
        );
}

client.on("message", function (msg, rinfo)
{
    console.log(msg);
    MeasureConnectionSpeed();
});