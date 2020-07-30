/// TODO:
/// Check: https://github.com/goldfire/howler.js
import "regenerator-runtime/runtime";
import React, { useRef, useEffect } from "react";
import ReactDOM from "react-dom";

import AudioPlayer from "./components/AudioPlayer.js";
import DAW from "./components/DAW.js";

const patterns = require("../../assets/audio/patterns.202006.mp3");
const clicks = require("../../assets/audio/patterns.202006-clicks.wav");
const bd = require("../../assets/audio/patterns.202006-bd.wav");
let audioCtx = new AudioContext();

const mount = document.querySelector("#mount");
ReactDOM.render(
  <div>
    <AudioPlayer audiosrc={patterns} />
    <DAW trackCount={5}></DAW>
  </div>,
  mount
);

window.AudioContext = window.AudioContext || window.webkitAudioContext;

function loadBuffer(url) {
  return fetch(url)
    .then(b => b.arrayBuffer())
    .then(b => {
      return context.decodeAudioData(
        b,
        () => {
          console.log(`${url} loaded.`);
        },
        e => {
          console.log(`ERROR: ${e}`);
        }
      );
    })
    .catch(e => console.log(e));
}

// CONTEXT ------------------------------------
var context = new AudioContext();
// SOURCE ------------------------------------
var source = context.createBufferSource();
var filter = context.createBiquadFilter();
// tell the source which sound to play
loadBuffer(clicks).then(buffer => {
  source.buffer = buffer;
  source.connect(filter);
  filter.connect(context.destination);
  filter.type = "highpass";
  filter.frequency.value = 140;
  source.connect(context.destination);
  // source.start(0);
});
const slider = document.createElement("input");
slider.type = "range";
slider.min = 0;
slider.max = 10000;
document.body.appendChild(slider);
slider.oninput = e => {
  console.log(e.target.value);
  filter.frequency.value = e.target.value;
};

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
