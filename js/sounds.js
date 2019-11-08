class Sounds {
    s;

    constructor(m) {
        s = this;
        s.context = new (window.AudioContext || window.webkitAudioContext)();
        s.initAnalyser();
        s.mode = m;
    }

    init() {
        switch(s.mode) {
            case "synth":
                console.log(s)
                s.initSynth();                
                break;

            default:
                console.log("invalid mode");
                break;
        }-       
        s.output.connect(s.analyser);
        s.analyser.connect(s.context.destination);
    }

    initSynth() {       
        s.synth = Object.create({
            lowpass: "",
            lfo: "",
            output: ""
        });

        s.synth.osc1 = s.context.createOscillator();
        s.synth.osc2 = s.context.createOscillator();
        s.synth.osc3 = s.context.createOscillator();

        s.synth.lowpass = s.context.createBiquadFilter();
        s.synth.lfo = function(t) {
            return Math.sin(t);
        };
        s.synth.lfo.freq = 1;
        s.synth.fundamental = 69.296; // 69.296 C#
        s.synth.freq = s.synth.fundamental;
        s.synth.osc1.frequency.setValueAtTime(s.synth.freq, s.context.currentTime);
        s.synth.osc2.frequency.setValueAtTime(2*s.synth.freq, s.context.currentTime);
        s.synth.osc3.frequency.setValueAtTime(4*s.synth.freq, s.context.currentTime);

        s.synth.osc1.type = "sine";
        s.synth.osc2.type = "sine";
        s.synth.osc3.type = "sine";

        s.synth.osc1.connect(s.synth.lowpass);
        s.synth.osc2.connect(s.synth.lowpass);
        s.synth.osc3.connect(s.synth.lowpass);

        s.output = s.synth.lowpass;
        
        s.source = {
            start: function start() {
                s.synth.osc1.start();
                s.synth.osc2.start();
                s.synth.osc3.start();
            }
        };
    }

    update() {
        s.analyse();
        s.synth.osc1.frequency.setValueAtTime(s.synth.freq, s.context.currentTime);
        s.synth.osc2.frequency.setValueAtTime(2*s.synth.freq, s.context.currentTime);
        s.synth.osc3.frequency.setValueAtTime(4*s.synth.freq, s.context.currentTime);
        s.synth.lowpass.frequency.setValueAtTime(25 + s.synth.lfo(s.synth.lfo.freq*s.context.currentTime)*25, s.context.currentTime);
        s.synth.lowpass.detune.setValueAtTime(20 + s.synth.lfo(s.synth.lfo.freq*s.context.currentTime)*10, s.context.currentTime);
    }

    initAnalyser() {
        s.analyser = s.context.createAnalyser();
        s.analyser.fftSize = 2048;

        s.bufferLength = s.analyser.frequencyBinCount;
        
        let f16hz = s.getIndexValue(0, s.bufferLength); //1st Octave - The lower human threshold of hearing, and the lowest pedal notes of a pipe organ.
        let f32hz = s.getIndexValue(32, s.bufferLength); //2nd-5th Octaves - Rhythm frequencies, where the lower and upper bass notes lie.
        let f512hz = s.getIndexValue(512, s.bufferLength); //6th-7th Octaves - Defines human speech intelligibility, gives a horn-like or tinny quality to sound.
        let f2048hz = s.getIndexValue(2048, s.bufferLength); //8th-9th Octaves - Gives presence to speech, where labial and fricative sounds lie.
        let f8192hz = s.getIndexValue(8192, s.bufferLength); //10th Octave - Brilliance, the sounds of bells and the ringing of cymbals and sibilance in speech.
        let f16384hz = s.getIndexValue(16384, s.bufferLength); //11th Ocatve - Beyond brilliance, nebulous sounds approaching and just passing the upper human threshold of hearing
    
        s.ranges = [f16hz, f32hz, f512hz, f2048hz, f8192hz, f16384hz];
    }
    analyse() {
        let freqs = new Uint8Array(s.bufferLength);
        
        s.analyser.getByteFrequencyData(freqs);

        for(let j= 0; j < s.ranges.length; j++) {
            s["f"+j] = avg1(freqs.slice(s.ranges[j], s.ranges[j+1]));
        }
        s.favg = avg1(freqs)
    }

    getIndexValue(freq, l) {
        let nyquist = s.context.sampleRate/2;
        return Math.round(freq/nyquist*l);
    }

    getFrequencyValue(index, l) {
        let nyquist = s.context.sampleRate/2;
        return Math.round(index/l * nyquist);
    }
}

function avg1(array) {
	return ((array.reduce((previous, current) => current += previous)/array.length)/255);
}

// track = s.context.createMediaElementSource(audioElement);
    //     gainNode = s.context.createGain();
    //     gainNode.gain.value = 1;
    //    filterNode = s.context.createBiquadFilter();
        
    //    filterNode.type = "lowpass";
    //    filterNode.frequency.setValueAtTime(24000, s.context.currentTime);
    //    filterNode.Q.setValueAtTime(10, s.context.currentTime);
   
    //    analyser.fftSize = 2048;
   
    //    bufferLength = analyser.frequencyBinCount;
    //    freqs = new Uint8Array(bufferLength);
   
    //    track.connect(filterNode);
    //    filterNode.connect(analyser);
    //    analyser.connect(gainNode);
    //    gainNode.connect(s.context.destination);