# Posenet Detection: Posenest

![posenet01](gif/posenest01.gif)
![posenet01](gif/posenest02.gif)

[Live Demo](https:/www.aven.cc/projects/posenest)

## Origin
* [Refer to this blog post](https://medium.com/tensorflow/real-time-human-pose-estimation-in-the-browser-with-tensorflow-js-7dd0bc881cd5) for a high-level description of PoseNet running on Tensorflow.js.

* This code are modified and re-organized from:
    * Original code from [tfjs-models/posenet](https://github.com/tensorflow/tfjs-models/tree/master/posenet)
    * And a cleaned up version from [MontrealAI](https://github.com/MontrealAI/posenet-v3)

## What's New
### New Code Structure:
* camera.js: loading and display video.
* gui.js: posenet paras control and display framerate
* posenet.js: posenet drawing and manipulating
* main.js: kick off the loop
* lib:
    * posenet.min.js: the model
    * tf.min.js: tf.js lib
    * dat.gui.js: gui lib
    * stats.min.js: ~~I dont know what's it for~~ for performance monitor
    * draw_fn.js: base functions for drawing posenet

### New Function
* drawNest(), for [Aven Le Zhou](https://www.aven.cc)'s AI Art Project: [Chasing You II](https://www.aven.cc/projects/chasingu2).

### ~~New Interaction~~
* **H Key** can hide control bar (Incase you dont know it like me...)