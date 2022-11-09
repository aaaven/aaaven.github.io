function pts2line(pts, pg) {
  if (pts.length > 1) pg.line(pts[0].x, pts[0].y, pts[1].x, pts[1].y);
}

function pts2shape(c1, c2, pts, pg, noCheck) {
  let checkDist =
    sqrt((c1.x - c2.x) * (c1.x - c2.x) + (c1.y - c2.y) * (c1.y - c2.y)) >
    min(c1.z, c2.z);
  if (checkDist || noCheck) {
    // push();
    // fill(colors[int(random(colors.length))]);
    // noStroke();
    if (pts.length > 0) {
      pg.beginShape();
//       pg.vertex(pts[0].x, pts[0].y);
//       pg.vertex(c1.x, c1.y);
//       pg.vertex(pts[1].x, pts[1].y);
//       pg.vertex(c2.x, c2.y);
      
      pg.vertex(c1.x, c1.y);
      pg.curveVertex(pts[1].x, pts[1].y);
      pg.vertex(c2.x, c2.y);
      pg.curveVertex(pts[0].x, pts[0].y);
      
      pg.endShape(CLOSE);
      // console.log("hi" + frameCount);
    }
    // pop();
  }
}

function findTwoCirclesIntersection(c1, c2) {
  //*************************pts*********************************
  //Calculating intersection coordinates (x1, y1) and (x2, y2) of
  //two circles of the form (x - c1.x)^2 + (y - c1.y)^2 = c1.z^2
  //                        (x - c2.x)^2 + (y - c2.y)^2 = c2.z^2
  //
  // Return value:   Intersection points - (x1, y1) and (x2, y2)
  //**************************************************************

  let pts = [];
  var x1, y1, x2, y2;
  var val1, val2, test;

  // Calculating distance between circles centers
  var D = sqrt((c1.x - c2.x) * (c1.x - c2.x) + (c1.y - c2.y) * (c1.y - c2.y));
  if (c1.z + c2.z >= D && D >= abs(c1.z - c2.z)) {
    // Two circles intersects or tangent
    // Area according to Heron's formula
    //----------------------------------
    var a1 = D + c1.z + c2.z;
    var a2 = D + c1.z - c2.z;
    var a3 = D - c1.z + c2.z;
    var a4 = -D + c1.z + c2.z;
    var area = sqrt(a1 * a2 * a3 * a4) / 4;
    // Calculating x axis intersection values
    //---------------------------------------
    val1 =
      (c1.x + c2.x) / 2 +
      ((c2.x - c1.x) * (c1.z * c1.z - c2.z * c2.z)) / (2 * D * D);
    val2 = (2 * (c1.y - c2.y) * area) / (D * D);
    x1 = val1 + val2;
    x2 = val1 - val2;
    // Calculating y axis intersection values
    //---------------------------------------
    val1 =
      (c1.y + c2.y) / 2 +
      ((c2.y - c1.y) * (c1.z * c1.z - c2.z * c2.z)) / (2 * D * D);
    val2 = (2 * (c1.x - c2.x) * area) / (D * D);
    y1 = val1 - val2;
    y2 = val1 + val2;
    // Intersection points are (x1, y1) and (x2, y2)
    // Because for every x we have two values of y, and the same thing for y,
    // we have to verify that the intersection points as chose are on the
    // circle otherwise we have to swap between the points
    test = abs(
      (x1 - c1.x) * (x1 - c1.x) + (y1 - c1.y) * (y1 - c1.y) - c1.z * c1.z
    );
    if (test > 0.0000001) {
      // point is not on the circle, swap between y1 and y2
      // the value of 0.0000001 is arbitrary chose, smaller values are also OK
      // do not use the value 0 because of computer rounding problems
      var tmp = y1;
      y1 = y2;
      y2 = tmp;
    }
    pts.push(createVector(x1, y1));
    pts.push(createVector(x2, y2));
  }
  return pts;
}

function intersections(c1, c2, pts) {}
