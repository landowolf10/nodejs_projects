/*
  Para poder poner este script en tu server tienes que poner tambien un archivo en tu server y saber de que tamaño es para poner la informacion en imageAddr y downloadSize.
*/
/*
  Para poder poner este script en tu server tienes que poner tambien un archivo en tu server y saber de que tamaño es para poner la informacion en imageAddr y downloadSize.
*/

var imageAddr = "https://pruebasbotanax.000webhostapp.com/videos/13-138039_4k-ultra-hd-dragon.jpg" + "?n=" + Math.random();
var startTime, endTime;
var downloadSize = 5616998; //5.36Mb
var download = new Image();
var roundedDecimals = 2;
var bytesInAKilobyte = 1024;

function showResults() {
  var duration = (endTime - startTime) / 1000;
  var bitsLoaded = downloadSize * 8;
  var speedBps = ( bitsLoaded / duration ).toFixed(roundedDecimals);
  var displaySpeed = speed(speedBps);
  var results = "<h2>Your connection speed is<h2><h1>" + displaySpeed.value + " " + displaySpeed.units + "</h1>"
    
    $('#results').fadeOut('fast',function(){
      $('#results').html(results);
      $('#results').fadeIn('fast', function(){
        $('#starttest').text('Thank You!');
      });
    });
}

function speed( bitsPerSecond ){
  var KBps = (bitsPerSecond / bytesInAKilobyte).toFixed(roundedDecimals);
  if ( KBps <= 1 ) return { value: bitsPerSecond, units: "Bps" };
  var MBps = (KBps / bytesInAKilobyte).toFixed(roundedDecimals);
  if ( MBps <= 1 ) return { value: KBps, units: "KBps" };
  else return { value: MBps, units: "MBps" };
}

$('#starttest').on('click', function(){
  console.log("Entra");
  $('#starttest').text('Wait, downloading...');
  $('#starttest').attr('disabled', 'disabled');
  
  download.onload = function () {
    endTime = (new Date()).getTime();
    showResults();
  }
  startTime = (new Date()).getTime();
  download.src = imageAddr;
})