const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const WIDTH = canvas.width;
const HEIGHT = canvas.height;
const MAX_LIVES = 5;

const game = {
  state: "menu",
  score: 0,
  lives: MAX_LIVES,
  level: 1,
  best: Number(localStorage.getItem("fruitFrenzyBest")) || 0,
  newBest: false,
  onChange: null
};

const player = {
  x: WIDTH / 2 - 45,
  y: HEIGHT - 90,
  w: 90,
  h: 50,
  speed: 430
};

const itemTypes = [
  { name: "apple", points: 1, size: 40, chance: 45 },
  { name: "orange", points: 2, size: 42, chance: 25 },
  { name: "cherry", points: 5, size: 34, chance: 8 },
  { name: "bomb", points: 0, size: 40, chance: 22 }
];

const keys = {};
const clouds = [
  { x: 40, y: 60, speed: 18 },
  { x: 260, y: 150, speed: 10 },
  { x: 400, y: 30, speed: 14 }
];

let items = [];
let popups = [];
let spawnTimer = 0;
let shake = 0;
let flash = 0;
let lastTime = 0;

function notify() {
  if (game.onChange) {
    game.onChange({
      state: game.state,
      score: game.score,
      lives: game.lives,
      level: game.level,
      best: game.best,
      newBest: game.newBest
    });
  }
}

function startGame() {
  game.state = "playing";
  game.score = 0;
  game.lives = MAX_LIVES;
  game.level = 1;
  game.newBest = false;
  items = [];
  popups = [];
  spawnTimer = 0.5;
  player.x = WIDTH / 2 - player.w / 2;
  notify();
}

function togglePause() {
  if (game.state === "playing") {
    game.state = "paused";
    notify();
  } else if (game.state === "paused") {
    game.state = "playing";
    notify();
  }
}

function endGame() {
  game.state = "over";
  if (game.score > game.best) {
    game.best = game.score;
    game.newBest = true;
    localStorage.setItem("fruitFrenzyBest", game.best);
  }
  notify();
}

function loseLife() {
  game.lives = game.lives - 1;
  flash = 0.25;
  if (game.lives <= 0) {
    endGame();
  }
}

function addPopup(x, y, text, color) {
  popups.push({ x: x, y: y, text: text, color: color, life: 0.8 });
}

function pickType() {
  const roll = Math.random() * 100;
  let total = 0;
  for (let i = 0; i < itemTypes.length; i++) {
    total = total + itemTypes[i].chance;
    if (roll < total) {
      return itemTypes[i];
    }
  }
  return itemTypes[0];
}

function spawnItem() {
  const type = pickType();
  const baseSpeed = Math.min(150 + game.score * 3, 380);
  items.push({
    type: type,
    x: Math.random() * (WIDTH - type.size),
    y: -type.size,
    speed: baseSpeed + Math.random() * 60,
    angle: 0,
    spin: (Math.random() - 0.5) * 4
  });
}

function keepPlayerInside() {
  if (player.x < 0) {
    player.x = 0;
  }
  if (player.x > WIDTH - player.w) {
    player.x = WIDTH - player.w;
  }
}

function movePlayerTo(clientX) {
  const rect = canvas.getBoundingClientRect();
  const x = (clientX - rect.left) * (WIDTH / rect.width);
  player.x = x - player.w / 2;
  keepPlayerInside();
}

function update(dt) {
  let move = 0;
  if (keys["ArrowLeft"] || keys["a"] || keys["A"]) {
    move = -1;
  }
  if (keys["ArrowRight"] || keys["d"] || keys["D"]) {
    move = 1;
  }
  player.x = player.x + move * player.speed * dt;
  keepPlayerInside();

  spawnTimer = spawnTimer - dt;
  if (spawnTimer <= 0) {
    spawnItem();
    spawnTimer = Math.max(0.35, 1 - game.score * 0.008);
  }

  for (let i = items.length - 1; i >= 0; i--) {
    const item = items[i];
    const size = item.type.size;
    item.y = item.y + item.speed * dt;
    item.angle = item.angle + item.spin * dt;

    const touchingBasket =
      item.y + size > player.y + 5 &&
      item.y < player.y + 30 &&
      item.x + size > player.x &&
      item.x < player.x + player.w;

    if (touchingBasket) {
      items.splice(i, 1);
      if (item.type.name === "bomb") {
        shake = 0.3;
        addPopup(item.x, item.y, "BOOM!", "#ff5a5a");
        loseLife();
      } else {
        game.score = game.score + item.type.points;
        game.level = 1 + Math.floor(game.score / 20);
        addPopup(item.x, item.y, "+" + item.type.points, "#ffffff");
      }
      notify();
    } else if (item.y > HEIGHT) {
      items.splice(i, 1);
      if (item.type.name === "apple" || item.type.name === "orange") {
        addPopup(item.x, HEIGHT - 70, "Missed!", "#ffd166");
        loseLife();
        notify();
      }
    }
  }
}

