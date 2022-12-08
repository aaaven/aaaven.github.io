class CalligraphyCanvas {
  constructor(colNum, rowNum, w, h) {
    this.colNum = colNum;
    this.rowNum = rowNum;
    this.w = w;
    this.h = h;
    this.shelfList = [];
    this.randomScale = [];
    for (let j = 0; j < colNum; j++) {
      let randomRows = [];
      for (let i = 0; i < rowNum; i++) {
        randomRows.push(createVector(random(1, 2), random(1.75, 3.5)));
      }
      this.randomScale.push(randomRows);
    }
  }

  addShelf(shelf) {
    this.shelfList.push(shelf);
    if (this.shelfList.length > this.colNum) this.shelfList.splice(0, 1);
  }

  display() {
    // console.log("display");
    // move to top right
    translate( 
      this.w * (0.5 - 0.5 / this.colNum),
      this.h * (-0.5 + 0.5 / this.rowNum),
      0
    );

    // translate(this.w * 0.5, this.h * -0.5, 0);
    push();
    for (let col = 0; col < this.colNum; col++) {
      if (col < this.shelfList.length) {
        // draw every shelf
        push();
        translate((-col / this.colNum) * this.w, 0, 0);
        let shelf = this.shelfList[col];
        for (let row = 0; row < shelf.strokeList.length; row++) {
          // draw every stroke
          push();
          translate(0, (row / this.rowNum) * this.h, 0);
          scale(
            (this.randomScale[col][row].x * this.w) /
              this.colNum /
              (shelf.w / shelf.xNum),
            (this.randomScale[col][row].y * this.h) /
              this.rowNum /
              (shelf.h / shelf.yNum),
            this.h / this.rowNum / (shelf.h / shelf.yNum)
          );
          shelf.strokeList[row].display(false, false);
          pop();
        }
        pop();
      }
    }
  }
  //
}
