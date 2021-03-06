import React, { useRef, useEffect, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

import "../sass/ExampleExhibit.sass";

const ExampleExhibit = ({ onCanvas, onMeta, meta }) => {
  const canvasRef = useRef();

  useEffect(() => {
    // Scene
    const scene = new THREE.Scene();
    // Camera
    const camera = new THREE.PerspectiveCamera(
      90,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    // Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current
    });
    renderer.setClearColor(0xad9972, 1);
    renderer.setSize(window.innerWidth, window.innerHeight);
    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(-2.3, 0, 2);
    camera.position.z = 1;
    camera.position.x = 2;
    controls.update();

    const tooControls = new THREE.Vector3(0, 0, 0);
    const tooCamera = new THREE.Vector3(3, 3, 3);
    // Light
    var light = new THREE.HemisphereLight(0xffffbb, 0x080820, 1);
    scene.add(light);
    // Geometry
    var geometry = new THREE.BoxGeometry();
    var material = new THREE.MeshPhongMaterial({ color: 0x2b13ff });
    var cube = new THREE.Mesh(geometry, material);
    scene.add(cube);
    // Clock
    const lock = new THREE.Clock();
    // Render loop
    const render = () => {
      requestAnimationFrame(render);
      controls.update();
      renderer.render(scene, camera);
    };
    render();
  }, []);

  return (
    <div className="canvas-wrapper" onClick={onCanvas}>
      <canvas ref={canvasRef}></canvas>
    </div>
  );
};

export default ExampleExhibit;
