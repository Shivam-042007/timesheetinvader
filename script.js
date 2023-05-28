// Constants for enemy spacing and sizing
const ENEMY_ROWS = 4;
const ENEMY_COLS = 8;
const ENEMY_WIDTH = 25;
const ENEMY_HEIGHT = 25;
const ENEMY_HORIZONTAL_SPACING = 70;
const ENEMY_VERTICAL_SPACING = 60;
const ENEMY_HORIZONTAL_PADDING = 100;
const ENEMY_VERTICAL_PADDING = 150;
const ENEMY_COLORS = [
  { color: '#97E6FF', points: 100 },
  { color: '#FEBC2C', points: 200 },
  { color: '#ff2d00', points: 300 }
];



const backgroundMusic = new //Audio('https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3');
Audio('https://thegeekdesigner.com/img/timesheet/gamemusic2.mp3');
backgroundMusic.volume = 0.04;
backgroundMusic.loop = true;



const playerImage = new Image();
playerImage.src = 'https://thegeekdesigner.com/img/timesheet/ship2.png'; // Replace with the path to your player image

// Constants for bullet properties
const BULLET_SPEED = -8;
const BULLET_FIRE_RATE = 250; // Time in milliseconds between bullets

// Constants for player movement
const PLAYER_SPEED = 25;
const PLAYER_ACCELERATION = 5;
const PLAYER_DECELERATION = 5;


const background = document.getElementById('background');

function createStar() {
  const star = document.createElement('div');
  star.className = 'star';
  star.style.left = Math.random() * 100 + 'vw';
  star.style.top = Math.random() * 100 + 'vh';
  star.style.animationDuration = 3 + Math.random() * 3 + 's';
  background.appendChild(star);
}

for (let i = 0; i < 150; i++) {
  createStar();
}




document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('gameCanvas');
  const ctx = canvas.getContext('2d');

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  
  

 
  

  // Player object

  
  
const player = {
  x: canvas.width / 2 - 30, // Adjust the starting x position to center the image
  y: canvas.height - 90, // Adjust the starting y position to position the image above the bottom
  width: 60,
  height: 80,
  dx: PLAYER_SPEED,
  bullets: [],
  easingProgress: 1,
  isMoving: false,
  ax: 0,
  vx: 0
};

  
  

// Bullet object
function Bullet(x, y) {
  this.x = x;
  this.y = y;
  this.width = 5;
  this.height = 10;
  this.color = 'yellow';
  this.dy = BULLET_SPEED;
}

// Easing function for player movement
function easeInOutQuad(t) {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}


  
  // Enemy object
function Enemy(x, y) {
  this.x = x;
  this.y = y;
  this.width = ENEMY_WIDTH;
  this.height = ENEMY_HEIGHT;
    const colorData = ENEMY_COLORS[Math.floor(Math.random() * ENEMY_COLORS.length)];
  this.color = colorData.color;
  this.points = colorData.points;
 

  
  this.dy = 3;
  this.dx = 2;
  this.hourHandAngle = 0;
  this.minuteHandAngle = 0;
}

  
  

  
  
  const enemies = [];
  let score = 0;
  let lives = 1;
  let gameOver = false;
  let lastBulletTime = 0;
// Generate enemies
for (let i = 0; i < ENEMY_ROWS; i++) {
  for (let j = 0; j < ENEMY_COLS; j++) {
    enemies.push(
      new Enemy(
        j * ENEMY_HORIZONTAL_SPACING + ENEMY_HORIZONTAL_PADDING,
        i * ENEMY_VERTICAL_SPACING + ENEMY_VERTICAL_PADDING
      )
    );
  }
}

function drawPlayer() {
  ctx.drawImage(playerImage, player.x, player.y, player.width, player.height);
}

  
  


  function drawBullets() {
    player.bullets.forEach((bullet) => {
      ctx.fillStyle = bullet.color;
      ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
    });
   
    
  }
  
  
  
  

