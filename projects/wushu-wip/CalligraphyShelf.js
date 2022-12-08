class CalligraphyShelf {
  constructor(xNum, yNum, w, h) {
    this.xNum = xNum;
    this.yNum = yNum;
    this.w = w;
    this.h = h;
    this.strokeList = [];
    this.ready = false;
  }

  addNewStroke() {
    this.strokeList.push(
      new CalligraphyStroke(
        this.w / this.xNum,                                
        this.h / this.yNum,
        this.h / this.yNum,
        1 / this.xNum,
        1 / this.yNum,
        1 / this.yNum
      )
    );
    if (this.strokeList.length > this.xNum * this.yNum) {
      this.strokeList.splice(0, 1);
      this.ready = true;
    }
  }

  updateLatestStroke(normPt) {
    // please note, here should pass in normalized pt
    if(this.strokeList.length > 0) this.strokeList[this.strokeList.length - 1].addPoint(normPt);
  }

  latestStroke2Mesh() {
    if(this.strokeList.length > 0) this.strokeList[this.strokeList.length - 1].points2mesh();
  }

  display() {
    push();
    translate(
      (-0.5 + 0.5 / this.xNum) * this.w,
      (-0.5 + 0.5 / this.yNum) * this.h,
      0        
    );
    for (let j = 0; j < this.yNum; j++) {
      for (let i = 0; i < this.xNum; i++) {
        let index = j * this.xNum + i;
        push();
        translate((i / this.xNum) * this.w, (j / this.yNum) * this.h);
        if (index < this.strokeList.length) this.strokeList[index].display(true, true);
        pop();
      }
    }
    pop();
  }
}
