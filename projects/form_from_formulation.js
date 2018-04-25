"use strict";

//JSON
var params = {
    debugMode: true,
    flocking: false,
    n: 4.5,
    d: 28.9,
    t: 324,
    s: 241,
    c: 0,
    angle: 0,
    step: 1.4,
    p: 20
};

// var d = 28.9;

var gui = new dat.gui.GUI();

gui.add(params, "flocking");

gui.add(params, "n").min(1).max(10).step(0.1);
gui.add(params, "d").min(1).max(30).step(0.1);

gui.add(params, "s").min(20).max(350).step(1);
gui.add(params, "c").min(-100).max(100).step(1);
gui.add(params, "p").min(1).max(20).step(1);

gui.add(params, "angle").min(-5).max(5).step(0.01);
gui.add(params, "t").min(40).max(400).step(1);
gui.add(params, "step").min(1).max(2).step(0.1);

gui.add(params, "debugMode");

gui.closed = true;

//particles

var coRestitution = 0.018;
var coFriction = 0.01;


// for particles
var particles = [];
var coResistance = 0.01;
var n = 1.00;

function setup() {
    var canvas = createCanvas(800, 600);
    canvas.parent('fff_sketch');
    textSize(10);

    var pNum = params.t % params.step + 1;
    for (var i = 0; i < pNum; i++) {
        particles.push(new Particle(random(width), random(height)));
    }

}

function draw() {
    console.log(n);
    n += 0.0005;

    background(47);

    // particle update and display
    for (var i = 0; i < particles.length; i++) {

        if (!params.flocking) {
            particles[i].moveWithLerp();
        } else {
            particles[i].update();
            particles[i].checkBoundaries();
        }
        particles[i].display();

    }


    //find target position
    var count = 0;
    var targets = [];
    for (var a = 0; a < TWO_PI * params.t; a += params.step) {

        //get point location
        var k = n / params.d;
        var r = params.s * cos(k * a) + params.c;
        var x = width / 2 + r * cos(a) + (r / params.p) * cos(params.angle);
        var y = height / 2 + r * sin(a) + (r / params.p) * sin(params.angle);

        if (params.debugMode) {
            push();
            fill(255);
            noStroke();
            ellipse(x, y, 3, 3);
            pop();
        }

        //add target pos to targets array
        var target = createVector(x, y);
        targets.push(target);
        count++;
    }

    //number adjustment
    while (count < particles.length) {
        particles.pop();
    }
    while (count > particles.length) {
        particles.push(new Particle(random(width), random(height))); //? one extra?
    }

    //update particles target pos
    for (var i = 0; i < particles.length; i++) {
        particles[i].targetPos = targets[i];
    }

    if (params.debugMode) {
        // text display
        fill(255);
        text("frameRate:" + round(frameRate()), 15, 30);
        text("count:" + count, 15, 50);
        text("# of particles:" + particles.length, 15, 70);
        text("target array:" + targets.length, 15, 90);
        text("k = n / d", 15, 110);
        text("r = s * cos(k * theta) + c", 15, 130);
        text("x = r * cos(theta) + r / p * cos(angle)", 15, 150);
        text("y = r * sin(theta) + r / p * sin(angle)", 15, 170);
    }
}


class Particle {
    constructor(x, y) {
        this.pos = createVector(x, y);
        this.vel = createVector(random(-10, 10), random(-10, 10)); //
        this.acc = createVector(0, 0);

        this.targetPos = createVector();
        this.lerpSpeed = random(0.05, 0.1);
        //255, 120, 20, 70
        this.r = 20; //random(255);
        this.g = 150; //random(255);
        this.b = 170; //random(255);

        this.rad = random(2, 3.5);
    }

    moveWithLerp() {
        // if(abs(this.pos.x-this.targetPos.x) > 0.5 * this.lerpSpeed){
        // this.pos = p5.Vector.lerp(this.pos, this.targetPos, this.lerpSpeed);
        // }else{
        this.pos = this.targetPos.copy();
        // }
    }


    applyForce(f) {
        this.acc.add(f)
    }

    update() {
        this.vel.add(this.acc);
        this.pos.add(this.vel);
        this.acc.mult(0);
    }

    display() {
        push();
        noStroke();
        fill(this.r, this.g, this.b);
        blendMode(ADD);
        ellipse(this.pos.x, this.pos.y, this.rad * 2, this.rad * 2);
        pop();
    }

    checkCollision(other) {
        var distance = this.pos.dist(other.pos);
        if (distance < this.rad + other.rad) {
            // this
            var force = p5.Vector.sub(other.pos, this.pos);
            force.normalize();
            force.mult(-1);
            force.mult(other.vel.mag());
            this.applyForce(force);
            this.vel.mult(coRestitution);

            var friction = p5.Vector.mult(this.vel, -1);
            friction.normalize();
            friction.mult(coFriction);
            friction.limit(this.vel.mag());
            other.applyForce(friction);

            // other
            var force = p5.Vector.sub(this.pos, other.pos);
            force.normalize();
            force.mult(-1);
            force.mult(this.vel.mag());
            other.applyForce(force);
            other.vel.mult(coRestitution);

            var friction = p5.Vector.mult(other.vel, -1);
            friction.normalize();
            friction.mult(coFriction);
            friction.limit(other.vel.mag());
            other.applyForce(friction);
        }
    }

    checkBoundaries() {
        var force = createVector(0, 0);
        //x
        if (this.pos.x < 0 + this.rad) {
            this.pos.x = 0 + this.rad;
            this.vel.x = -this.vel.x * 0.3;
        } else if (this.pos.x > width - this.rad) {
            this.pos.x = width - this.rad;
            this.vel.x = -this.vel.x * 0.3;
        }
        // y
        if (this.pos.y < 0 + this.rad) {
            this.pos.y = 0 + this.rad;
            this.vel.y = -this.vel.y * 0.3;
        } else if (this.pos.y > height - this.rad) {
            this.pos.y = height - this.rad;
            this.vel.y = -this.vel.y * 0.3;
        }
    }
}