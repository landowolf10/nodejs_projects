var mqtt = require('mqtt');
var client = mqtt.connect('mqtts://master.tortops.com');

client.on('connect', function () {
  console.log('Conectado al broker mqtts://master.tortops.com')
  client.subscribe('metrics');
});

client.on('message', function (topic, message) {
  console.log(topic);
  console.log(message.toString());
  client.end();
});