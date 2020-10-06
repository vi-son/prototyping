import React, { useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import createLineGeometry from "./createLineGeometry.js";
import quaternionFromNormal from "three-quaternion-from-normal";

import "../sass/laufende-muster.sass";

const App = () => {
  const canvasWrapperRef = useRef();
  const canvasRef = useRef();

  const calculateFrame = (start, ctrlA, ctrlB, end, t) => {
    // find next sample along curve
    const nextT = t + 0.01;

    // sample the curve in two places
    const current = sample(start, ctrlA, ctrlB, end, t);
    const next = sample(start, ctrlA, ctrlB, end, nextT);

    // compute the TBN matrix
    const T = next.sub(current).normalize();
    const B = T.clone()
      .cross(next.clone().add(current))
      .normalize();
    const N = B.clone().cross(T);

    return [N, B, T];
  };

  const sample = (start, ctrlA, ctrlB, end, t) => {
    return start
      .clone()
      .multiplyScalar(Math.pow(1.0 - t, 3.0))
      .add(ctrlA.clone().multiplyScalar(3.0 * Math.pow(1.0 - t, 2.0) * t))
      .add(ctrlB.clone().multiplyScalar(3.0 * (1.0 - t) * Math.pow(t, 2.0)))
      .add(end.clone().multiplyScalar(Math.pow(t, 3.0)));
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
    renderer.autoClear = false;

    // Camera
    const camera = new THREE.PerspectiveCamera(
      60,
      size.width / size.height,
      0.1,
      100
    );
    camera.position.set(0, 3, -2);

    // Start- & end point
    const startPoint = new THREE.Vector3(-1, 0, 0);
    const endPoint = new THREE.Vector3(+1, 0, 0);
    // Geometry
    const handlesGroup = new THREE.Group();
    var geometry = new THREE.SphereGeometry(0.02, 32, 32);
    var material = new THREE.MeshBasicMaterial({ color: 0x000000 });
    var handleMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });
    var startSphere = new THREE.Mesh(geometry, material);
    startSphere.position.copy(startPoint);
    var endSphere = new THREE.Mesh(geometry, material);
    endSphere.position.copy(endPoint);
    scene.add(startSphere);
    scene.add(endSphere);

    const handleGeometry = new THREE.BoxGeometry(0.025, 0.025, 0.025);
    var startHandle = new THREE.Mesh(handleGeometry, handleMaterial);
    var startHandlePosition = startPoint.clone().divideScalar(2.0);
    startHandlePosition.y = 1.0;
    startHandlePosition.z = 0.75;
    startHandle.position.copy(startHandlePosition);
    var endHandle = new THREE.Mesh(handleGeometry, handleMaterial.clone());
    var endHandlePosition = endPoint.clone().divideScalar(2.0);
    endHandlePosition.y = 1.0;
    endHandlePosition.z = -0.5;
    endHandle.position.copy(endHandlePosition);
    handlesGroup.add(startHandle);
    handlesGroup.add(endHandle);
    scene.add(handlesGroup);
    var handleLinesMaterial = new THREE.LineBasicMaterial({ color: 0x000000 });
    var points = [];
    points.push(startPoint);
    points.push(startHandlePosition);
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
    points.push(endHandlePosition);
    var endHandleLinesGeometry = new THREE.BufferGeometry().setFromPoints(
      points
    );
    var endHandleLine = new THREE.Line(
      endHandleLinesGeometry,
      handleLinesMaterial
    );
    scene.add(endHandleLine);

    // Controls
    var controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(0, 0.5, 0);
    controls.update();
    controls.enableZoom = true;
    controls.dampingFactor = 0.9;

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
          value: [startPoint, startHandlePosition, endHandlePosition, endPoint]
        }
      }
    });
    const tubeGeometry = createLineGeometry(numSides, subdivisions);
    const instTubeMaterial = tubeMaterial.clone();
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

    // Normals
    var samplePosition = sample(
      startPoint,
      startHandle.position,
      endHandle.position,
      endPoint,
      0.5
    );
    var geometry = new THREE.PlaneBufferGeometry(0.02, 0.5, 1);
    const planeMaterial = new THREE.ShaderMaterial({
      vertexShader: require("../glsl/basic.vert.glsl"),
      fragmentShader: require("../glsl/plane.frag.glsl"),
      uniforms: {
        uColor: { value: new THREE.Vector3(1, 0, 0) }
      },
      side: THREE.DoubleSide,
      transparent: true,
      depthWrite: false
    });
    const planeGroup = new THREE.Group();
    scene.add(planeGroup);
    planeGroup.position.copy(samplePosition);
    var plane = new THREE.Mesh(geometry, planeMaterial);
    planeGroup.add(plane);
    plane.position.set(0, 0.25, 0);

    // Raycasting
    var raycaster = new THREE.Raycaster();
    var mouse = new THREE.Vector2();
    let selectedHandle = null;

    let mouseDown = false;
    function onMouseDown(e) {
      mouseDown = true;

      raycaster.setFromCamera(mouse, camera);
      var intersects = raycaster.intersectObjects(handlesGroup.children);
      if (intersects.length > 0) {
        controls.enabled = false;
        controls.saveState();
      }
    }

    function onMouseUp(e) {
      if (!controls.enabled) {
        controls.reset();
        controls.enabled = true;
      }
      mouseDown = false;
    }

    // Arrow Helper
    var dir = new THREE.Vector3(0, 1, 0);
    //normalize the direction vector (convert to vector of length 1)
    dir.normalize();
    var origin = new THREE.Vector3(0, 0, 0);
    var length = 1;
    var hex = 0xff00ff;
    // var arrowHelper = new THREE.ArrowHelper(dir, origin, length, hex);
    // scene.add(arrowHelper);
    // Arrow Helper

    function onMouseMove(e) {
      mouse.x = ((e.clientX - size.x) / size.width) * 2 - 1;
      mouse.y = -((e.clientY - size.y) / size.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      var intersects = raycaster.intersectObjects(handlesGroup.children);
      if (intersects.length > 0 && mouseDown) {
        intersects[0].object.material.color.set(0xff0000);

        instTubeMaterial.uniforms.uPoints.value = [
          startPoint,
          startHandle.position,
          endHandle.position,
          endPoint
        ];
      } else {
        handlesGroup.children.forEach(h => {
          h.material.color.set(0x000000);
        });
      }
    }

    let angle = 0;
    function updatePlane(t) {
      // Update normals
      const samplePosition = sample(
        startPoint,
        startHandle.position,
        endHandle.position,
        endPoint,
        t
      );
      const [normal, bitangent, tangent] = calculateFrame(
        startPoint,
        startHandle.position,
        endHandle.position,
        endPoint,
        t
      );
      // arrowHelper.position.copy(samplePosition);
      // arrowHelper.setDirection(normal);
      planeGroup.position.copy(samplePosition);
      const quaternionN = quaternionFromNormal(normal);
      const quaternionT = quaternionFromNormal(tangent);
      planeGroup.quaternion.copy(quaternionN);
      // planeGroup.rotateOnAxis(bitangent, 90.0);
      angle += 0.001;
    }

    // Render loop
    const clock = new THREE.Clock();
    function render() {
      requestAnimationFrame(render);

      updatePlane((clock.getElapsedTime() / 10.0) % 1.0);

      renderer.clear();
      renderer.render(backgroundScene, backgroundCamera);
      renderer.render(scene, camera);

      startHandleLine.geometry.attributes.position.array[3] =
        startHandle.position.x;
      startHandleLine.geometry.attributes.position.array[4] =
        startHandle.position.y;
      startHandleLine.geometry.attributes.position.array[5] =
        startHandle.position.z;
      startHandleLine.geometry.attributes.position.needsUpdate = true;

      endHandleLine.geometry.attributes.position.array[3] =
        endHandle.position.x;
      endHandleLine.geometry.attributes.position.array[4] =
        endHandle.position.y;
      endHandleLine.geometry.attributes.position.array[5] =
        endHandle.position.z;
      endHandleLine.geometry.attributes.position.needsUpdate = true;
      // Calculate audio things
      if (sound.isPlaying) {
        // console.log(audioListener._clock.elapasedTime / audioListener._clock);
        // currentTime = listener.context.currentTime - audioStartTime;
        // t = currentTime;
      }
    }
    render();

    window.addEventListener("pointermove", onMouseMove, false);
    window.addEventListener("pointerdown", onMouseDown, false);
    window.addEventListener("pointerup", onMouseUp, false);
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
