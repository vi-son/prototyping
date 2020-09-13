<svg
  style={{ display: "none" }}
  ref={svg}
  stroke="black"
  width={2 * center}
  height={2 * center}
  fill="none"
  strokeWidth="3"
  id="svg"
>
  {feelings.map((row, i) => {
    const radius = 80;
    return (
      <g
        key={i}
        transform={`translate(${center},${center})`}
        onMouseMove={e => {
          setFeeling(e.target.dataset.feeling);
          var p = svg.current.createSVGPoint();
          p.x = e.clientX;
          p.y = e.clientY;
          p.matrixTransform(svg.current.getScreenCTM().inverse());
          var ctm = svg.current.getScreenCTM();
          var inverse = ctm.inverse();
          var p = p.matrixTransform(inverse);
          setSvgPoint([p.x, p.y]);
        }}
      >
        {row.map((f, j) => {
          let q = 0.05;
          let a = ((i + 0 + q * j) / n) * 2 * Math.PI;
          let b = ((i + 1 - q * j) / n) * 2 * Math.PI;
          let a1 = ((i + 0 + q * (j + 1)) / n) * 2 * Math.PI;
          let b1 = ((i + 1 - q * (j + 1)) / n) * 2 * Math.PI;
          if (j == 2) {
            a1 = ((i + 0.5) / n) * 2 * Math.PI;
            b1 = ((i + 0.5) / n) * 2 * Math.PI;
          }
          const r = radius * 1.5 * j;
          const x0 = radius * j * Math.sin(a);
          const y0 = radius * j * Math.cos(a);
          const x1 = radius * (j + 1) * Math.sin(a1);
          const y1 = radius * (j + 1) * Math.cos(a1);
          const x2 = radius * (j + 1) * Math.sin(b1);
          const y2 = radius * (j + 1) * Math.cos(b1);
          const x3 = radius * j * Math.sin(b);
          const y3 = radius * j * Math.cos(b);
          return (
            <polygon
              key={`${i}${j}`}
              stroke="black"
              fill="var(--color-snow)"
              points={`${x0},${y0} ${x1},${y1} ${x2},${y2} ${x3},${y3}`}
              data-feeling={f}
            ></polygon>
          );
        })}
        <circle
          id="cursor"
          cx={svgPoint[0] - center}
          cy={svgPoint[1] - center}
          r="10"
          stroke="none"
          fill="currentColor"
        ></circle>
      </g>
    );
  })}
</svg>;
