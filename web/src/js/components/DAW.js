import React, { useState, useReducer } from "react";

import "../../sass/components/DAW.sass";

const DAW = ({ trackCount }) => {
  const [context, setContext] = useState(new AudioContext());
  const initialTracks = new Array(trackCount).fill(0).map((_, i) => {
    return "";
  });
  const [trackNames, dispatchTrackNames] = useReducer(
    (tracks, { idx, value }) => {
      return tracks.map((e, i) => {
        if (i === idx) {
          return value;
        } else {
          return e;
        }
      });
    },
    initialTracks
  );
  const [duration, setDuration] = useState(-1);
  const [intervalled, setIntervalled] = useState(null);
  const [startedAt, setStartedAt] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [buffers, setBuffers] = useState(new Array(trackCount));
  const [dragOn, setDragOn] = useState(-1);
  const [fileBuffers] = useState(new Array(trackCount));
  const [mix] = useState(
    new Array(trackCount).fill(0).map(i => context.createBufferSource())
  );

  const handleDrop = (ev, i) => {
    ev.preventDefault();
    console.log("Drop the base.", i);
    const fr = new FileReader();
    fr.onload = function(e) {
      const res = fr.result;
      var source = context.createBufferSource();
      context.decodeAudioData(res).then(e => {
        fileBuffers[i] = e;
        if (e.duration >= duration) {
          setDuration(e.duration);
        }
      });
    };
    if (ev.dataTransfer.items) {
      // Use DataTransferItemList interface to access the file(s)
      for (var x = 0; x < ev.dataTransfer.items.length; x++) {
        // If dropped items aren't files, reject them
        if (ev.dataTransfer.items[x].kind === "file") {
          var file = ev.dataTransfer.items[x].getAsFile();
          console.log(file.type);
          fr.readAsArrayBuffer(file);
          console.log("... file[" + x + "].name = " + file.name);
          dispatchTrackNames({ idx: i, value: file.name });
        }
      }
    } else {
      // Use DataTransfer interface to access the file(s)
      for (var i = 0; i < ev.dataTransfer.files.length; i++) {
        console.log(
          "... file[" + i + "].name = " + ev.dataTransfer.files[i].name
        );
      }
    }
  };

  const audioProcess = () => {
    setCurrentTime((context.currentTime - startedAt) / duration);
  };

  const getTimecode = d => {
    const min = Math.floor(d / 60);
    const sec = Math.floor(d % 60);
    return `${min}:${sec} min`;
  };

  return (
    <div className="daw">
      <div className="controls">
        <b
          onClick={() => {
            mix.forEach((m, i) => {
              if (m === null) {
                m = context.createBufferSource();
                mix[i] = m;
              }
              m.buffer = fileBuffers[i];
              m.connect(context.destination);
              m.start(0);
            });
            setStartedAt(context.currentTime);
            const intervalled = setInterval(audioProcess, 100);
            setIntervalled(intervalled);
          }}
        >
          Play
        </b>
        <b onClick={() => {}}>Pause</b>
        <b
          onClick={() => {
            mix.forEach((m, i) => {
              m.stop();
              mix[i] = null;
            });
            clearInterval(intervalled);
            setIntervalled(null);
            setStartedAt(0);
            setCurrentTime(0);
          }}
        >
          Stop
        </b>
        <span className="duration">{getTimecode(duration)}</span>
      </div>
      <div className="tracks">
        {trackNames.map((t, i) => {
          return (
            <div
              key={i}
              className={`track track-${i} ${dragOn === i ? "drop" : ""}`}
              onDragOver={ev => {
                ev.preventDefault();
                setDragOn(i);
              }}
              onDrop={e => handleDrop(e, i)}
            >
              {i} {t}
            </div>
          );
        })}
      </div>
      <div
        className="current-time"
        style={{ left: `${(currentTime * 100.0).toFixed(2)}%` }}
      >
        <div className="time-indicator"></div>
        <div className="line"></div>
        {currentTime}
      </div>
    </div>
  );
};

export default DAW;
