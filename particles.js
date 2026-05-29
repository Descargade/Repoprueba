const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');

let width = canvas.width = window.innerWidth;
let height = canvas.height = window.innerHeight;

const mouse = { x: null, y: null, radius: 200 };
const particles = [];
const PARTICLE_COUNT = 600;
const CONNECTION_DISTANCE = 80;

class Particle {
  constructor() {
    this.x = Math.random() * width;
    this.y = Math.random() * height;
    this.z = Math.random() * 3 + 0.5;
    this.vx = (Math.random() - 0.5) * 0.6;
    this.vy = (Math.random() - 0.5) * 0.6;
    this.baseRadius = Math.random() * 1.8 + 0.3;
    this.radius = this.baseRadius;
    this.baseAlpha = Math.random() * 0.6 + 0.2;
    this.alpha = this.baseAlpha;
    this.pulse = Math.random() * Math.PI * 2;
    this.pulseSpeed = Math.random() * 0.02 + 0.005;
  }

  update() {
    this.pulse += this.pulseSpeed;
    const pulseFactor = Math.sin(this.pulse) * 0.3 + 0.7;

    if (mouse.x !== null && mouse.y !== null) {
      const dx = mouse.x - this.x;
      const dy = mouse.y - this.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < mouse.radius) {
        const force = (mouse.radius - dist) / mouse.radius;
        const angle = Math.atan2(dy, dx);
        const pullStrength = force * 0.04;
        this.vx += Math.cos(angle) * pullStrength;
        this.vy += Math.sin(angle) * pullStrength;
        this.alpha = Math.min(1, this.baseAlpha + force * 0.8);
        this.radius = this.baseRadius + force * 2;
      } else {
        this.alpha += (this.baseAlpha * pulseFactor - this.alpha) * 0.08;
        this.radius += (this.baseRadius * pulseFactor - this.radius) * 0.05;
      }
    } else {
      this.alpha += (this.baseAlpha * pulseFactor - this.alpha) * 0.05;
      this.radius += (this.baseRadius * pulseFactor - this.radius) * 0.03;
    }

    this.x += this.vx;
    this.y += this.vy;

    this.vx *= 0.985;
    this.vy *= 0.985;

    if (this.x < -10) this.x = width + 10;
    if (this.x > width + 10) this.x = -10;
    if (this.y < -10) this.y = height + 10;
    if (this.y > height + 10) this.y = -10;
  }

  draw() {
    const glowRadius = this.radius * 4;
    const gradient = ctx.createRadialGradient(
      this.x, this.y, 0,
      this.x, this.y, glowRadius
    );
    gradient.addColorStop(0, `rgba(200, 220, 255, ${this.alpha})`);
    gradient.addColorStop(0.3, `rgba(160, 190, 255, ${this.alpha * 0.5})`);
    gradient.addColorStop(1, `rgba(100, 140, 255, 0)`);

    ctx.beginPath();
    ctx.arc(this.x, this.y, glowRadius, 0, Math.PI * 2);
    ctx.fillStyle = gradient;
    ctx.fill();

    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(230, 240, 255, ${this.alpha})`;
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
        const alpha = (1 - dist / CONNECTION_DISTANCE) * 0.2;
        const gradient = ctx.createLinearGradient(
          particles[i].x, particles[i].y,
          particles[j].x, particles[j].y
        );
        gradient.addColorStop(0, `rgba(150, 180, 255, ${alpha * particles[i].alpha})`);
        gradient.addColorStop(1, `rgba(150, 180, 255, ${alpha * particles[j].alpha})`);

        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = gradient;
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
