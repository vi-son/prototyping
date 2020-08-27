import React, { useState, useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

import "../../sass/components/FeelingsInput.sass";

export default ({}) => {
  const [feeling, setFeeling] = useState("");
  const [svgPoint, setSvgPoint] = useState([0, 0]);
  const canvas = useRef();
  const svg = useRef();

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
    // const width = window.innerWidth / window.innerHeight;
    const aspect = 1;
    var camera = new THREE.OrthographicCamera(-2, 2, 2, -2, 0.1, 100);
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
    var material = new THREE.MeshPhongMaterial({
      color: 0x424242,
      shininess: 50,
      flatShading: true
    });
    var cube = new THREE.Mesh(geometry, material);
    var directionalLight = new THREE.DirectionalLight(0xffffff, 5.0);
    directionalLight.position.set(1, 3, 2);
    scene.add(directionalLight);
    scene.add(cube);
    camera.position.z = 5;
    var controls = new OrbitControls(camera, renderer.domElement);
    camera.position.set(2, 2, 2);
    controls.update();
    controls.enableZoom = false;
    var animate = function() {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };
    animate();
  }, []);

  return (
    <div className="feelings-input">
      <h4>Feelings Input</h4>
      <canvas width="600" height="600" ref={canvas}></canvas>
      <svg
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
      </svg>
      <h4>{feeling}</h4>
    </div>
  );
};
