// Gaze, 2022
// Aven Le ZHOU, https://aven.cc + Rong HUANG
// CMA, HKUST(GZ)
// for CMAA 6001

let video;
let poseNet;
let poses = [];

let painting;
let vid;

let playing = false;
let nose;

function preload() {
  painting = loadImage("gothic.jpeg");
  painting.resize(1024, 1244);
}

function vidLoad() {
  vid.loop();
  vid.volume(0);
  vid.hide();
}

function setup() {
  createCanvas(1024, 1244 + 480);
  video = createCapture(VIDEO);
  video.size(640, 480);
  poseNet = ml5.poseNet(video, modelReady);
  poseNet.on("pose", function (results) {
    poses = results;
  });
  video.hide();

  vid = createVideo(["animated-gothic.mp4"], vidLoad);

  noStroke();
}

function modelReady() {
  // select('#status').html('Model Loaded');
  console.log("Model Loaded");
}

function draw() {
  image(painting, 0, 0, 1024, 1244);

  if (nose) {
    let f = nose.position.x / 640;
    f = constrain(f, 0,1);
    vid.time(f * vid.duration());
    // console.log(nose.position.x / 640);
    let img = vid.get();
    image(img, 399, 0, 625, 625);
  }
  push();
  translate(384, 1244);
  image(video, 0, 0, 640, 480);
  drawKeypoints();
  pop();

  rect(0, 1244, 384, 480);
}

// A function to draw ellipses over the detected keypoints
function drawKeypoints() {
  if (poses.length > 0) {
    let pose = poses[0].pose;
    nose = pose.keypoints[0];
    fill(255, 0, 0);
    noStroke();
    ellipse(nose.position.x, nose.position.y, 10, 10);
  }
}

// A function to draw the skeletons
function drawSkeleton() {
  // Loop through all the skeletons detected
  for (let i = 0; i < poses.length; i++) {
    let skeleton = poses[i].skeleton;
    // For every skeleton, loop through all body connections
    for (let j = 0; j < skeleton.length; j++) {
      let partA = skeleton[j][0];
      let partB = skeleton[j][1];
      stroke(255, 0, 0);
      line(
        partA.position.x,
        partA.position.y,
        partB.position.x,
        partB.position.y
      );
    }
  }
}
