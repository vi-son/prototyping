import React from "react";

import "../../sass/components/AudioPlayer.sass";

class AudioPlayer extends React.Component {
  constructor(props) {
    super(props);
    this.audio = new Audio(this.props.audiosrc);
    this.timeUpdate = this.timeUpdate.bind(this);
    this.changeTime = this.changeTime.bind(this);
    this.dragTime = this.dragTime.bind(this);
    this.state = {
      duration: 0,
      currentTime: 0
    };
  }

  componentWillReceiveProps() {
    console.log("Received Props", this.props);
    this.audio.pause();
    this.audio = new Audio(this.props.audiosrc);
  }

  componentWillUnmount() {
    console.log("Will unmount");
    this.audio.pause();
  }

  timeUpdate() {
    this.setState({
      currentTime: this.audio.currentTime,
      duration: this.audio.duration
    });
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
        <div onClick={() => this.audio.play()}>Play</div>
        <div onClick={() => this.audio.pause()}>Pause</div>
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
