import React, { useState, useReducer } from "react";

import "../../sass/components/DAW.sass";

const DAW = ({ trackCount }) => {
  const [context] = useState(new AudioContext());
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
  const [buffers, setBuffers] = useState(new Array(trackCount));
  const [dragOn, setDragOn] = useState(-1);
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
        mix[i].buffer = e;
        // console.log("Ready");
        console.log(mix[i]);
      });
    };
    if (ev.dataTransfer.items) {
      // Use DataTransferItemList interface to access the file(s)
      for (var x = 0; x < ev.dataTransfer.items.length; x++) {
        // If dropped items aren't files, reject them
        if (ev.dataTransfer.items[x].kind === "file") {
          var file = ev.dataTransfer.items[x].getAsFile();
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

  return (
    <div className="daw">
      <div className="controls">
        <b
          onClick={() => {
            mix.forEach(m => {
              m.connect(context.destination);
              m.start(0);
            });
          }}
        >
          Play
        </b>
        <b>Pause</b>
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
        {JSON.stringify(trackNames)}
      </div>
    </div>
  );
};

export default DAW;
