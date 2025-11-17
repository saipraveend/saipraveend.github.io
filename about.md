---
title: About
layout: page
---

<style>
.about-container {
  max-width: 900px;
  margin: 0 auto;
  padding: 60px 0;
}

.about-grid {
  display: grid;
  grid-template-columns: 240px 1fr;
  gap: 48px;
  margin-bottom: 60px;
}

.about-image img {
  width: 100%;
  border-radius: 50%;
  border: 4px solid #f8f9fa;
  box-shadow: 0 2px 8px rgba(60,64,67,0.15);
}

.about-content h1 {
  font-size: 3.2rem;
  font-weight: 400;
  color: #202124;
  margin-bottom: 12px;
}

.about-role {
  font-size: 1.6rem;
  color: #1a73e8;
  font-weight: 500;
  margin-bottom: 24px;
}

.about-text {
  font-size: 1.6rem;
  color: #5f6368;
  line-height: 1.8;
  margin-bottom: 16px;
}

.highlights {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 24px;
  margin: 60px 0;
}

.highlight-card {
  background: white;
  padding: 24px;
  border-radius: 8px;
  border: 1px solid #dadce0;
  transition: all 0.2s;
}

.highlight-card:hover {
  border-color: #1a73e8;
  box-shadow: 0 1px 3px 0 rgba(60,64,67,0.3), 0 4px 8px 3px rgba(60,64,67,0.15);
}

.highlight-icon {
  font-size: 2.4rem;
  margin-bottom: 12px;
}

.highlight-title {
  font-size: 1.6rem;
  font-weight: 500;
  color: #202124;
  margin-bottom: 8px;
}

.highlight-desc {
  font-size: 1.4rem;
  color: #5f6368;
  line-height: 1.6;
}

.snake-section {
  margin: 80px 0;
  padding: 40px;
  background: white;
  border-radius: 8px;
  border: 1px solid #dadce0;
  text-align: center;
}

.snake-section h2 {
  font-size: 2.4rem;
  font-weight: 400;
  color: #202124;
  margin-bottom: 12px;
}

.snake-intro {
  font-size: 1.4rem;
  color: #5f6368;
  margin-bottom: 32px;
}

#game {
  border: 2px solid #dadce0;
  border-radius: 4px;
  display: block;
  margin: 0 auto;
  box-shadow: 0 1px 3px rgba(60,64,67,0.15);
}

#score {
  font-size: 1.8rem;
  color: #202124;
  margin: 20px 0;
  font-weight: 500;
  font-variant-numeric: tabular-nums;
}

.connect-section {
  display: flex;
  justify-content: center;
  gap: 16px;
  flex-wrap: wrap;
  margin-top: 60px;
}

.connect-btn {
  padding: 12px 24px;
  background: white;
  color: #1a73e8;
  border: 1px solid #dadce0;
  border-radius: 4px;
  text-decoration: none;
  font-weight: 500;
  font-size: 1.4rem;
  transition: all 0.2s;
}

.connect-btn:hover {
  background: #f8f9fa;
  border-color: #1a73e8;
  text-decoration: none;
}

@media (max-width: 768px) {
  .about-grid {
    grid-template-columns: 1fr;
    text-align: center;
  }

  .about-image {
    max-width: 200px;
    margin: 0 auto;
  }

  .about-content h1 {
    font-size: 2.4rem;
  }

  .highlights {
    grid-template-columns: 1fr;
  }
}
</style>