function drawEnemies() {
  enemies.forEach((enemy) => {
    ctx.save();
    ctx.translate(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2);

    // Draw the clock's outer circle
    ctx.beginPath();
    ctx.arc(0, 0, enemy.width / 2, 0, Math.PI * 2);
    ctx.fillStyle = enemy.color;
    ctx.fill();
    ctx.closePath();

    // Draw the clock's hour hand
    ctx.save();
    ctx.rotate(enemy.hourHandAngle);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, -enemy.height / 4);
    ctx.lineWidth = 3;
    ctx.strokeStyle = 'black';
    ctx.stroke();
    ctx.closePath();
    ctx.restore();

    // Draw the clock's minute hand
    ctx.save();
    ctx.rotate(enemy.minuteHandAngle);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(enemy.width / 4, 0);
    ctx.lineWidth = 2;
    ctx.strokeStyle = 'black';
    ctx.stroke();
    ctx.closePath();
    ctx.restore();

    ctx.restore();
  });
}

 
function movePlayer(direction) {
  player.x += direction * PLAYER_SPEED;

  // Make sure the player stays within the canvas boundaries
  player.x = Math.max(Math.min(player.x, canvas.width - player.width), 0);
}


  
 function shootBullet() {
  const currentTime = Date.now();
  if (currentTime - lastBulletTime >= BULLET_FIRE_RATE) {
    player.bullets.push(new Bullet(player.x + player.width / 2 - 2.5, player.y));
    lastBulletTime = currentTime;
  }
}
 
  
  
function updateClockHands() {
  enemies.forEach((enemy) => {
    enemy.hourHandAngle += 0.01;
    enemy.minuteHandAngle += 0.04 ;
  });
}




  

  function moveBullets() {
    player.bullets.forEach((bullet) => {
      bullet.y += bullet.dy;
    });

    // Remove bullets that are out of the canvas
    player.bullets = player.bullets.filter((bullet) => bullet.y > 0);
    

    
    
  }

function moveEnemies() {
  let changeDirection = false;

  enemies.forEach((enemy) => {
    enemy.x += enemy.dx;

    if (enemy.x < 0 || enemy.x + enemy.width > canvas.width) {
      changeDirection = true;
    }
  });

  if (changeDirection) {
    enemies.forEach((enemy) => {
      enemy.dy += 6; // update this for jump distance
      enemy.y += enemy.dy;
      enemy.dx = -enemy.dx;

      // Check if any enemy has reached the player
      if (enemy.y + enemy.height >= player.y) {
        gameOver = true;
      }
    });
  }
}

  
  // Explosion object
function Explosion(x, y) {
  this.x = x;
  this.y = y;
  this.radius = 0;
  this.maxRadius = 30;
  this.color = 'orange';
}

const explosions = [];

function drawExplosions() {
  explosions.forEach((explosion) => {
    ctx.beginPath();
    ctx.arc(explosion.x, explosion.y, explosion.radius, 0, Math.PI * 2);
    ctx.fillStyle = explosion.color;
    ctx.fill();
    ctx.closePath();
  });
}

function updateExplosions() {
  explosions.forEach((explosion, index) => {
    explosion.radius += 2;

    if (explosion.radius >= explosion.maxRadius) {
      explosions.splice(index, 1);
    }
  });
}

  
  
  
    function handleCollisions() {
      player.bullets.forEach((bullet, bulletIndex) => {
    enemies.forEach((enemy, enemyIndex) => {
      if (
        bullet.x + bullet.width > enemy.x &&
        bullet.x < enemy.x + enemy.width &&
        bullet.y < enemy.y + enemy.height &&
        bullet.y + bullet.height > enemy.y
      ) {
        player.bullets.splice(bulletIndex, 1);
        enemies.splice(enemyIndex, 1);
        score += enemy.points; // Update this line

        // Create an explosion at the enemy's center
        const centerX = enemy.x + enemy.width / 2;
        const centerY = enemy.y + enemy.height / 2;
        explosions.push(new Explosion(centerX, centerY));
      }
    });
        
    
        
  });

    enemies.forEach((enemy) => {
      if (enemy.y + enemy.height >= player.y) {
        lives--;
        enemy.y = -enemy.height;
      }

      if (lives === 0) {
        gameOver = true;
      }
    });
  }

