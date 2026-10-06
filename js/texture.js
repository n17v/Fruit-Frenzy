const textures = {};

function makeTexture(w, h, draw) {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const g = c.getContext("2d");
  draw(g, w, h);
  return c;
}

function circle(g, x, y, r, color) {
  g.fillStyle = color;
  g.beginPath();
  g.arc(x, y, r, 0, Math.PI * 2);
  g.fill();
}

function leaf(g, x, y, angle) {
  g.fillStyle = "#4caf50";
  g.beginPath();
  g.ellipse(x, y, 11, 5, angle, 0, Math.PI * 2);
  g.fill();
}

textures.background = makeTexture(480, 640, function (g, w, h) {
  const sky = g.createLinearGradient(0, 0, 0, h);
  sky.addColorStop(0, "#5ec8f2");
  sky.addColorStop(1, "#d9f5ff");
  g.fillStyle = sky;
  g.fillRect(0, 0, w, h);

  circle(g, 390, 110, 55, "rgba(255, 236, 130, 0.35)");
  circle(g, 390, 110, 38, "#ffe66d");

  circle(g, 90, 700, 280, "#8fd47a");
  circle(g, 420, 690, 250, "#6cc062");

  g.fillStyle = "#3f9b49";
  g.fillRect(0, 598, w, 42);
  g.fillStyle = "#2f7d3a";
  g.fillRect(0, 598, w, 6);

  g.strokeStyle = "#2f7d3a";
  g.lineWidth = 3;
  for (let x = 10; x < w; x += 24) {
    g.beginPath();
    g.moveTo(x, 604);
    g.lineTo(x - 4, 592);
    g.moveTo(x, 604);
    g.lineTo(x + 5, 593);
    g.stroke();
  }
});

textures.cloud = makeTexture(130, 60, function (g) {
  circle(g, 35, 38, 22, "rgba(255,255,255,0.9)");
  circle(g, 65, 28, 26, "rgba(255,255,255,0.9)");
  circle(g, 95, 38, 21, "rgba(255,255,255,0.9)");
  g.fillStyle = "rgba(255,255,255,0.9)";
  g.fillRect(35, 38, 60, 21);
});

textures.basket = makeTexture(90, 50, function (g) {
  g.fillStyle = "#c98a3d";
  g.beginPath();
  g.moveTo(6, 10);
  g.lineTo(84, 10);
  g.lineTo(74, 48);
  g.lineTo(16, 48);
  g.closePath();
  g.fill();

  g.strokeStyle = "#8a5a1f";
  g.lineWidth = 3;
  for (let y = 20; y < 48; y += 10) {
    g.beginPath();
    g.moveTo(8, y);
    g.lineTo(82, y);
    g.stroke();
  }
  for (let x = 20; x < 80; x += 14) {
    g.beginPath();
    g.moveTo(x, 10);
    g.lineTo(x - 3, 48);
    g.stroke();
  }

  g.fillStyle = "#a86f2a";
  g.fillRect(2, 4, 86, 10);
  g.fillStyle = "#d9a05b";
  g.fillRect(2, 4, 86, 4);
});

textures.apple = makeTexture(64, 64, function (g) {
  circle(g, 23, 38, 20, "#e63946");
  circle(g, 41, 38, 20, "#e63946");
  circle(g, 32, 44, 18, "#e63946");
  circle(g, 19, 31, 5, "rgba(255,255,255,0.55)");
  g.fillStyle = "#6b3e1e";
  g.fillRect(30, 8, 4, 14);
  leaf(g, 43, 13, -0.4);
});

textures.orange = makeTexture(64, 64, function (g) {
  circle(g, 32, 36, 26, "#fb8500");
  circle(g, 22, 28, 3, "#d96f00");
  circle(g, 40, 24, 3, "#d96f00");
  circle(g, 44, 44, 3, "#d96f00");
  circle(g, 26, 47, 3, "#d96f00");
  circle(g, 20, 26, 6, "rgba(255,255,255,0.4)");
  leaf(g, 38, 10, -0.3);
  g.fillStyle = "#6b3e1e";
  g.fillRect(31, 7, 3, 7);
});

textures.cherry = makeTexture(64, 64, function (g) {
  g.strokeStyle = "#4a7c2f";
  g.lineWidth = 3;
  g.beginPath();
  g.moveTo(20, 36);
  g.lineTo(34, 6);
  g.lineTo(44, 38);
  g.stroke();
  leaf(g, 42, 8, 0.2);
  circle(g, 20, 46, 15, "#c1121f");
  circle(g, 44, 49, 15, "#c1121f");
  circle(g, 15, 41, 4, "rgba(255,255,255,0.5)");
  circle(g, 39, 44, 4, "rgba(255,255,255,0.5)");
});

textures.bomb = makeTexture(64, 64, function (g) {
  g.strokeStyle = "#8d6e63";
  g.lineWidth = 4;
  g.beginPath();
  g.moveTo(40, 16);
  g.quadraticCurveTo(46, 8, 50, 8);
  g.stroke();

  circle(g, 32, 38, 24, "#262626");
  circle(g, 23, 28, 6, "#5c5c5c");
  g.fillStyle = "#444";
  g.fillRect(26, 12, 14, 8);

  circle(g, 24, 40, 6, "#ffffff");
  circle(g, 41, 40, 6, "#ffffff");
  circle(g, 25, 41, 3, "#000000");
  circle(g, 40, 41, 3, "#000000");

  g.strokeStyle = "#ff4d4d";
  g.lineWidth = 3;
  g.beginPath();
  g.moveTo(17, 30);
  g.lineTo(28, 35);
  g.moveTo(47, 30);
  g.lineTo(36, 35);
  g.stroke();

  circle(g, 51, 7, 6, "#ffd166");
  circle(g, 51, 7, 3, "#ff6b35");
});
