// shim layer with setTimeout fallback
// (by Paul Irish, see http://paulirish.com/2011/requestanimationframe-for-smart-animating/)
window.requestAnimFrame = function(){
  return  window.requestAnimationFrame       ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame    || 
          window.oRequestAnimationFrame      || 
          window.msRequestAnimationFrame     || 
          function( callback ) {
            window.setTimeout(callback, 1000 / 60);
          };
}();

var canvas, ctx;
var centerX = 100;
var centerY = 100;

function init() {
  canvas = document.createElement('canvas');
  canvas.width = 202;
  canvas.height = 202;
  ctx = canvas.getContext("2d");
  
  document.getElementById('container').appendChild(canvas);
}

function animate() {
  window.requestAnimFrame(animate);
  draw();
}

function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function toRadian(angle) {
  return angle / 180 * Math.PI;
}

function getColor(i) {
  var color = "rgba(255, 255, 255, ";
  // you can try switching the first 720 to e.g. 360 for a nice effect...
  color = color + (i % 720 / 720);
  color = color + ")";
  return color;
}

function draw() {
  var time = new Date().getTime() * 0.2;
  clearCanvas();

  for (var i = 0; i < 720; i++) {
    var angle = (i + time) % 360;
    var x = centerX + Math.sin(toRadian(angle)) * (100 - i / 7.2);
    var y = centerY + Math.cos(toRadian(angle)) * (100 - i / 7.2);
    ctx.fillStyle = getColor(i);
    ctx.fillRect(x, y, 2, 2);
  }
}  

init();
animate();
