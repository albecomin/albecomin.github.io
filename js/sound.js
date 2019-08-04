//window.onload = init;
var context;
var bufferLoader;



function BufferLoader(context, urlList, callback) {
  this.context = context;
  this.urlList = urlList;
  this.onload = callback;
  this.bufferList = new Array();
  this.loadCount = 0;
}

BufferLoader.prototype.loadBuffer = function(url, index) {
  // Load buffer asynchronously
  var request = new XMLHttpRequest();
  request.open("GET", url, true);
  request.responseType = "arraybuffer";

  var loader = this;

  request.onload = function() {
    // Asynchronously decode the audio file data in request.response
    loader.context.decodeAudioData(
      request.response,
      function(buffer) {
        if (!buffer) {
          alert('error decoding file data: ' + url);
          return;
        }
        loader.bufferList[index] = buffer;
        if (++loader.loadCount == loader.urlList.length)
          loader.onload(loader.bufferList);
      },
      function(error) {
        console.error('decodeAudioData error', error);
      }
    );
  }

  request.onerror = function() {
    alert('BufferLoader: XHR error');
  }

  request.send();
}

BufferLoader.prototype.load = function() {
  for (var i = 0; i < this.urlList.length; ++i)
  this.loadBuffer(this.urlList[i], i);
}




function init() {
context = new AudioContext();

switch(track) {
  case 0:
  bufferLoader = new BufferLoader(
context,
[
'../sounds/people_Bass1.wav'
//,

//Putting It All Together | 11

//'../sounds/hyper-reality/laughter.wav',
],
finishedLoading
);


bufferLoader.load();
  break;

  case 1:
  bufferLoader = new BufferLoader(
context,
[
'../sounds/people_Kick1.wav'
//,

//Putting It All Together | 11

//'../sounds/hyper-reality/laughter.wav',
],
finishedLoading
);


bufferLoader.load();
  break;

  case "2":
  break;

  default:
  break;
}


}

function finishedLoading(bufferList) {
// Create two sources and play them both together.
var source1 = context.createBufferSource();
//var source2 = context.createBufferSource();
source1.buffer = bufferList[0];
source1.loop = true;
//source2.buffer = bufferList[1];
source1.connect(context.destination);
//source2.connect(context.destination);
source1.start(0);
//source2.start(0);
}