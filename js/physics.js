class Gaussian {
    constructor(a, x0, y0, sx, sy) {
        this.amplitude = a;
        this.x0 = x0;
        this.y0 = y0;
        this.sx2 = Math.pow(sx, 2);
        this.sy2 = Math.pow(sy, 2);
    }
    
    value(x,y) {
        return this.amplitude * Math.exp( - ( (Math.pow((x-this.x0),2)/(2*this.sx2)) + (Math.pow((y-this.y0),2)/(2*this.sy2)) ));
    };
}

class Physics {
    constructor() {

    }

    _velocityField = 0;

    set velocityField(newValue) {
        this._velocityField = newValue;
    }

    get velocityField() {
        return this._velocityField;
    }
}


class SinWave {
    self = this;

    constructor() {
        self.amplitude = 1;
        self.period = 2*Math.pi;
        self.interval;
        self.t = 0;
        self.value = self.amplitude*Math.sin(self.t);
    }
    
    get value() {
        return self.value;
    }

    start() {
        self.interval = setInterval(function() { self.value = self.amplitude*Math.sin(self.t); self.t++;}, 1000);
    }
    stop() {
        clearInterval(self.interval);
        self.t = 0;    
    }
};
  