function DrawTheOrbit(orbit, color) {
	d.beginPath();
	d.strokeStyle = color;
	d.lineWidth = 10;
	d.shadowOffsetX = 0;
	d.shadowOffsetY = 0;
	d.shadowBlur = 100;
	d.shadowColor = orbit.color;
	
	d.arc(orbit.x, orbit.y, orbit.r, 0, 2 * Math.PI);
	d.stroke();
	d.closePath();
}


var img = new Image();
img.src = "svg/spa.svg";

function DrawTheSun(sun, orbit) {
	d.beginPath();
	d.fillStyle = sun.color;
	d.shadowOffsetX = 0;
	d.shadowOffsetY = 0;
	d.shadowBlur = 100;
	d.shadowColor = "#144955";
	d.arc(orbit.x, orbit.y, orbit.r*sun.percentage, 0, 2 * Math.PI);
	d.fill();
	d.closePath();
	d.drawImage(img, 500-orbit.r*sun.percentage, 500-orbit.r*sun.percentage, orbit.r*sun.percentage * 2, orbit.r*sun.percentage * 2);
}

function DrawTheShield(shield, orbit, gamma0) {
	var _gammaA = gamma0;
	var _gammaB = _gammaA + full;
	gamma1 = anorm(_gammaA);
	gamma2 = anorm(_gammaB);
	d.beginPath();
	d.strokeStyle = shield.color;
	d.lineWidth = 10;
	d.arc(orbit.x, orbit.y, orbit.r*(shield.percentage), toRad(gamma1), toRad(gamma2));
	d.shadowOffsetX = 0;
	d.shadowOffsetY = 0;
	d.shadowBlur = 10;
	d.shadowColor = "#FFFFFF";
	d.stroke();
	d.closePath();
	_gammaA = _gammaB + empty;
	_gammaB = _gammaA + full;
	gamma3 = anorm(_gammaA);
	gamma4 = anorm(_gammaB);
	d.beginPath();
	d.strokeStyle = shield.color;
	d.lineWidth = 10;
	d.arc(orbit.x, orbit.y, orbit.r*(shield.percentage),  toRad(gamma3), toRad(gamma4));
	d.shadowOffsetX = 0;
	d.shadowOffsetY = 0;
	d.shadowBlur = 10;
	d.shadowColor = "#FFFFFF";
	d.stroke();
	d.closePath();
	_gammaA = _gammaB + empty;
	_gammaB = _gammaA + full;
	gamma5 = anorm(_gammaA);
	gamma6 = anorm(_gammaB);
	d.beginPath();
	d.strokeStyle = shield.color;
	d.lineWidth = 10;
	d.arc(orbit.x, orbit.y, orbit.r*(shield.percentage), toRad(gamma5), toRad(gamma6));
	d.shadowOffsetX = 0;
	d.shadowOffsetY = 0;
	d.shadowBlur = 10;
	d.shadowColor = "#FFFFFF";
	d.stroke();
	d.closePath();
}

function InitBackground() {
	orbit.r = 1;	
	InitialAnimation();

	shotsIndicator.innerHTML = "Shots " + game.initialShots
	levelIndicator.innerHTML = "Level " + game.level
	scoreIndicator.innerHTML = "Score " + game.score
}

var _animationPhase = 0;
function InitialAnimation() {	
	switch(_animationPhase) {
		case 0:
			console.log("phase 0");			
	
			orbit.r += 10;		
			d.save();
			d.clearRect(0,0,1000,1000);
			DrawTheOrbit(orbit, orbit.color);
			d.restore();
			window.requestAnimationFrame(InitialAnimation);	
			_animationPhase = (orbit.r < (R_Orbit - 10)) ? 0 : 1;
			break;

		case 1:
			console.log("phase 1");
			_animationPhase = 2;

			DrawTheSun(sun, orbit);

			window.requestAnimationFrame(InitialAnimation);	
			break;

		case 2:
			console.log("phase 2");
			_animationPhase = (shield.percentage < 0.3) ? 2 : 3;	

			//shield.percentage += 0.1;		
			
			DrawTheShield(shield, orbit, gamma0);
			// window.requestAnimationFrame(InitialAnimation);	
			break;
	}	
}

var stop = true;

function StartSpinning() {
	stop = false;
	window.requestAnimationFrame(Spin);
}
function StopSpinning() {
	stop = true;
}

function Restart() {
	location.reload(true);
}

function Spin() {		
	d.save();
	d.clearRect(0,0,1000,1000); // clear canvas

	DrawBackground();

	d.save()
	UpdateShots();
	d.restore()


	d.save();
	let _alpha = spaceship.alpha / 360 * 2 * Math.PI;		
	xSPA = orbit.x + orbit.r * Math.cos(_alpha);
	ySPA = orbit.y + orbit.r * Math.sin(_alpha);
	//console.log(_alpha, xSPA, ySPA)
	d.beginPath();	
	d.arc(xSPA, ySPA, spaceship.r, 0, 2 * Math.PI);
	d.shadowOffsetX = 0;
	d.shadowOffsetY = 0;
	d.shadowBlur = 100;
	d.shadowColor = spaceship.color;
	d.fillStyle = spaceship.color
	
	d.fill();
	d.closePath();

	d.restore();

	spaceship.alpha += vel_spaceship;
	if(spaceship.alpha==360) {spaceship.alpha = 0;}

	if(!stop) window.requestAnimationFrame(Spin);
}

