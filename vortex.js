var canvas, ctx, time, target,
	particles = [];

window.addEventListener('load', initialize, false);

function initialize() {
	canvas = document.createElement('canvas');
	ctx = canvas.getContext('2d');

	time = new Time;
	target = new Target;

	document.body.appendChild(canvas);

	window.addEventListener('resize', resizeHandler, false);
	resizeHandler();

	for(var i = 0; i < 256; i++) particles.push(new Particle(target));

	preLoop();
	render();
}

/* Events and interaction */

function resizeHandler() {
	canvas.height = window.innerHeight;
	canvas.width = window.innerWidth;

	target.radius = canvas.width * 0.5;
}

/* Rendering and such */

function preLoop() {
	ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function render() {
	requestAnimationFrame(render);
	time.update();

	ctx.save();

  ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	ctx.translate(canvas.width / 2, canvas.height / 2);

	target.update(ctx, time);

	ctx.globalCompositeOperation = 'lighter';

	var i = particles.length;
	while(i--) particles[i].render(ctx, time);

	ctx.restore();
}

/* Objects */

function Target() {
	this.position = new Vector();

	this.strength = 0.1;
	this.radius = 0;
}

Target.prototype.update = function(ctx, time) {
	this.position.x = Math.sin(time.elapsed / 2) * canvas.width * 0.5 * 0.8;
	this.position.y = Math.sin(time.elapsed * 2) * canvas.height * 0.5 * 0.8;
};



function Particle() {
	var r = Math.random();

	this.colorOffset = Math.random() * 90;
	this.friction = 0.2 + r * 0.05;

	this.position = new Vector(0, 0);
	this.velocity = new Vector(Math.random(), Math.random());

	this.size = r * 2 + 1;

	this.radius = this.size * 10;
	this.strength = 1;
}

Particle.prototype.update = function(ctx, time) {
	var xd = target.position.x - this.position.x;
	var yd = target.position.y - this.position.y;

	var angle = Math.atan2(yd, xd);
	var dist = Math.sqrt(xd * xd + yd * yd);
	var strength = Math.max(target.radius - dist, 0) * target.strength;

	if(strength > 0) {
		this.velocity.x /= this.friction + 1;
		this.velocity.y /= this.friction + 1;

		this.velocity.x += Math.cos(angle) * strength;
		this.velocity.y += Math.sin(angle) * strength;

		this.position.x += this.velocity.x * time.delta;
		this.position.y += this.velocity.y * time.delta;
	}

	var i = particles.length;

	while(i--) {
		if(particles[i] === this) continue;

		var xd = particles[i].position.x - this.position.x;
		var yd = particles[i].position.y - this.position.y;

		var dist = Math.sqrt(xd * xd + yd * yd);
		var angle = Math.atan2(yd, xd);

		var strength = Math.max(this.radius - dist, 0) * this.strength;

		if(strength <= 0) continue;

		particles[i].velocity.x += Math.cos(angle) * strength;
		particles[i].velocity.y += Math.sin(angle) * strength;
	}
};

Particle.prototype.render = function(ctx, time) {
	this.update(ctx, time);

	ctx.fillStyle = 'hsl(' + ((time.elapsed * 10 + this.colorOffset) % 360) + ', 100%, 50%)';

	ctx.beginPath();
	ctx.arc(this.position.x, this.position.y, this.size, 0, Math.PI * 2, true);
	ctx.fill();
};

function Vector(x, y) {
	this.x = x || 0;
	this.y = y || 0;
}

// My Time object, used for time-based animation
function Time(){var a=(new Date).getTime();this.elapsed=this.delta=0;this._start=this._prev=a}Time.prototype.update=function(){var a=(new Date).getTime();this.delta=(a-this._prev)/1E3;this.elapsed=(a-this._start)/1E3;this._prev=a};

// RequestAnimationFrame polyfill
(function(){for(var e=0,b=["ms","moz","webkit","o"],a=0;a<b.length&&!self.requestAnimationFrame;++a)self.requestAnimationFrame=self[b[a]+"RequestAnimationFrame"];void 0===self.requestAnimationFrame&&void 0!==self.setTimeout&&(self.requestAnimationFrame=function(a){var c=Date.now(),d=Math.max(0,16-(c-e)),b=self.setTimeout(function(){a(c+d)},d);e=c+d;return b})})();
