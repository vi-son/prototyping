import React, { useEffect, useRef } from "react";
import { useHistory } from "react-router-dom";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

import Layout from "./Layout.js";

function Finish() {
  const history = useHistory();
  const canvasRef = useRef();

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
    var light = new THREE.HemisphereLight(0xffffff, 0x666666, 3.75);
    light.position.set(0, 10, 0);
    scene.add(light);
    // Geometry
    var sphereGeometry = new THREE.SphereBufferGeometry(1, 32, 12);
    var sphereMaterial = new THREE.MeshPhongMaterial({
      color: 0x0332b3,
      flatShading: true
    });
    sphereMaterial.depthTest = false;
    var sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    sphere.position.set(0, 0, 0);
    scene.add(sphere);

    // Camera
    const camera = new THREE.OrthographicCamera(
      size.width / -300,
      size.width / +300,
      size.width / +300,
      size.width / -300,
      0.1,
      100
    );
    var controls = new OrbitControls(camera, renderer.domElement);
    camera.position.set(1, 3, 5);
    controls.update();
    controls.enableZoom = false;
    controls.enableDamping = true;
    controls.dampingFactor = 0.2;

    var render = function() {
      requestAnimationFrame(render);
      renderer.render(scene, camera);
    };
    render();
  }, []);

  return (
    <Layout>
      <main className="center-column">
        <span className="emoji">&#127881;</span>
        <h2>Congratulations</h2>
        <h4>You finished 10 mappings</h4>
        <h4 className="token-heading">
          We've built a token from your mappings (TODO)':
        </h4>
        <div className="finish-canvas-wrapper">
          <canvas ref={canvasRef} width="500" height="500"></canvas>
        </div>
        <button
          className="flow-button"
          onClick={() => history.push("/harvester.html/flow")}
        >
          Another round
        </button>
      </main>
    </Layout>
  );
}

export default Finish;
