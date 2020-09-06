import React, { useRef, useState, useEffect } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

export default ({}) => {
  const canvasRef = useRef();

  useEffect(() => {
    // onChange(`hsl(${hue}, ${saturation}%, ${brightness}%)`);

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
    const material = new THREE.MeshBasicMaterial({ color: 0x000000 });
    const cube = new THREE.Mesh(geometry, material);
    // scene.add(cube);

    var sphereGeometry = new THREE.SphereBufferGeometry(0.05, 32, 32);
    var sphereMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });
    sphereMaterial.depthTest = false;
    var sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    sphere.position.set(1.5, 0, 0);
    scene.add(sphere);

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

    function onMouseMove(e) {
      mousePosition.x = ((e.clientX - size.x) / size.width) * 2 - 1;
      mousePosition.y = -((e.clientY - size.y) / size.height) * 2 + 1;
    }
    canvasRef.current.addEventListener("mousemove", onMouseMove);

    function onUpdate() {
      sphere.position.set(mousePosition.x, mousePosition.y, 0);
      raycaster.setFromCamera(mousePosition, camera);
      hit = raycaster.intersectObject(cube);
      if (hit.length > 0) {
        // sphere.position.set(hit[0].point.x, hit[0].point.y, hit[0].point.z);
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
    <div className="shape-input">
      Shape Input
      <div className="canvas-wrapper">
        <canvas width="600" height="600" ref={canvasRef}></canvas>
      </div>
    </div>
  );
};
