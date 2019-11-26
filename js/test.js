var $body = document.body;
var $subtractiveSynth = document.getElementById("subtractive-synth");

var sound;
var subtractiveSynth;
var aux;
var analyser;
var soundSystem = Object.create( SoundSystem );
var oscilloscope = Object.create( Oscilloscope );
var gaussian = Object.create( Gaussian );

function initializeGraphics() {
    Graphics.init(0.8, 0.8, document.getElementById("graphics-container"));
}

initializeGraphics();

async function initializeSystem() {
    soundSystem.init(0.0);
    subtractiveSynth = Object.create( Synth );  
    subtractiveSynth.configure("subtractive");  
    subtractiveSynth.setFreqRoot("A", 4)
    //aux = Object.create( Aux );
    //aux.configure();
    analyser = Object.create( Analyser );
    analyser.configure();
    console.log("awaited")
    // ### NETWORK ###
    subtractiveSynth.linkTo(analyser);
    analyser.linkTo(soundSystem);

    gaussian.init();
    analyser.linkTo(gaussian, ["f_1"]);

    oscilloscope.init();
    analyser.linkTo(oscilloscope, ["waveform"]);

    randomShapesSphere = Object.create( Sphere );
    randomShapesSphere.init();

    draw();
}

function play() {
    soundSystem.play();  
}

function toggleSynth() {
    subtractiveSynth.toggle();
    if(subtractiveSynth.on) {
        $subtractiveSynth.classList.replace("off", "on");
    } else {
        $subtractiveSynth.classList.replace("on", "off");
    }
}

var drawVisual;
function draw() {
    drawVisual = requestAnimationFrame(draw);
    Sound.update();
    Graphics.clear();
    Graphics.update();
    document.getElementById("avg").innerHTML = analyser.output.data.f_2;
}
