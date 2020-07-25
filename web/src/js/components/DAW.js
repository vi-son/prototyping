import React from "react";

import "../../sass/components/DAW.sass";

const DAW = ({ trackCount }) => {
  const tracks = new Array(trackCount).fill(0).map((_, i) => i + 1);

  return (
    <div className="daw">
      <div className="controls">
        <b>Play</b>
        <b>Pause</b>
      </div>
      <div className="tracks">
        {tracks.map(i => {
          return (
            <div key={i} className={`track track-${i}`}>
              Track {i}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DAW;
