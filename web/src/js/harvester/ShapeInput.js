import React, { useRef, useState, useEffect } from "react";

export default ({}) => {
  useEffect(() => {}, []);

  return (
    <div className="shape-input">
      Shape Input
      <div className="canvas-wrapper">
        <canvas width="600" height="600"></canvas>
      </div>
    </div>
  );
};
