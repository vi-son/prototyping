import React from "react";

import "../../sass/components/AudioPlayer.sass";

class AudioPlayer extends React.Component {
  constructor(props) {
    super(props);
    this.audio = new Audio(this.props.audiosrc);
    this.setupAudio();
    this.changeTime = this.changeTime.bind(this);
    this.dragTime = this.dragTime.bind(this);
    this.state = {
      duration: 0,
      currentTime: 0,
      volume: 1
    };
  }

  componentWillUnmount() {
    this.audio.ontimeupdate = null;
  }

  setupAudio() {
    this.audio.loop = true;
    this.audio.addEventListener("canplaythrough", () => {
      this.setState({
        duration: this.audio.duration
      });
    });
    this.audio.ontimeupdate = this.timeUpdate.bind(this);
    this.audio.src = this.props.audiosrc;
  }

  stopAudio() {
    this.audio.src = this.props.audiosrc;
    if (this.audio.paused) {
      this.props.onStopped();
      return;
    }
    // Fade out if audio is playing
    const steps = 10;
    const step = 1.0 / steps;
    const timeStep = this.props.fadeDuration / steps;
    const intv = setInterval(() => {
      if (this.state.volume < 0.0) {
        clearInterval(intv);
        this.audio.pause();
        this.setState(state => ({ volume: 1 }));
        this.audio.volume = this.state.volume;
        this.props.onStopped();
      } else {
        this.setState(state => ({ volume: this.state.volume - step }));
        this.audio.volume = Math.max(this.state.volume, 0.0);
      }
    }, timeStep);
  }

  timeUpdate() {
    this.setState(state => ({
      currentTime: this.audio.currentTime
    }));
  }

  changeTime(e) {
    var xOffset = e.target.getBoundingClientRect().left;
    const percent =
      (e.clientX - xOffset) / e.target.getBoundingClientRect().width;
    this.audio.currentTime = this.state.duration * percent;
  }

  dragTime(e) {}

  render() {
    const left =
      this.state.currentTime / this.state.duration
        ? (this.state.currentTime / this.state.duration) * 100
        : 0;
    return (
      <div className="audio-player">
        <div className="btn-play" onClick={() => this.audio.play()}>
          Play
        </div>
        <div className="btn-pause" onClick={() => this.audio.pause()}>
          Pause
        </div>
        <div className="timeline" onClick={this.changeTime}>
          <div className="playhead" style={{ left: `${left}%` }}></div>
        </div>
        {this.state.currentTime}/{this.state.duration}
        <div className="volume">
          <div className="knob"></div>
        </div>
        {this.props.audiosrc}
      </div>
    );
  }
}

export default AudioPlayer;
