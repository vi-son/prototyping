import React, { useState, useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import glsl from "glslify";

import "../sass/ColorInput.sass";

export default ({ onChange, onClick }) => {
  const canvasRef = useRef();
  const [hue, setHue] = useState(128);
  const [saturation, setSaturation] = useState(60);
  const [brightness, setBrightness] = useState(97);
  const [r, setR] = useState(250);
  const [g, setG] = useState(250);
  const [b, setB] = useState(250);

  const handleClick = () => {
    onClick(r, g, b);
  };

  useEffect(() => {
    const size = canvasRef.current.getBoundingClientRect();
    // Scene
    const scene = new THREE.Scene();
    // Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: 1,
      alpha: true
    });
    // Light
    var light = new THREE.HemisphereLight(0xffffff, 0x666666, 2.75);
    light.position.set(0, 10, 0);
    scene.add(light);
    // Geometry
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.ShaderMaterial({
      uniforms: {},
      vertexShader: glsl.compile(require("../glsl/colorcube.vert.glsl")),
      fragmentShader: glsl.compile(require("../glsl/colorcube.frag.glsl"))
    });

    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    var sphereGeometry = new THREE.SphereBufferGeometry(0.03, 32, 32);
    var sphereMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });
    sphereMaterial.depthTest = false;
    var sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    sphere.position.set(0, 0, 0);
    scene.add(sphere);

    const radius = 0.03;
    const points = new Array(30).fill(0).map((_, i) => {
      return new THREE.Vector3(
        radius * Math.sin((i / 29) * Math.PI * 2.0),
        radius * Math.cos((i / 29) * Math.PI * 2.0),
        0
      );
    });
    var cursorGeometry = new THREE.BufferGeometry().setFromPoints(points);
    var cursorMaterial = new THREE.LineBasicMaterial({
      color: 0x000000,
      depthTest: false
    });
    var cursor = new THREE.Line(cursorGeometry, cursorMaterial);
    scene.add(cursor);

    // Camera
    const camera = new THREE.OrthographicCamera(
      size.width / -500,
      size.width / +500,
      size.width / +500,
      size.width / -500,
      0.1,
      100
    );
    var controls = new OrbitControls(camera, renderer.domElement);
    camera.position.set(1, 1, 1);
    controls.update();
    controls.enableZoom = false;
    controls.enableDamping = true;
    controls.dampingFactor = 0.2;

    var mousePosition = new THREE.Vector2();
    const raycaster = new THREE.Raycaster();
    var hit = [];
    let mouseDown = false;

    function onMouseMove(e) {
      mousePosition.x = ((e.clientX - size.x) / size.width) * 2 - 1;
      mousePosition.y = -((e.clientY - size.y) / size.height) * 2 + 1;
      if (e.buttons !== 0) mouseDown = true;
      else mouseDown = false;
    }
    canvasRef.current.addEventListener("mousemove", onMouseMove, false);
    let clientX, clientY;
    function onMouseDown(e) {
      clientX = e.clientX;
      clientY = e.clientY;
    }
    canvasRef.current.addEventListener("mousedown", onMouseDown, false);
    function onMouseUp(e) {
      var x = e.clientX;
      var y = e.clientY;
      // If the mouse moved since the mousedown then don't consider this a selection
      if (x != clientX || y != clientY) return;
      else {
        if (hit.length > 0) {
          cursor.position.set(hit[0].point.x, hit[0].point.y, hit[0].point.z);
          const red = Math.round((hit[0].point.x + 0.5) * 255);
          const green = Math.round((hit[0].point.y + 0.5) * 255);
          const blue = Math.round((hit[0].point.z + 0.5) * 255);
          setR(red);
          setG(green);
          setB(blue);
          onChange(`rgb(${red}, ${green}, ${blue})`);
        }
      }
    }
    canvasRef.current.addEventListener("mouseup", onMouseUp);

    function onUpdate() {
      raycaster.setFromCamera(mousePosition, camera);
      hit = raycaster.intersectObject(cube);
      cursor.lookAt(camera.position);
      if (hit.length > 0) {
        sphere.position.set(hit[0].point.x, hit[0].point.y, hit[0].point.z);
      }
    }

    var render = function() {
      requestAnimationFrame(render);
      onUpdate();
      renderer.render(scene, camera);
    };
    render();
  }, []);

  return (
    <div className="color-input">
      <h4>Color Input</h4>
      <div className="color-name">
        <span>
          <b>R:</b> {r}
        </span>
        <span>
          <b>G:</b> {g}
        </span>
        <span>
          <b>B:</b> {b}
        </span>
      </div>
      {/* <div className="fallback-input"> */}
      {/*   <span> */}
      {/*     hsl({hue}, {saturation}%, {brightness}%) */}
      {/*   </span> */}
      {/*   <div className="sliders"> */}
      {/*     <input */}
      {/*       name="hue" */}
      {/*       type="range" */}
      {/*       min="0" */}
      {/*       max="360" */}
      {/*       defaultValue={hue} */}
      {/*       onChange={e => { */}
      {/*         setHue(e.target.value); */}
      {/*         reactOnChange(); */}
      {/*       }} */}
      {/*     /> */}
      {/*     <input */}
      {/*       name="saturation" */}
      {/*       type="range" */}
      {/*       min="0" */}
      {/*       max="100" */}
      {/*       defaultValue={saturation} */}
      {/*       onChange={e => { */}
      {/*         setSaturation(e.target.value); */}
      {/*         reactOnChange(); */}
      {/*       }} */}
      {/*     /> */}
      {/*     <input */}
      {/*       name="brightness" */}
      {/*       type="range" */}
      {/*       min="25" */}
      {/*       max="100" */}
      {/*       defaultValue={brightness} */}
      {/*       onChange={e => { */}
      {/*         setBrightness(e.target.value); */}
      {/*         reactOnChange(); */}
      {/*       }} */}
      {/*     /> */}
      {/*   </div> */}
      {/* </div> */}
      <h4>
        {r} {g} {b}
      </h4>
      <div className="canvas-wrapper">
        <canvas
          width="600"
          height="600"
          ref={canvasRef}
          onClick={handleClick}
        ></canvas>
      </div>
    </div>
  );
};
