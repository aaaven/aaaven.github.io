class Cell {
  constructor() {
    this.xoff = random(1000);
    this.yoff = random(1000);
    this.location = createVector(random(_width), random(_height));
    this.gene = random(1); // setting the type
    this.radius = map(this.gene, 0, 1, 5, 30); 
    // this.radius = map(this.gene, 0, 1, 10, 60); 
    this.maxSpeed = map(this.gene, 0, 1, 0.05, 1.2);
    // this.maxSpeed = map(this.gene, 0, 1, 0.02, 0.7);
    this.cureRate = map(this.gene, 0, 1, 2, 0.25);
    this.health = 255;
    this.isAlive = true;
    this.velocity = createVector(0, 0);
    this.color = random(colors);
    this.targetColor = random(colors);
    this.sw = 1;
  }

  draw() {
    if (this.health < 255) {
      if (frameCount % 300 == 0) this.targetColor = random(colors);
      this.color = lerpColor(color(this.color), color(this.targetColor), 0.02);
      curePainting.push();
      curePainting.fill(this.color);
      curePainting.translate(this.location);
      let r = map(this.health, 0, 255, 1, 0.0001) * this.radius;
      curePainting.circle(0, 0, r);
      if (random() < 0.5) {
        curePainting.circle(
          random(-0.92, 0.92) * r,
          random(-0.92, 0.92) * r,
          r / 8
        );
      }
      curePainting.pop();
      simulate.fill(this.health);
      simulate.circle(this.location.x, this.location.y, this.radius);
    } else {
      simulate.fill(255);
      simulate.stroke(255);
      simulate.circle(this.location.x, this.location.y, this.radius);
    }
  }

  move() {
    this.velocity.x = map(
      noise(this.xoff),
      0,
      1,
      -this.maxSpeed,
      this.maxSpeed
    );
    this.velocity.y = map(
      noise(this.yoff),
      0,
      1,
      -this.maxSpeed,
      this.maxSpeed
    );
    this.xoff += 0.01;
    this.yoff += 0.01;
    this.location.add(this.velocity);
  }

  //if the agent exists from one side of the screen it enters from the other
  borders() {
    if (this.location.x < -this.radius) this.location.x = _width + this.radius;
    if (this.location.y < -this.radius) this.location.y = _height + this.radius;
    if (this.location.x > _width + this.radius) this.location.x = -this.radius;
    if (this.location.y > _height + this.radius) this.location.y = -this.radius;
  }

  //checks if a point is inside an agent. We use that to check if an agent
  //is clicked on so that we can infect it (done in another function)
  isInside(x, y) {
    if (dist(x, y, this.location.x, this.location.y) < this.radius) return true;
    else return false;
  }

  cure() {
    if (this.isAlive) {
      this.health = this.health + this.cureRate; //as time passes agents get better
      this.health = constrain(this.health, 0, 255);
      if (this.health < 255 && map(this.gene, 0, 1, 0, random(1)) < 0.0001)
        this.isAlive = false;
      // once in a while they die
    }
  }
}
