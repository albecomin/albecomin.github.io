// ### ENVIRONMENT ###
var Sound = {
    ctx: undefined,
    environment: "sound",
    bpm: 120,
    modulesToUpdate: [],
    notesFrequencies: {"A":110},
    linkTo: function(receiver, parameters) {
        switch(this.environment+"->"+receiver.environment) {
            case "sound->sound":
                console.log(this.name, "---->", receiver.name)
                // console.log("OUT")
                // console.log(this.output.audio)
                // console.log("IN")
                // console.log(receiver.input.audio)
                this.output.audio.connect(receiver.input.audio);
                break;
            case "sound->graphics":
                console.log(this.name, "---->", receiver.name)
                // console.log("OUT")
                // console.log(this.output.data)
                // console.log("IN")
                // console.log(receiver.input)
                receiver.parameters = [];
                let j = 0;
                for(let j = 0; j < parameters.length; j++) 
                {
                    console.log([this.output.data[parameters[j]]])
                    receiver.parameters["p_" + j] = this.output.data[parameters[j]];
                };
                
                break;
        }
        
    },
    update: function() {
        this.modulesToUpdate.forEach(module => {
            module.update();
            //console.log(instrument.output.data);
        });
    }
}

// (((> SOUND SYSTEM <)))
var SoundSystem = Object.create( Sound );
SoundSystem.name = "SOUNDSYSTEM";
SoundSystem.init = function(volume){
    Sound.ctx = new (window.AudioContext || window.webkitAudioContext)(); // define audio context
    // Webkit/blink browsers need prefix, Safari won't work without window.
    this.amp = this.ctx.createGain();
    this.volume = (0>=volume>=1) ? volume : 0.5;
    this.amp.gain.setValueAtTime(this.volume, this.ctx.currentTime);
    this.amp.connect(this.ctx.destination);
    this.input = {
        audio: this.amp
    };
};
SoundSystem.play = function() {
    if(this.ctx.state === 'running') {
        this.ctx.suspend().then(function() {
        });
    } else if(this.ctx.state === 'suspended') {
        this.ctx.resume().then(function() {
        });  
    }
};

/// $$$ SYNTHETISER $$$
var Synth = Object.create( Sound );
Synth.name = "synth";
Synth.oscillators = [];
Synth.filters = [];
Synth.lfos = [];
Synth.on = false;
Synth.note = "A4";
Synth.freqRoot = 440;
Synth.setFreqRoot = function(note, octave) {
    this.freqRoot = subtractiveSynth.notesFrequencies["A"]*4;
}
Synth.configure = function(type) {
    this.type = type;
    this.output = {
        audio: undefined,
        data: undefined
    };
    switch(type) {
        case "subtractive":
            this.setupSubtractive();
            return 
    };
};
Synth.toggle = function() {
    if(!this.on) { this.connect(); }
    else { this.disconnect(); }
}
Synth.setupSubtractive = function() {
    this.createComponents = function() {
        this.oscillators = [];
        this.filters = [];
        let _osc = this.ctx.createOscillator();
        _osc.type = 'square';
        _osc.frequency.setValueAtTime(this.freqRoot*4, this.ctx.currentTime);
        this.oscillators.push(_osc);
        _osc = this.ctx.createOscillator();
        _osc.type = 'sine';
        _osc.frequency.setValueAtTime(this.freqRoot/2, this.ctx.currentTime);
        this.oscillators.push(_osc);
        _osc = this.ctx.createOscillator();
        _osc.type = 'sawtooth';
        _osc.frequency.setValueAtTime(this.freqRoot*8, this.ctx.currentTime);
        this.oscillators.push(_osc);
        let _filter = this.ctx.createBiquadFilter();
        _filter.type = 'lowpass';
        _filter.frequency.setValueAtTime(this.freqRoot, this.ctx.currentTime);
        this.filters.push(_filter);
        this.lfos = [];
        this.lfos.push(this.createLFO(this.filters[0], "frequency", 1));
        this.output.audio = this.filters[0];
        this.oscillators.forEach(function(o) { o.start(); });
    };

    this.createLFO = function(target, field, beat) {
        let _lfo = Object.create( Synth );
        _lfo.asyncProcess =  undefined;
        _lfo.ctx = this.ctx;
        // _lfo.start = function() {
        //     asyncProcess = setInterval(function() { _lfo.modulation(Sound.ctx.currentTime) }, 10); // !!! sound.ctx.currentTime forzatura da corregere
        // };
        _lfo.modulation = function(t) {
            target[field].setValueAtTime((0.2-Math.sin(beat/4*Math.PI*t)*0.1)*this.freqRoot , t);
        };
        console.log(this);
        _lfo.modulation.bind(this);
        // _lfo.stop = function() {
        //     clearInterval(asyncProcess);
        // };
        
        return _lfo;
    };

    this.createComponents();

    this.deleteComponents = function() {
        delete this.oscillators[0];
        delete this.filters[0];
    }

    this.connect = function() {
        this.oscillators.forEach((o) => { o.connect(this.filters[0]); });
        this.t0 = this.ctx.currentTime;
        this.modulesToUpdate.push(this);
        this.on = true;
    }

    this.connect();

    this.disconnect = function() {
        //this.oscillators[0].stop();
        //this.lfos[0].stop();
        //this.filters[0].disconnect();
        this.oscillators.forEach((o) => { o.disconnect(this.filters[0]); });
        this.on = false;
        ///this.deleteComponents();        
    }
    
    this.update = function() {
        console.log("update synth")
        this.t = this.ctx.currentTime-this.t0;
        this.lfos[0].modulation(this.t);
    }
}

