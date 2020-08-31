const mqtt = require('mqtt');
const client = mqtt.connect('mqtt://broker.hivemq.com');

var metricsState = '';
var connected = false;

client.on('connect', () => {
  client.subscribe('metrics/connected');
  client.subscribe('metrics/state');
})

client.on('message', (topic, message) => {
  switch (topic) {
    case 'metrics/connected':
      return handleMetricsConnected(message);
    case 'metrics/state':
      return handleMetricsState(message);
  }
  console.log('No handler for topic %s', topic);
})

function handleMetricsConnected (message)
{
  console.log('Metrics connected status %s', message);

  connected = (message.toString() === 'true');
}

function handleMetricsState (message)
{
  metricsState = message;
  console.log('Metrics state update to %s', message);
}

function openMetricsDoor ()
{
  // can only open door if we're connected to mqtt and door isn't already open
  if (connected && metricsState !== 'open')
  {
    // Ask the door to open
    client.publish('garage/open', 'true');
  }
}

function closeMetricsDoor ()
{
  // can only close door if we're connected to mqtt and door isn't already closed
  if (connected && metricsState !== 'closed')
  {
    // Ask the door to close
    client.publish('metrics/close', 'true');
  }
}

// --- For Demo Purposes Only ----//

// simulate opening garage door
setTimeout(() => {
  console.log('open door');
  openMetricsDoor();
}, 5000)

// simulate closing garage door
setTimeout(() => {
  console.log('close door');
  closeMetricsDoor();
}, 20000)