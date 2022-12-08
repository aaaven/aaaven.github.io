// video & posenet
let video;
let poseNet;
let poses = [];
let radius = 30;

// posenet to simulate m&k ix
let presence = false;
let _presence = false;

let closed = false;
let _closed = false;

// calligraphy
let calligraphyShelf;
let calligraphyCanvas;
let xNum = 4,
  yNum = 3;

// center canvas
let cnv;

function centerCanvas() {
  let x = (windowWidth - width) / 2;
  let y = (windowHeight - height) / 2;
  cnv.position(x, y);
}

function windowResized() {
  centerCanvas();
}

function setup() {
  // createCanvas(windowWidth, windowHeight, WEBGL);
  cnv = createCanvas(1280, 960, WEBGL);
  centerCanvas();
  // video & posenet
  video = createCapture(VIDEO);
  video.size(640, 480);
  video.hide();
  poseNet = ml5.poseNet(video, modelReady);
  poseNet.on("pose", function (results) {
    poses = results;
  });

  //calligraphy
  calligraphyShelf = new CalligraphyShelf(xNum, yNum, width / 2, height / 2);
  calligraphyCanvas = new CalligraphyCanvas(
    xNum * xNum,
    xNum * yNum,
    width / 2,
    height / 2
  );
}

function draw() {
  background(0);
  /* simulate background
  push();
  fill(0);
  rect(0, 0, width / 2, height / 2);
  rect(0, -height / 2, width / 2, height / 2);
  rect(-width / 2, 0, width / 2, height / 2);
  pop();
*/
  // ------------------- show calligraphy interface -----------------------------------------------------
  let list = calligraphyShelf.strokeList;

  push();
  //top right
  push();
  translate(width / 4, -height / 4, 0);
  calligraphyShelf.display();
  pop();

  // bottom left
  push();
  translate(-width / 4, height / 4, 0);
  scale(xNum, yNum, yNum);
  if (list.length > 1) {
    list[list.length - 1].display(false, false);
  }
  pop();

  //bottom right
  push();
  translate(width / 4, height / 4, 0);
  calligraphyCanvas.display();
  pop();

  pop();

  //top left & main control logic
  push();
  translate(-width / 2, -height / 2, 0);
  // translate(-width / 4, -height / 4, 0);
  image(video, 0, 0, 640, 480);

  //------------------------------ main control logic ----------------------------------------------------------------
  let presence = poses.length > 0;

  //--------------------------- participant enter ----------------------------------

  let validPoints = showKeypoints(width / 2, height / 2, presence);

  if (validPoints[0] && validPoints[1]) {
    if (
      validPoints[0].x >= 0 &&
      validPoints[0].y >= 0 &&
      validPoints[1].x >= 0 &&
      validPoints[1].y >= 0
    ) {
      //----------------------- safezone: two wrist started to work ------------------------------------

      closed =
        p5.Vector.dist(validPoints[0], validPoints[1]) < radius * 4 ||
        p5.Vector.dist(validPoints[0], validPoints[2]) < radius * 4 ||
        p5.Vector.dist(validPoints[0], validPoints[3]) < radius * 4 ||
        p5.Vector.dist(validPoints[0], validPoints[4]) < radius * 4 ||
        p5.Vector.dist(validPoints[0], validPoints[5]) < radius * 4;
      if (closed) {
        fill(255, 255, 0);
        circle(validPoints[0].x, validPoints[0].y, radius);
      }
      if (_closed === false && closed === true) {
        console.log("pressed");
        calligraphyShelf.addNewStroke();
        // reinit trace
        trace = [];
      } else if (_closed === true && closed === true) {
        console.log("dragged");
        trace.push(createVector(validPoints[0].x, validPoints[0].y));
        //show trace
        push();
        stroke(255);
        if (trace.length > 1) {
          for (let k = 0; k < trace.length - 1; k++) {
            strokeWeight(p5.Vector.dist(trace[k], trace[k + 1]) / 100);
            line(trace[k].x, trace[k].y, trace[k + 1].x, trace[k + 1].y);
          }
        }
        pop();
        // shelf
        calligraphyShelf.updateLatestStroke(
          new Vec3D(
            (validPoints[0].x - calligraphyShelf.w / 2) / calligraphyShelf.w,
            (validPoints[0].y - calligraphyShelf.h / 2) / calligraphyShelf.h,
            0
          )
        );
      } else if (_closed === true && closed === false) {
        console.log("released");
        calligraphyShelf.latestStroke2Mesh();
      }

      _closed = closed;
      //----------------------- safezone: two wrist started to work ------------------------------------
    }
  }
  //--------------------------- participant enter ----------------------------------
  if (_presence === false && presence === true) {
    console.log("In");
    // create new empty shelf
    calligraphyShelf = new CalligraphyShelf(xNum, yNum, width / 2, height / 2);
    // push shelf (full with stroke) in
    calligraphyCanvas.addShelf(calligraphyShelf);
  } else if (_presence === true && presence === false) {
    console.log("Out");
  }

  _presence = presence;
  pop();
}

// -------------------- posenet utility ------------------------
function showKeypoints(w, h, presence) {
  let points = [];
  if (presence) {
    let pose = poses[0].pose;
    let keypoints = pose.keypoints;

    // right wrist
    points[0] = validatePoint(10, keypoints, w, h);

    // left wrist
    points[1] = validatePoint(9, keypoints, w, h);

    // left elbow
    points[2] = validatePoint(7, keypoints, w, h);

    // left shoulder
    points[3] = validatePoint(5, keypoints, w, h);

    // left knee
    points[4] = validatePoint(13, keypoints, w, h);

    // left ankle
    points[5] = validatePoint(15, keypoints, w, h);
  }
  return points;
}

function validatePoint(index, keypoints, w, h) {
  let keypoint = keypoints[index];
  let inVideo =
    keypoint.position.x > 0 &&
    keypoint.position.x < w &&
    keypoint.position.y > 0 &&
    keypoint.position.y < h;

  if (keypoint.score > 0.1 && inVideo) {
    noStroke();
    fill(50, 50);
    circle(keypoint.position.x, keypoint.position.y, radius);
    fill(20, 80);
    circle(keypoint.position.x, keypoint.position.y, 0.4 * radius);
    return createVector(keypoint.position.x, keypoint.position.y);
  } else {
    return createVector(-1, -1);
  }
}

function modelReady() {
  console.log("Model Loaded");
}
