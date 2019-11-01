var canvasCtx;
var canvas = document.createElement("canvas");
var context = canvas.getContext("2d");
canvas.style.display = "flex";
canvas.style.margin = "auto";
canvas.width = 0.8*window.innerWidth;
canvas.height = 0.8*window.innerHeight;
canvas.style.background = "none";
canvas.addEventListener("click", function() {Play();})
var x0 = canvas.width/2;
var y0 = canvas.height/2;
var overlay;

const field_vR = new Gaussian(1, x0, y0, 1000, 1000);
var posX = canvas.width/2, posY = canvas.height/2;

var Vx = 10, Vy = 10, gravity = 1;
var particles = [],
    particleIndex = 0,
    settings = {
      density: 20,
      particleSize: 100,
      startingX: canvas.width / 2,
      startingY: canvas.height / 2,
      gravity: 0,
      maxLife: 100
    };


function Particle(color) {
    // Establish starting positions and velocities
    this.x = settings.startingX;
    this.y = settings.startingY;
    
    // Random X and Y velocities
    // this.vx = Math.random() * 20 - 10;
    // this.vy = Math.random() * 20 - 5;
    this.vx = Math.cos(particleIndex)*Vx;
    this.vy = Math.sin(particleIndex)*Vy;

    this.color = color;
    // Add new particle to the index

    particleIndex ++;
    this.id = particleIndex;
    this.life = 0;
}
Particle.prototype.draw = function() {
    this.x += this.vx;
    this.y += this.vy;
  
    this.vx = field_vR.getZ(this.x, this.y) * this.vx;
    this.vy = field_vR.getZ(this.x, this.y) * this.vy;

    // if (this.x < 0 | this.x > canvas.width) { particles.splice(particles.indexOf(this), 1); }
    // if (this.y < 0 | this.y > canvas.height) { particles.splice(particles.indexOf(this), 1); }

    if (this.x < 0) { this.x = 0; }
    if (this.x > canvas.width) { this.x = canvas.width; } 
    if (this.y < 0) { this.y = 0; }
    if (this.y > canvas.height) { this.y = canvas.height; }
    // Adjust for gravity
    this.vy += settings.gravity;
  
    // Age the particle
    this.life++;
  
    // If Particle is old, remove it
    if (this.life >= settings.maxLife) {
        particles.splice(particles.indexOf(this), 1);
    }
  
    // Create the shapes
    context.beginPath();

    context.stroke= "white"; // "rgb("+(settings.maxLife - this.life)/100*255 + ", "+(settings.maxLife - this.life)/100*255 + ", "+(settings.maxLife - this.life)/100*255 + ")";
    context.fillStyle = this.color; //+ toHex(settings.maxLife - this.life);
    context.globalAlpha = (settings.maxLife - this.life)/100;
    context.arc(this.x, this.y, settings.particleSize, 0, Math.PI*2, true); 
    context.closePath();
    context.fill();
}
function StartParticles(particle) {
    context.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach(function(element) {
        element.draw();
    }); 

    particles.push(particle);        
}


// function StartDrawing() {
//     setInterval(function() {
//         context.clearRect(0, 0, canvas.width, canvas.height);

//         particles.forEach(function(element) {
//             element.draw();
//         });
        
//     }, 5);   
    
//     setInterval(function() {
//         particles.push(new Particle());        
//     }, 5);
// }


var toHex = function (int) { 
    var hex = Number(int).toString(16);
    if (hex.length < 2) {
         hex = "0" + hex;
    }
    return hex;
};
function Gaussian(a, x0, y0, sx, sy) {
    this.amplitude = a;
    this.x0 = x0;
    this.y0 = y0;
    this.sx2 = Math.pow(sx, 2);
    this.sy2 = Math.pow(sy, 2);
};
Gaussian.prototype.getZ = function(x,y) {
    return this.amplitude * Math.exp( - ( (Math.pow((x-this.x0),2)/(2*this.sx2)) + (Math.pow((y-this.y0),2)/(2*this.sy2)) ));
};
function getSinT(x,y,y0) {
    return (y-y0)/Math.sqrt(Math.pow(x,2)+Math.pow(y,2));
};
function getCosT(x,y,x0) {
    return (x-x0)/Math.sqrt(Math.pow(x,2)+Math.pow(y,2));
};