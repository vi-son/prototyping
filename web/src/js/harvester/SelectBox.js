import React, { useState } from "react";

import "../../sass/components/SelectBox.sass";

export default ({ options, children, onIndexChange }) => {
  const [selection, setSelection] = useState(0);

  return (
    <div className="select">
      <div className="options">
        {options.map((o, i) => {
          return (
            <span
              className={i === selection ? "selected" : ""}
              key={o}
              onClick={() => {
                setSelection(i);
                onIndexChange(i);
              }}
            >
              {o}
            </span>
          );
        })}
      </div>
      {React.Children.map(children, (child, i) =>
        i === selection ? child : null
      )}
    </div>
  );
};
