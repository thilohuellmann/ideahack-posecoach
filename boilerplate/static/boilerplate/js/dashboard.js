let video;
let poseNet;
let poses = [];

function setup() {
    var myCanvas = createCanvas(600, 400);
    myCanvas.parent('video-container');

  video = createCapture(VIDEO);
  //video = createVideo('/static/boilerplate/video/good_test.mov', vidLoad);
  video.size(width, height);
  //vidLoad()

  var posenetoptions = {
   imageScaleFactor: 0.3,
   outputStride: 8,
   flipHorizontal: false,
   minConfidence: 0.5,
   maxPoseDetections: 1,
   scoreThreshold: 0.5,
   nmsRadius: 20,
   detectionType: 'single',
   multiplier: 0.75,
  }

  // Create a new poseNet method with a single detection
  poseNet = ml5.poseNet(video, posenetoptions, 'single', modelReady);
  // This sets up an event that fills the global variable "poses"
  // with an array every time new poses are detected

  poseNet.on('pose', function(results) {
    poses = results
    $.ajax({
        method: 'POST',
        headers: {'X-CSRFToken': document.getElementsByName('csrfmiddlewaretoken')[0].value},
        url: '/api/predict',
        data: JSON.stringify(poses[0]),
        cache: false,
        processData: false,
        contentType: 'application/json',
        enctype: 'multipart/form-data',
        success: function (response) {
            if (response['prediction'] == 'bad') {
              $('#bad').show()
                $('#unclear').hide()
                $('#good').hide()
            }
            else if (response['prediction'] == 'good') {
              $('#bad').hide()
                $('#unclear').hide()
                $('#good').show()
            }
            else {
              $('#bad').hide()
                $('#unclear').show()
                $('#good').hide()
            }
        }
    })

  });
  // Hide the video element, and just show the canvas
  video.hide();
}

// function vidLoad() {
//     video.stop()
//     video.loop()
//     video.volume(0)
// }

function modelReady() {
  console.log('model ready')
  //poseNet.singlePose(video)
}

function draw() {
  image(video, 0, 0, width, height);

  // We can call both functions to draw all keypoints and the skeletons
  drawKeypoints();
  drawSkeleton();
}

// A function to draw ellipses over the detected keypoints
function drawKeypoints()  {
  // Loop through all the poses detected
  for (let i = 0; i < poses.length; i++) {
    // For each pose detected, loop through all the keypoints
    let pose = poses[i].pose;
    for (let j = 0; j < pose.keypoints.length; j++) {
      // A keypoint is an object describing a body part (like rightArm or leftShoulder)
      let keypoint = pose.keypoints[j];
      // Only draw an ellipse is the pose probability is bigger than 0.2
      if (keypoint.score > 0.2) {
        fill(255, 0, 0);
        noStroke();
        ellipse(keypoint.position.x, keypoint.position.y, 10, 10);
      }
    }
  }
}

// A function to draw the skeletons
function drawSkeleton() {
  // Loop through all the skeletons detected
  for (let i = 0; i < poses.length; i++) {
    let skeleton = poses[i].skeleton;
    // For every skeleton, loop through all body connections
    for (let j = 0; j < skeleton.length; j++) {
      let partA = skeleton[j][0];
      let partB = skeleton[j][1];
      stroke(255, 0, 0);
      line(partA.position.x, partA.position.y, partB.position.x, partB.position.y);
    }
  }
}