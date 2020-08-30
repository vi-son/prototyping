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

  const reactOnChange = () => {
    onChange(`hsl(${hue}, ${saturation}%, ${brightness}%)`);
  };

  useEffect(() => {
    onChange(`hsl(${hue}, ${saturation}%, ${brightness}%)`);

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
    var geometry = new THREE.BoxGeometry(1, 1, 1);
    var material = new THREE.ShaderMaterial({
      uniforms: {},
      vertexShader: glsl.compile(
        require("../../glsl/harvester/colorcube.vert.glsl")
      ),
      fragmentShader: glsl.compile(
        require("../../glsl/harvester/colorcube.frag.glsl")
      )
    });

    var cube = new THREE.Mesh(geometry, material);
    scene.add(cube);
    // Camera
    const camera = new THREE.OrthographicCamera(-1, +1, +1, -1, 0.1, 100);
    var controls = new OrbitControls(camera, renderer.domElement);
    camera.position.set(1, 1, 1);
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
    <div className="color-input">
      <h4>Color Input</h4>
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
