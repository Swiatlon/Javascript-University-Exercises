const canvas = document.getElementById("animationCanvas");
const ctx = canvas.getContext("2d");
const startButton = document.getElementById("startButton");
const resetButton = document.getElementById("resetButton");
const numBallsInput = document.getElementById("numBalls");
const distanceInput = document.getElementById("distance");
const repulsionInput = document.getElementById("repulsion");

const MAX_SPEED = 3; // Maximum speed limit for the balls

let balls = [];
let animationId;
let mouse = { x: 0, y: 0, active: false, repulsion: 0 };

class Ball {
  constructor(x, y, radius, dx, dy) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.dx = dx;
    this.dy = dy;
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = "blue";
    ctx.fill();
    ctx.closePath();
  }

  update() {
    if (this.x + this.radius > canvas.width || this.x - this.radius < 0) {
      this.dx = -this.dx;
    }
    if (this.y + this.radius > canvas.height || this.y - this.radius < 0) {
      this.dy = -this.dy;
    }

    if (mouse.active) {
      const dx = this.x - mouse.x;
      const dy = this.y - mouse.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      if (distance < 100) {
        const angle = Math.atan2(dy, dx);
        const force = mouse.repulsion / distance;
        this.dx += force * Math.cos(angle);
        this.dy += force * Math.sin(angle);
      }
    }

    // Apply speed limit
    const speed = Math.sqrt(this.dx * this.dy + this.dy * this.dy);
    if (speed > MAX_SPEED) {
      this.dx = (this.dx / speed) * MAX_SPEED;
      this.dy = (this.dy / speed) * MAX_SPEED;
    }

    this.x += this.dx;
    this.y += this.dy;

    this.draw();
  }
}

function initBalls(numBalls) {
  balls = [];
  for (let i = 0; i < numBalls; i++) {
    const radius = 5;
    const x = Math.random() * (canvas.width - 2 * radius) + radius;
    const y = Math.random() * (canvas.height - 2 * radius) + radius;
    const dx = (Math.random() - 0.5) * 2;
    const dy = (Math.random() - 0.5) * 2;
    balls.push(new Ball(x, y, radius, dx, dy));
  }
}

function drawLines() {
  const distance = (distanceInput.value / 100) * canvas.width;
  for (let i = 0; i < balls.length; i++) {
    for (let j = i + 1; j < balls.length; j++) {
      const dx = balls[i].x - balls[j].x;
      const dy = balls[i].y - balls[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < distance) {
        ctx.beginPath();
        ctx.moveTo(balls[i].x, balls[i].y);
        ctx.lineTo(balls[j].x, balls[j].y);
        ctx.strokeStyle = "rgba(0, 0, 0, 0.2)";
        ctx.stroke();
        ctx.closePath();
      }
    }
  }
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  balls.forEach((ball) => ball.update());
  drawLines();
  animationId = requestAnimationFrame(animate);
}

function startAnimation() {
  const numBalls = parseInt(numBallsInput.value);
  const repulsion = parseInt(repulsionInput.value);
  mouse.repulsion = repulsion;
  initBalls(numBalls);
  animate();
}

function resetAnimation() {
  cancelAnimationFrame(animationId);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  balls = [];
}

canvas.addEventListener("mousemove", (e) => {
  mouse.x = e.offsetX;
  mouse.y = e.offsetY;
  mouse.active = true;
});

canvas.addEventListener("mouseleave", () => {
  mouse.active = false;
});

canvas.addEventListener("click", (e) => {
  const clickX = e.offsetX;
  const clickY = e.offsetY;
  for (let i = 0; i < balls.length; i++) {
    const dx = balls[i].x - clickX;
    const dy = balls[i].y - clickY;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < balls[i].radius) {
      balls.splice(i, 1);
      balls.push(
        new Ball(
          Math.random() * canvas.width,
          Math.random() * canvas.height,
          5,
          (Math.random() - 0.5) * 2,
          (Math.random() - 0.5) * 2
        )
      );
      balls.push(
        new Ball(
          Math.random() * canvas.width,
          Math.random() * canvas.height,
          5,
          (Math.random() - 0.5) * 2,
          (Math.random() - 0.5) * 2
        )
      );
      break;
    }
  }
});

startButton.addEventListener("click", startAnimation);
resetButton.addEventListener("click", resetAnimation);

numBallsInput.value = 50;
distanceInput.value = 20;
repulsionInput.value = 50;
