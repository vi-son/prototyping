// node_modules imports
import React, { useState, useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import TWEEN from "@tweenjs/tween.js";
// Style imports
import "../../sass/ColorInput.sass";

export default ({ onChange, onSelect }) => {
  const canvasRef = useRef();
  const canvasWrapperRef = useRef();
  const [hue, setHue] = useState(128);
  const [saturation, setSaturation] = useState(60);
  const [brightness, setBrightness] = useState(97);
  const [r, setR] = useState(250);
  const [g, setG] = useState(250);
  const [b, setB] = useState(250);

  const handleClick = () => {
    if (onSelect) onSelect(r, g, b);
  };

  useEffect(() => {
    const size = canvasWrapperRef.current.getBoundingClientRect();
    // Scene
    const scene = new THREE.Scene();
    // Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: 1,
      alpha: true
    });
    renderer.setSize(size.width, size.height);
    // Light
    var light = new THREE.HemisphereLight(0xffffff, 0x666666, 2.75);
    light.position.set(0, 10, 0);
    scene.add(light);
    // Geometry
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.ShaderMaterial({
      uniforms: {},
      vertexShader: require("../../glsl/colorcube.vert.glsl"),
      fragmentShader: require("../../glsl/colorcube.frag.glsl")
    });

    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    var sphereGeometry = new THREE.SphereBufferGeometry(0.03, 32, 32);
    var sphereMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });
    // sphereMaterial.depthTest = false;
    var sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    sphere.position.set(0, 0, 0);
    scene.add(sphere);

    const radius = 0.1;
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
      size.height / +500,
      size.height / -500,
      -10,
      100
    );
    var controls = new OrbitControls(camera, renderer.domElement);
    camera.position.set(1, 1, 1);
    controls.target.set(0, 0.25, 0);
    controls.update();
    controls.enableZoom = false;
    controls.enableDamping = true;
    controls.dampingFactor = 0.9;

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
    const pointerMoveHandler = canvasRef.current.addEventListener(
      "pointermove",
      onMouseMove,
      false
    );
    let clientX, clientY;
    function onMouseDown(e) {
      clientX = e.clientX;
      clientY = e.clientY;
    }
    const pointerDownHandler = canvasRef.current.addEventListener(
      "pointerdown",
      onMouseDown,
      false
    );

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
              controls.update();
            })
            .easing(TWEEN.Easing.Quadratic.InOut);
          cameraTween.start();
          controls.update();
          cursor.position.set(hit[0].point.x, hit[0].point.y, hit[0].point.z);
          const red = Math.round((hit[0].point.x + 0.5) * 255);
          const green = Math.round((hit[0].point.y + 0.5) * 255);
          const blue = Math.round((hit[0].point.z + 0.5) * 255);
          setR(red);
          setG(green);
          setB(blue);
          if (onChange) onChange(`rgba(${red}, ${green}, ${blue}, 0.65)`);
        }
      }
    }
    const pointerUpHandler = canvasRef.current.addEventListener(
      "pointerup",
      onMouseUp
    );

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
      TWEEN.update();
      cursor.lookAt(camera.position);
      renderer.render(scene, camera);
    };
    render();

    return () => {
      window.removeEventListener("resize", resizeHandler);
      canvasRef.current.removeEventListener("pointermove", pointerMoveHandler);
      canvasRef.current.removeEventListener("pointerup", pointerUpHandler);
      canvasRef.current.removeEventListener("pointerdown", pointerDownHandler);
    };
  }, []);

  return (
    <div className="color-input">
      <div className="color-name">
        <h5>Auswahl</h5>
        <div
          className="color-swatch"
          style={{ backgroundColor: `rgb(${r}, ${g}, ${b})` }}
        ></div>
      </div>
      <div className="canvas-wrapper" ref={canvasWrapperRef}>
        <canvas ref={canvasRef} onClick={handleClick}></canvas>
      </div>
    </div>
  );
};
