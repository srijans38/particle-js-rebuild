import './style.css';

let canvas = document.querySelector('#canvas');
let c = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

function draw() {
  c.fillStyle = 'rgba(255,255,255,1)';
  c.fillRect(0, 0, canvas.width, canvas.height);

  requestAnimationFrame(draw);
}

draw();
