

/**
 * Kicks off the demo by loading the posenet model, finding and loading available
 * camera devices, and setting off the detectPoseInRealTime function.
 */
async function bindPage() {
    // Load the PoseNet model weights for version 1.01
    const net = await posenet.load();
  
    document.getElementById('loading').style.display = 'none';
    document.getElementById('main').style.display = 'block';
  
    let video;
  
    try {
      video = await loadVideo();
    } catch(e) {
      console.error(e);
      return;
    }
    
    setupGui([], net);
    // setupFPS();
    detectPoseInRealTime(video, net);
    console.log("hello");
  }
  
  navigator.getUserMedia = navigator.getUserMedia ||
    navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia;
  bindPage(); // kick off the demo