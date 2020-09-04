import React, { useState, useEffect, useRef } from "react";
import * as THREE from "three";
import { WEBGL } from "../webgl.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

import "../../sass/components/FeelingsInput.sass";

// TODO: compatability check
if (WEBGL.isWebGLAvailable()) {
  // Initiate function or other initializations here
  // animate();
} else {
  // var warning = WEBGL.getWebGLErrorMessage();
  // document.getElementById("container").appendChild(warning);
}

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
  const feelingMap = new Map();

  const center = 250;
  const n = feelings.length;

  const reactOnSlider = () => {};

  useEffect(() => {
    let size = canvas.current.getBoundingClientRect();
    var scene = new THREE.Scene();
    const root = new THREE.Object3D();
    var material = new THREE.MeshPhongMaterial({
      color: 0x424242,
      shininess: 10,
      flatShading: true,
      side: THREE.DoubleSide
    });
    const aspect = size.width / size.height;
    var camera = new THREE.OrthographicCamera(-1, +1, +1, -1, 0.1, 100);
    var renderer = new THREE.WebGLRenderer({
      antialias: 1,
      canvas: canvas.current,
      alpha: true
    });
    // var geometry = new THREE.BoxGeometry(1, 1, 1);
    feelings.map((row, i) => {
      var geometry = new THREE.BufferGeometry();
      const vert = [];
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
      vert.push(0, 0.3, 0);
      vert.push(x, y, z);
      vert.push(x1, y, z1);
      var vertices = new Float32Array(vert);
      geometry.setAttribute("position", new THREE.BufferAttribute(vertices, 3));
      geometry.computeVertexNormals();
      geometry.computeFaceNormals();
      const mesh = new THREE.Mesh(geometry, material.clone());
      root.add(mesh);
      feelingMap.set(mesh.id, row[0]);
      row.slice(1).map((f, j) => {
        geometry = new THREE.BufferGeometry();
        var vert = [];
        radius = (feelings[0].length - (j + 2)) / 3.3;
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
        vertices = new Float32Array(vert);
        geometry.setAttribute(
          "position",
          new THREE.BufferAttribute(vertices, 3)
        );
        geometry.computeVertexNormals();
        geometry.computeFaceNormals();
        const mesh = new THREE.Mesh(geometry, material.clone());
        root.add(mesh);
        feelingMap.set(mesh.id, f);
        prevY = v;
        prevX = u;
        prevX1 = u1;
        prevZ = w;
        prevZ1 = w1;
      });
    });
    scene.add(root);
    var light = new THREE.HemisphereLight(0xffffff, 0x666666, 2.75);
    light.position.set(0, 10, 0);
    scene.add(light);
    var controls = new OrbitControls(camera, renderer.domElement);
    camera.position.set(1, 1, 1);
    controls.update();
    controls.enableZoom = false;

    var mousePosition = new THREE.Vector2();
    const raycaster = new THREE.Raycaster();
    var hit = [];

    var onUpdate = function() {
      for (var i = 0, j = root.children.length; i < j; i++) {
        root.children[i].material.color = new THREE.Color(0x666666);
      }
      raycaster.setFromCamera(mousePosition, camera);
      hit = raycaster.intersectObjects(root.children);
      if (hit.length > 0) {
        const id = hit[0].object.id;
        setFeeling(feelingMap.get(id));
        hit[0].object.material.color = new THREE.Color(0x000000);
      }
    };

    // Get mouse position
    function onMouseMove(e) {
      mousePosition.x = ((e.clientX - size.x) / size.width) * 2 - 1;
      mousePosition.y = -((e.clientY - size.y) / size.height) * 2 + 1;
    }
    canvas.current.addEventListener("mousemove", onMouseMove);

    window.addEventListener("resize", onWindowResize, false);

    function onWindowResize() {
      size = canvas.current.getBoundingClientRect();
      camera.updateProjectionMatrix();
      renderer.setSize(size.width, size.height);
    }

    var render = function() {
      requestAnimationFrame(render);
      onUpdate();
      renderer.render(scene, camera);
    };
    render();
  }, []);

  return (
    <div className="feelings-input">
      <h4>Feelings Input</h4>
      {/* <input */}
      {/*   type="range" */}
      {/*   defaultValue="0" */}
      {/*   min="0" */}
      {/*   max="100" */}
      {/*   onChange={e => { */}
      {/*     setOpen(e.target.value); */}
      {/*     reactOnSlider(); */}
      {/*   }} */}
      {/* /> */}
      <div className="canvas-wrapper">
        <h4 className="feeling-name">Gefühl: {feeling}</h4>
        <canvas width="600" height="600" ref={canvas}></canvas>
      </div>
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
    </div>
  );
};
