/// TODO:
/// Check: https://github.com/goldfire/howler.js
import React, { useRef, useEffect } from "react";
import ReactDOM from "react-dom";
import Vue from "vue";

const audioFile = require("../assets/audio/patterns.202006.mp3");
let audioCtx = new AudioContext();

class AudioPlayer extends React.Component {
  constructor(props) {
    super(props);
    this.audio = React.createRef();
    this.timeUpdate = this.timeUpdate.bind(this);
    this.changeTime = this.changeTime.bind(this);
    this.state = {
      duration: NaN,
      currentTime: 0
    };
  }

  timeUpdate() {
    this.setState({
      currentTime: this.audio.current.currentTime,
      duration: this.audio.current.duration
    });
  }

  changeTime(e) {
    const percent = e.clientX / 500;
    this.audio.current.currentTime = this.state.duration * percent;
  }

  render() {
    return (
      <div className="audio-player">
        <audio preload="true" onTimeUpdate={this.timeUpdate} ref={this.audio}>
          <source src={this.props.audiosrc} />
        </audio>
        <div onClick={() => this.audio.current.play()}>Play</div>
        <div onClick={() => this.audio.current.pause()}>Pause</div>
        <div
          className="timeline"
          style={{ width: 500, height: 5, background: "black" }}
          onClick={this.changeTime}
        >
          <div
            className="playhead"
            style={{
              width: 5,
              height: 5,
              background: "red",
              position: "relative",
              left: (this.state.currentTime / this.state.duration) * 500
            }}
          ></div>
        </div>
        {this.state.currentTime}/{this.state.duration}
      </div>
    );
  }
}

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
