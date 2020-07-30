import React, { useState } from "react";

import "../../sass/components/DAW.sass";

const DAW = ({ trackCount }) => {
  const tracks = new Array(trackCount).fill(0).map((_, i) => i + 1);
  const [buffers, setBuffers] = useState(new Array(trackCount));
  const [dragOn, setDragOn] = useState(-1);

  const handleDrop = ev => {
    ev.preventDefault();
    console.log("Drop the base.");
    const fr = new FileReader();
    if (ev.dataTransfer.items) {
      // Use DataTransferItemList interface to access the file(s)
      for (var i = 0; i < ev.dataTransfer.items.length; i++) {
        // If dropped items aren't files, reject them
        if (ev.dataTransfer.items[i].kind === "file") {
          var file = ev.dataTransfer.items[i].getAsFile();
          const blob = fr.readAsArrayBuffer(file);
          console.log(blob);
          var context = new AudioContext();
          var source = context.createBufferSource();
          // source.buffer = file;
          console.log("... file[" + i + "].name = " + file.name);
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
        <b>Play</b>
        <b>Pause</b>
      </div>
      <div className="tracks">
        {tracks.map(i => {
          return (
            <div
              key={i}
              className={`track track-${i} ${dragOn === i ? "drop" : ""}`}
              onDragOver={ev => {
                ev.preventDefault();
                setDragOn(i);
              }}
              onDrop={handleDrop}
            >
              Track {i}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DAW;
