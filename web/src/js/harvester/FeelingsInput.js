import React, { useState } from "react";

import "../../sass/components/FeelingsInput.sass";

export default ({}) => {
  const [feeling, setFeeling] = useState("");

  const feelings = [
    ["klar", "aufmerksam", "neugierig"],
    ["begeistert", "froh", "gelassen"],
    ["bewundernd", "vertrauend", "akzeptierend"],
    ["erschrocken", "ängstlich", "besort"],
    ["erstaunt", "überrascht", "verwirrt"],
    ["deprimiert", "traurig", "nachdenklich"],
    ["angewiedert", "ablehnend", "gelangweilt"],
    ["gereizg", "verärgert", "wütend"]
  ];

  const center = 250;
  const n = feelings.length;

  return (
    <div className="feelings-input">
      Feelings Input
      <svg
        stroke="black"
        width={2 * center}
        height={2 * center}
        fill="none"
        strokeWidth="3"
      >
        {feelings.map((row, i) => {
          const radius = 80;
          return (
            <g key={i} transform={`translate(${center},${center})`}>
              {row.map((f, j) => {
                const a = (i / n) * 2 * Math.PI;
                const b = ((i + 1) / n) * 2 * Math.PI;
                const r = radius * 1.5 * j;
                const x0 = radius * j * Math.sin(a);
                const y0 = radius * j * Math.cos(a);
                const x1 = radius * (j + 1) * Math.sin(a);
                const y1 = radius * (j + 1) * Math.cos(a);
                const x2 = radius * (j + 1) * Math.sin(b);
                const y2 = radius * (j + 1) * Math.cos(b);
                const x3 = radius * j * Math.sin(b);
                const y3 = radius * j * Math.cos(b);
                return (
                  <polygon
                    key={`${i}${j}`}
                    onMouseOver={e => setFeeling(e.target.dataset.feeling)}
                    stroke="black"
                    fill="var(--color-snow)"
                    points={`${x0},${y0} ${x1},${y1} ${x2},${y2} ${x3},${y3}`}
                    data-feeling={f}
                  ></polygon>
                );
              })}
            </g>
          );
        })}
      </svg>
      <h4>{feeling}</h4>
    </div>
  );
};
