let TriangleMesh = toxi.geom.mesh.TriangleMesh,
  Face = toxi.geom.mesh.Face,
  Vec3D = toxi.geom.Vec3D,
  Vec2D = toxi.geom.Vec2D;

class CalligraphyStroke {
  constructor(w, h, d) {
    // take stroke box size
    this._points = [];
    this._calligraphyMesh = new TriangleMesh();
    this._rotation = new Vec2D();
    this._camRotation = new Vec2D();

    this.w = w;
    this.h = h;
    this.d = d;

    // this.wRatio = wRatio;
    // this.hRatio = hRatio;
    // this.dRatio = dRatio;
  }

  addPoint(vec3D) {
    // please note, here should pass in normalized pt
    let unNormVec3D = new Vec3D(
      vec3D.x * this.w,
      vec3D.y * this.h,
      vec3D.z * this.d
    );
    this._points.push(unNormVec3D);
  }

  points2mesh() {
    this._calligraphyMesh = new TriangleMesh("doodle");
    let weight = 0;

    let p = new Vec3D();
    let q = new Vec3D();
    let prePos = new Vec3D();
    prePos = this._points[0];

    for (let i = 1; i < this._points.length; i++) {
      let pos = this._points[i];

      pos.rotateX(this._rotation.x);
      pos.rotateY(this._rotation.y);

      // define offset points for the triangle strip
      weight += (sqrt(pos.distanceTo(prePos)) * 2 - weight) * 0.1;
      let a = pos.add(0, 0, weight);
      let b = pos.add(0, 0, -weight);

      // add 2 faces to the mesh
      this._calligraphyMesh.addFace(p, b, q);
      this._calligraphyMesh.addFace(p, a, b);

      //update prev with pos
      prePos = pos;
      p = a;
      q = b;
      this._rotation.addSelf(0.014, 0.0237);
    }
  }

  displayMesh() {
    push();

    stroke(255, 0, 0);
    strokeWeight(0.1);
    fill(255, 0, 0);
    sphere(1);
    
    let sd = 30;
    line(-this.w / sd, 0, 0, this.w / sd, 0, 0);
    line(0, -this.h / sd, 0, 0, this.h / sd, 0);
    line(0, 0, -this.h / sd, 0, 0, this.h / sd);
    
    noStroke();
    fill(255);
    beginShape(TRIANGLES);
    if (this._calligraphyMesh) {
      // iterate over all faces/triangles of the mesh
      let faces = this._calligraphyMesh.getFaces();
      let numFaces = faces.length;
      for (let i = 0; i < numFaces; i++) {
        let f = faces[i];
        // create vertices for each corner point
        vertex(f.a.x, f.a.y, f.a.z);
        vertex(f.b.x, f.b.y, f.b.z);
        vertex(f.c.x, f.c.y, f.c.z);
      }
      endShape();
    }
    pop();
  }

  displayBox() {
    push();
    noFill();
    strokeWeight(0.5);
    stroke(255);
    scale(this.w, this.h, this.d);
    box(1);
    pop();
  }

  display(toRotate, showBox) {
    push();
    if (toRotate) {
      rotateX(this._camRotation.x);
      rotateY(this._camRotation.y);
    }
    if (this._calligraphyMesh) this.displayMesh();
    this._camRotation.addSelf(0.007, 0.0118);
    pop();
    if (showBox) this.displayBox();
    // this._camRotation.addSelf(0.014, 0.0237);
  }
}
