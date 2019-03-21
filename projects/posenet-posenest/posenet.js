
/**
 * Feeds an image to posenet to estimate poses - this is where the magic happens.
 * This function loops with a requestAnimationFrame method.
 */
function detectPoseInRealTime(video, net) {
  const canvas = document.getElementById('output');
  const ctx = canvas.getContext('2d');
  const flipHorizontal = true; // since images are being fed from a webcam

  canvas.width = canvasSize;
  canvas.height = canvasSize;

  async function poseDetectionFrame() {
    if (guiState.changeToArchitecture) {
      // Important to purge variables and free up GPU memory
      guiState.net.dispose();

      // Load the PoseNet model weights for either the 0.50, 0.75, 1.00, or 1.01 version
      guiState.net = await posenet.load(Number(guiState.changeToArchitecture));

      guiState.changeToArchitecture = null;
    }

    // Begin monitoring code for frames per second
    stats.begin();

    // Scale an image down to a certain factor. Too large of an image will slow down
    // the GPU
    const imageScaleFactor = guiState.input.imageScaleFactor;
    const outputStride = Number(guiState.input.outputStride);

    let poses = [];
    let minPoseConfidence;
    let minPartConfidence;
    switch (guiState.algorithm) {
      case 'single-pose':
        const pose = await guiState.net.estimateSinglePose(video, imageScaleFactor, flipHorizontal, outputStride);
        poses.push(pose);

        minPoseConfidence = Number(
          guiState.singlePoseDetection.minPoseConfidence);
        minPartConfidence = Number(
          guiState.singlePoseDetection.minPartConfidence);
        break;
      case 'multi-pose':
        poses = await guiState.net.estimateMultiplePoses(video, imageScaleFactor, flipHorizontal, outputStride,
          guiState.multiPoseDetection.maxPoseDetections,
          guiState.multiPoseDetection.minPartConfidence,
          guiState.multiPoseDetection.nmsRadius);

        minPoseConfidence = Number(guiState.multiPoseDetection.minPoseConfidence);
        minPartConfidence = Number(guiState.multiPoseDetection.minPartConfidence);
        break;
    }

    ctx.clearRect(0, 0, canvasSize, canvasSize);

    if (guiState.output.showVideo) {
      ctx.save();
      ctx.scale(-1, 1);
      ctx.translate(-canvasSize, 0);
      ctx.drawImage(video, 0, 0, canvasSize, canvasSize);
      ctx.restore();
    }

    const scale = canvasSize / video.width;

    // For each pose (i.e. person) detected in an image, loop through the poses
    // and draw the resulting skeleton and keypoints if over certain confidence
    // scores
    poses.forEach(({ score, keypoints }) => {
      if (score >= minPoseConfidence) {
        if (guiState.output.showPoints) {
          drawKeypoints(keypoints, minPartConfidence, ctx, scale);
          drawNest(keypoints, minPartConfidence, ctx, scale);
          // drawBoundingBox(keypoints, ctx);
        //   console.log("leftX:" + keypoints[9].position.x);
        //   console.log("leftY:" + keypoints[9].position.y);
        //   console.log("rightX" + keypoints[10].position.x);
        //   console.log("rightY" + keypoints[10].position.y);
        }
        if (guiState.output.showSkeleton) {
          drawSkeleton(keypoints, minPartConfidence, ctx, scale);
        }
      }
    });

    // End monitoring code for frames per second
    stats.end();

    requestAnimationFrame(poseDetectionFrame);
  }

  poseDetectionFrame();
}