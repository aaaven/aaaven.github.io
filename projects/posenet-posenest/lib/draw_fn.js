const color = 'white';
const lineWidth = 1.2;

/** Functions prepared:
1. drawSegment()
2. drawSkeleton()
3. drawKeypoints()
4. drawBoundingBox()
5. drawNest()
*/

function toTuple({ y, x }) {
  return [y, x];
}

/**
 * Draws a line on a canvas, i.e. a joint
 */
function drawSegment([ay, ax], [by, bx], color, scale, ctx) {
  ctx.beginPath();
  ctx.moveTo(ax * scale, ay * scale);
  ctx.lineTo(bx * scale, by * scale);
  ctx.lineWidth = lineWidth;
  ctx.strokeStyle = color;
  ctx.stroke();
}

/**
 * Draws a pose skeleton by looking up all adjacent keypoints/joints
 */
function drawSkeleton(keypoints, minConfidence, ctx, scale = 1) {
  const adjacentKeyPoints = posenet.getAdjacentKeyPoints(
    keypoints, minConfidence);

  adjacentKeyPoints.forEach((keypoints) => {
    drawSegment(toTuple(keypoints[0].position),
      toTuple(keypoints[1].position), color, scale, ctx);
  });
}

/** art machines function
 * Draws a nest looping through every point
 */
function drawNest(keypoints, minConfidence, ctx, scale = 0.1) {
  for (let i = 0; i < keypoints.length; i++) {
    const keypoint = keypoints[i];

    if (keypoint.score < minConfidence) {
      continue;
    }
    const keypointPos = keypoint.position;

    for (let j = i + 1; j < keypoints.length; j++) {
      const otherKeypoint = keypoints[j];
      if (otherKeypoint.score < minConfidence) {
        continue;
      }
      const otherKeypointPos = otherKeypoint.position;
      drawSegment(toTuple(keypointPos), toTuple(otherKeypointPos), color, scale, ctx);
    }
  }
}

/**
 * Draw pose keypoints onto a canvas
 */
function drawKeypoints(keypoints, minConfidence, ctx, scale = 1) {
  for (let i = 0; i < keypoints.length; i++) {
    const keypoint = keypoints[i];

    if (keypoint.score < minConfidence) {
      continue;
    }

    const { y, x } = keypoint.position;
    ctx.beginPath();
    ctx.arc(x * scale, y * scale, 3, 0, 2 * Math.PI);
    ctx.fillStyle = color;
    ctx.fill();
  }
}

/**
 * Draw the bounding box of a pose. For example, for a whole person standing
 * in an image, the bounding box will begin at the nose and extend to one of
 * ankles
 */
function drawBoundingBox(keypoints, ctx) {
  const boundingBox = posenet.getBoundingBox(keypoints);

  ctx.rect(boundingBox.minX, boundingBox.minY,
    boundingBox.maxX - boundingBox.minX, boundingBox.maxY - boundingBox.minY);
  ctx.stroke();
}

/**
 * Converts an arary of pixel data into an ImageData object
 */
async function renderToCanvas(a, ctx) {
  const [height, width] = a.shape;
  const imageData = new ImageData(width, height);

  const data = await a.data();

  for (let i = 0; i < height * width; ++i) {
    const j = i * 4;
    const k = i * 3;

    imageData.data[j + 0] = data[k + 0];
    imageData.data[j + 1] = data[k + 1];
    imageData.data[j + 2] = data[k + 2];
    imageData.data[j + 3] = 255;
  }

  ctx.putImageData(imageData, 0, 0);
}

/**
 * Draw an image on a canvas
 */
function renderImageToCanvas(image, size, canvas) {
  canvas.width = size[0];
  canvas.height = size[1];
  const ctx = canvas.getContext('2d');

  ctx.drawImage(image, 0, 0);
}

/**
 * Draw heatmap values, one of the model outputs, on to the canvas
 * Read our blog post for a description of PoseNet's heatmap outputs
 * https://medium.com/tensorflow/real-time-human-pose-estimation-in-the-browser-with-tensorflow-js-7dd0bc881cd5
 */
function drawHeatMapValues(heatMapValues, outputStride, canvas) {
  const ctx = canvas.getContext('2d');
  const radius = 5;
  const scaledValues = heatMapValues.mul(tf.scalar(outputStride, 'int32'));

  drawPoints(ctx, scaledValues, radius, color);
}

/**
 * Used by the drawHeatMapValues method to draw heatmap points on to
 * the canvas
 */
function drawPoints(ctx, points, radius, color) {
  const data = points.buffer().values;

  for (let i = 0; i < data.length; i += 2) {
    const pointY = data[i];
    const pointX = data[i + 1];

    if (pointX !== 0 && pointY !== 0) {
      ctx.beginPath();
      ctx.arc(pointX, pointY, radius, 0, 2 * Math.PI);
      ctx.fillStyle = color;
      ctx.fill();
    }
  }
}

/**
 * Draw offset vector values, one of the model outputs, on to the canvas
 * Read our blog post for a description of PoseNet's offset vector outputs
 * https://medium.com/tensorflow/real-time-human-pose-estimation-in-the-browser-with-tensorflow-js-7dd0bc881cd5
 */
function drawOffsetVectors(heatMapValues, offsets, outputStride, scale = 1, ctx) {
  const offsetPoints = posenet.singlePose.getOffsetPoints(
    heatMapValues, outputStride, offsets);

  const heatmapData = heatMapValues.buffer().values;
  const offsetPointsData = offsetPoints.buffer().values;

  for (let i = 0; i < heatmapData.length; i += 2) {
    const heatmapY = heatmapData[i] * outputStride;
    const heatmapX = heatmapData[i + 1] * outputStride;
    const offsetPointY = offsetPointsData[i];
    const offsetPointX = offsetPointsData[i + 1];

    drawSegment([heatmapY, heatmapX], [offsetPointY, offsetPointX],
      color, scale, ctx);
  }
}
