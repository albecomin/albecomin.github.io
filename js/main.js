
var phy = new Physics();
var g = new Graphics(1, 1);
var s;
var overlay;

window.onload = function() {
    overlay = document.getElementById("overlay");
    g.init();
       
    setTimeout(draw(), 100);

    document.body.addEventListener("click", play);
    document.body.addEventListener("touchmove", function() { interact(event); });
}

function play() {
    if(!s) {
        s = new Sounds("synth");
        s.init();
        s.source.start();
        overlay.style.display = "none";
    }  else {		
        if (s.context.state == 'running') {
            s.context.suspend().then(function() { overlay.style.display = "flex"; })
            //TransitionDown(24000, 0, function() { });		
        } else if(s.context.state === 'suspended') {
            s.context.resume().then(function() { overlay.style.display = "none"; })
            //TransitionUp(0, 24000, function() { });		
        }
    }
}

function interact(event) {
    s.synth.freq = s.synth.fundamental + s.synth.fundamental*(event.touches[0].clientY/window.innerHeight-0.5)*2;
    s.synth.lfo.freq = 1 + (event.touches[0].clientX/window.innerWidth-0.5);
}
var drawVisual;
function draw() {
    drawVisual = requestAnimationFrame(draw);

    if(s) { 
        s.update(); 
        phy.velocityField = new Gaussian(1, g.xCenter, g.yCenter, 100+s.f1*200, 100+s.f1*200);
    } else {
        phy.velocityField = new Gaussian(1, g.xCenter, g.yCenter, 100, 100);
    }
    
    g.clear();
    g.plot(phy.velocityField, 50, 50);
}