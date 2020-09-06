import "regenerator-runtime/runtime";

// Global var to load essentia.js core instance
let essentiaExtractor;
let isEssentiaInstance = false;
// Global var for web audio API AudioContext
let audioCtx;
// Buffer size microphone stream
// (buffer size is high in order to make PitchYinProbabilistic algorithm work)
let bufferSize = 2048;
let gumStream; // getUserMedia Stream
let plotContainerId = "plot-div";
let plotSpectrogram;
let recording = false;

try {
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  audioCtx = new AudioContext();
} catch (e) {
  throw "Could not instantiate AudioContext: " + e.message;
}

function startMicRecordStream(
  audioCtx,
  bufferSize,
  onProcessCallback,
  btnCallback
) {
  // cross-browser support for getUserMedia
  navigator.getUserMedia =
    navigator.getUserMedia ||
    navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia ||
    navigator.msGetUserMedia;
  window.URL = window.URL || window.webkitURL || window.mozURL || window.msURL;

  if (navigator.getUserMedia) {
    console.log("Initializing audio...");
    navigator.getUserMedia(
      { audio: true, video: false },
      stream => {
        gumStream = stream;
        if (gumStream.active) {
          console.log("Audio context sample rate = " + audioCtx.sampleRate);
          var mic = audioCtx.createMediaStreamSource(stream);

          // In most platforms where the sample rate is 44.1 kHz or 48 kHz,
          // and the default bufferSize will be 4096, giving 10-12 updates/sec.
          console.log("Buffer size = " + bufferSize);
          if (audioCtx.state == "suspended") {
            audioCtx.resume();
          }
          const scriptNode = audioCtx.createScriptProcessor(bufferSize, 1, 1);
          // onprocess callback (here we can use essentia.js algos)
          scriptNode.onaudioprocess = onProcessCallback;
          // It seems necessary to connect the stream to a sink for the pipeline to work, contrary to documentataions.
          // As a workaround, here we create a gain node with zero gain, and connect temp to the system audio output.
          const gain = audioCtx.createGain();
          gain.gain.setValueAtTime(0, audioCtx.currentTime);
          mic.connect(scriptNode);
          scriptNode.connect(gain);
          gain.connect(audioCtx.destination);

          if (btnCallback) {
            btnCallback();
          }
        } else {
          throw "Mic stream not active";
        }
      },
      function(message) {
        throw "Could not access microphone - " + message;
      }
    );
  } else {
    throw "Could not access microphone - getUserMedia not available";
  }
}

function stopMicRecordStream() {
  console.log("Stopped recording ...");
  gumStream.getAudioTracks().forEach(track => {
    track.stop();
  });
  isPlotting = false;
  audioCtx.suspend();
}

function onRecordEssentiaFeatureExtractor(event) {
  let audioBuffer = event.inputBuffer.getChannelData(0);
  // modifying default extractor settings
  essentiaExtractor.frameSize = 1024;
  essentiaExtractor.hopSize = 512;
  // settings specific to an algorithm
  essentiaExtractor.profile.MelBands.numberBands = 96;
  // compute hpcp for overlapping frames of audio
  let spectrogram = essentiaExtractor.melSpectrogram(audioBuffer);
  // here we call the plotting function to display realtime feature extraction results
  plotSpectrogram.create(
    spectrogram,
    "Log-scaled MelSpectrogram",
    bufferSize,
    audioCtx.sampleRate
  );
}

document.onreadystatechange = function() {
  if (document.readyState === "complete") {
    plotSpectrogram = new EssentiaPlot.PlotHeatmap(
      Plotly,
      plotContainerId,
      "spectrogram",
      EssentiaPlot.LayoutSpectrogramPlot // layout settings
    );
    console.log("Document is ready...");
    const stopButton = document.querySelector("#stop");
    stopButton.addEventListener("click", ev => {
      stopMicRecordStream();
    });
    const recordButton = document.querySelector("#record");
    recordButton.addEventListener("click", ev => {
      EssentiaModule().then(function(essentiaModule) {
        if (!isEssentiaInstance) {
          essentiaExtractor = new EssentiaExtractor(essentiaModule);
          isEssentiaInstance = true;
          console.log(`Essentia loaded: ${isEssentiaInstance}`);
        }
        // Start microphone stream using getUserMedia
        // startMicRecordStream(
        //   audioCtx,
        //   bufferSize,
        //   onRecordEssentiaFeatureExtractor,
        //   function() {
        //     console.log("finished");
        //   }
        // );
      });
    });
  }
};
