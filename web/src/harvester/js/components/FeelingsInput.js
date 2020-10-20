// node_modules imports
import React, { useState, useEffect, useRef } from "react";
import * as THREE from "three";
import { WEBGL } from "../../../shared/js/webgl.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import TWEEN from "@tweenjs/tween.js";
// Style imports
import "../../sass/FeelingsInput.sass";

// TODO: compatability check
if (WEBGL.isWebGLAvailable()) {
  // Initiate function or other initializations here
  // animate();
} else {
  // var warning = WEBGL.getWebGLErrorMessage();
  // document.getElementById("container").appendChild(warning);
}

export default ({ onSelect }) => {
  const [feeling, setFeeling] = useState("");
  const [hoverFeeling, setHoverFeeling] = useState("");
  const [svgPoint, setSvgPoint] = useState([0, 0]);
  const [open, setOpen] = useState(0);
  const canvas = useRef();
  const svg = useRef();
  const [newGeometry, setNewGeometry] = useState(new THREE.BufferGeometry());

  const feelings = [
    ["klar", "aufkmersam", "neugierig"],
    ["begeisternd", "froh", "gelassen"],
    ["bewundernd", "vertrauend", "akzeptierend"],
    ["erschreckend", "beängstigend", "besorgend"],
    ["erstaunend", "überraschend", "verwirrend"],
    ["betrübend", "traurig", "nachdenklich"],
    ["angewiedernd", "ablehnend", "langweilend"],
    ["wütend", "verärgernd", "reizend"]
  ];
  const feelingMap = new Map();

  const center = 250;
  const n = feelings.length;

  const reactOnSlider = () => {};

  useEffect(() => {
    let feelingPoint = new THREE.Vector3();
    let size = canvas.current.getBoundingClientRect();
    var scene = new THREE.Scene();
    const root = new THREE.Object3D();

    var material = new THREE.MeshLambertMaterial({
      color: 0x333333,
      side: THREE.DoubleSide,
      flatShading: true
    });
    // var material = new THREE.MeshPhongMaterial({
    //   color: 0x424242,
    //   shininess: 10,
    //   flatShading: true,
    //   side: THREE.DoubleSide
    // });
    const aspect = size.width / size.height;
    var camera = new THREE.OrthographicCamera(
      size.width / -400,
      size.width / +400,
      size.height / +400,
      size.height / -400,
      0.01,
      100
    );
    var renderer = new THREE.WebGLRenderer({
      antialias: 1,
      canvas: canvas.current,
      alpha: true
    });
    renderer.setSize(size.width, size.height);
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
      vert.push(0, 0.5, 0);
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
    var light = new THREE.HemisphereLight(0xffffff, 0x666666, 1.5);
    light.position.set(0, 10, 0);
    scene.add(light);
    var directionalLight = new THREE.DirectionalLight(0xffffff, 3.5);
    directionalLight.position.set(
      camera.position.x + 1,
      camera.position.y + 1,
      camera.position.z + 1
    );
    scene.add(directionalLight);
    var controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(0, -0.5, 0);
    camera.position.set(1, 0.25, 1);
    controls.update();
    controls.enableZoom = false;

    // Lines
    var lineMaterial = new THREE.LineBasicMaterial({ color: 0x000000 });
    var points = [];
    points.push(new THREE.Vector3(0, 0, 0));
    points.push(new THREE.Vector3(-0.5, 0.5, 0));
    var lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
    var line = new THREE.Line(lineGeometry, lineMaterial);
    // scene.add(line);

    var mousePosition = new THREE.Vector2();
    const raycaster = new THREE.Raycaster();
    var hit = [];
    var selectedId = -1;

    var onUpdate = function() {
      var to = new THREE.Vector3(-0.5, -0.5, 0).project(camera);
      points[1] = to;
      lineGeometry.setFromPoints(points);
      for (var i = 0, j = root.children.length; i < j; i++) {
        if (root.children[i].id === selectedId) {
          root.children[i].material.color.set(0x2b13ff);
          continue;
        }
        root.children[i].material.color.set(0x333333);
      }
      raycaster.setFromCamera(mousePosition, camera);
      hit = raycaster.intersectObjects(root.children);
      if (hit.length > 0) {
        const id = hit[0].object.id;
        setHoverFeeling(feelingMap.get(id));
        hit[0].object.material.color = new THREE.Color(0x2b13ff);
      } else {
      }
    };

    // Get mouse position
    function onMouseMove(e) {
      mousePosition.x = ((e.clientX - size.x) / size.width) * 2 - 1;
      mousePosition.y = -((e.clientY - size.y) / size.height) * 2 + 1;
    }
    canvas.current.addEventListener("pointermove", onMouseMove);

    let clientX, clientY;
    function onMouseDown(e) {
      clientX = e.clientX;
      clientY = e.clientY;
    }
    canvas.current.addEventListener("pointerdown", onMouseDown, false);

    // var arrowHelper = new THREE.ArrowHelper(
    //   new THREE.Vector3(0, 0, 0),
    //   new THREE.Vector3(0, 0, 0),
    //   1.0,
    //   0xff0000
    // );
    // scene.add(arrowHelper);

    function onMouseUp(e) {
      var x = e.clientX;
      var y = e.clientY;
      // If the mouse moved since the mousedown then don't consider this a selection
      if (x != clientX || y != clientY) return;
      else {
        if (hit.length > 0) {
          const normal = hit[0].point
            .clone()
            .sub(new THREE.Vector3(0, 0, 0))
            .normalize();
          // arrowHelper.setDirection(normal);
          const from = {
            x: camera.position.x,
            y: camera.position.y,
            z: camera.position.z
          };
          const to = {
            x: normal.x,
            y: normal.y,
            z: normal.z
          };
          const cameraTween = new TWEEN.Tween(from).to(to, 1500);
          cameraTween
            .onUpdate(function() {
              camera.position.set(from.x, from.y, from.z);
              directionalLight.position.set(from.x, from.y, from.z);
              controls.update();
            })
            .easing(TWEEN.Easing.Quadratic.InOut);
          cameraTween.start();
          controls.update();
          points[0] = hit[0].point;
          const id = hit[0].object.id;
          setFeeling(feelingMap.get(id));
          feelingPoint = hit[0].point;
          selectedId = id;
          if (onSelect) {
            onSelect(feelingMap.get(id), feelingPoint);
          }
        }
      }
    }
    canvas.current.addEventListener("pointerup", onMouseUp);

    function onWindowResize() {
      size = canvas.current.getBoundingClientRect();
      camera.updateProjectionMatrix();
      renderer.setSize(size.width, size.height);
    }
    const resizeHandler = window.addEventListener(
      "resize",
      onWindowResize,
      false
    );

    var render = function() {
      requestAnimationFrame(render);
      TWEEN.update();
      onUpdate();
      renderer.render(scene, camera);
    };
    render();

    return () => {
      window.removeEventListener("resize", resizeHandler);
    };
  }, []);

  return (
    <div className="feelings-input">
      <div className="canvas-wrapper">
        <div className="selected-feeling">
          <h5>Auswahl</h5>
          {feeling.length > 0 ? (
            <h3 className="feeling-name">{feeling}</h3>
          ) : (
            <></>
          )}
        </div>
        {hoverFeeling.length > 0 ? (
          <h4 className="hover-feeling">{hoverFeeling}</h4>
        ) : (
          <></>
        )}
        <canvas ref={canvas}></canvas>
      </div>
    </div>
  );
};
