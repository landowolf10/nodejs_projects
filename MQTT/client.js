const mqtt = require('mqtt');
const client = mqtt.connect('mqtt://broker.hivemq.com');

var state = 'closed';

client.on('connect', () => {
  client.subscribe('metrics/open');
  client.subscribe('metrics/close');

  // Inform controllers that metrics is connected
  client.publish('metrics/connected', 'true');
  sendStateUpdate();
})

client.on('message', (topic, message) => {
  console.log('Received message %s %s', topic, message);

  switch (topic) {
    case 'metrics/open':
      return handleOpenRequest(message);
    case 'metrics/close':
      return handleCloseRequest(message);
  }
})

function sendStateUpdate () {
  console.log('Sending state %s', state);
  client.publish('metrics/state', state);
}

function handleOpenRequest (message) {
  if (state !== 'open' && state !== 'opening')
  {
    console.log('Opening metrics door');

    state = 'opening';
    sendStateUpdate();

    // simulate door open after 5 seconds (would be listening to hardware)
    setTimeout(() => {
      state = 'open';
      sendStateUpdate();
    }, 5000)
  }
}

function handleCloseRequest (message)
{
  if (state !== 'closed' && state !== 'closing')
  {
    state = 'closing';
    sendStateUpdate();

    // simulate door closed after 5 seconds (would be listening to hardware)
    setTimeout(() => {
      state = 'closed';
      sendStateUpdate();
    }, 5000)
  }
}

/**
 * Want to notify controller that garage is disconnected before shutting down
 */
function handleAppExit (options, err)
{
  if (err) {
    console.log(err.stack);
  }

  if (options.cleanup)
  {
    client.publish('metrics/connected', 'false');
  }

  if (options.exit)
  {
    process.exit();
  }
}

/**
 * Handle the different ways an application can shutdown
 */
process.on('exit', handleAppExit.bind(null, {
  cleanup: true
}))
process.on('SIGINT', handleAppExit.bind(null, {
  exit: true
}))
process.on('uncaughtException', handleAppExit.bind(null, {
  exit: true
}))