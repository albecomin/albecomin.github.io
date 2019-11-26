//#############################################
var Graphics = {
    ctx: undefined,
    environment: "graphics",
    bpm: 120,
    modulesToUpdate: [],
    notesFrequencies: {"A":110},
    linkTo: function(receiver) {
        switch(this.environment+"->"+receiver.environment) {
            case "graphics->graphics":
                console.log(this.name, "---->", receiver.name)
                console.log("OUT")
                console.log(this.output.audio)
                console.log("IN")
                console.log(receiver.input.audio)
                this.output.audio.connect(receiver.input.audio);
                break;
            case "sound->graphics":
                console.log(this.name, "---->", receiver.name)
                /*console.log("OUT")
                console.log(this.output.data)
                console.log("IN")
                console.log(receiver.input)*/
                this.output.data.connect(receiver.input.data);
                break;
        }
        
    },
    init: function(w, h, container) {
        this.w = w ? w*window.innerWidth : window.innerWidth;
        this.h = h ? h*window.innerHeight : window.innerHeight;
        this.canvas = document.createElement("canvas");
        this.canvas.style.display = "flex";
        this.canvas.style.margin = "auto";
        this.canvas.width = this.w;
        this.canvas.height = this.h;
        this.canvas.style.background = "none";
        // canvas.addEventListener("click", function() {Play();})
        this.xCenter = this.w/2;
        this.yCenter = this.h/2;
    
        this.ctx = this.canvas.getContext("2d");
        
        this.container = container ? container : document.body;

        this.container.appendChild(this.canvas);
    },
    update: function() {
        this.modulesToUpdate.forEach(module => {
            module.update();
            //console.log(instrument.output.data);
        });
    },
    clear: function() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    },
    overlayColor: function(color){
        //if only first half of color is defined, repeat it
        if(color.length < 5) {
            color += color.slice(1);
        }
        return (color.replace('#','0x')) > (0xffffff/2) ? '#333' : '#fff';
    },
}

var Oscilloscope = Object.create( Graphics );
Oscilloscope.init = function() {
    console.log("oscilloscope initialized")
    this.parameters = {
        p_0: 0,
    };
    this.output = {
        data: undefined
    };

    this.modulesToUpdate.push(this);
}

Oscilloscope.update = function() {
    this.background = getComputedStyle(document.documentElement).getPropertyValue('--primary'); ;

    this.ctx.lineWidth = 2;
    this.ctx.strokeStyle = this.background; // this.overlayColor(this.background); // 'rgb(0, 0, 0)';
    this.ctx.beginPath();
    
    let sliceWidth = this.canvas.width * 1.0 / this.parameters.p_0.length;
    let x = 0;

    for(let i = 0; i < this.parameters.p_0.length; i++) {

        var v = this.parameters.p_0[i] / 256.0;
        //console.log(v)
        var y = (0.5 + v) * this.canvas.height/2;

        if(i === 0) {
            this.ctx.moveTo(x, y);
        } else {
            this.ctx.lineTo(x, y);
        }
        
        x += sliceWidth;
    }

    this.ctx.stroke();
}


var Gaussian = Object.create( Graphics );
Gaussian.init = function(a, x0, y0, sx, sy) {
    console.log("Gaussian initialized")
    this.parameters = {
        p_0: 0,
        p_1: 0,
    };

    this.resX = 100;
    this.resY = 100;
    this.amplitude = a ? a : 1;
    this.x0 = x0 ? x0 : this.xCenter;
    this.y0 = y0 ? y0 : this.yCenter;
    this.sx2 = sx ? Math.pow(sx, 2) : 100;
    this.sy2 = sy ? Math.pow(sy, 2) : 100;

    this.z = function(x,y) {
        return this.amplitude * Math.exp( - ( (Math.pow((x-this.x0),2)/(2*this.sx2)) + (Math.pow((y-this.y0),2)/(2*this.sy2)) ));
    };

    this.modulesToUpdate.push(this);
}
Gaussian.update = function() {
    this.sx2 = this.parameters.p_0[0]*100000;
    this.sy2 = this.parameters.p_0[0]*100000;
    
    for(let i = 0; i < this.resX; i++) {            
        let dx = this.canvas.width/this.resX;
        for(let j=0; j < this.resY; j++) {
            let dy = this.canvas.height/this.resY;
            let z = this.z(i*dx+dx/2, j*dy+dy/2);
            //console.log(z)
            this.ctx.strokeStyle = "none";
            this.ctx.fillStyle = RGBA(255*z, 0, 255*(1-z), 0.4*z);
            this.ctx.fillRect(i*dx, j*dy, dx, dy)
        }
    }       
}

