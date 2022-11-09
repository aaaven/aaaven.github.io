// by Aven Le ZHOU, https://www.aven.cc
// CMA, HKUST(GZ)

let cellSys;
let num = 50;
let canvas;

let bg;
let colors = "FDCA40-f7b2b7-f7717d-de639a-7f2982-16001e-fcfcfc-f7567c-fffae3-88e1d9-5d576b"
  .split("-")
  .map((a) => "#" + a);

let infectPainting, simulate, curePainting;
let _width = 720,
  gap = 60,
  margin = 100,
  _height = 1280;
let savePainting = false;
let mockup = false;
let index = 0;
let frameNum = 12000;

function preload() {
  bg = loadImage("bg.png");
}

function setup() {
  canvas = createCanvas(_width * 3 + (gap + margin) * 2, _height + 2 * margin);
  cellSys = new CellSystem(num);
  colors = colors.concat(colors).concat(["#2176FF"]);

  simulate = createGraphics(_width, _height);

  infectPainting = createGraphics(_width, _height);
  infectPainting.noStroke();
  infectPainting.background(0);

  curePainting = createGraphics(_width, _height);
  curePainting.noStroke();
  curePainting.background(0);
  // frameRate(3);
}

function draw() {
  if (mockup) background(bg, width, height);
  else background(255);
  simulate.background(0);
  cellSys.update();
  cellSys.draw();
  cellSys.drawInteraction();
  // cellSys.printStats(10, 20);
  // simulate.noFill();
  // simulate.rect(0, 0, _width, _height);

  if (frameCount % 12000) cellSys.infectCell();
  translate(margin, margin);
  image(simulate, _width + gap, 0);
  image(infectPainting, 0, 0);
  image(curePainting, 2 * (_width + gap), 0);

  /*
  if (savePainting) {
    infectPainting.save("i-" + padL(index, 5) + ".png");
    simulate.save("s-" + padL(index, 5) + ".png");
    curePainting.save("c-" + padL(index, 5) + ".png");
    index++;
  }
  if (frameCount > 4*frameNum){
    savePainting = true;
    frameRate(1);
  } 
  if (index > frameNum) noLoop();
  */
  /*
  let filename = "full-" + padL(index, 5);
  saveCanvas(canvas, filename, ".png");
  index++;
  if (index > frameNum) noLoop();
  */
}

function mousePressed() {
  mockup = !mockup;
}
function padL(a, b, c) {
  return (new Array(b || 2).join(c || 0) + a).slice(-b);
}
