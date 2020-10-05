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
    const camera = new THREE.PerspectiveCamera(
      60,
      size.width / size.height,
      0.1,
      100
    );
    camera.position.set(0, 0, -5);

    // Controls
    var controls = new OrbitControls(camera, renderer.domElement);
    controls.update();
    controls.enableZoom = true;
    controls.enableDamping = true;
    controls.dampingFactor = 0.9;

    // Start- & end point
    const startPoint = new THREE.Vector3(-1, 0, 0);
    const endPoint = new THREE.Vector3(+1, 0, 0);
    // Geometry
    const handlesGroup = new THREE.Group();
    var geometry = new THREE.SphereGeometry(0.02, 32, 32);
    var material = new THREE.MeshBasicMaterial({ color: 0x000000 });
    var handleMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
    var startSphere = new THREE.Mesh(geometry, material);
    startSphere.position.copy(startPoint);
    var endSphere = new THREE.Mesh(geometry, material);
    endSphere.position.copy(endPoint);
    scene.add(startSphere);
    scene.add(endSphere);

    const handleGeometry = new THREE.BoxGeometry(0.1, 0.1, 0.1);

    var startHandle = new THREE.Mesh(handleGeometry, handleMaterial);
    startHandle.position.copy(startPoint.clone().divideScalar(2.0));
    var endHandle = new THREE.Mesh(handleGeometry, handleMaterial.clone());
    endHandle.position.copy(endPoint.clone().divideScalar(2.0));
    handlesGroup.add(startHandle);
    handlesGroup.add(endHandle);
    scene.add(handlesGroup);
    var handleLinesMaterial = new THREE.LineBasicMaterial({ color: 0x000000 });
    var points = [];
    points.push(startPoint);
    points.push(startHandle.position);
    var startHandleLinesGeometry = new THREE.BufferGeometry().setFromPoints(
      points
    );
    var startHandleLine = new THREE.Line(
      startHandleLinesGeometry,
      handleLinesMaterial
    );
    scene.add(startHandleLine);
    points = [];
    points.push(endPoint);
    points.push(endHandle.position);
    var endHandleLinesGeometry = new THREE.BufferGeometry().setFromPoints(
      points
    );
    var endHandleLine = new THREE.Line(
      endHandleLinesGeometry,
      handleLinesMaterial
    );
    scene.add(endHandleLine);

    // Background
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
      startPoint,
      new THREE.Vector3(0, 1, 0),
      endPoint
    ];
    const straightLineTubeMaterial = tubeMaterial.clone();
    const tubeMesh = new THREE.Mesh(tubeGeometry, instTubeMaterial);
    tubeMesh.frustumCulled = false;
    scene.add(tubeMesh);

    // Audio
    var audioListener = new THREE.AudioListener();
    camera.add(audioListener);
    // create a global audio source
    var sound = new THREE.Audio(audioListener);
    // load a sound and set it as the Audio object's buffer
    var audioLoader = new THREE.AudioLoader();
    audioLoader.load(
      "/audio/patterns.202006.mp3",
      function(buffer) {
        console.log(audioListener);
        sound.setBuffer(buffer);
        sound.setLoop(false);
        sound.setVolume(1.0);
        // sound.play();
      },
      function(xhr) {
        console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
      }
    );
    // Audio analyze
    var analyser = new THREE.AudioAnalyser(sound, 32);
    // get the average frequency of the sound
    var data = analyser.getAverageFrequency();

    // Raycasting
    var raycaster = new THREE.Raycaster();
    var mouse = new THREE.Vector2();

    function onMouseMove(e) {
      // calculate mouse position in normalized device coordinates
      // (-1 to +1) for both components
      mouse.x = ((e.clientX - size.x) / size.width) * 2 - 1;
      mouse.y = -((e.clientY - size.y) / size.height) * 2 + 1;

      var intersects = raycaster.intersectObjects(handlesGroup.children);
      if (intersects.length > 0) {
        intersects[0].object.material.color.set(0xff0000);
      } else {
        handlesGroup.children.forEach(o => {
          o.material.color.set(0xffffff);
        });
      }
    }

    // Render loop
    function render() {
      requestAnimationFrame(render);

      // update the picking ray with the camera and mouse position
      raycaster.setFromCamera(mouse, camera);

      renderer.clear();
      renderer.render(backgroundScene, backgroundCamera);
      renderer.render(scene, camera);
      // Calculate audio things
      if (sound.isPlaying) {
        // console.log(audioListener._clock.elapasedTime / audioListener._clock);
        // currentTime = listener.context.currentTime - audioStartTime;
        // t = currentTime;
      }
    }
    render();

    window.addEventListener("mousemove", onMouseMove, false);
  }, []);

  return (
    <>
      <div className="canvas-wrapper" ref={canvasWrapperRef}>
        <canvas ref={canvasRef}></canvas>
      </div>
    </>
  );
};

const mount = document.querySelector("#mount");
ReactDOM.render(<App />, mount);
