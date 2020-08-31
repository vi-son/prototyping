import React, { useState, useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import glsl from "glslify";

import "../../sass/components/ColorInput.sass";

export default ({ onChange }) => {
  const canvasRef = useRef();
  const [hue, setHue] = useState(128);
  const [saturation, setSaturation] = useState(60);
  const [brightness, setBrightness] = useState(97);
  const [r, setR] = useState(0);
  const [g, setG] = useState(0);
  const [b, setB] = useState(0);

  const reactOnChange = () => {
    // onChange(`hsl(${hue}, ${saturation}%, ${brightness}%)`);
  };

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
    const material = new THREE.ShaderMaterial({
      uniforms: {},
      vertexShader: glsl.compile(
        require("../../glsl/harvester/colorcube.vert.glsl")
      ),
      fragmentShader: glsl.compile(
        require("../../glsl/harvester/colorcube.frag.glsl")
      )
    });

    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

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
    // var camera = new THREE.PerspectiveCamera(
    //   45,
    //   size.width / size.height,
    //   1,
    //   1000
    // );
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
      raycaster.setFromCamera(mousePosition, camera);
      hit = raycaster.intersectObject(cube);
      if (hit.length > 0) {
        sphere.position.set(hit[0].point.x, hit[0].point.y, hit[0].point.z);
        const red = hit[0].point.x + 0.5;
        const green = hit[0].point.y + 0.5;
        const blue = hit[0].point.z + 0.5;
        setR(Math.round(red * 255));
        setG(Math.round(green * 255));
        setB(Math.round(blue * 255));
        onChange(`rgb(${red * 255}, ${green * 255}, ${blue * 255})`);
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
      <div className="canvas-wrapper">
        <canvas width="600" height="600" ref={canvasRef}></canvas>
      </div>
    </div>
  );
};
