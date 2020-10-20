// node_modules imports
import React, { useRef, useEffect } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
// Local imports
import createLineGeometry from "../utils/createLineGeometry.js";
// Style imports
import "../../sass/Totem.sass";

export default ({ mapping }) => {
  console.group("Totem");
  console.log("Mapping:", mapping);
  console.groupEnd();

  const canvasRef = useRef();
  const canvasWrapperRef = useRef();

  const audioSamples = mapping.map(e => e.sample);

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
        feeling: m.mapping,
        sample: m.sample
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
    // Camera
    var camera = new THREE.PerspectiveCamera(
      45,
      size.width / size.height,
      0.01,
      1000
    );
    var controls = new OrbitControls(camera, renderer.domElement);
    camera.position.set(1.5, 1.5, 1.5);
    controls.update();
    controls.enableZoom = true;
    controls.enableDamping = true;
    controls.dampingFactor = 0.2;
    // Audio listener
    const sounds = [];
    const listener = new THREE.AudioListener();
    camera.add(listener);
    // Light
    var light = new THREE.HemisphereLight(0xffffff, 0x666666, 3.75);
    light.position.set(0, 10, 0);
    scene.add(light);

    // Mappings
    let colorMaterial;
    if (colorMappings.length > 0) {
      colorMaterial = new THREE.ShaderMaterial({
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
        vertexShader: require("../../glsl/totem.vert.glsl"),
        fragmentShader: require("../../glsl/totem.frag.glsl")
      });
      var geometry = new THREE.PlaneGeometry(5, 5, 32);
      var plane = new THREE.Mesh(geometry, colorMaterial);
      // scene.add(plane);
    }

    // Bezier
    var curve = new THREE.QuadraticBezierCurve3(
      new THREE.Vector3(0, 0, 0),
      ...feelingMappings.map(
        (m, i) =>
          new THREE.Vector3(
            0.1 * Math.sin(m.feeling.point.x * Math.PI * 2.0),
            i / feelingMappings.length,
            0.1 * Math.cos(m.feeling.point.z * Math.PI * 2.0)
          )
      ),
      new THREE.Vector3(0, 1, 0)
    );

    // var points = curve.getPoints(50);
    // var curveGeometry = new THREE.BufferGeometry().setFromPoints(points);
    // var curveMaterial = new THREE.LineBasicMaterial({ color: 0x000000 });
    // var curveObject = new THREE.Line(curveGeometry, curveMaterial);
    // curveObject.position.set(0, -0.5, 0);
    // scene.add(curveObject);

    // Tube material
    const numSides = 8;
    const subdivisions = 50;
    const tubeMaterial = new THREE.RawShaderMaterial({
      vertexShader: require("../../glsl/tubes.vert.glsl"),
      fragmentShader: require("../../glsl/tubes.frag.glsl"),
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

    // Spheres
    const feelingGroup = new THREE.Group();
    feelingMappings.map(m => {
      var sphereGeometry = new THREE.SphereBufferGeometry(0.05, 32, 12);
      var sphereMaterial = new THREE.MeshPhongMaterial({
        color: 0x0332b3,
        flatShading: true
      });
      var sphere = new THREE.Mesh(sphereGeometry, colorMaterial);
      const loc = new THREE.Vector3(
        m.feeling.point.x,
        m.feeling.point.y,
        m.feeling.point.z
      );
      sphere.position.set(
        m.feeling.point.x,
        m.feeling.point.y,
        m.feeling.point.z
      );
      scene.add(sphere);

      const samplePath = `/audio/harvester/${m.sample}`;
      console.log(samplePath);
      const sound = new THREE.PositionalAudio(listener);
      var sphere = new THREE.SphereBufferGeometry();
      var object = new THREE.Mesh(
        sphere,
        new THREE.MeshBasicMaterial(0xff0000)
      );
      var box = new THREE.Box3();
      box.setFromCenterAndSize(loc, new THREE.Vector3(0.1, 0.1, 0.1));
      var helper = new THREE.Box3Helper(box, 0xff0000);
      var group = new THREE.Group();
      group.add(helper);
      group.add(sound);
      // group.position.set(loc);
      scene.add(group);
      // load a sound and set it as the Audio object's buffer
      const audioLoader = new THREE.AudioLoader();
      audioLoader.load(samplePath, function(buffer) {
        sound.setBuffer(buffer);
        sound.setLoop(true);
        sound.setVolume(1.0);
        sound.play();
      });
      sounds.push(sound);

      const tubeGeometry = createLineGeometry(numSides, subdivisions);
      const instTubeMaterial = tubeMaterial.clone();
      instTubeMaterial.uniforms.uPoints.value = [
        new THREE.Vector3(0, -0.5, 0),
        new THREE.Vector3(m.feeling.point.x, 0, m.feeling.point.z),
        loc
      ];
      const tubeMesh = new THREE.Mesh(tubeGeometry, instTubeMaterial);
      tubeMesh.frustumCulled = false;
      feelingGroup.add(tubeMesh);
    });
    scene.add(feelingGroup);

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

    //// TUBES
    // Camera
    // const camera = new THREE.OrthographicCamera(
    //   size.width / -100,
    //   size.width / +100,
    //   size.width / +100,
    //   size.width / -100,
    //   0.1,
    //   100
    // );

    // audioSamples.map(sample => {
    // });

    // Clock + timings
    var clock = new THREE.Clock();
    clock.start();
    let time = 0.0;

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
      vertexShader: require("../../glsl/background.vert.glsl"),
      fragmentShader: require("../../glsl/background.frag.glsl"),
      uniforms: {
        uResolution: { value: new THREE.Vector2(size.width, size.height) }
      },
      depthWrite: false
    });
    var planeGeometry = new THREE.PlaneGeometry(2, 2);
    var backgroundPlane = new THREE.Mesh(planeGeometry, backgroundMaterial);
    backgroundScene.add(backgroundPlane);
    renderer.autoClear = false;

    // Render loop
    var render = function() {
      requestAnimationFrame(render);
      time = clock.getElapsedTime();
      feelingGroup.children.forEach(f => {
        f.material.uniforms.uTime.value = time;
      });
      renderer.clear();
      renderer.render(backgroundPlane, backgroundCamera);
      renderer.render(scene, camera);
    };
    render();

    return () => {
      sounds.forEach(s => {
        console.log(s);
        s.stop();
      });
    };
  }, []);

  return (
    <div className="totem">
      <div className="canvas-wrapper" ref={canvasWrapperRef}>
        <canvas ref={canvasRef}></canvas>
      </div>
    </div>
  );
};