/// [**] ANALYSER [**]
var Analyser = Object.create( Sound );
Analyser.name = "analyser";
Analyser.fftSize = 2048;

Analyser.getIndexValue = function(freq, l) {
    return Math.round(freq/(this.ctx.sampleRate/2)*l);
};
Analyser.getFrequencyValue = function(index, l) {
    return Math.round(index/l * (this.ctx.sampleRate/2));
};
Analyser.configure = function(type) {
    this.type = type;
    this.input = {
        audio: undefined,
        data: undefined
    };
    this.output = {
        audio: undefined,
        data: undefined
    };
    switch(type) {
        default:
            this.input.audio = this.ctx.createAnalyser();
            this.bufferLength = this.input.audio.frequencyBinCount;
            let f16hz = this.getIndexValue(0, this.bufferLength); //1st Octave - The lower human threshold of hearing, and the lowest pedal notes of a pipe organ.
            let f32hz = this.getIndexValue(32, this.bufferLength); //2nd-5th Octaves - Rhythm frequencies, where the lower and upper bass notes lie.
            let f512hz = this.getIndexValue(512, this.bufferLength); //6th-7th Octaves - Defines human speech intelligibility, gives a horn-like or tinny quality to sound.
            let f2048hz = this.getIndexValue(2048, this.bufferLength); //8th-9th Octaves - Gives presence to speech, where labial and fricative sounds lie.
            let f8192hz = this.getIndexValue(8192, this.bufferLength); //10th Octave - Brilliance, the sounds of bells and the ringing of cymbals and sibilance in speech.
            let f16384hz = this.getIndexValue(16384, this.bufferLength); //11th Ocatve - Beyond brilliance, nebulous sounds approaching and just passing the upper human threshold of hearing
        
            this.ranges = [f16hz, f32hz, f512hz, f2048hz, f8192hz, f16384hz];
            this.output.data = {
                spectrum: new Uint8Array(this.bufferLength),
                waveform:  new Uint8Array(this.bufferLength),
                f_AVG : new Float32Array(1),
                f_0 : new Float32Array(1),
                f_1 : new Float32Array(1),
                f_2 : new Float32Array(1),
                f_3 : new Float32Array(1),
                f_4 : new Float32Array(1),
                f_5 : new Float32Array(1)
            };
            this.output.audio = this.input.audio;
            break;
    }
    this.modulesToUpdate.push(this);
};
Analyser.update = function() {
    this.input.audio.getByteTimeDomainData(this.output.data.waveform)
    this.input.audio.getByteFrequencyData(this.output.data.spectrum);

    for(let j= 0; j < this.ranges.length; j++) {
        this.output.data["f_"+j][0] = avg1(this.output.data.spectrum.slice(this.ranges[j], this.ranges[j+1]));
    }
    this.output.data.f_AVG[0] = avg1(this.output.data.spectrum)
}

