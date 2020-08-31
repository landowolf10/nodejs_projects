var dgram = require('dgram');

var counts = {};

var socket = dgram.createSocket("udp4");
socket.bind(8123, function () {
  // socket.addMembership('0.0.0.0');
});

var recv = {};

socket.on('message', function (msg, rinfo) {
  var lol = msg.toString();
  if (lol ==="__FULL_PRINT__") {
    console.log(counts);
    return;
  }
  recv[lol] = (recv[lol] || 0) + 1;
  var data = counts[lol] = counts[lol] || { n: 0, s: Date.now(), e: null };
  data.n ++;
  if (data.n >= 100000) {
    data.e = Date.now();
    console.log("=============");
    console.log(lol, data.e - data.s);
  }
});

setInterval(function () {
  console.log("RECEIVED", recv);
  recv = {};
}, 1000);