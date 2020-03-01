function createGeneration(width, height) {
  var generation = new Array(height);
  var planisphere = calculatePlanisphere();
  for (var y = 0; y < height; y++) {
    generation[y] = [];
    for (var x = 0; x < width; x++) {
      if (
        planisphere[(x + y * 2161) * 4 + 0] < 50 &&
        planisphere[(x + y * 2161) * 4 + 1] < 50 &&
        planisphere[(x + y * 2161) * 4 + 2] < 50
      ) {
        generation[y][x] = -1;
        //generation[y][x] = Math.floor(Math.random() * 2);
      } else {
        generation[y][x] = 0;
      }
    }
  }
  /* generation[301][947] = 1;
  generation[300][947] = 1;
  generation[302][947] = 1;
  generation[298][947] = 1;
  generation[298][945] = 1;
  generation[300][945] = 1;
  generation[302][945] = 1;
  generation[300][944] = 1;
  generation[300][943] = 1;
*/
  return generation;
}

function calculatePlanisphere() {
  var planisphere = new Array();
  var canvas_terrain = document.getElementById("canvas_terrain");
  var ctx_terrain = canvas_terrain.getContext("2d");
  planisphere = ctx_terrain.getImageData(0, 0, 2161, 1038).data;
  return planisphere;
}

function draw(context2d, generation, generationD) {
  var height = generation.length;
  var width = generation[0].length;
  var scale = 1;

  document.getElementById("generation_id").innerHTML = generationD;
  clearBackground(context2d, width, height, scale);
  drawCells(context2d, generation, width, height, scale);
  generationDate = generationD;
  if (play == true) setTimeout(update, 50, context2d, generation, generationD);
  return generation;
}

function clearBackground(context2d, width, height, scale) {
  context2d.fillStyle = "rgb(50, 50, 250)";
  context2d.fillRect(0, 0, width * scale, height * scale);
}

function drawCells(context2d, generation, width, height, scale) {
  context2d.fillStyle = "white";
  for (var y = 0; y < height; y++) {
    for (var x = 0; x < width; x++) {
      switch (generation[y][x]) {
        case 0:
          context2d.fillStyle = "rgb(10, 230, 30)";
          context2d.fillRect(x * scale, y * scale, scale, scale);
          break;
        case 1:
          context2d.fillStyle = "red";
          context2d.fillRect(x * scale, y * scale, scale, scale);
          break;
        default:
          break;
      }
    }
  }
}

function nextCellState(neighborhood) {
  var result = neighborhood.reduce(function(a, b) {
    return a + b;
  }, 0);

  if (result === 2) return 1;
  else if (result === 4) return neighborhood[4];
  else return 0;
}

function extractNeighborhood(generation, x, y) {
  var cells = line1(generation, x, y).concat(
    line2(generation, x, y),
    line3(generation, x, y)
  );

  return cells.map(function(cell) {
    return cell === undefined ? 0 : cell;
  });
}

function line1(generation, x, y) {
  if (y > 0) return extractLine(generation[y - 1], x);
  else return extractLine(generation[generation.length - 1], x);
}

function line2(generation, x, y) {
  return extractLine(generation[y], x);
}

function line3(generation, x, y) {
  if (y === generation.length - 1) return extractLine(generation[0], x);
  else return extractLine(generation[y + 1], x);
}

function extractLine(line, x) {
  var left = x - 1,
    right = x + 1;

  if (x === 0) left = line.length - 1;
  else if (x === line.length - 1) right = 0;

  return [line[left], line[x], line[right]];
}

function update(ctx, generation, generationDate) {
  var height = generation.length,
    width = generation[0].length;

  // Create an empty generation.
  var nextGeneration = new Array(height);
  for (var y = 0; y < height; y++) {
    nextGeneration[y] = new Array(width);
  }

  // Fill the next generation.
  for (var y = 0; y < height; y++) {
    for (var x = 0; x < width; x++) {
      if (generation[y][x] === -1) {
        nextGeneration[y][x] = -1;
      } else {
        var neighborhood = extractNeighborhood(generation, x, y);
        var state = nextCellState(neighborhood);
        nextGeneration[y][x] = state;
      }
    }
  }

  setTimeout(draw, 50, ctx, nextGeneration, generationDate - 1);
}

function getMousePos(canvas, evt) {
  var rect = canvas.getBoundingClientRect();
  return {
    x: evt.clientX - rect.left,
    y: evt.clientY - rect.top
  };
}

function stop_game() {
  play = false;
}
function play_game() {
  if (play == false) {
    play = true;
    generation = draw(ctx, generation, generationDate);
  }
}
function next_game() {
  if (play == false) {
    update(ctx, generation, generationDate);
  }
}

var generationDate = 20200229;
var play = false;

function createCell(x, y) {
  generation[y][x] = 1;
  generation[y][x + 1] = 1;
  generation[y][x + 2] = 1;

  generation[y + 1][x] = 1;
  generation[y + 1][x + 1] = 1;
  generation[y + 1][x + 2] = 1;

  generation[y + 2][x] = 1;
  generation[y + 2][x + 1] = 1;
  generation[y + 2][x + 2] = 1;
  draw(ctx, generation, generationDate);
}
var generationDate = 20200229;
var play = false;

// LOAD TERRAIN
var img_terrain = new Image();
img_terrain.crossOrigin = "anonymous";
img_terrain.src = "./ressources/world_terrain_30.png";
var canvas_terrain = document.getElementById("canvas_terrain");
var ctx_terrain = canvas_terrain.getContext("2d");

// LOAD DENSITY
var img_density = new Image();
img_density.crossOrigin = "anonymous";
img_density.src = "./ressources/world_density_30.png";
var canvas_density = document.getElementById("canvas_density");
var ctx_density = canvas_density.getContext("2d");

var c = document.getElementById("canvas");
var ctx = c.getContext("2d");
var generation;

img_terrain.onload = function() {
  ctx_terrain.drawImage(img_terrain, 0, 0);
  generation = createGeneration(2161, 1038);
  c.addEventListener(
    "mousemove",
    function(evt) {
      var mousePos = getMousePos(canvas, evt);
      document.getElementById("x_coord").innerHTML = Math.floor(mousePos.x);
      document.getElementById("y_coord").innerHTML = Math.floor(mousePos.y);
    },
    false
  );
  c.addEventListener(
    "click",
    function(evt) {
      var mousePos = getMousePos(canvas, evt);
      var width = canvas.getBoundingClientRect().width;
      var height = canvas.getBoundingClientRect().height;
      var x = (mousePos.x * 2161) / width;
      var y = (mousePos.y * 1038) / height;
      createCell(Math.floor(x), Math.floor(y));
    },
    false
  );
  draw(ctx, generation, generationDate);
};
img_density.onload = function() {
  ctx_density.drawImage(img_density, 0, 0);
};
