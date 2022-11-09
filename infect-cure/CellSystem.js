class CellSystem {
  constructor(num) {
    this.cells = [];
    this.numOfCells = num;

    for (let i = 0; i < this.numOfCells; i++) {
      let b = new Cell();
      this.cells.push(b);
    }
  }

  update() {
    for (let i = 0; i < this.cells.length; i++) {
      this.cells[i].move();
      this.cells[i].borders();
      this.cells[i].cure();
    }
    this.checkInfections();
    this.removeDeadCells();
  }

  draw() {
    for (let i = 0; i < this.cells.length; i++) this.cells[i].draw(simulate);
  }

  addCell(x, y) {
    let b = new Cell();
    b.location = createVector(x, y);
    this.cells.push(b);
  }

  infectCell() {
    for (let i = 0; i < this.cells.length; i++) {
      if (random(1) < 0.0003) this.cells[i].health = 0;
    }
  }

  checkInfections() {
    for (let i = 0; i < this.cells.length; i++) {
      for (let j = 0; j < this.cells.length; j++) {
        if (i != j) {
          // if it's not the same cell
          if ((this.cells[i].health < 255) & (this.cells[j].health == 255)) {
            // if one of the two cells is infected, and the another one is healthy.
            let b2b_distance = dist(
              this.cells[i].location.x,
              this.cells[i].location.y,
              this.cells[j].location.x,
              this.cells[j].location.y
            );
            //calculate distance between their centers
            let sumRad = this.cells[i].radius + this.cells[j].radius;

            if (b2b_distance < sumRad) {
              // if they are touching infect both

              if (this.cells[i].health < 255 || this.cells[j].health == 255) {
                this.cells[j].health = 0;
              } else if (
                this.cells[j].health < 255 ||
                this.cells[i].health == 255
              ) {
                this.cells[i].health = 0;
              }
            }
          }
        }
      }
    }
  }

  drawInteraction() {
    for (let i = 0; i < this.cells.length; i++) {
      for (let j = i + 1; j < this.cells.length; j++) {
        // if (i != j) {
        if ((this.cells[i].health < 255) & (this.cells[j].health < 255)) {
          let b2b_distance = dist(
            this.cells[i].location.x,
            this.cells[i].location.y,
            this.cells[j].location.x,
            this.cells[j].location.y
          );
          //calculate distance between their centers
          let sumRad = this.cells[i].radius + this.cells[j].radius;

          if (b2b_distance < sumRad) {
            // if they are touching each other
            // draw lines
            // if (paint) {
            let c1 = createVector(
              this.cells[i].location.x,
              this.cells[i].location.y,
              this.cells[i].radius*2
            );
            let c2 = createVector(
              this.cells[j].location.x,
              this.cells[j].location.y,
              this.cells[j].radius*2
            );
            let pts = findTwoCirclesIntersection(c1, c2);
            if (pts.length > 0) {
              infectPainting.push();
              infectPainting.fill(this.cells[i].color);
              pts2shape(
                this.cells[i].location,
                this.cells[j].location,
                pts,
                infectPainting,
                false
              );
              infectPainting.pop();
            }
            // }
          }
        }
      }
    }
  }
  removeDeadCells() {
    for (let i = this.cells.length - 1; i >= 0; i--) {
      if (this.cells[i].isAlive == false) {
        this.cells.splice(i, 1);
        cellSys.addCell(random(_width), random(_height));
      }
    }
  }

  getPoints() {
    let pts = [];
    for (let i = 0; i < this.cells.length; i++)
      pts.push(this.cells[i].location);
    return pts;
  }

  printStats(x, y) {
    simulate.push();
    simulate.fill(255);
    let infectionCounter = 0;
    for (let i = 0; i < this.cells.length; i++) {
      if (this.cells[i].health < 255) infectionCounter++;
    }
    simulate.text(
      nf(cellSys.cells.length, 3, 0) + " number of live cells",
      x,
      y
    );
    simulate.text(
      nf(infectionCounter, 3, 0) + " number of sick cells",
      x,
      y + 10
    );
    simulate.pop();
  }

  getNearestCell(p) {
    let record = 99999999;
    let recordCellIndex = 0;
    for (let i = 0; i < this.cells.size(); i++) {
      let d = dist(
        p.x,
        p.y,
        this.cells[i].location.x,
        this.cells[i].location.y
      );
      if (d < record) {
        record = d;
        recordCellIndex = i;
      }
    }
    return this.cells[recordCellIndex];
  }
}
