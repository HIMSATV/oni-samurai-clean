(() => {

let canvas = null;
let ctx = null;
let lastTime = 0;
let running = false;

const Game = {

  bindCanvas(c){
    canvas = c;
    if(canvas){
      ctx = canvas.getContext("2d");
    }
  },

  resize(w,h){
    if(!canvas) return;
    canvas.width  = w;
    canvas.height = h;
  },

  start(){
    if(running) return;
    running = true;
    requestAnimationFrame(loop);
  }

};

function loop(t){
  if(!running) return;

  const dt = (t - lastTime) / 1000;
  lastTime = t;

  update(dt);
  draw();

  requestAnimationFrame(loop);
}

let player = {
  x: 200,
  y: 200,
  size: 40,
  speed: 200
};

let keys = {};

window.addEventListener("keydown", e => keys[e.key] = true);
window.addEventListener("keyup", e => keys[e.key] = false);

function update(dt){
  if(keys["ArrowUp"])    player.y -= player.speed * dt;
  if(keys["ArrowDown"])  player.y += player.speed * dt;
  if(keys["ArrowLeft"])  player.x -= player.speed * dt;
  if(keys["ArrowRight"]) player.x += player.speed * dt;
}

function draw(){
  if(!ctx) return;

  ctx.clearRect(0,0,canvas.width,canvas.height);
  ctx.fillStyle = "red";
  ctx.fillRect(player.x, player.y, player.size, player.size);
}

window.Game = Game;

})();