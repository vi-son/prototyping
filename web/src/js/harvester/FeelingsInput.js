import React, { useState, useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

import "../../sass/components/FeelingsInput.sass";

export default ({}) => {
  const [feeling, setFeeling] = useState("");
  const [svgPoint, setSvgPoint] = useState([0, 0]);
  const [open, setOpen] = useState(0);
  const canvas = useRef();
  const svg = useRef();
  const [newGeometry, setNewGeometry] = useState(new THREE.BufferGeometry());

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

  const reactOnSlider = () => {
    const val = open / 100.0;
    console.log(val);
    const vert = [];
    feelings.map((row, i) => {
      let radius = 0.5;
      const a = (i / n) * 2 * Math.PI;
      const b = ((i + 1) / n) * 2 * Math.PI;
      const x = radius * Math.sin(a);
      const z = radius * Math.cos(a);
      const x1 = radius * Math.sin(b);
      const z1 = radius * Math.cos(b);
      const y = 0;
      let prevX = x;
      let prevZ = z;
      let prevX1 = x1;
      let prevZ1 = z1;
      let prevY = y;
      vert.push(0, 0.1 * (1.0 - val), 0);
      vert.push(x, y, z);
      vert.push(x1, y, z1);
      row.map((f, j) => {
        const from = (feelings[0].length - (j + 1)) / 3.3;
        const to = radius + (j + 1) / 6;
        radius = val * to + (1.0 - val) * from;
        let step = 0.33 / (feelings[0].length - 1);
        const inset = val * Math.min(1.0, step * (j + 1));
        let o = ((i + inset) / n) * 2 * Math.PI;
        let p = ((i + 1 - inset) / n) * 2 * Math.PI;
        const u = radius * Math.sin(o);
        const w = radius * Math.cos(o);
        const u1 = radius * Math.sin(p);
        const w1 = radius * Math.cos(p);
        const v = -(j + 1) * 0.5 * (1.0 - val);
        vert.push(prevX, prevY, prevZ);
        vert.push(u, v, w);
        vert.push(prevX1, prevY, prevZ1);
        vert.push(prevX1, prevY, prevZ1);
        vert.push(u1, v, w1);
        vert.push(u, v, w);
        prevY = v;
        prevX = u;
        prevX1 = u1;
        prevZ = w;
        prevZ1 = w1;
      });
    });
    var vertices = new Float32Array(vert);
    newGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(vertices, 3)
    );
  };

  useEffect(() => {
    var scene = new THREE.Scene();
    // const width = window.innerWidth / window.innerHeight;
    const aspect = 1;
    var camera = new THREE.OrthographicCamera(-2, 2, 2, -2, 0.1, 100);
    var renderer = new THREE.WebGLRenderer({
      antialias: 1,
      canvas: canvas.current,
      alpha: true
    });
    // renderer.setSize(window.innerWidth, window.innerHeight);
    var geometry = new THREE.BoxGeometry(1, 1, 1);
    const vert = [];
    feelings.map((row, i) => {
      let radius = 0.5;
      const a = (i / n) * 2 * Math.PI;
      const b = ((i + 1) / n) * 2 * Math.PI;
      const x = radius * Math.sin(a);
      const z = radius * Math.cos(a);
      const x1 = radius * Math.sin(b);
      const z1 = radius * Math.cos(b);
      const y = 0;
      let prevX = x;
      let prevZ = z;
      let prevX1 = x1;
      let prevZ1 = z1;
      let prevY = y;
      vert.push(0, 0.1, 0);
      vert.push(x, y, z);
      vert.push(x1, y, z1);
      row.map((f, j) => {
        radius = (feelings[0].length - (j + 1)) / 3.3;
        let step = 0.33 / (feelings[0].length - 1);
        const inset = 0.0; //Math.min(1.0, step * (j + 1));
        let o = ((i + inset) / n) * 2 * Math.PI;
        let p = ((i + 1 - inset) / n) * 2 * Math.PI;
        const u = radius * Math.sin(o);
        const w = radius * Math.cos(o);
        const u1 = radius * Math.sin(p);
        const w1 = radius * Math.cos(p);
        const v = -(j + 1) * 0.5;
        vert.push(prevX, prevY, prevZ);
        vert.push(u, v, w);
        vert.push(prevX1, prevY, prevZ1);
        vert.push(prevX1, prevY, prevZ1);
        vert.push(u1, v, w1);
        vert.push(u, v, w);
        prevY = v;
        prevX = u;
        prevX1 = u1;
        prevZ = w;
        prevZ1 = w1;
      });
    });
    var vertices = new Float32Array(vert);
    newGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(vertices, 3)
    );
    newGeometry.computeVertexNormals();
    newGeometry.computeFaceNormals();
    var material = new THREE.MeshPhongMaterial({
      color: 0x424242,
      shininess: 10,
      flatShading: true,
      side: THREE.DoubleSide
    });
    var wireframe = new THREE.WireframeGeometry(newGeometry);
    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0x000000,
      linewidth: 10
    });
    var line = new THREE.LineSegments(wireframe, lineMaterial);
    line.position.set(0, 1.0, 0);
    scene.add(line);
    var cube = new THREE.Mesh(newGeometry, material);
    cube.position.set(0, 1.0, 0);
    scene.add(cube);
    var light = new THREE.HemisphereLight(0xffffff, 0x666666, 2.75);
    light.position.set(0, 10, 0);
    scene.add(light);
    // var directionalLight = new THREE.DirectionalLight(0xffffff, 5.0);
    // directionalLight.position.set(1, 3, 2);
    // directionalLight.position.sub(camera.position);
    // var light = new THREE.AmbientLight(0x404040, 3.0); // soft white light
    // scene.add(light);
    // scene.add(directionalLight);
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
      <input
        type="range"
        defaultValue="0"
        min="0"
        max="100"
        onChange={e => {
          setOpen(e.target.value);
          reactOnSlider();
        }}
      />
      <canvas width="800" height="800" ref={canvas}></canvas>
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
      </svg>
      <h4>{feeling}</h4>
    </div>
  );
};