function updateEffects(dt) {
  if (shake > 0) {
    shake = shake - dt;
  }
  if (flash > 0) {
    flash = flash - dt;
  }

  for (let i = 0; i < clouds.length; i++) {
    clouds[i].x = clouds[i].x + clouds[i].speed * dt;
    if (clouds[i].x > WIDTH) {
      clouds[i].x = -150;
    }
  }

  for (let i = popups.length - 1; i >= 0; i--) {
    popups[i].y = popups[i].y - 50 * dt;
    popups[i].life = popups[i].life - dt;
    if (popups[i].life <= 0) {
      popups.splice(i, 1);
    }
  }
}

function draw() {
  ctx.save();
  if (shake > 0) {
    ctx.translate((Math.random() - 0.5) * 10, (Math.random() - 0.5) * 10);
  }

  ctx.drawImage(textures.background, -10, -10, WIDTH + 20, HEIGHT + 20);

  for (let i = 0; i < clouds.length; i++) {
    ctx.drawImage(textures.cloud, clouds[i].x, clouds[i].y);
  }

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const size = item.type.size;
    ctx.save();
    ctx.translate(item.x + size / 2, item.y + size / 2);
    ctx.rotate(item.angle);
    ctx.drawImage(textures[item.type.name], -size / 2, -size / 2, size, size);
    ctx.restore();
  }

  ctx.drawImage(textures.basket, player.x, player.y);

  ctx.font = "bold 24px Fredoka, sans-serif";
  ctx.textAlign = "center";
  for (let i = 0; i < popups.length; i++) {
    const p = popups[i];
    ctx.globalAlpha = Math.max(0, p.life / 0.8);
    ctx.fillStyle = "#000000";
    ctx.fillText(p.text, p.x + 21, p.y + 2);
    ctx.fillStyle = p.color;
    ctx.fillText(p.text, p.x + 20, p.y);
  }
  ctx.globalAlpha = 1;

  ctx.restore();

  if (flash > 0) {
    ctx.fillStyle = "rgba(255, 0, 0, " + flash * 1.5 + ")";
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
  }
}

function loop(time) {
  const dt = Math.min((time - lastTime) / 1000, 0.05);
  lastTime = time;

  if (game.state === "playing") {
    update(dt);
  }
  updateEffects(dt);
  draw();

  requestAnimationFrame(loop);
}

window.addEventListener("keydown", function (e) {
  keys[e.key] = true;

  if (e.key === "p" || e.key === "P" || e.key === "Escape") {
    togglePause();
  }

  if ((e.key === "Enter" || e.key === " ") && (game.state === "menu" || game.state === "over")) {
    e.preventDefault();
    startGame();
  }

  if (e.key === " " || e.key === "ArrowLeft" || e.key === "ArrowRight") {
    e.preventDefault();
  }
});

window.addEventListener("keyup", function (e) {
  keys[e.key] = false;
});

window.addEventListener("mousemove", function (e) {
  if (game.state === "playing") {
    movePlayerTo(e.clientX);
  }
});

window.addEventListener("touchmove", function (e) {
  if (game.state === "playing") {
    movePlayerTo(e.touches[0].clientX);
  }
}, { passive: true });

document.addEventListener("visibilitychange", function () {
  if (document.hidden && game.state === "playing") {
    togglePause();
  }
});

game.start = startGame;
game.togglePause = togglePause;

requestAnimationFrame(loop);
