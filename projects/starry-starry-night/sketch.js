var particles = [];
// amount of particles per row
var pPerRow = 150;
var cIndex = 0;
var noiseScale = 500;

function setup() {
  colors = [
    color(0, 160, 250, 60),
    color(0, 150, 250, 60),
    color(60, 250, 255, 60),
    color(20, 150, 255, 60),
    color(255, 150, 0, 60),
    color(200, 190, 0, 60),
    color(250, 190, 0, 60)
  ];

  createCanvas(
    window.innerWidth,
    window.innerHeight
  );

  background(0);
  seedParticles();
}

function draw() {
  particles.forEach(function(particle) {
    particle.move();
    particle.render();
  });
}

function seedParticles() {
  var wInterval = width / pPerRow;
  var hInterval = height / pPerRow;
  var paddingW = width / 3;
  var paddingH = height / 3;

  for (var i = paddingW; i <= width - paddingW; i+= wInterval) {
    for (var j = paddingH; j <= height - paddingH; j += hInterval) {

      var c = Math.round(
        cIndex % colors.length
      );
      cIndex++;
      var particle = new Particle(
        // add guassian to randomly disperse starting points
        i + randomGaussian(-30, 40),
        j + randomGaussian(-30, 40),
        c
      );
      particles.push(particle);
    }
  }
}

function Particle(x, y, colorIndex) {
  this.position = createVector(x, y);
  this.color = colorIndex;

  this.move = function() {
    var angleNoise = noise(
      noise(this.position.x / noiseScale, this.position.y / noiseScale) * 15,
      noise(frameCount * noise(frameCount), frameCount / noise(frameCount)) * 0.03
    ) * noiseScale;

    var density = 0.97;

    this.position.x += cos(cos(angleNoise) * (1.5 + noise(frameCount))) * density;
    this.position.y += sin(sin(angleNoise) * (1.5 + noise(frameCount))) * density;
  }

  this.render = function() {
    stroke(colors[this.color]);
    point(
      this.position.x,
      this.position.y
    );
  }
}

function resetEnvironment() {
  particles = [];
  seedParticles();
  background(0);
}

function windowResized() {
   createCanvas(
    window.innerWidth,
    window.innerHeight
  );
  resetEnvironment();
}