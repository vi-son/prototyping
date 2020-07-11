/// TODO:
/// Check: https://github.com/goldfire/howler.js
import React, { useRef, useEffect } from "react";
import ReactDOM from "react-dom";

import AudioPlayer from "./components/AudioPlayer.js";

const audioFile = require("../../assets/audio/patterns.202006.mp3");
let audioCtx = new AudioContext();

const mount = document.querySelector("#mount");
ReactDOM.render(
  <div>
    <AudioPlayer audiosrc={audioFile} />
  </div>,
  mount
);

let essentia;
let isEssentiaInstance = false;
let essentiaExtractor;

// async function useFeatureExtractor() {
//   audioData = await essentiaExtractor.getAudioChannelDataFromURL(
//     audioUrl,
//     audioCtx
//   );
//   essentiaExtractor.frameSize = 1024;
//   essentiaExtractor.hopSize = 512;
//   essentiaExtractor.profile.MelBands.numberBands = 96;
//   let logMelSpectrogram = essentiaExtractor.melSpectrogram(audioData);
//   console.log(logMelSpectrogram);
// }

document.onreadystatechange = function() {
  if (document.readyState === "complete") {
    console.log("Document is ready...");
    EssentiaModule().then(function(essentiaModule) {
      if (!isEssentiaInstance) {
        essentia = new Essentia(essentiaModule);
        isEssentiaInstance = true;
        console.log(essentia.version);

        // audioData = async essentiaExtractor.getAudioChannelDataFromURL(audioUrl, audioCtx);
        // essentiaExtractor = new EssentiaExtractor(essentiaModule);
        // useFeatureExtractor();
        console.log(isEssentiaInstance);
      }
    });
  }
};