function drawScore() {
  ctx.font = '14px "Press Start 2P"';
  ctx.fillStyle = 'white';
  ctx.textAlign = 'start'; // Reset textAlign to its default value
  ctx.textBaseline = 'alphabetic'; // Reset textBaseline to its default value
  ctx.fillText('Score: ' + score, 10, 30);
}

function drawLives() {
  ctx.font = '14px "Press Start 2P"';
  ctx.fillStyle = 'white';
  ctx.textAlign = 'start'; // Reset textAlign to its default value
  ctx.textBaseline = 'alphabetic'; // Reset textBaseline to its default value
  ctx.fillText('Lives: ' + lives, canvas.width - 130, 30);
}


  

  
  
  
  



const keysDown = new Set();

function keyDownHandler(e) {
  keysDown.add(e.key);

  if (keysDown.has('ArrowRight')) {
    movePlayer(1);
  } else if (keysDown.has('ArrowLeft')) {
    movePlayer(-1);
  }

  const currentTime = Date.now();

  if (keysDown.has(' ') && currentTime - lastBulletTime >= BULLET_FIRE_RATE) {
    player.bullets.push(new Bullet(player.x + player.width / 2 - 2.5, player.y));
    lastBulletTime = currentTime;
  }

  // Toggle background music on/off with 'M' key
  if (e.key === 'm' || e.key === 'M') {
    if (backgroundMusic.paused) {
      backgroundMusic.play();
    } else {
      backgroundMusic.pause();
    }
  }
}


function keyUpHandler(e) {
  keysDown.delete(e.key);

  if (!keysDown.has('ArrowRight') && !keysDown.has('ArrowLeft')) {
    player.ax = 0; // set acceleration to zero
    player.vx *= PLAYER_DECELERATION; // decelerate player
  }
}


window.addEventListener('keydown', keyDownHandler);
window.addEventListener('keyup', keyUpHandler);


  

  
  
const legendFontSize = 10;
const legendScaleFactor = 0.75;
  
  
function drawLegend() {
  const legendText = 'Legend';
  const lineHeight = 30;
  const yOffset = 50;

  ctx.font = `${legendFontSize}px "Press Start 2P"`;
  ctx.fillStyle = 'white';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(legendText, canvas.width / 2, yOffset - lineHeight);

  const legendWidth = ENEMY_COLORS.length * (ENEMY_WIDTH * legendScaleFactor + 10) - 10;

  ENEMY_COLORS.forEach((color, index) => {
    const scaledEnemyWidth = ENEMY_WIDTH * legendScaleFactor;
    const scaledEnemyHeight = ENEMY_HEIGHT * legendScaleFactor;

    const xOffset = canvas.width / 2 - legendWidth / 2 + index * (scaledEnemyWidth + 10);

    ctx.save();
    ctx.translate(xOffset + scaledEnemyWidth / 2, yOffset + scaledEnemyHeight / 2);

    // Draw the clock's outer circle
    ctx.beginPath();
    ctx.arc(0, 0, scaledEnemyWidth / 2, 0, Math.PI * 2);
    ctx.fillStyle = color.color;
    ctx.fill();
    ctx.closePath();

    // Draw the clock's hour hand
    ctx.save();
    ctx.rotate(Math.PI / 6);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, -scaledEnemyHeight / 4);
    ctx.lineWidth = 3 * legendScaleFactor;
    ctx.strokeStyle = 'black';
    ctx.stroke();
    ctx.closePath();
    ctx.restore();

    // Draw the clock's minute hand
    ctx.save();
    ctx.rotate(Math.PI / 3);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(scaledEnemyWidth / 4, 0);
    ctx.lineWidth = 2 * legendScaleFactor;
    ctx.strokeStyle = 'black';
    ctx.stroke();
    ctx.closePath();
    ctx.restore();

    ctx.restore();

    const scaledScoreFontSize = legendFontSize * legendScaleFactor;
    ctx.font = `${scaledScoreFontSize}px "Press Start 2P"`;
    ctx.fillStyle = 'white';
    ctx.fillText(color.points, xOffset + scaledEnemyWidth / 2, yOffset + lineHeight + scaledEnemyHeight / 2);
  });
}




