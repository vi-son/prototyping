import React, { useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import createLineGeometry from "./createLineGeometry.js";

import "../sass/laufende-muster.sass";

const App = () => {
  const canvasWrapperRef = useRef();
  const canvasRef = useRef();

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
    renderer.autoClear = false;
    // Camera
    const camera = new THREE.PerspectiveCamera(90, 1.0, 0.1, 100);
    camera.position.set(0, 0, -5);
    // Controls
    var controls = new OrbitControls(camera, renderer.domElement);
    camera.position.set(1, 1, 1);
    controls.update();
    controls.enableZoom = false;
    controls.enableDamping = true;
    controls.dampingFactor = 0.9;
    // Geometry
    var geometry = new THREE.SphereGeometry(0.1, 32, 32);
    var material = new THREE.MeshBasicMaterial({ color: 0xffff00 });
    var sphere = new THREE.Mesh(geometry, material);
    scene.add(sphere);
    var backgroundCamera = new THREE.OrthographicCamera(
      -2 / size.width,
      +2 / size.width,
      +2 / size.width,
      -2 / size.width,
      -1,
      100
    );
    const backgroundScene = new THREE.Scene();
    const backgroundMaterial = new THREE.ShaderMaterial({
      vertexShader: require("../../shared/glsl/background.vert.glsl"),
      fragmentShader: require("../../shared/glsl/background.frag.glsl"),
      uniforms: {
        uResolution: { value: new THREE.Vector2(size.width, size.height) }
      },
      depthWrite: false
    });
    var planeGeometry = new THREE.PlaneGeometry(2, 2);
    var backgroundPlane = new THREE.Mesh(planeGeometry, backgroundMaterial);
    backgroundScene.add(backgroundPlane);

    // Tube/Bezier spline
    const numSides = 8;
    const subdivisions = 50;
    const tubeMaterial = new THREE.RawShaderMaterial({
      vertexShader: require("../glsl/tubes.vert.glsl"),
      fragmentShader: require("../glsl/tubes.frag.glsl"),
      side: THREE.FrontSide,
      extensions: {
        deriviatives: true
      },
      defines: {
        lengthSegments: subdivisions.toFixed(1),
        FLAT_SHADED: false
      },
      uniforms: {
        uResolution: {
          type: "vec2",
          value: new THREE.Vector2(size.width, size.height)
        },
        uThickness: { type: "f", value: 0.005 },
        uTime: { type: "f", value: 2.5 },
        uRadialSegments: { type: "f", value: numSides },
        uPoints: {
          type: "a",
          value: [
            new THREE.Vector3(0, -1, 0),
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(0, 1, 0)
          ]
        }
      }
    });
    const tubeGeometry = createLineGeometry(numSides, subdivisions);
    const instTubeMaterial = tubeMaterial.clone();
    instTubeMaterial.uniforms.uPoints.value = [
      new THREE.Vector3(0, -0.5, 0),
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(0, 0.5, 0)
    ];
    const tubeMesh = new THREE.Mesh(tubeGeometry, instTubeMaterial);
    tubeMesh.frustumCulled = false;
    scene.add(tubeMesh);

    function render() {
      requestAnimationFrame(render);
      renderer.clear();
      renderer.render(backgroundScene, backgroundCamera);
      renderer.render(scene, camera);
    }
    render();
  }, []);

  return (
    <div className="canvas-wrapper" ref={canvasWrapperRef}>
      <h1>laufende muster</h1>
      <canvas ref={canvasRef}></canvas>
    </div>
  );
};

const mount = document.querySelector("#mount");
ReactDOM.render(<App />, mount);
