import './style.css';

// INITIALIZE VARIABLES ----------------------------------------
let canvas = document.querySelector('#canvas');
let c = canvas.getContext('2d');
let particles = [];

// SET INITIAL CANVAS WIDTH ------------------------------------
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// UTIL FUNCTIONS ----------------------------------------------
const map = (value, x1, y1, x2, y2) =>
  ((value - x1) * (y2 - x2)) / (y1 - x1) + x2;

const calcDistance = (p1, p2) =>
  Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));

function join() {
  for (let i = 0; i < particles.length; i++) {
    for (let j = i; j < particles.length; j++) {
      let distance = calcDistance(particles[i], particles[j]);
      if (distance < 100) {
        c.beginPath();
        c.strokeStyle = `rgba(255,255,255,${map(distance, 0, 100, 0.5, 0)}`;
        c.lineWidth = 1.5;
        c.moveTo(particles[i].x, particles[i].y);
        c.lineTo(particles[j].x, particles[j].y);
        c.stroke();
        c.closePath();
      }
    }
  }
}

function repel(mouseX, mouseY) {
  let repelRadius = 100;
  for (let i = 0; i < particles.length; i++) {
    let distance = calcDistance(particles[i], { x: mouseX, y: mouseY });
    if (distance < repelRadius) {
      if (mouseX > repelRadius && mouseX < canvas.width - repelRadius) {
        if (mouseX > particles[i].x) {
          particles[i].x -= repelRadius - distance;
        } else {
          particles[i].x += repelRadius - distance;
        }
      }
      if (mouseY > repelRadius && mouseY < canvas.height - repelRadius) {
        if (mouseY > particles[i].y) {
          particles[i].y -= repelRadius - distance;
        } else {
          particles[i].y += repelRadius - distance;
        }
      }
    }
  }
}

// EVENT LISTENERS ---------------------------------------------
window.addEventListener('resize', () => {
  init();
});

window.addEventListener('mousemove', (e) => {
  // console.log(e.clientX, e.clientY);
  repel(e.clientX, e.clientY);
});

window.addEventListener('touchmove', (e) => {
  e.preventDefault();
  let touch = e.touches[0];
  repel(touch.clientX, touch.clientY);
});

// PARTICLE OBJECT CONSTRUCTOR ---------------------------------
function Particle(x, y, radius, color) {
  this.x = x;
  this.y = y;
  this.radius = radius;
  this.color = color;
  this.veloX = 2 * (Math.random() - 0.5);
  this.veloY = 2 * (Math.random() - 0.5);
}

Particle.prototype.draw = function () {
  c.beginPath();
  c.fillStyle = this.color;
  c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
  c.fill();
  c.closePath();
};

Particle.prototype.update = function () {
  if (this.x > canvas.width || this.x < 0) {
    this.veloX = -this.veloX;
  }
  if (this.y > canvas.height || this.y < 0) {
    this.veloY = -this.veloY;
  }

  this.x += this.veloX;
  this.y += this.veloY;

  this.draw();
};

// ANIMATION LOOP ----------------------------------------------
function draw() {
  c.fillStyle = 'rgba(0,0,0,1)';
  c.fillRect(0, 0, canvas.width, canvas.height);

  join();

  particles.forEach((particle) => {
    particle.update();
  });

  requestAnimationFrame(draw);
}

// INIT FUNCTION -----------------------------------------------
function init() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  // const ratio = Math.ceil(window.devicePixelRatio);

  // canvas.width = canvas.width * ratio;
  // canvas.height = canvas.height * ratio;
  // canvas.style.width = `${window.innerWidth}px`;
  // canvas.style.height = `${window.innerHeight}px`;

  // c.scale(ratio, ratio);

  particles.length = 0;

  for (let i = 0; i < window.innerWidth / 3; i++) {
    let x = Math.random() * canvas.width;
    let y = Math.random() * canvas.height;
    let radius = Math.random() * 2;

    particles.push(new Particle(x, y, radius, 'white'));
  }

  draw();
}

// CALL INIT ON WINDOW LOAD ------------------------------------
window.onload = init;
