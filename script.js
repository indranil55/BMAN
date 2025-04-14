<script>
  const canvas = document.getElementById('gameCanvas');
  const ctx = canvas.getContext('2d');

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    player.x = lanes[player.lane]; // keep player in correct lane
  }

  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  const coinSound = document.getElementById('coinSound');
  const crashSound = document.getElementById('crashSound');

  let player = { x: canvas.width / 2, y: canvas.height - 150, width: 50, height: 50, lane: 1 };
  let lanes = [canvas.width / 2 - 100, canvas.width / 2, canvas.width / 2 + 100];
  let coins = [];
  let trains = [];
  let score = 0;
  let gameStarted = false;
  let gameOver = false;

  function drawPlayer() {
    ctx.fillStyle = 'yellow';
    ctx.beginPath();
    ctx.arc(player.x, player.y, 25, 0, Math.PI * 2);
    ctx.fill();
  }

  function drawCoins() {
    ctx.fillStyle = 'gold';
    coins.forEach(c => {
      ctx.beginPath();
      ctx.arc(c.x, c.y, 10, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  function drawTrains() {
    ctx.fillStyle = 'red';
    trains.forEach(t => ctx.fillRect(t.x - 40, t.y, 80, 100));
  }

  function drawPolice() {
    ctx.fillStyle = 'blue';
    ctx.beginPath();
    ctx.arc(player.x, player.y + 70, 20, 0, Math.PI * 2);
    ctx.fill();
  }

  function update() {
    if (!gameStarted || gameOver) return;

    coins.forEach(c => c.y += 5);
    trains.forEach(t => t.y += 7);

    coins = coins.filter(c => {
      if (Math.abs(c.x - player.x) < 30 && Math.abs(c.y - player.y) < 30) {
        score++;
        coinSound.currentTime = 0;
        coinSound.play();
        document.getElementById('score').textContent = 'স্কোর: ' + score;
        return false;
      }
      return c.y < canvas.height;
    });

    trains.forEach(t => {
      if (Math.abs(t.x - player.x) < 50 && Math.abs(t.y - player.y) < 70) {
        crashSound.play();
        gameOver = true;
        setTimeout(() => {
          document.getElementById('startText').textContent = `ধরা পড়ে গেছো! স্কোর: ${score} | আবার খেলতে স্পেস চাপুন`;
          document.getElementById('startText').style.display = 'block';
        }, 200);
      }
    });

    if (Math.random() < 0.03) {
      coins.push({ x: lanes[Math.floor(Math.random() * 3)], y: -20 });
    }
    if (Math.random() < 0.02) {
      trains.push({ x: lanes[Math.floor(Math.random() * 3)], y: -100 });
    }
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawCoins();
    drawTrains();
    drawPlayer();
    drawPolice();
  }

  function loop() {
    update();
    draw();
    requestAnimationFrame(loop);
  }

  document.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft' && player.lane > 0) player.lane--;
    if (e.key === 'ArrowRight' && player.lane < 2) player.lane++;
    if (e.key === ' ') {
      if (!gameStarted) {
        document.getElementById('startText').style.display = 'none';
        gameStarted = true;
      } else if (gameOver) {
        location.reload();
      }
    }
    player.x = lanes[player.lane];
  });

  loop();
</script>
