var body;
var canvas;
var d;
var lifeIndicator;

var game;

var xSPA = 0;
var ySPA = 0;
var R_Orbit = 400;

const orbit = new Orbit(500, 500, R_Orbit, "#698B92")
const spaceship = new Spaceship(0, 40, "#b4b9c5")

const sun = new Sun("#144955", 0.2)
const shield = new Sun("#144955", 0.3)

var vel_spaceship = 2;
var vel_shield = 4;
var gamma0 = 0;
var full = 100;
var empty = (120 - full);
var gamma1;
var gamma2;
var gamma3;
var gamma4;
var gamma5;
var gamma6;

var isRunning = false;
var isGameOver = false;

window.onload = function() {
	body = document.getElementsByTagName("body")[0];
	canvas = document.getElementById("myCanvas");
	d = canvas.getContext("2d");
	lifeIndicator = document.getElementById("life");
	levelIndicator = document.getElementById("levelIndicator");
	scoreIndicator = document.getElementById("scoreIndicator");
	shotsIndicator = document.getElementById("shotsIndicator");
	gameOver = document.getElementById("gameOver");

	
	game = new Game();

	InitBackground();

	InitTouch();

}





function Play() {
	if (!isRunning) {
		StartSpinning();
		isRunning = true;
	} else {
		StopSpinning();
		isRunning = false;
	}
    

}




var bullets = [];

var on = false;
var sound = false;


var track = 0;
var counter = 0;
var freq = 3;

document.onkeydown = function(event) {
	switch (event.keyCode) {
		case 32:
			Play();
			break;
		case 37:
			vel_spaceship = (vel_spaceship > 0) ? vel_spaceship : -vel_spaceship;
			break;
		case 38:
			Shot();
			break;
		case 39:
			vel_spaceship = (vel_spaceship < 0) ? vel_spaceship : -vel_spaceship;
			break;
		case 40:
			//alert('Down key pressed');
			break;
	}
};

function getRandomColor() {
	var letters = '0123456789ABCDEF';
	var color = '#';
	for (var i = 0; i < 6; i++) {
		color += letters[Math.floor(Math.random() * 16)];
	}
	return color;
}
  

function InitTouch(){
 
    var touchsurface = canvas,
        startX,
        startY,
        dist,
        threshold = 150, //required min distance traveled to be considered swipe
        allowedTime = 200, // maximum time allowed to travel that distance
        elapsedTime,
        startTime;
 
    function handleswipe(swipe, right){
		console.log(swipe, right)
		if(swipe) {
			if (right) {
				vel_spaceship = (vel_spaceship < 0) ? vel_spaceship : -vel_spaceship;
			}
			else {
				vel_spaceship = (vel_spaceship > 0) ? vel_spaceship : -vel_spaceship;
			}
		}
    }  

	touchsurface.addEventListener('touchstart', function(e){
		touchsurface.innerHTML = ''
		var touchobj = e.changedTouches[0]
		dist = 0
		startX = touchobj.pageX
		startY = touchobj.pageY
		startTime = new Date().getTime() // record time when finger first makes contact with surface
		e.preventDefault()
	}, false)

	touchsurface.addEventListener('touchmove', function(e){
		e.preventDefault() // prevent scrolling when inside DIV
	}, false)

	touchsurface.addEventListener('touchend', function(e){
		var touchobj = e.changedTouches[0]
		dist = touchobj.pageX - startX // get total dist traveled by finger while in contact with surface
		elapsedTime = new Date().getTime() - startTime // get time elapsed
		// check that elapsed time is within specified, horizontal dist traveled >= threshold, and vertical dist traveled <= 100
		
		var swipe = (elapsedTime <= allowedTime && Math.abs(dist) >= threshold && Math.abs(touchobj.pageY - startY) <= 100);
		handleswipe(swipe, dist > 0)
		e.preventDefault()
	}, false)

};