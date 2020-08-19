import React from "react";

import "../../sass/components/AudioPlayer.sass";

class AudioPlayer extends React.Component {
  constructor(props) {
    super(props);
    this.audio = React.createRef();
    this.timeUpdate = this.timeUpdate.bind(this);
    this.changeTime = this.changeTime.bind(this);
    this.dragTime = this.dragTime.bind(this);
    this.state = {
      duration: 0,
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
    var xOffset = e.target.getBoundingClientRect().left;
    const percent =
      (e.clientX - xOffset) / e.target.getBoundingClientRect().width;
    this.audio.current.currentTime = this.state.duration * percent;
  }

  dragTime(e) {}

  render() {
    const left =
      this.state.currentTime / this.state.duration
        ? (this.state.currentTime / this.state.duration) * 100
        : 0;
    return (
      <div className="audio-player">
        <audio preload="true" onTimeUpdate={this.timeUpdate} ref={this.audio}>
          <source src={this.props.audiosrc} />
        </audio>
        <div onClick={() => this.audio.current.play()}>Play</div>
        <div onClick={() => this.audio.current.pause()}>Pause</div>
        <div className="timeline" onClick={this.changeTime}>
          <div className="playhead" style={{ left: `${left}%` }}></div>
        </div>
        {this.state.currentTime}/{this.state.duration}
        <div className="volume">
          <div className="knob"></div>
        </div>
      </div>
    );
  }
}

export default AudioPlayer;
