import React, { useState } from "react";

import "../../sass/components/SelectBox.sass";

export default ({}) => {
  const [selection, setSelection] = useState(0);
  const [options] = useState(["Farbe", "Gefühl", "Form"]);

  return (
    <div className="select">
      <div className="options">
        {options.map((o, i) => {
          return (
            <span
              className={i === selection ? "selected" : ""}
              key={o}
              onClick={() => setSelection(i)}
            >
              {o}
            </span>
          );
        })}
      </div>
    </div>
  );
};
