var mqtt = require('mqtt');
var client  = mqtt.connect('mqtts://master.tortops.com');

var id = 0;
var nombres = "";

client.on('connect', function ()
{
    setInterval(function()
    {
        var bytes = Math.floor(Math.random() * 500) + 1;

        id++;

        console.log(id);
        console.log(bytes);
        console.log()

        //console.log(JSON.stringify(id));

        var data = JSON.stringify({"id_scooter": id, "size": bytes});
        var jsonData = JSON.parse(data);

        client.publish('metrics', JSON.stringify(jsonData));

    }, 1000);
});

client.on('connect', function ()
{
    setInterval(function()
    {

        var data2 = JSON.stringify({"usuario": 1});
        var jsonData2 = JSON.parse(data2);

        client.publish('metrics', JSON.stringify(jsonData2));

    }, 1000);
});