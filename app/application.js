function createGeneration(width, height) {
  var generation = new Array(height);
  var planisphere = calculatePlanisphere();
  document.getElementById("data_plan").innerHTML = planisphere;
  for (var y = 0; y < height; y++) {
    generation[y] = [];
    for (var x = 0; x < width; x++) {
      if (planisphere[(x + y * 1282) * 4 + 1] == 255) {
        generation[y][x] = Math.floor(Math.random() * 2);
      } else {
        generation[y][x] = -1;
      }
    }
  }
  return generation;
}

function calculatePlanisphere() {
  var planisphere = new Array();
  var canvas_terrain = document.getElementById("canvas_terrain");
  var ctx_terrain = canvas_terrain.getContext("2d");
  planisphere = ctx_terrain.getImageData(0, 0, 1282, 641).data;
  return planisphere;
}

function draw(context2d, generation, totalGeneration) {
  var height = generation.length;
  var width = generation[0].length;
  var scale = 1;

  console.log(totalGeneration);
  document.getElementById("generation_id").innerHTML = totalGeneration;
  clearBackground(context2d, width, height, scale);
  drawCells(context2d, generation, width, height, scale);

  if (totalGeneration > 0)
    setTimeout(update, 200, context2d, generation, totalGeneration);
}

function clearBackground(context2d, width, height, scale) {
  context2d.fillStyle = "blue";
  context2d.fillRect(0, 0, width * scale, height * scale);
  context2d.fillStyle = "red";

  context2d.fillRect(0, 0, 4, 4);
}

function drawPlanisphere(context2d, width, height, scale) {
  for (var y = 0; y < height; y++) {
    for (var x = 0; x < width; x++) {}
  }
}

function drawCells(context2d, generation, width, height, scale) {
  context2d.fillStyle = "white";
  for (var y = 0; y < height; y++) {
    for (var x = 0; x < width; x++) {
      switch (generation[y][x]) {
        case 0:
          context2d.fillStyle = "rgb(0, 233, 0)";
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

  if (result === 3) return 1;
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

function update(ctx, generation, totalGeneration) {
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

  setTimeout(draw, 200, ctx, nextGeneration, totalGeneration - 1);
}

(function() {
  var img = new Image();
  img.crossOrigin = "anonymous";
  img.src = "./ressources/planisphere_terrain.png";
  var canvas_terrain = document.getElementById("canvas_terrain");
  var ctx_terrain = canvas_terrain.getContext("2d");
  img.onload = function() {
    ctx_terrain.drawImage(img, 0, 0);

    var generation = createGeneration(1282, 641);
    var c = document.getElementById("canvas");
    var ctx = c.getContext("2d");
    var totalGeneration = 50;

    draw(ctx, generation, totalGeneration);
  };
})();