<div class="about-container">
  <div class="about-grid">
    <div class="about-image">
      <img src="{{ site.url }}/{{ site.picture }}" alt="Saipraveen Durairaman">
    </div>

    <div class="about-content">
      <h1>Saipraveen Durairaman</h1>
      <p class="about-role">Embedded Systems Engineer at MathWorks</p>

      <p class="about-text">
        I build stuff with microcontrollers, sensors, and code. Started with simple obstacle-avoiding robots back in 2010, competed at national level, built power electronics systems that got published, and now exploring how AI fits into embedded hardware.
      </p>

      <p class="about-text">
        Currently managing embedded hardware product marketing at MathWorks India, but I still spend my weekends prototyping with ESP32s and testing TinyML models.
      </p>
    </div>
  </div>

  <div class="highlights">
    <div class="highlight-card">
      <div class="highlight-icon">🏆</div>
      <h3 class="highlight-title">Competitions</h3>
      <p class="highlight-desc">3rd place at IIT Madras Robotics, Top 20 at IndiaHacks 2016</p>
    </div>

    <div class="highlight-card">
      <div class="highlight-icon">📝</div>
      <h3 class="highlight-title">Published</h3>
      <p class="highlight-desc">ARPN Journal, featured on Digilent Blog and Hackster.io</p>
    </div>

    <div class="highlight-card">
      <div class="highlight-icon">🔧</div>
      <h3 class="highlight-title">Maker</h3>
      <p class="highlight-desc">DIY electronics, upcycling projects, assistive tech innovations</p>
    </div>
  </div>

  <div class="snake-section">
    <h2>Why not?</h2>
    <p class="snake-intro">Classic Snake game in vanilla JavaScript 🎮</p>

    <div id="score">Score: 0</div>
    <canvas width="400" height="400" id="game"></canvas>
    <p style="font-size: 1.2rem; color: #5f6368; margin-top: 16px;">Use arrow keys to move</p>
  </div>

  <div class="connect-section">
    <a href="{{ site.url }}/projects" class="connect-btn">View Projects</a>
    <a href="{{ site.url }}/lab" class="connect-btn">Explore Lab</a>
    <a href="https://www.linkedin.com/in/saipraveend" target="_blank" class="connect-btn">LinkedIn</a>
    <a href="https://github.com/saipraveend" target="_blank" class="connect-btn">GitHub</a>
  </div>
</div>

<script>
var canvas = document.getElementById('game');
var context = canvas.getContext('2d');
var grid = 16;
var count = 0;
var score = 0;
var scoreDisplay = document.getElementById('score');

var snake = {
  x: 160,
  y: 160,
  dx: grid,
  dy: 0,
  cells: [],
  maxCells: 4
};

var apple = {
  x: 320,
  y: 320
};

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function loop() {
  requestAnimationFrame(loop);

  if (++count < 4) {
    return;
  }

  count = 0;
  context.clearRect(0,0,canvas.width,canvas.height);

  snake.x += snake.dx;
  snake.y += snake.dy;

  if (snake.x < 0) {
    snake.x = canvas.width - grid;
  }
  else if (snake.x >= canvas.width) {
    snake.x = 0;
  }

  if (snake.y < 0) {
    snake.y = canvas.height - grid;
  }
  else if (snake.y >= canvas.height) {
    snake.y = 0;
  }

  snake.cells.unshift({x: snake.x, y: snake.y});

  if (snake.cells.length > snake.maxCells) {
    snake.cells.pop();
  }

  context.fillStyle = '#EA4335';
  context.fillRect(apple.x, apple.y, grid-1, grid-1);

  context.fillStyle = '#1a73e8';
  snake.cells.forEach(function(cell, index) {
    context.fillRect(cell.x, cell.y, grid-1, grid-1);

    if (cell.x === apple.x && cell.y === apple.y) {
      snake.maxCells++;
      score++;
      scoreDisplay.textContent = 'Score: ' + score;
      apple.x = getRandomInt(0, 25) * grid;
      apple.y = getRandomInt(0, 25) * grid;
    }

    for (var i = index + 1; i < snake.cells.length; i++) {
      if (cell.x === snake.cells[i].x && cell.y === snake.cells[i].y) {
        snake.x = 160;
        snake.y = 160;
        snake.cells = [];
        snake.maxCells = 4;
        snake.dx = grid;
        snake.dy = 0;
        apple.x = getRandomInt(0, 25) * grid;
        apple.y = getRandomInt(0, 25) * grid;
        score = 0;
        scoreDisplay.textContent = 'Score: ' + score;
      }
    }
  });
}

document.addEventListener('keydown', function(e) {
  e.preventDefault();

  if (e.which === 37 && snake.dx === 0) {
    snake.dx = -grid;
    snake.dy = 0;
  }
  else if (e.which === 38 && snake.dy === 0) {
    snake.dy = -grid;
    snake.dx = 0;
  }
  else if (e.which === 39 && snake.dx === 0) {
    snake.dx = grid;
    snake.dy = 0;
  }
  else if (e.which === 40 && snake.dy === 0) {
    snake.dy = grid;
    snake.dx = 0;
  }
});

requestAnimationFrame(loop);
</script>
