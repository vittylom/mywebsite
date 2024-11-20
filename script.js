const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const img = new Image();
img.src = "https://i.ibb.co/Q9yv5Jk/flappy-bird-set.png";

// Resize canvas dynamically for mobile
const resizeCanvas = () => {
  canvas.width = Math.min(window.innerWidth, 431); // Maximum width of 431px
  canvas.height = window.innerHeight - 100; // Adjust for header
};
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// General settings
let gamePlaying = false;
const gravity = 0.3;
const speed = 2.2;
const size = [51, 36];
const jump = -7.5;
const cTenth = canvas.width / 10;

let index = 0, bestScore = 0, flight, flyHeight, currentScore, pipes;

// Pipe settings
const pipeWidth = 78;
const pipeGap = 300;
const pipeLoc = () =>
  Math.random() * ((canvas.height - (pipeGap + pipeWidth)) - pipeWidth) + pipeWidth;

const setup = () => {
  currentScore = 0;
  flight = jump;

  // Set initial flyHeight (middle of screen - size of the bird)
  flyHeight = (canvas.height / 2) - (size[1] / 2);

  // Setup first 3 pipes
  pipes = Array(3).fill().map((_, i) => [
    canvas.width + i * (pipeGap + pipeWidth), 
    pipeLoc()
  ]);
};

const render = () => {
  index++;

  // Background rendering
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height, 
    -(index * (speed / 2)) % canvas.width + canvas.width, 0, canvas.width, canvas.height);
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height, 
    -(index * (speed / 2)) % canvas.width, 0, canvas.width, canvas.height);

  // Pipe rendering and logic
  if (gamePlaying) {
    pipes.forEach(pipe => {
      pipe[0] -= speed;

      // Top pipe
      ctx.drawImage(img, 432, 588 - pipe[1], pipeWidth, pipe[1], pipe[0], 0, pipeWidth, pipe[1]);
      // Bottom pipe
      ctx.drawImage(img, 432 + pipeWidth, 108, pipeWidth, canvas.height - pipe[1] + pipeGap, 
        pipe[0], pipe[1] + pipeGap, pipeWidth, canvas.height - pipe[1] + pipeGap);

      // Score update and new pipe creation
      if (pipe[0] <= -pipeWidth) {
        currentScore++;
        bestScore = Math.max(bestScore, currentScore);
        pipes = [...pipes.slice(1), [pipes[pipes.length - 1][0] + pipeGap + pipeWidth, pipeLoc()]];
      }

      // Game over condition
      if (
        pipe[0] <= cTenth + size[0] && 
        pipe[0] + pipeWidth >= cTenth &&
        (pipe[1] > flyHeight || pipe[1] + pipeGap < flyHeight + size[1])
      ) {
        gamePlaying = false;
        setup();
      }
    });
  }

  // Bird rendering
  ctx.drawImage(
    img,
    432, Math.floor((index % 9) / 3) * size[1], 
    ...size, 
    cTenth, flyHeight, 
    ...size
  );
  
  if (gamePlaying) {
    flight += gravity;
    flyHeight = Math.min(flyHeight + flight, canvas.height - size[1]);
  } else {
    ctx.fillText(`Best score: ${bestScore}`, 85, 245);
    ctx.fillText('Tap to play', 90, 535);
    ctx.font = "bold 30px courier";
  }

  document.getElementById('bestScore').innerText = `Best: ${bestScore}`;
  document.getElementById('currentScore').innerText = `Current: ${currentScore}`;

  // Loop the render function
  window.requestAnimationFrame(render);
};

// Initial setup
setup();
img.onload = render;

// Start game on touch for mobile or click for desktop
document.addEventListener('touchstart', () => gamePlaying = true);
document.addEventListener('click', () => gamePlaying = true);
window.addEventListener('touchstart', () => flight = jump);
window.addEventListener('click', () => flight = jump);
