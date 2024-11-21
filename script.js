const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const img = new Image();
img.src = "https://i.ibb.co/Q9yv5Jk/flappy-bird-set.png";

// Adatta le dimensioni del canvas
const resizeCanvas = () => {
  canvas.width = Math.min(window.innerWidth, 431); // Larghezza massima di 431px
  canvas.height = window.innerHeight - 100; // Adatta per lasciare spazio all'header
};
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Impostazioni del gioco
let gamePlaying = false;
const gravity = 0.2;
const speed = 1.5;
const size = [51, 36];
const jump = -8;
const cTenth = canvas.width / 10;

let index = 0, bestScore = 0, flight, flyHeight, currentScore, pipes, birdAngle = 0;

// Impostazioni dei tubi
const pipeWidth = 78;
const pipeGap = 250;
const pipeLoc = () =>
  Math.random() * ((canvas.height - (pipeGap + pipeWidth)) - pipeWidth) + pipeWidth;

// Inizializza il gioco
const setup = () => {
  currentScore = 0;
  flight = jump;

  // Posiziona l'uccello al centro dello schermo
  flyHeight = (canvas.height / 2) - (size[1] / 2);
  birdAngle = 0;

  // Crea i tubi iniziali
  pipes = Array(3).fill().map((_, i) => [
    canvas.width + i * (pipeGap + pipeWidth), 
    pipeLoc()
  ]);
};

// Funzione di rendering
const render = () => {
  index += 0.3; // Incremento per un movimento fluido

  // Sfondo
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height,
    -(index * speed / 2) % canvas.width + canvas.width, 0, canvas.width, canvas.height);
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height,
    -(index * speed / 2) % canvas.width, 0, canvas.width, canvas.height);

  // Logica dei tubi
  if (gamePlaying) {
    pipes.forEach(pipe => {
      pipe[0] -= speed;

      // Disegna i tubi
      ctx.drawImage(img, 432, 588 - pipe[1], pipeWidth, pipe[1], pipe[0], 0, pipeWidth, pipe[1]);
      ctx.drawImage(img, 432 + pipeWidth, 108, pipeWidth, canvas.height - pipe[1] + pipeGap, 
        pipe[0], pipe[1] + pipeGap, pipeWidth, canvas.height - pipe[1] + pipeGap);

      // Rimuovi e aggiungi nuovi tubi
      if (pipe[0] <= -pipeWidth) {
        currentScore++;
        bestScore = Math.max(bestScore, currentScore);
        pipes = [...pipes.slice(1), [pipes[pipes.length - 1][0] + pipeGap + pipeWidth, pipeLoc()]];
      }

      // Game over
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

  // Disegna l'uccello
  ctx.save();
  ctx.translate(cTenth + size[0] / 2, flyHeight + size[1] / 2); // Trasla al centro dell'uccello
  ctx.rotate(birdAngle * Math.PI / 180); // Ruota l'uccello
  ctx.drawImage(
    img,
    432, Math.floor((index % 9) / 3) * size[1], 
    ...size, 
    -size[0] / 2, -size[1] / 2, // Reimposta origine per disegnare
    ...size
  );
  ctx.restore();

  // Movimento dell'uccello
  if (gamePlaying) {
    flight += gravity;
    flyHeight = Math.min(flyHeight + flight, canvas.height - size[1]); // Limite inferiore
    birdAngle = Math.min(birdAngle + 2, 90); // Inclinazione verso il basso
  } else {
    ctx.font = "bold 20px 'Press Start 2P'";
    ctx.fillText(`Best score: ${bestScore}`, canvas.width / 5, canvas.height / 3);
    ctx.fillText('Tap to play', canvas.width / 4, canvas.height / 1.5);
  }

  // Aggiorna i punteggi
  document.getElementById('bestScore').innerText = `Best: ${bestScore}`;
  document.getElementById('currentScore').innerText = `Current: ${currentScore}`;

  // Loop di rendering
  window.requestAnimationFrame(render);
};

// Configurazioni iniziali
setup();
img.onload = render;

// Eventi per avviare il gioco
document.addEventListener('touchstart', () => { 
  gamePlaying = true; 
  flight = jump; 
  birdAngle = -45; // Inclinazione verso l'alto
});
document.addEventListener('click', () => { 
  gamePlaying = true; 
  flight = jump; 
  birdAngle = -45; // Inclinazione verso l'alto
});
