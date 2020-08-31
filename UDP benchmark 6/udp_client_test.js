var dgram = require('dgram');

function Timer() {
  this.st = Date.now();
}

Timer.prototype.poll = function poll(name) {
  var now = Date.now();
  console.log("%s :: %d", (name || "--"), (now - this.st));
  this.st = now;
};


// Strict loop, opening + closing UDP sockets:
function testStrictLoop(num) {
  num = num || 1;

  var socket = dgram.createSocket("udp4");
  var msg = new Buffer.from("STRICT_LOOP");

  socket.send(msg, 0, msg.length, 8123, "localhost", function (err, bytes) {
    socket.close();

    if (num < 100000) {
      process.nextTick(testStrictLoop.bind(null, num + 1));
    } else {
      timer.poll("strict loop");
      setImmediate(testCachedStrictLoop);
    }
  });
}


// Loop that depends on back-pressure while opening + closing UDP sockets:

// NOTE: This strategy errors with <<EMFILE>>:

// var backpressure_count = 0;
// function _backPressureSend() {
//   var socket = dgram.createSocket("udp4");
//   var msg = new Buffer("BACKPRESSURE");
//   backpressure_count ++;
//   socket.send(msg, 0, msg.length, 8123, "localhost", function (err, bytes) {
//     if (err) {
//       timer.poll
//     }
//     socket.close();
//     backpressure_count --;
//     if (!backpressure_count) {
//       timer.poll("backpressure");
//       setImmediate(testCachedStrictLoop);
//     }
//   });
// }

// // Async utilizing back-pressure:
// function testBackPressure() {
//   // Strict loop:
//   for (var i=0; i<100000; i++) {
//     _backPressureSend()
//   }
// }

// Strict with cached socket:
var cached_socket = dgram.createSocket("udp4");

function testCachedStrictLoop(num) {
  num = num || 1;

  // Strict loop:
  var msg = new Buffer.from("CACHED_LOOP");

  cached_socket.send(msg, 0, msg.length, 8123, "localhost", function (err, bytes) {
    if (err) {
      console.err(err.stack);
      process.exit(1);
    }

    if (num < 100000) {
      process.nextTick(testCachedStrictLoop.bind(null, num + 1));
    } else {
      timer.poll("cached loop");
      setImmediate(testCachedBackPressure);
    }
  });
}

// Async with cached socket:
var async_cached_socket = dgram.createSocket("udp4");
var async_backpressure_count = 0;
function _cachedBackPressureSend() {
  var msg = new Buffer.from("CACHED_BACKPRESSURE");
  async_backpressure_count ++;
  async_cached_socket.send(msg, 0, msg.length, 8123, "localhost", function (err, bytes) {
    if (err) {
      console.err(err.stack);
      process.exit(1);
    }
    async_backpressure_count --;
    if (!async_backpressure_count) {
      timer.poll("backpressure cached");
      console.log("Done");
      setTimeout(function () {
        msg = new Buffer.from("__FULL_PRINT__");
        async_cached_socket.send(msg, 0, msg.length, 8123, "localhost", function () {
          process.exit(0);
        });
      }, 5000);
    }
  });
}

// Async utilizing back-pressure:
function testCachedBackPressure() {
  // Strict loop:
  for (var i=0; i<100000; i++) {
    _cachedBackPressureSend();
  }
  console.log("done sending. backpressure at", async_backpressure_count);
}

// Let's kick things into motion!
var timer = new Timer();
testStrictLoop();