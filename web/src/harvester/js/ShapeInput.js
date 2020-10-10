import React, { useRef, useState, useEffect } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

import "../sass/ShapeInput.sass";

export default ({ onSelect }) => {
  const canvasRef = useRef();
  const [selectedShape, setSelectedShape] = useState("");

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
    renderer.setSize(size.width, size.height);

    // Light
    var light = new THREE.HemisphereLight(0xffffff, 0x666666, 2.75);
    light.position.set(0, 10, 0);
    scene.add(light);
    // Geometry
    var material = new THREE.MeshLambertMaterial({ color: 0x333333 });

    // Cube
    const cubeGeometry = new THREE.BoxGeometry(0.4, 0.4, 0.4);
    const cube = new THREE.Mesh(cubeGeometry, material.clone());
    cube.name = "Cube";
    // Sphere
    const sphereGeometry = new THREE.SphereBufferGeometry(0.26, 32, 32);
    const sphere = new THREE.Mesh(sphereGeometry, material.clone());
    sphere.position.set(-0.75, 0, 0);
    sphere.name = "Sphere";
    // Cone
    const coneGeometry = new THREE.ConeGeometry(0.2, 0.5, 30);
    const cone = new THREE.Mesh(coneGeometry, material.clone());
    cone.position.set(0.75, 0, 0);
    cone.name = "Cone";
    // Cylinder
    var cylinderGeometry = new THREE.CylinderGeometry(0.2, 0.2, 0.5, 32);
    var cylinder = new THREE.Mesh(cylinderGeometry, material.clone());
    cylinder.position.set(-0.75, 0.75, 0);
    cylinder.name = "Cylinder";
    // Icosahedron
    var icosahedronGeometry = new THREE.IcosahedronGeometry(0.25, 0);
    var icosahedron = new THREE.Mesh(icosahedronGeometry, material.clone());
    icosahedron.position.set(0.0, 0.75, 0);
    icosahedron.name = "Icosahedron";
    // Octahedron
    var octahedronGeometry = new THREE.OctahedronGeometry(0.25, 0);
    var octahedron = new THREE.Mesh(octahedronGeometry, material.clone());
    octahedron.position.set(0.75, 0.75, 0);
    octahedron.name = "Octahedron";

    const group = new THREE.Group();
    group.add(sphere);
    group.add(cube);
    group.add(cone);
    group.add(cylinder);
    group.add(icosahedron);
    group.add(octahedron);

    scene.add(group);

    // Camera
    const aspect = size.width / size.height;
    const camera = new THREE.OrthographicCamera(
      size.width / -500,
      size.width / +500,
      size.height / +500,
      size.height / -500,
      0.1,
      100
    );
    var controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(0, 0.33, 0);
    camera.position.set(0, 3, 5);
    controls.enableZoom = false;
    controls.enablePan = false;
    controls.enableRotate = false;
    controls.enableDamping = true;
    controls.dampingFactor = 0.2;
    controls.update();

    var mousePosition = new THREE.Vector2();
    const raycaster = new THREE.Raycaster();
    var hit = [];

    function onMouseMove(e) {
      mousePosition.x = ((e.clientX - size.x) / size.width) * 2 - 1;
      mousePosition.y = -((e.clientY - size.y) / size.height) * 2 + 1;
    }
    canvasRef.current.addEventListener("pointermove", onMouseMove);

    let selectedShape = "";

    function onClick(e) {
      raycaster.setFromCamera(mousePosition, camera);
      hit = raycaster.intersectObjects(group.children);
      if (hit.length > 0) {
        setSelectedShape(hit[0].object.name);
        selectedShape = hit[0].object.name;
        if (onSelect) onSelect(hit[0].object.name);
      }
    }
    canvasRef.current.addEventListener("click", onClick);

    function onUpdate() {
      raycaster.setFromCamera(mousePosition, camera);
      hit = raycaster.intersectObjects(group.children);
      if (hit.length > 0) {
        hit[0].object.material.color.set(0x666666);
        setSelectedShape(hit[0].object.name);
      }
    }

    function onWindowResize() {
      size = canvas.current.getBoundingClientRect();
      camera.updateProjectionMatrix();
      renderer.setSize(size.width, size.height);
    }
    window.addEventListener("resize", onWindowResize, false);

    const clock = new THREE.Clock(true);
    let t;
    var render = function() {
      requestAnimationFrame(render);
      t = clock.getDelta();
      for (var i = 0; i < group.children.length; i++) {
        if (group.children[i].name === selectedShape) {
          group.children[i].material.color.set(0x2b13ff);
          group.children[i].rotation.x += t;
          group.children[i].rotation.y += t;
          group.children[i].rotation.z += t;
          continue;
        }
        group.children[i].material.color.set(0x333333);
      }
      onUpdate();
      renderer.render(scene, camera);
    };
    render();
  }, []);

  return (
    <div className="shape-input">
      <div className="shape-name">
        <h5>Auswahl</h5>
        <h3>{selectedShape}</h3>
      </div>
      <div className="canvas-wrapper">
        <canvas ref={canvasRef}></canvas>
      </div>
    </div>
  );
};