function drawMuteLabel() {
  ctx.font = '12px "Press Start 2P"';
  ctx.fillStyle = 'white';
  ctx.textAlign = 'right';
  ctx.textBaseline = 'bottom';
  ctx.fillText("Press 'M' to toggle music", canvas.width - 10, canvas.height - 10);
}

  
  
  
function gameLoop() {
  if (gameOver) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = '20px "Press Start 2P"';
    ctx.fillStyle = 'white';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';

    const gameOverImage = document.getElementById('gameOverImage');
    gameOverImage.style.display = 'block';
    const imgWidth = Math.min(gameOverImage.width, 400);
    const imgHeight = (gameOverImage.height / gameOverImage.width) * imgWidth;
    ctx.drawImage(gameOverImage, (canvas.width - imgWidth) / 2, canvas.height / 2 - imgHeight - 20, imgWidth, imgHeight);

    const gameOverText = ["Oh no! Outta time! Try again?", "Your Score: " + score];
    const lineHeight = 50;
    const yOffset = canvas.height / 2 - lineHeight / 2 * (gameOverText.length - 1) + imgHeight / 2;

    gameOverText.forEach((line, index) => {
      const textWidth = ctx.measureText(line).width;
      const xOffset = (canvas.width - textWidth) / 2;
      ctx.fillText(line, xOffset, yOffset + lineHeight * index);
    });
    restartButton.classList.remove('hidden');
    return;
  }

if (enemies.length === 0) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.font = '20px "Press Start 2P"';
  ctx.fillStyle = 'white';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';

  const victoryText = "You're done...for now.";
  const textWidth = ctx.measureText(victoryText).width;
  const xOffset = (canvas.width - textWidth) / 2;
  const yOffset = canvas.height / 2;

  ctx.fillText(victoryText, xOffset, yOffset);

    restartButton.classList.remove('hidden');
    return;
  }

  
    // Update player easing progress
  if (player.easingProgress < 1) {
    player.easingProgress += 0.05;
  }
  
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawPlayer();
  drawBullets();
  drawEnemies();
  drawScore();
  drawLives();
  drawLegend();
  drawMuteLabel();

  moveBullets();
  moveEnemies();
  handleCollisions();

 
  drawExplosions();

  moveBullets();
  moveEnemies();
  updateClockHands();
  handleCollisions();
  updateExplosions();

  requestAnimationFrame(gameLoop);
}

function resetGame() {
  // Reset game variables
  gameOver = false;
  score = 0;
  lives = 1;

  player.bullets = [];

  enemies.length = 0;

// Generate enemies
for (let i = 0; i < ENEMY_ROWS; i++) {
  for (let j = 0; j < ENEMY_COLS; j++) {
    enemies.push(
      new Enemy(
        j * ENEMY_HORIZONTAL_SPACING + ENEMY_HORIZONTAL_PADDING,
        i * ENEMY_VERTICAL_SPACING + ENEMY_VERTICAL_PADDING
      )
    );
  }
}

  // Hide the restart button and start the game loop again
  restartButton.classList.add('hidden');
  gameLoop();
}

const restartButton = document.getElementById('restartButton');
restartButton.addEventListener('click', resetGame);

  
 
const startScreen = document.getElementById('startScreen');
const playButton = document.getElementById('playButton');
 
  

playButton.addEventListener('click', () => {
  startScreen.style.display = 'none';
  backgroundMusic.play();
  
  gameLoop();
});
});


// ... (all the previous code remains the same)