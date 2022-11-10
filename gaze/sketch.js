// Gaze, 2022
// Aven Le ZHOU, https://aven.cc 
// CMA, HKUST(GZ)
// the idea and workflow are inspired by https://github.com/emilyxxie/mona_lisa_eyes 

let video;
let poseNet;
let poses = [];

let painting;
let vid, vidLength;
let loaded = false;
let noseX, pnoseX;

function preload() {
  painting = loadImage("gothic.jpeg");
}

function vidLoaded() {
  vid.volume(0.3);
  vid.hide();
  console.log("Video Loaded");
  loaded = true;
  vidLength = vid.duration();
}

function modelReady() {
  console.log("Model Loaded");
}

function setup() {
  createCanvas(1024, 1244);
  
  //posenet
  video = createCapture(VIDEO);
  video.size(640, 480);
  poseNet = ml5.poseNet(video, modelReady);
  poseNet.on("pose", function (results) {
    poses = results;
  });
  video.hide();

  //animated video
  vid = createVideo(["animated-gothic.mp4"], vidLoaded);

  //static painting
  image(painting, 0, 0, 1024, 1244);
  
  frameRate(24);
}

function draw() {
  noseX = detectPos();

  if (noseX && loaded) {
    //smooth the data with noseX, pnoseX and lerp
    let f = lerp(noseX, pnoseX, 0.01);
    // console.log(f);
    let img = findFrame(vid, vidLength, f);
    image(img, 399, 0, 625, 625);
  }

  //draw video capture
  push();
  translate(170, 1114);
  scale(-1, 1);
  image(video, 0, 0, 160, 120);
  pop();

  pnoseX = noseX;
}

function findFrame(inputVideo, vLen, fPos) {
  fPos = constrain(fPos, 0.01, 0.99);
  inputVideo.time(fPos * vLen);
  let img = inputVideo.get();
  return img;
}

function detectPos() {
  let nosePos;
  if (poses.length > 0) {
    let pose = poses[0].pose;
    nosePos = pose.keypoints[0];
    return nosePos.position.x / 640;
  } else {
    return null;
  }
}
