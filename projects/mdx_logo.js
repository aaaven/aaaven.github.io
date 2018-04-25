//by aven(more at www.aven.cc)
//March 13, 2018
//logo design for class(and potentially an interactive book) "Make design interact"
//project description post at: aven.cc/projects/mdx_logo


var dist_overlap = 20,
 margin = 20,
 lsize = 100,
 mx = 0,
 my = 0,
 pmx = 0,
 pmy = 0;
var lcol, bgcolor;
var debug = true,
 clrFading = false;

function setup() {
 var canvas = createCanvas(860, 320);
 canvas.parent('p5_sketch');
 background(227);
 smooth();
 noStroke();
 lcol = color(77), bgcolor = color(227);
 colorMode(HSB, 360, 100, 100);

}


function draw() {
 background(bgcolor);

 //MOUSE POS: EYE BALL
 mx = mouseX - width * 0.5;
 my = mouseY - height * 0.5;
 mx = constrain(mx,-width * 0.5, width * 0.5);
 my = constrain(my,-height * 0.5, height * 0.5);
 mx = map(mx, -width * 0.5, width * 0.5, -0.15 * lsize, 0.15 * lsize);
 my = map(my, -height * 0.5, height * 0.5, -0.15 * lsize, 0.15 * lsize);
 mx = lerp(pmx, mx, 0.1);
 my = lerp(pmy, my, 0.1);

 //MOUSE DISTANCE: COLOR FADING
 if (clrFading) {
  var pd = dist(pmouseX, pmouseY, width * 0.5, height * 0.5);
  var d = dist(mouseX, mouseY, width * 0.5, height * 0.5);
  d = constrain(d, 0, width * 0.5);
  d = lerp(pd, d, 0.005);
  lcol = color(int(d * 0.375 + 180), int(80 - d / 8), 80);
 } else {
  // lcol = color(0);
 }

 var posx = 200,
  posy = height / 2;
 letter2c(posx, posy, 0.75, 2, -1, 0.25);
 letter1c(posx + 2 * lsize + margin, posy, -0.75, 0.75);
 letter2c(posx + 3 * lsize + 3 * margin, posy, -0.5, 0.5, 0.5, 1.5);

 pmx = mx;
 pmy = my;
}

function letter2c(x, y, s1, e1, s2, e2) {

 push();
 translate(x, y);
 //CIRCLE ONE
 fill(lcol);
 arc(0, 0, lsize, lsize, s1 * PI, e1 * PI);
 fill(bgcolor);
 ellipse(mx, my, 0.6 * lsize, 0.6 * lsize);
 //DEBUG
 if (debug) Debug(0);
 //CIRCLE TWO
 translate(lsize - dist_overlap, 0);
 fill(lcol);
 arc(0, 0, lsize, lsize, s2 * PI, e2 * PI);
 fill(bgcolor);
 ellipse(mx, my, 0.6 * lsize, 0.6 * lsize);
 //DEBUG
 if (debug) Debug(2);
 pop();
}

function letter1c(x, y, s1, e1) {

 push();
 translate(x, y);
 //CIRCLE
 fill(lcol);
 arc(0, 0, lsize, lsize, s1 * PI, e1 * PI);
 fill(bgcolor);
 ellipse(mx, my, 0.6 * lsize, 0.6 * lsize);
 //DEBUG
 if (debug) Debug(1);
 pop();
}

function Debug(k) {
 push();
 noFill();
 strokeWeight(1);
 if (k == 0) {
  stroke('#FFFF00');
  rect(-0.5 * lsize, -0.5 * lsize, 2 * lsize - dist_overlap, lsize);
  stroke('#00ECFF');
  rect(-0.5 * lsize - margin, -0.5 * lsize - margin,
   2 * lsize - dist_overlap + 2 * margin, lsize + 2 * margin);
 } else if (k == 1) {
  stroke('#FFFF00');
  rect(-0.5 * lsize, -0.5 * lsize, lsize, lsize);
  stroke('#00ECFF');
  rect(-0.5 * lsize - margin, -0.5 * lsize - margin,
   lsize + 2 * margin, lsize + 2 * margin);
 }
 stroke('#FF0026');
 var ms = 0.5 * (lsize + margin);
 line(0, -ms, 0, ms);
 line(-ms, 0, ms, 0);
 stroke('#FFFF00');
 line(-0.5 * ms, -0.5 * ms, 0.5 * ms, 0.5 * ms);
 line(0.5 * ms, -0.5 * ms, -0.5 * ms, 0.5 * ms);
 stroke('#00ECFF');
 ellipse(0, 0, lsize, lsize);
 ellipse(mx, my, 0.6 * lsize, 0.6 * lsize);
 pop();
}

function mousePressed() {
 debug = !debug;
}

function keyPressed() {
 if (keyCode === 83) {
  saveCanvas('mdx_logo', 'jpg');
  console.log('file saved');
 }
 if (keyCode === 32) {
  clrFading = !clrFading;
  console.log(clrFading);
 }
}