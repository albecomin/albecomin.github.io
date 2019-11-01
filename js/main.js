var audioCtx;
var audioElement; 
var track;
var analyser;
var gainNode;
var filterNode;
var dataArray;
var bufferLength;
var f16hz, f32hz, f512hz, f2048hz, f8192hz, f16384hz;
var ranges;
var a0 = [10], a1 = [0], a2 = [0], a3 = [0], a4 = [0];

window.onload = function() {
	draw();

	overlay = document.getElementById("overlay");
	overlay.width = 1*window.innerWidth;
	overlay.height = 1*window.innerHeight;

	document.body.appendChild(canvas); 
}

function InitializeSound() {
	audioCtx = new (window.AudioContext || window.webkitAudioContext)();
	analyser = audioCtx.createAnalyser();

	audioElement = document.querySelector('audio');
	track = audioCtx.createMediaElementSource(audioElement);

 	gainNode = audioCtx.createGain();
 	gainNode.gain.value = 1;
	filterNode = audioCtx.createBiquadFilter();
	 
	filterNode.type = "lowpass";
	filterNode.frequency.setValueAtTime(24000, audioCtx.currentTime);
	filterNode.Q.setValueAtTime(10, audioCtx.currentTime);

	analyser.fftSize = 2048;

	bufferLength = analyser.frequencyBinCount;
	dataArray = new Uint8Array(bufferLength);

	track.connect(filterNode);
	filterNode.connect(analyser);
	analyser.connect(gainNode);
	gainNode.connect(audioCtx.destination);
}

function TransitionDown(a, b, callback) {
	setTimeout(function() { 		
			if (a > b) {
				a = a - 1000; 
				TransitionDown(a, b, callback);
				filterNode.frequency.setValueAtTime(a, audioCtx.currentTime);
			} else  {
				callback();
			}
	}, a/1000);
}
function TransitionUp(a, b, callback) {
	setTimeout(function() { 
			console.log((b-a)/b);			
			if (a < b) {
				a = a + 1000; 
				TransitionUp(a, b, callback);
				filterNode.frequency.setValueAtTime(a, audioCtx.currentTime);
			} else {
				callback();
			}
	}, (b-a)/1000);
}

function Play() {
	  
	if (!audioCtx) { 
		InitializeSound();	
		audioElement.play();	
		overlay.style.display = "none";	
	} else {		
		if (audioCtx.state == 'running') {
			TransitionDown(24000, 0, function() { audioCtx.suspend().then(function() { overlay.style.display = "flex"; }) });		
		} else if(audioCtx.state === 'suspended') {
			TransitionUp(0, 24000, function() { audioCtx.resume().then(function() { overlay.style.display = "none"; })});		
		}
	}
}

function draw() {
	drawVisual = requestAnimationFrame(draw);

	if (audioCtx) {
		GetFrequencyRanges();
	}
	
	if (avg1(a0) > 0.9) {
		document.body.style.background = "#030003"
	} if (avg1(a4) > 0) {
		document.body.style.background = "#222222"
	}else {
		document.body.style.background = "#333033"
	}

	field_vR.a = avg1(a0);
	field_vR.sx2 = Math.pow(0 + 400*avg1(a0), 2);
	field_vR.sy2 = Math.pow(0 + 400*avg1(a0), 2);
	
	// let h = 225 + (avg1(a0))*10 + Math.random()*5 - Math.random()*avg1(a4)*100 - Math.random()*avg1(a3)*100;
	// let s = 10 + (avg1(a2))*30 + Math.random()*avg1(a4)*30;
	// let l = 10 + (avg1(a4))*100 + avg1(a3)*50 + Math.random()*5;

	let h = 225 + Math.random()*5 + avg1(a1)*40 + avg1(a2)*40 + avg1(a3)*40;
	let s = 10 + Math.random()*5 + (avg1(a2))*30 + avg1(a3)*30;
	let l = 10 + Math.random()*5 + avg1(a4)*30;

	var color = HSL(h, s, l);

	StartParticles(new Particle(color));
}

function GetFrequencyRanges() {
	analyser.getByteFrequencyData(dataArray);

	f16hz = getIndexValue(0); //1st Octave - The lower human threshold of hearing, and the lowest pedal notes of a pipe organ.
	f32hz = getIndexValue(32); //2nd-5th Octaves - Rhythm frequencies, where the lower and upper bass notes lie.
	f512hz = getIndexValue(512); //6th-7th Octaves - Defines human speech intelligibility, gives a horn-like or tinny quality to sound.
	f2048hz = getIndexValue(2048); //8th-9th Octaves - Gives presence to speech, where labial and fricative sounds lie.
	f8192hz = getIndexValue(8192); //10th Octave - Brilliance, the sounds of bells and the ringing of cymbals and sibilance in speech.
	f16384hz = getIndexValue(16384); //11th Ocatve - Beyond brilliance, nebulous sounds approaching and just passing the upper human threshold of hearing

	ranges = [f16hz, f32hz, f512hz, f2048hz, f8192hz, f16384hz];

	a0 = dataArray.slice(f16hz,f32hz)
	a1 = dataArray.slice(f32hz,f512hz)
	a2 = dataArray.slice(f512hz,f2048hz)
	a3 = dataArray.slice(f2048hz,f8192hz)
	a4 = dataArray.slice(f8192hz,f16384hz)
}