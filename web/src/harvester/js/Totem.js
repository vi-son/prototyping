import React, { useRef, useEffect } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import glsl from "glslify";

import "../sass/Totem.sass";

export default ({ mapping }) => {
  const canvasRef = useRef();
  const canvasWrapperRef = useRef();

  const colorMappings = mapping
    .filter(m => m.type === "color")
    .map((m, i) => {
      return {
        index: i,
        color: m.mapping
      };
    });

  const shapeMappings = mapping
    .filter(m => m.type === "shape")
    .map((m, i) => {
      return {
        index: i,
        shape: m.mapping
      };
    });

  const feelingMappings = mapping
    .filter(m => m.type === "feeling")
    .map((m, i) => {
      return {
        index: i,
        feeling: m.mapping
      };
    });

  console.log(feelingMappings);
  console.log(colorMappings);
  console.log(shapeMappings);

  useEffect(() => {
    // Size
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
    var light = new THREE.HemisphereLight(0xffffff, 0x666666, 3.75);
    light.position.set(0, 10, 0);
    scene.add(light);

    // Mappings
    if (colorMappings.length > 0) {
      const colorMaterial = new THREE.ShaderMaterial({
        uniforms: {
          u_color_point_count: { value: colorMappings.length - 1 },
          u_resolution: { value: new THREE.Vector2(size.width, size.height) },
          u_color_points: {
            value: colorMappings.map(m => m.index / colorMappings.length)
          },
          u_colors: {
            value: colorMappings.map(
              m =>
                new THREE.Vector3(
                  m.color[0] / 255,
                  m.color[1] / 255,
                  m.color[2] / 255
                )
            )
          }
        },
        vertexShader: glsl.compile(require("../glsl/totem.vert.glsl")),
        fragmentShader: glsl.compile(require("../glsl/totem.frag.glsl"))
      });
      var geometry = new THREE.PlaneGeometry(5, 5, 32);
      var plane = new THREE.Mesh(geometry, colorMaterial);
      scene.add(plane);
    }

    // Bezier
    var curve = new THREE.QuadraticBezierCurve3(
      new THREE.Vector3(0, 0, 0),
      ...feelingMappings.map(m => m.feeling.point),
      new THREE.Vector3(0, 1, 0)
    );
    var points = curve.getPoints(50);
    var curveGeometry = new THREE.BufferGeometry().setFromPoints(points);
    var curveMaterial = new THREE.LineBasicMaterial({ color: 0x000000 });
    var curveObject = new THREE.Line(curveGeometry, curveMaterial);
    curveObject.scale.set(3, 3, 3);
    scene.add(curveObject);

    // Geometry
    // var sphereGeometry = new THREE.SphereBufferGeometry(1, 32, 12);
    // var sphereMaterial = new THREE.MeshPhongMaterial({
    //   color: 0x0332b3,
    //   flatShading: true
    // });
    // sphereMaterial.depthTest = false;
    // var sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    // sphere.position.set(0, 0, 0);
    // scene.add(sphere);

    // Camera
    // const camera = new THREE.OrthographicCamera(
    //   size.width / -100,
    //   size.width / +100,
    //   size.width / +100,
    //   size.width / -100,
    //   0.1,
    //   100
    // );
    var camera = new THREE.PerspectiveCamera(
      45,
      size.width / size.height,
      1,
      1000
    );
    var controls = new OrbitControls(camera, renderer.domElement);
    camera.position.set(5, 5, 5);
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
    <div className="totem">
      <div className="canvas-wrapper" ref={canvasWrapperRef}>
        <canvas ref={canvasRef}></canvas>
      </div>
    </div>
  );
};
