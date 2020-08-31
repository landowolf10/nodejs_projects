var Client = require('myspeed').Client;
var client = new Client({ url: 'ws://187.188.112.95:80' });
 
client.test(function(err, result) {
  console.log(result); // { download: Number, upload: Number }
  console.log(err);
});