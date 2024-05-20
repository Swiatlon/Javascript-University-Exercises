let ball = document.getElementById("ball");
let hole = document.getElementById("hole");
let container = document.getElementById("container");
let startButton = document.getElementById("startButton");
let startTime, endTime;
let ballX, ballY;
let tiltX = 0,
  tiltY = 0;
const speedFactor = 0.05; // Adjust this value for better sensitivity
const maxTilt = 10; // Maximum tilt value to prevent teleporting

const baseBeta = 90; // base position value for beta
const baseGamma = 0; // base position value for gamma

if (window.DeviceOrientationEvent) {
  window.addEventListener("deviceorientation", handleOrientation, true);
}

startButton.addEventListener("click", startGame);

function handleOrientation(event) {
  tiltX = Math.max(
    -maxTilt,
    Math.min((event.beta - baseBeta) * speedFactor, maxTilt)
  ); // Adjust beta to base position and apply speed factor
  tiltY = Math.max(
    -maxTilt,
    Math.min((event.gamma - baseGamma) * speedFactor, maxTilt)
  ); // Adjust gamma to base position and apply speed factor
}

function updateBallPosition() {
  ballX += tiltY; // Adjust left-right direction
  ballY += tiltX; // Adjust up-down direction

  // Constrain the ball within the container
  ballX = Math.max(
    0,
    Math.min(ballX, container.clientWidth - ball.clientWidth)
  );
  ballY = Math.max(
    0,
    Math.min(ballY, container.clientHeight - ball.clientHeight)
  );

  ball.style.left = `${ballX}px`;
  ball.style.top = `${ballY}px`;

  checkCollision();
  requestAnimationFrame(updateBallPosition);
}

function checkCollision() {
  let holeRect = hole.getBoundingClientRect();
  let ballRect = ball.getBoundingClientRect();

  if (
    ballRect.left >= holeRect.left &&
    ballRect.right <= holeRect.right &&
    ballRect.top >= holeRect.top &&
    ballRect.bottom <= holeRect.bottom
  ) {
    endTime = new Date();
    let timeDiff = (endTime - startTime) / 1000; // in seconds
    alert(`You win! Time: ${timeDiff.toFixed(2)} seconds`);
    recordTime(timeDiff);
    resetGame();
  }
}

function recordTime(time) {
  let records = JSON.parse(localStorage.getItem("records")) || [];
  records.push(time);
  localStorage.setItem("records", JSON.stringify(records));
  displayRecords();
}

function displayRecords() {
  let records = JSON.parse(localStorage.getItem("records")) || [];
  console.log("Records:", records);
}

function resetGame() {
  ballX = container.clientWidth / 2 - ball.clientWidth / 2;
  ballY = container.clientHeight / 2 - ball.clientHeight / 2;
  ball.style.left = `${ballX}px`;
  ball.style.top = `${ballY}px`;

  let holeX = Math.random() * (container.clientWidth - hole.clientWidth);
  let holeY = Math.random() * (container.clientHeight - hole.clientHeight);
  hole.style.left = `${holeX}px`;
  hole.style.top = `${holeY}px`;
}

function startGame() {
  resetGame();
  startTime = new Date();
  requestAnimationFrame(updateBallPosition);
}
