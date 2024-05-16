let img;

function setup() {
  let cw = 1280, ch = 960;
  createCanvas(cw+200,ch+200);
  let constraints = {
    video: {
      mandatory: {
        minWidth: 1280,
        minHeight: 960
      },
      optional: [{ maxFrameRate: 24 }]
    },
    audio: false
  };
  img = createCapture(constraints);
  img.size(cw,ch)
  img.hide();
  console.log("img: " + img.width + " : " + img.height);
  // createCanvas(img.width + 200, 200 + img.height);
  console.log("w/h: " + width + " : " + height);
    fullscreen(true);

}

function draw() {
  // fill(220);
  // rect(0,0,width,height);
  background(220);
  translate(0.5*(width-img.width),0.5*(height-img.height));
  img.loadPixels();
  console.log("img: " + img.width + " : " + img.height);
  console.log("w/h: " + width + " : " + height);

  /*
  // nested for loops to step throughthe image 
  for (let x = 0; x <= img.width; x += sampleX ){
    for (let y = 0; y <= img.height; y += sampleY){

      // correlate where we are on the image with 
      // the position img.pixels array
      var index = (x + y * img.width) * 4;

      // get the r value of the current pixel
      var r = img.pixels[index + 0];http://79.120.134.229:8080/cam_1.jpg
      // get the g value of the current pixel
      var g = img.pixels[index + 1];
      // get the r value of the current pixel
      var b = img.pixels[index + 2];

      // set a fill color using those r,g,b numbers
      fill(r,g,b);

      // draw a rectangle for testing
      // replace this with something else!
      rect(x,y,sampleX,sampleY);
    }
  }
*/
  let t = int(frameCount/2) % img.height;
  for(let x = 0; x< img.width; x++){
    var index = (x + t * img.width) * 4;
      // get the r value of the current pixel
      var r = img.pixels[index + 0];
      // get the g value of the current pixel
      var g = img.pixels[index + 1];
      // get the r value of the current pixel
      var b = img.pixels[index + 2];
    stroke(r,g,b);
    line(x,0,x,img.height-1);
  }
img.updatePixels();
  if(!fullscreen())image(img,0,0, img.width/4,img.height/4);
}

function mousePressed() {
  if (mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height) {
    let fs = fullscreen();
    fullscreen(!fs);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  img.size(width-200,height-200);
}