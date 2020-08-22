import React, { useState, useEffect } from "react";

import "../../sass/components/ColorInput.sass";

export default ({ onChange }) => {
  const [hue, setHue] = useState(128);
  const [saturation, setSaturation] = useState(60);
  const [brightness, setBrightness] = useState(78);

  const reactOnChange = () => {
    onChange(`hsl(${hue}, ${saturation}%, ${brightness}%)`);
  };

  useEffect(() => {
    onChange(`hsl(${hue}, ${saturation}%, ${brightness}%)`);
  });

  return (
    <div className="color-input">
      <h4>Color Input</h4>
      <span>
        hsl({hue}, {saturation}%, {brightness}%)
      </span>
      <div className="sliders">
        <input
          name="hue"
          type="range"
          min="0"
          max="360"
          defaultValue={hue}
          onChange={e => {
            setHue(e.target.value);
            reactOnChange();
          }}
        />
        <input
          name="saturation"
          type="range"
          min="0"
          max="100"
          defaultValue={saturation}
          onChange={e => {
            setSaturation(e.target.value);
            reactOnChange();
          }}
        />
        <input
          name="brightness"
          type="range"
          min="25"
          max="100"
          defaultValue={brightness}
          onChange={e => {
            setBrightness(e.target.value);
            reactOnChange();
          }}
        />
      </div>
    </div>
  );
};
