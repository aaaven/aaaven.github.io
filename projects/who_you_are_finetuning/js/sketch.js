// aven le zhou: https://aven.cc
// 2019.03
// AI-Arts Series: Neuralnet On Web
// Class 02 Image/Video Classification with MobileNet


let video;
let canvas;
let classifier;

let label, old_label;
let prob, old_prob;

let labels = [];

function setup() {
  canvas = createCanvas(windowWidth,windowHeight);
  background(0, 255, 255);
  textAlign(CENTER);
  textSize(28);
  colorMode(HSB, 100);
  video = createCapture(VIDEO);
  video.hide();
  classifier = ml5.imageClassifier("MobileNet", video, function () {
    console.log("model loaded... ");
  });
}

function draw() {
  image(video, 0, 0,width,height);

  classifier.predict(function (err, results) {
    label = results[0].className.split(',')[0];
    prob = results[0].probability;
  });

  if (old_label != label) {
    console.log("label changed");
    console.log(label);
    let diff_label = new Label(label);
    labels.push(diff_label);
    if (labels.length > 15) {
      labels.splice(0, 1);
    }
  }


  for(let i = 0; i < labels.length; i++){
    labels[i].display();
  }


  old_label = label;
  old_prob = prob;
}

class Label {
  constructor(label) {
    this.x = random(width);
    this.y = random(height);
    this.clr = color(random(40, 90), 90, 90);
    this.label = label;
  }

  display() {
    fill(this.clr);
    text(this.label, this.x, this.y);
  }
}