/// -<- GAIN -<-
var Gain = Object.create( Sound );
Gain.name = "gain";

Gain.configure = function(value) {
    this.type = type;
    this.input = {
        audio: undefined
    };
    this.output = {
        audio: undefined
    };
    this.output.audio = this.ctx.createGain();
    this.output.audio.value = value ? value : 0;
};


/// --- AUX  ---
var Aux = Object.create( Sound );
Aux.name = "aux";
Aux.on = false;
Aux.configure = function() {
    let _tmp = this;
    return new Promise(() => {this.init(_tmp);}).then(console.log("promise solved"));
};

Aux.init = function() {
    this.output = {
        audio: undefined,
        data: undefined
    };

    this.element = document.querySelector('audio');

    this.gotDevices = function(deviceInfos) {
        // Handles being called several times to update labels. Preserve values.
        //const values = this.selectors.map(select => select.value);
        // this.selectors.forEach(select => {
        //   while (select.firstChild) {
        //     select.removeChild(select.firstChild);
        //   }
        // });
        this.mics = [];
        for (let i = 0; i !== deviceInfos.length; ++i) {
            const deviceInfo = deviceInfos[i];
            const option = {};
            option.value = deviceInfo.deviceId;
            if (deviceInfo.kind === 'audioinput') {
                console.log(deviceInfo.deviceId)
                option.text = deviceInfo.label || "microphone " + i;
                this.mics.push(option);
            }
        }
        // this.selectors.forEach((select, selectorIndex) => {
        //   if (Array.prototype.slice.call(select.childNodes).some(n => n.value === values[selectorIndex])) {
        //     select.value = values[selectorIndex];
        //   }
        // });
    };

    this.getStream = function(stream) {
        console.log(this)
        this.element.srcObject = stream;
        this.output.audio = this.ctx.createMediaStreamSource(this.element.srcObject);
        this.element.onloadedmetadata = function(e) {
            //this.element.play();
            this.muted = true;
        };
    };

    this.start = function() {
        console.log("start line in")
        // Second call to getUserMedia() with changed device may cause error, so we need to release stream before changing device
      if (window.stream) {
          stream.getAudioTracks()[0].stop();
      }
    
      const audioSource = this.mics[0].value;
      
      const constraints = {
        audio: {deviceId: audioSource ? {exact: audioSource} : undefined}
      };
      navigator.mediaDevices.getUserMedia ({audio: true, video: false}).then(this.getStream.bind(this));
    }

    this.getStream.bind(this);
    this.gotDevices.bind(this);
    this.start.bind(this);

    navigator.mediaDevices.enumerateDevices().then(this.gotDevices.bind(this));

    this.start().bind(this);
}



//#################################################
avg1 = function(array) {
	return ((array.reduce((previous, current) => current += previous)/array.length)/255);
};
toHex = function (int) { 
    var hex = Number(int).toString(16);
    if (hex.length < 2) {
            hex = "0" + hex;
    }
    return hex;
};

RGBA = function(r, g, b, a) {
    return "rgba("+r+","+g+","+b+","+a+")";
}

    
    
    // navigator.mediaDevices.enumerateDevices().then(this.gotDevices);

	// navigator.mediaDevices.getUserMedia ({audio: true, video: false}).then(function(stream) {
	// 	console.log(stream)
    //     this.element.srcObject = stream;
    //     this.element.onloadedmetadata = function(e) {
    //         //this.element.play();
	// 		this.element.muted = true;
    //     };})
        
    //     this.output.audio = this.ctx.createMediaStreamSource(this.element.srcObject);
    
