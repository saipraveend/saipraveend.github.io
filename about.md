---
title: About
layout: page
---

<style>
.about-section {
  max-width: 900px;
  margin: 0 auto;
}

.about-hero {
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 50px;
  align-items: start;
  margin-bottom: 60px;
}

.about-image-wrapper {
  position: relative;
}

.about-image {
  width: 100%;
  border-radius: 16px;
  box-shadow: 0 10px 40px rgba(0,0,0,0.15);
}

.about-content h1 {
  font-size: 2.5rem;
  color: #0f172a;
  margin-bottom: 10px;
  line-height: 1.2;
}

.about-role {
  font-size: 1.3rem;
  color: #0ea5e9;
  font-weight: 600;
  margin-bottom: 25px;
}

.about-bio {
  font-size: 1.1rem;
  color: #64748b;
  line-height: 1.8;
  margin-bottom: 30px;
}

.about-highlights {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 25px;
  margin: 50px 0;
}

.highlight-card {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 25px;
  transition: all 0.3s ease;
}

.highlight-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(0,0,0,0.1);
  border-color: #0ea5e9;
}

.highlight-icon {
  font-size: 2rem;
  margin-bottom: 15px;
}

.highlight-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #0f172a;
  margin-bottom: 8px;
}

.highlight-desc {
  font-size: 0.95rem;
  color: #64748b;
  line-height: 1.5;
}

.connect-section {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 40px;
  border-radius: 16px;
  text-align: center;
  margin-top: 50px;
}

.connect-section h2 {
  font-size: 1.8rem;
  margin-bottom: 20px;
}

.connect-links {
  display: flex;
  gap: 15px;
  justify-content: center;
  flex-wrap: wrap;
  margin-top: 25px;
}

.connect-btn {
  display: inline-block;
  padding: 12px 28px;
  background: white;
  color: #667eea;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;
}

.connect-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 20px rgba(255,255,255,0.3);
}

@media (max-width: 768px) {
  .about-hero {
    grid-template-columns: 1fr;
    gap: 30px;
    text-align: center;
  }

  .about-image-wrapper {
    max-width: 250px;
    margin: 0 auto;
  }

  .about-content h1 {
    font-size: 2rem;
  }

  .about-role {
    font-size: 1.1rem;
  }

  .about-highlights {
    grid-template-columns: 1fr;
  }
}
</style>

