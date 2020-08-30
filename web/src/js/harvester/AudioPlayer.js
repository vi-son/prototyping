import React from "react";

import "../../sass/components/AudioPlayer.sass";

class AudioPlayer extends React.Component {
  constructor(props) {
    super(props);
    this.audio = new Audio(this.props.audiosrc);
    this.changeTime = this.changeTime.bind(this);
    this.dragTime = this.dragTime.bind(this);
    this.setDuration = this.setDuration.bind(this);
    this.setupAudio();
    this.state = {
      duration: 0,
      currentTime: 0,
      volume: 0,
      fadeInterval: null
    };
  }

  fadeInAndPlay() {
    this.audio.play();
    const steps = 10;
    const step = 1.0 / steps;
    const timeStep = this.props.fadeDuration / steps;
    clearInterval(this.state.fadeInterval);
    const intv = setInterval(() => {
      if (this.state.volume >= 1.0) {
        clearInterval(this.state.fadeInterval);
        this.setState(state => ({ volume: 1 }));
      } else {
        this.setState(state => ({ volume: this.state.volume + step }));
        this.audio.volume = Math.min(this.state.volume, 1.0);
      }
    }, timeStep);
    this.setState(state => ({ fadeInterval: intv }));
  }

  fadeOutAndStop() {
    const steps = 10;
    const step = 1.0 / steps;
    const timeStep = this.props.fadeDuration / steps;
    clearInterval(this.state.fadeInterval);
    const intv = setInterval(() => {
      if (this.state.volume <= 0.0) {
        clearInterval(this.state.fadeInterval);
        this.setState(state => ({ volume: 0 }));
        this.audio.pause();
      } else {
        this.setState(state => ({ volume: this.state.volume - step }));
        this.audio.volume = Math.max(this.state.volume, 0.0);
      }
    }, timeStep);
    this.setState(state => ({ fadeInterval: intv }));
  }

  componentWillUpdate() {
    console.log(this.props.audiosrc);
  }

  componentWillUnmount() {
    this.audio.ontimeupdate = null;
    this.audio.removeEventListener("canplaythrough", this.setDuration);
    clearInterval(this.state.fadeInterval);
  }

  setDuration() {
    this.setState({
      duration: this.audio.duration
    });
  }

  setupAudio() {
    this.audio.loop = true;
    this.audio.volume = 0.0;
    this.audio.addEventListener("canplaythrough", this.setDuration);
    this.audio.ontimeupdate = this.timeUpdate.bind(this);
    this.audio.src = this.props.audiosrc;
  }

  stopAudio() {
    const steps = 10;
    const step = 1.0 / steps;
    const timeStep = this.props.fadeDuration / steps;
    clearInterval(this.state.fadeInterval);
    const intv = setInterval(() => {
      if (this.state.volume < 0.0) {
        clearInterval(this.state.fadeInterval);
        this.audio.pause();
        this.setState(state => ({ volume: 0 }));
        this.audio.volume = this.state.volume;
        this.audio.src = this.props.audiosrc;
        this.props.onStopped();
      } else {
        this.setState(state => ({ volume: this.state.volume - step }));
        this.audio.volume = Math.max(this.state.volume, 0.0);
      }
    }, timeStep);
    this.setState(state => ({ fadeInterval: intv }));
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
    const debug = (
      <div className="column">
        <span>
          <b>Sample: </b>
          {this.props.audiosrc}
        </span>
        <span>
          <b>Volume:</b> {this.state.volume}
        </span>
        <span>
          {this.state.currentTime}/{this.state.duration}
        </span>
      </div>
    );

    const left =
      this.state.currentTime / this.state.duration
        ? (this.state.currentTime / this.state.duration) * 100
        : 0;
    return (
      <div className="audio-player">
        <div className="controls">
          <div className="btn-play" onClick={() => this.fadeInAndPlay()}>
            Play
          </div>
          <div className="btn-pause" onClick={() => this.fadeOutAndStop()}>
            Pause
          </div>
        </div>
        <div className="timeline" onClick={this.changeTime}>
          <div className="playhead" style={{ left: `${left}%` }}></div>
        </div>
        <div className="volume">
          <div className="knob"></div>
        </div>
        {/* {debug} */}
      </div>
    );
  }
}

export default AudioPlayer;
