function Orbit(x,y,r,color){
    this.x=x;
    this.y=y;
	this.r=r;
	this.color = color;
}

function Spaceship(alpha, r, color){
    this.alpha = alpha;
    this.r = r;
    this.color = color;
}

function Bullet(alpha, percentage, velocity, color) {
	this.alpha = alpha;
	this.percentage = percentage;
	this.velocity = velocity;
	this.color = color;
	this.toBeDestroyed = false;
	this.justCreated = true;
}

function Sun(color, percentage) {
	this.color = color;
	this.percentage = percentage;
}


function Game() {
	this.level = 0;
	this.life = 100;
	this.score = 0;
	this.initialShots = 10;

	this.isRunning = false;
}