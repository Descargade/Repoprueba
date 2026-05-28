const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');

let width = canvas.width = window.innerWidth;
let height = canvas.height = window.innerHeight;

const mouse = { x: null, y: null, radius: 180 };
const particles = [];
const PARTICLE_COUNT = 150;
const CONNECTION_DISTANCE = 100;

class Particle {
  constructor() {
    this.x = Math.random() * width;
    this.y = Math.random() * height;
    this.vx = (Math.random() - 0.5) * 0.4;
    this.vy = (Math.random() - 0.5) * 0.4;
    this.radius = Math.random() * 1.8 + 0.4;
    this.baseAlpha = Math.random() * 0.4 + 0.2;
    this.alpha = this.baseAlpha;
  }

  update() {
    if (mouse.x !== null && mouse.y !== null) {
      const dx = mouse.x - this.x;
      const dy = mouse.y - this.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < mouse.radius) {
        const force = (mouse.radius - dist) / mouse.radius;
        const angle = Math.atan2(dy, dx);
        this.vx -= Math.cos(angle) * force * 0.03;
        this.vy -= Math.sin(angle) * force * 0.03;
        this.alpha = Math.min(1, this.baseAlpha + force * 0.6);
      } else {
        this.alpha += (this.baseAlpha - this.alpha) * 0.05;
      }
    }

    this.x += this.vx;
    this.y += this.vy;

    this.vx *= 0.99;
    this.vy *= 0.99;

    if (this.x < 0) this.x = width;
    if (this.x > width) this.x = 0;
    if (this.y < 0) this.y = height;
    if (this.y > height) this.y = 0;
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(140, 170, 255, ${this.alpha})`;
    ctx.fill();
  }
}

function init() {
  particles.length = 0;
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    particles.push(new Particle());
  }
}

function drawConnections() {
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < CONNECTION_DISTANCE) {
        const alpha = (1 - dist / CONNECTION_DISTANCE) * 0.25;
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = `rgba(100, 140, 255, ${alpha})`;
        ctx.lineWidth = 0.4;
        ctx.stroke();
      }
    }
  }
}

function animate() {
  ctx.clearRect(0, 0, width, height);

  for (const p of particles) {
    p.update();
    p.draw();
  }

  drawConnections();
  requestAnimationFrame(animate);
}

window.addEventListener('mousemove', (e) => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});

window.addEventListener('mouseleave', () => {
  mouse.x = null;
  mouse.y = null;
});

window.addEventListener('resize', () => {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
  init();
});

init();
animate();
