import React, { useState, useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

import "../../sass/components/FeelingsInput.sass";

export default ({}) => {
  const [feeling, setFeeling] = useState("");
  const canvas = useRef();

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

  useEffect(() => {
    var scene = new THREE.Scene();
    // const aspect = window.innerWidth / window.innerHeight;
    const aspect = 1;
    var camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000);
    var renderer = new THREE.WebGLRenderer({
      canvas: canvas.current,
      alpha: true
    });
    // renderer.setSize(window.innerWidth, window.innerHeight);
    var geometry = new THREE.BoxGeometry(1, 1, 1);
    var newGeometry = new THREE.BufferGeometry();
    var vertices = new Float32Array([]);
    newGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(vertices, 3)
    );
    var material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    var cube = new THREE.Mesh(geometry, material);
    scene.add(cube);
    camera.position.z = 5;
    var controls = new OrbitControls(camera, renderer.domElement);
    controls.enableZoom = false;
    var animate = function() {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();
  }, []);

  return (
    <div className="feelings-input">
      <h4>Feelings Input</h4>
      <canvas width="600" height="600" ref={canvas}></canvas>
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
