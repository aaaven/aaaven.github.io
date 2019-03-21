
/**
 * Sets up dat.gui controller on the top-right of the window
 */

function setupGui(cameras, net) {
    guiState.net = net;
  
    if (cameras.length > 0) {
      guiState.camera = cameras[0].deviceId;
    }
  
    const cameraOptions = cameras.reduce((result, { label, deviceId }) => {
      result[label] = deviceId;
      return result;
    }, {});
  
    const gui = new dat.GUI({ width: 300 });
  
    // The single-pose algorithm is faster and simpler but requires only one person to be
    // in the frame or results will be innaccurate. Multi-pose works for more than 1 person
    const algorithmController = gui.add(
      guiState, 'algorithm', ['single-pose', 'multi-pose']);
  
    // The input parameters have the most effect on accuracy and speed of the network
    let input = gui.addFolder('Input');
    // Architecture: there are a few PoseNet models varying in size and accuracy. 1.01
    // is the largest, but will be the slowest. 0.50 is the fastest, but least accurate.
    const architectureController =
      input.add(guiState.input, 'mobileNetArchitecture', ['1.01', '1.00', '0.75', '0.50']);
    // Output stride:  Internally, this parameter affects the height and width of the layers
    // in the neural network. The lower the value of the output stride the higher the accuracy
    // but slower the speed, the higher the value the faster the speed but lower the accuracy.
    input.add(guiState.input, 'outputStride', [8, 16, 32]);
    // Image scale factor: What to scale the image by before feeding it through the network.
    input.add(guiState.input, 'imageScaleFactor').min(0.2).max(1.0);
    input.open();
  
    // Pose confidence: the overall confidence in the estimation of a person's
    // pose (i.e. a person detected in a frame)
    // Min part confidence: the confidence that a particular estimated keypoint
    // position is accurate (i.e. the elbow's position)
    let single = gui.addFolder('Single Pose Detection');
    single.add(guiState.singlePoseDetection, 'minPoseConfidence', 0.0, 1.0);
    single.add(guiState.singlePoseDetection, 'minPartConfidence', 0.0, 1.0);
    single.open();
  
    let multi = gui.addFolder('Multi Pose Detection');
    multi.add(
      guiState.multiPoseDetection, 'maxPoseDetections').min(1).max(20).step(1);
    multi.add(guiState.multiPoseDetection, 'minPoseConfidence', 0.0, 1.0);
    multi.add(guiState.multiPoseDetection, 'minPartConfidence', 0.0, 1.0);
    // nms Radius: controls the minimum distance between poses that are returned
    // defaults to 20, which is probably fine for most use cases
    multi.add(guiState.multiPoseDetection, 'nmsRadius').min(0.0).max(40.0);
  
    let output = gui.addFolder('Output');
    output.add(guiState.output, 'showVideo');
    output.add(guiState.output, 'showSkeleton');
    output.add(guiState.output, 'showPoints');
    output.open();
  
  
    architectureController.onChange(function (architecture) {
      guiState.changeToArchitecture = architecture;
    });
  
    algorithmController.onChange(function (value) {
      switch (guiState.algorithm) {
        case 'single-pose':
          multi.close();
          single.open();
          break;
        case 'multi-pose':
          single.close();
          multi.open();
          break;
      }
    });
  }
  
  /**
   * Sets up a frames per second panel on the top-left of the window
   */
  function setupFPS() {
    stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
    document.body.appendChild(stats.dom);
  }
  