<div class="about-section">
  <div class="about-hero">
    <div class="about-image-wrapper">
      <img class="about-image" src="{{ site.url }}/{{ site.picture }}" alt="Saipraveen Durairaman">
    </div>
    <div class="about-content">
      <h1>Hi, I'm Sai 👋</h1>
      <p class="about-role">Managing Embedded Hardware Product Marketing at MathWorks</p>
      <p class="about-bio">
        I build stuff with microcontrollers, sensors, and code. Started with simple obstacle-avoiding robots
        back in 2010, competed at IIT Madras, built power electronics systems, and now I'm exploring how AI
        fits into embedded hardware. This site is where I document what I make and share what works (and what doesn't).
      </p>
    </div>
  </div>

  <div class="about-highlights">
    <div class="highlight-card">
      <div class="highlight-icon">🏆</div>
      <h3 class="highlight-title">Competition Success</h3>
      <p class="highlight-desc">3rd place at IIT Madras Robotics, Top 20 at IndiaHacks 2016</p>
    </div>
    <div class="highlight-card">
      <div class="highlight-icon">📝</div>
      <h3 class="highlight-title">Published Work</h3>
      <p class="highlight-desc">ARPN Journal publications, featured on Digilent Blog & Hackster.io</p>
    </div>
    <div class="highlight-card">
      <div class="highlight-icon">💡</div>
      <h3 class="highlight-title">Maker Mindset</h3>
      <p class="highlight-desc">DIY electronics, upcycling projects, and assistive technology innovations</p>
    </div>
  </div>

  <div class="connect-section">
    <h2>Let's Connect</h2>
    <p>Working on something similar? Want to collaborate? Let's talk.</p>
    <div class="connect-links">
      <a href="{{ site.url }}/projects" class="connect-btn">View Projects</a>
      <a href="{{ site.url }}/lab" class="connect-btn">Explore Lab</a>
      <a href="https://www.linkedin.com/in/saipraveend" target="_blank" class="connect-btn">LinkedIn</a>
      <a href="https://github.com/saipraveend" target="_blank" class="connect-btn">GitHub</a>
    </div>
  </div>
</div>

---

## While here - If you're like me, you'll enjoy this classic game!

<head>
  <style>
  html, body {
    height: 100%;
    margin: 0;
  }
  body {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  canvas {
    border: 1px solid black;
  }
  score {
      font-size: 20px;
      margin: 5px 0;
    }
  </style>
</head>
<body>
<pre><code data-trim>
<p align="center">
<h4 id="score">Score: 0</h4> <!-- Score display -->
<canvas width="400" height="400" id="game" align="right"></canvas>
</p>
<script>
var canvas = document.getElementById('game');
var context = canvas.getContext('2d');
var grid = 16;
var count = 0;
var score = 0; // Initialize score
var scoreDisplay = document.getElementById('score');
var snake = {
  x: 160,
  y: 160,
  // snake velocity. moves one grid length every frame in either the x or y direction
  dx: grid,
  dy: 0,
  // keep track of all grids the snake body occupies
  cells: [],
  // length of the snake. grows when eating an apple
  maxCells: 4
};
var apple = {
  x: 320,
  y: 320
};
// get random whole numbers in a specific range
// @see https://stackoverflow.com/a/1527820/2124254
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}
// game loop
function loop() {
  requestAnimationFrame(loop);
  // slow game loop to 15 fps instead of 60 (60/15 = 4)
  if (++count < 4) {
    return;
  }
  count = 0;
  context.clearRect(0,0,canvas.width,canvas.height);
  // move snake by it's velocity
  snake.x += snake.dx;
  snake.y += snake.dy;
  // wrap snake position horizontally on edge of screen
  if (snake.x < 0) {
    snake.x = canvas.width - grid;
  }
  else if (snake.x >= canvas.width) {
    snake.x = 0;
  }
  // wrap snake position vertically on edge of screen
  if (snake.y < 0) {
    snake.y = canvas.height - grid;
  }
  else if (snake.y >= canvas.height) {
    snake.y = 0;
  }
  // keep track of where snake has been. front of the array is always the head
  snake.cells.unshift({x: snake.x, y: snake.y});
  // remove cells as we move away from them
  if (snake.cells.length > snake.maxCells) {
    snake.cells.pop();
  }
  // draw apple
  context.fillStyle = 'red';
  context.fillRect(apple.x, apple.y, grid-1, grid-1);
  // draw snake one cell at a time
  context.fillStyle = 'green';
  snake.cells.forEach(function(cell, index) {
    // drawing 1 px smaller than the grid creates a grid effect in the snake body so you can see how long it is
    context.fillRect(cell.x, cell.y, grid-1, grid-1);  
    // snake ate apple
    if (cell.x === apple.x && cell.y === apple.y) {
      snake.maxCells++;
      // canvas is 400x400 which is 25x25 grids 
		score++;
		scoreDisplay.textContent = 'Score: ' + score; // Update score display
      apple.x = getRandomInt(0, 25) * grid;
      apple.y = getRandomInt(0, 25) * grid;
    }
    // check collision with all cells after this one (modified bubble sort)
    for (var i = index + 1; i < snake.cells.length; i++) { 
      // snake occupies same space as a body part. reset game
      if (cell.x === snake.cells[i].x && cell.y === snake.cells[i].y) {
        snake.x = 160;
        snake.y = 160;
        snake.cells = [];
        snake.maxCells = 4;
        snake.dx = grid;
        snake.dy = 0;
        apple.x = getRandomInt(0, 25) * grid;
        apple.y = getRandomInt(0, 25) * grid;
		   score = 0; // Reset score
        scoreDisplay.textContent = 'Score: ' + score; // Update score display
      }
    }
  });
}
// listen to keyboard events to move the snake
document.addEventListener('keydown', function(e) {
	  event.preventDefault()
  // prevent snake from backtracking on itself by checking that it's 
  // not already moving on the same axis (pressing left while moving
  // left won't do anything, and pressing right while moving left
  // shouldn't let you collide with your own body) 
  // left arrow key
  if (e.which === 37 && snake.dx === 0) {
    snake.dx = -grid;
    snake.dy = 0;
  }
  // up arrow key
  else if (e.which === 38 && snake.dy === 0) {
    snake.dy = -grid;
    snake.dx = 0;
  }
  // right arrow key
  else if (e.which === 39 && snake.dx === 0) {
    snake.dx = grid;
    snake.dy = 0;
  }
  // down arrow key
  else if (e.which === 40 && snake.dy === 0) {
    snake.dy = grid;
    snake.dx = 0;
  }
});
// start the game
requestAnimationFrame(loop);
</script>
</code></pre>
</body>