var Sphere = Object.create( Graphics );
Sphere.init = function() {
    this.radius = 200;
    this.l = -11;
    this.o = 0.9;
    this.update = function() {
        // this.sx2 = this.parameters.p_0[0]*100000;
        // this.sy2 = this.parameters.p_0[0]*100000;   

        for(let i=0; i<10; i++) {
            let _w = GetRandNum(0, 20);
            let _theta = GetRandNum(0,360);
            let _x = GetRandNum(1.5*_w, this.radius-1.5*_w)*Math.cos(_theta);
            let _y = GetRandNum(1.5*_w, this.radius-1.5*_w)*Math.sin(_theta);
            this.drawShape(this.xCenter+_x, this.yCenter+_y, _w, RGBA(255,0,0,GetRandNum(0.2,1)));
        }
        this.l = this.l + 0.1;
        if (this.l > 11) { this.l = -11; }
        this.drawSphere(this.radius, this.l);
    }    
    this.drawSphere = function(r, l) {
        this.ctx.beginPath();
        this.ctx.arc(this.xCenter, this.yCenter, r, 0, 2 * Math.PI);
        // Create gradient
        var grd = this.ctx.createLinearGradient(this.xCenter-this.radius/2, this.yCenter, this.xCenter+this.radius/2, this.yCenter);
  
        grd.addColorStop(0, RGBA(0,0,0,this.o));
        grd.addColorStop(0.33, RGBA(5+l,5+l,5+l,this.o));
        grd.addColorStop(0.66, RGBA(10+l,10+l,10+l,this.o));
        grd.addColorStop(1, RGBA(15,15,15,this.o));

        // Fill with gradient
        this.ctx.fillStyle = grd;
        this.ctx.fill();
    }
    this.drawShape = function(x,y,w,c) {
        this.ctx.fillStyle = c;
        this.ctx.fillRect(x-w/2, y-w/2, w, w);
    }
    this.drawRandShape = function(c1, c2, c3, c4) {
        
       this.ctx.fillStyle = 'blue';
       this.ctx.beginPath();
       this.ctx.moveTo(GetRandNum(0, c2), GetRandNum(50, c1));
       this.ctx.lineTo(GetRandNum(c2, c3),GetRandNum(c2, 250));
       this.ctx.lineTo(GetRandNum(c2, c4), GetRandNum(c1, c3));
       this.ctx.lineTo(GetRandNum(c1, c2), GetRandNum(c3, c4));
        //this.ctx.lineTo(GetRandNum(10, 100), GetRandNum(110, 290));
       this.ctx.closePath();
       this.ctx.fill();
    }

    this.modulesToUpdate.push(this);
}

function drawRandShape2() {
    
   this.ctx.fillStyle = 'red';
   this.ctx.beginPath();
    var moveToX = GetRandNum(0, 1000);
    var moveToY = GetRandNum(0, 1000);
   this.ctx.moveTo(moveToX, moveToY);
    //if moveToX is > 500 then subtract, if not then add
    //If moveToX is < 500
   this.ctx.lineTo((moveToX - GetRandNum(20, 80)),(moveToY - GetRandNum(0, 120)));
   this.ctx.lineTo((moveToX - GetRandNum(80, 200)),(moveToY - GetRandNum(120, 250)));
   this.ctx.lineTo((moveToX - GetRandNum(220, 380)),(moveToY - GetRandNum(260, 350)));
   this.ctx.lineTo((moveToX - GetRandNum(220, 380)),(moveToY - GetRandNum(260, 350)));
    //this.ctx.moveTo(GetRandNum(900, 1000), GetRandNum(900, 1000));
    //this.ctx.lineTo(GetRandNum(220, 380),GetRandNum(220, 350));
    //this.ctx.lineTo(GetRandNum(220, 250), GetRandNum(270, 400));
    //this.ctx.lineTo(GetRandNum(70, 100), GetRandNum(170, 290));
    //this.ctx.lineTo(GetRandNum(10, 100), GetRandNum(110, 290));
   this.ctx.closePath();
   this.ctx.fill();
}

function GetRandNum(min, max) {  
    return Math.floor(Math.random() * (max - min + 1)) + min
}    