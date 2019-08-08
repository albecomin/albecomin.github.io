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



var soundsArray =  ['../sounds/paul_Wobble2.wav', '../sounds/people_Hats.wav', '../sounds/people_Kick1.wav']
var soundsArrayLen = soundsArray.length;

function Sample(name, source) {
  this.name = name;
  this.source = source;
  this.on = false;
}


function init() {
  context = new AudioContext();
  console.log("audio init")
  bufferLoader = new BufferLoader(context, soundsArray, finishedLoading);
  bufferLoader.load();
}

var samples = [];

function finishedLoading(bufferList) {

  for(var i = 0; i < soundsArrayLen; i++) {
    console.log(soundsArray[i]);
    let _sample = new Sample(soundsArray[i], context.createBufferSource());
    _sample.source.buffer = bufferList[i];
    _sample.source.loop = true;
    _sample.source.connect(context.destination);    
    _sample.on = false;
    samples.push(_sample);
  }
}


function UpdateSound() {
  switch(game.level) {
    case 0:
      if (!samples[0].on) { samples[0].source.start(barLevelUp); samples[0].on = true; };
      break;
    case 1:      
      if (!samples[1].on) { 
          samples[1].source.start(barLevelUp); samples[1].on = true; 
      };
      break;
    case 2:
      if (!samples[2].on) { samples[2].source.start(barLevelUp); samples[2].on = true; };
      break;
  }
}

function Sounds_PlayPause() {
  
  if(context.state === 'running') {
    context.suspend(); //.then(function() {susresBtn.textContent = 'Resume context';});
  } else if(context.state === 'suspended') {
    context.resume()//.then(function() { susresBtn.textContent = 'Suspend context'; });  
  }
}


// context.onstatechange = function() {
//   console.log(context.state);
// }