function GameOver(_bool) {
	//alert("You fucking loser");
	if (_bool) gameOver.firstElementChild.innerHTML = "Just a fucking loser."
	else gameOver.firstElementChild.innerHTML = "You win, but you're still a fucking loser."

	canvas.style.display = "none";
	gameOver.style.display = "flex";
	isGameOver = true;
	stop = true;
}
function Shot() {
	
	if(stop) return;

	if (!on && sound) { init(); }
	on = true;
	if (game.level >= 2) game.initialShots = 20;
	shotsIndicator.innerHTML = "Shots " + (game.initialShots - bullets.length);
	if(bullets.length < game.initialShots) {
		bullets.push(new Bullet(spaceship.alpha, 1, 0.1, getRandomColor()))
	}	
}

var xxx = 0;
function DrawBackground() {

	DrawTheOrbit(orbit, orbit.color);
	
	DrawTheSun(sun, orbit);

	DrawTheShield(shield, orbit, gamma0);

	if(game.level >= 1) 
	{
		gamma0 = gamma0 - vel_shield; 
		if(gamma0==-360) {gamma0 = 0;}
	}
	
	xxx++;
	console.log(parseInt(Math.sin(toRad(xxx))*10,10))
	if(game.level >= 3) { vel_shield = parseInt(Math.sin(toRad(xxx))*10,10); }	
}


function toRad(a) {
	return  a/ 360 * 2 * Math.PI;
}

function anorm(angle) {
	angle = angle%360
	if(angle < 0) {
		angle +=360;
	}

	return angle
}

function IsShieldHit(bullet) {
	if ((bullet.percentage - bullet.velocity) > (shield.percentage)) return false;
	if (anorm(bullet.alpha) > anorm(gamma1) && anorm(bullet.alpha) < anorm(gamma2)) return true;
	if (anorm(bullet.alpha) > anorm(gamma3) && anorm(bullet.alpha) < anorm(gamma4)) return true;
	if (anorm(bullet.alpha) > anorm(gamma5) && anorm(bullet.alpha) < anorm(gamma6)) return true;

	return false;
}

function IsOrbitHit(bullet) {
	if ((bullet.percentage - bullet.velocity) > (1)) return true;
}

function DrawShot(bullet) {
	
	if (bullet.percentage > sun.percentage) {

		if (IsShieldHit(bullet)) {
			bullet.velocity = (- (1 + Math.abs(vel_shield)/4) * bullet.velocity);	
			if (bullet.justCreated) { bullet.justCreated = false; }
		}
		if (game.level >= 1 && IsOrbitHit(bullet)) {
			bullet.velocity = (-0.1) * bullet.velocity;	
			if (game.level >= 3) bullet.velocity = 0;
		}

		bullet.percentage = bullet.percentage - bullet.velocity;

		var _xSHOT = orbit.x + bullet.percentage * orbit.r * Math.cos(toRad(bullet.alpha));
		var _ySHOT = orbit.y + bullet.percentage * orbit.r * Math.sin(toRad(bullet.alpha));



		if (!bullet.justCreated && (Math.abs(_xSHOT - xSPA) < spaceship.r) && (Math.abs(_ySHOT - ySPA) < 10)) {
			body.style.background = "red";
			bullet.toBeDestroyed = true; 
			game.life = game.life - 20; 			
			if(game.life==0) {GameOver(true);} 
			lifeIndicator.style.width = game.life +"%"; 
			setTimeout(function() { body.style.background = "black" }, 100);
		}

		d.beginPath();		
		d.arc(_xSHOT, _ySHOT, 10, 0, 2 * Math.PI);
		d.fillStyle = bullet.color
		d.fill();
		d.closePath();	

		// if (bullet.justCreated) { bullet.justCreated = false; }
	} else {
		//sun.percentage = sun.percentage + 0.01;
		game.score++;
		scoreIndicator.innerHTML = "Score " + game.score;

		//if (counter%freq == 0) {document.getElementById("myCanvas").style.background = getRandomColor();}
		if (game.score%5 == 0) {
			track = 1; on = false; 
			game.level = game.score/5;			
			levelIndicator.innerHTML = "Level " + game.level;
		}
		bullet.toBeDestroyed = true;

		if (game.level == 5) {
			GameOver(false);
		}
	}
}

function UpdateShots() {	
	bullets = bullets.filter(function(x) { return !x.toBeDestroyed; });
	bullets = bullets.filter(function(x) { return x.percentage < 5; });
	let n = bullets.length;
	if (n > 0) {
		for (var i = 0; i < n; i++) {
			DrawShot(bullets[i]);
		}
	}		
}
