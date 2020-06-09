const createStreamServer = require('./js/createStreamServer')

const getLocalIp = (cb) => {
  require('dns').lookup(require('os').hostname(), function (err, add, fam) {
    cb(err, add, fam)
  })
}

let videoStreamServer
async function startCapture() {
  logElem.innerHTML = "";

  try {
    videoElem.srcObject = await navigator.mediaDevices.getDisplayMedia(displayMediaOptions);
    dumpOptionsInfo();
    const mediaStream = captureStream(videoElem)
    const videoStream = new MediaRecorder(mediaStream, {mimeType : 'video/webm'})
    global.mediaStream = mediaStream
    global.videoStream = videoStream
    const { Readable } = require('stream')
    const readableStream = new Readable({
      read() {
        if (videoStream.state !== 'recording') {
          videoStream.start()
        }
        videoStream.requestData()
      }
  })
    global.readableStream = readableStream
    videoStream.ondataavailable = async ({ data }) => {
      readableStream.push(new Uint8Array(await data.arrayBuffer()))
    }
    videoStreamServer = createStreamServer(readableStream)
    getLocalIp((err, addr) => {
      if (err) addr = 'localhost'
      log('Created video streaming server at ', 'http://' + addr + ':8888')
    })
    
  } catch(err) {
    log("Error: " + err);
  }
}

function stopCapture(evt) {
  let tracks = videoElem.srcObject.getTracks();

  tracks.forEach(track => track.stop());
  videoElem.srcObject = null;
  videoStream.stop()
  videoStreamServer.close()
}

function dumpOptionsInfo() {
  const videoTrack = videoElem.srcObject.getVideoTracks()[0];
 
  log("Track settings:");
  log(JSON.stringify(videoTrack.getSettings(), null, 2));
  log("Track constraints:");
  log(JSON.stringify(videoTrack.getConstraints(), null, 2));
}

function log() {
  logElem.innerHTML += [ ...arguments ].join(", ") + '<br />'
}

function captureStream(videoElem, fps = 0) {
  let stream
  if (videoElem.captureStream) {
    stream = videoElem.captureStream(fps);
  } else if (videoElem.mozCaptureStream) {
    stream = videoElem.mozCaptureStream(fps);
  } else {
    throw new Error('Stream capture is not supported');
  }
  return stream
}

const videoElem = document.getElementById("video");
const logElem = document.getElementById("log");
const startElem = document.getElementById("start");
const stopElem = document.getElementById("stop");

// Options for getDisplayMedia()

var displayMediaOptions = {
  video: {
    cursor: "always"
  },
  audio: false
};

// Set event listeners for the start and stop buttons
startElem.addEventListener("click", function(evt) {
  startCapture();
}, false);

stopElem.addEventListener("click", function(evt) {
  stopCapture();
}, false);