// node_modules imports
import React, { useRef, useEffect } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { PositionalAudioHelper } from "three/examples/jsm/helpers/PositionalAudioHelper.js";
// Local imports
import createLineGeometry from "../utils/createLineGeometry.js";
// Style imports
import "../../sass/Totem.sass";

const remap = (v, a, b, c, d) => {
  const newval = ((v - a) / (b - a)) * (d - c) + c;
  return newval;
};

export default ({ mapping }) => {
  console.group("Totem");
  console.log("Mapping:", mapping);
  console.groupEnd();

  const canvasRef = useRef();
  const canvasWrapperRef = useRef();

  const colorMappings = mapping
    .filter(m => m.type === "Farbe")
    .map((m, i) => {
      return {
        index: i,
        color: m.mapping,
        sample: m.sample
      };
    });

  const shapeMappings = mapping
    .filter(m => m.type === "Form")
    .map((m, i) => {
      return {
        index: i,
        shape: m.mapping
      };
    });

  const feelingMappings = mapping
    .filter(m => m.type === "Gefühl")
    .map((m, i) => {
      return {
        index: i,
        feeling: m.mapping,
        sample: m.sample
      };
    });

  console.log(`# Color Mappings: ${colorMappings.length}`);
  console.log(`# Shape Mappings: ${shapeMappings.length}`);
  console.log(`# Feeling Mappings: ${feelingMappings.length}`);

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
    const analysers = [];
    const listener = new THREE.AudioListener();
    camera.add(listener);
    const samplesFolder = `/audio/harvester/`;

    // Light
    var light = new THREE.HemisphereLight(0xffffff, 0x666666, 3.75);
    light.position.set(0, 10, 0);
    scene.add(light);

    // Tube material
    const colors = colorMappings.map(
      cm =>
        new THREE.Vector3(
          cm.color[0] / 255.0,
          cm.color[1] / 255.0,
          cm.color[2] / 255.0
        )
    );
    const colorToUniformsArray = new Array(mapping.length)
      .fill(0)
      .map((_, i) => {
        if (colors[i]) {
          return colors[i];
        } else {
          return new THREE.Vector3();
        }
      });
    const numSides = 4;
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
        uThickness: { type: "f", value: 0.02 },
        uTime: { type: "f", value: 2.5 },
        uColors: {
          type: "a",
          value: colorToUniformsArray
        },
        uAnalysers: {
          type: "a",
          value: new Array(mapping.length).fill(0)
        },
        uRadialSegments: { type: "f", value: numSides },
        uStopCount: { type: "i", value: colorMappings.length },
        uPoints: {
          type: "a",
          value: [
            new THREE.Vector3(0, -3, 0),
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(0, 3, 0)
          ]
        }
      }
    });

    // Audio
    const audioLoader = new THREE.AudioLoader();
    // Show audio sources
    const audioVisualizerCubes = [];
    mapping.map((c, i) => {
      const sampleFilepath = `${samplesFolder}${c.sample}`;
      console.log(sampleFilepath);
      const positionalAudio = new THREE.PositionalAudio(listener);
      const analyser = new THREE.AudioAnalyser(positionalAudio, 32);
      audioLoader.load(sampleFilepath, function(buffer) {
        positionalAudio.setBuffer(buffer);
        positionalAudio.setLoop(true);
        positionalAudio.setVolume(1.0);
        positionalAudio.play();
        sounds.push(positionalAudio);
        analyser.smoothingTimeConstant = 0.9;
        analysers.push(analyser);
      });
      var geometry = new THREE.BoxBufferGeometry(0.5, 0.5, 0.5);
      var material = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        opacity: 0,
        transparent: true
      });
      var cube = new THREE.Mesh(geometry, material);
      cube.position.set(0, i / (colorMappings.length - 1) - 0.5, 0);
      audioVisualizerCubes.push(cube);
      var helper = new PositionalAudioHelper(positionalAudio);
      positionalAudio.add(helper);
      cube.add(positionalAudio);
      // scene.add(cube);
    });

    //// FEELING MAPPING TOTEM
    const feelingCurves = [];
    const feelingsGroup = new THREE.Group();
    const feelingSpheres = [];
    var bezierMaterial = new THREE.LineBasicMaterial({ color: 0x2b13ff });
    var feelingMaterial = new THREE.MeshLambertMaterial({
      color: 0x2b13ff,
      side: THREE.DoubleSide,
      flatShading: true
    });
    feelingMappings.map((f, i) => {
      console.log("Feeling", f.feeling.point);
      const point = f.feeling.point;
      const position = new THREE.Vector3(point.x, point.y, point.z);
      const sphereGeometry = new THREE.SphereBufferGeometry(0.26, 32, 32);
      const feelingSphere = new THREE.Mesh(sphereGeometry, feelingMaterial);
      feelingSphere.scale.set(0.15, 0.15, 0.15);
      feelingSphere.position.copy(position);
      scene.add(feelingSphere);
      feelingSpheres.push(feelingSphere);
      var curve = new THREE.QuadraticBezierCurve3(
        new THREE.Vector3(0, -1, 0),
        position,
        new THREE.Vector3(0, 1, 0)
      );
      feelingCurves.push(curve);
      var points = curve.getPoints(40);
      var bezierGeometry = new THREE.BufferGeometry().setFromPoints(points);
      // Create the final object to add to the scene
      var bezierObject = new THREE.Line(bezierGeometry, bezierMaterial);
      feelingsGroup.add(bezierObject);
    });
    scene.add(feelingsGroup);

    //// SHAPE MAPPING TOTEM
    var shapeMaterial = new THREE.MeshLambertMaterial({ color: 0xcfddec });
    const shapeGroup = new THREE.Group();
    const radius = 0.5;
    shapeMappings.map((s, i) => {
      console.log(s);
      const yStep = i / shapeMappings.length - 0.5;
      const position = new THREE.Vector3(
        radius * Math.sin(Math.random() * 3.1415 * 2.0),
        yStep,
        radius * Math.cos(Math.random() * 3.1415 * 2.0)
      );
      switch (s.shape) {
        case "Zylinder":
          var cylinderGeometry = new THREE.CylinderGeometry(0.2, 0.2, 0.5, 32);
          var cylinder = new THREE.Mesh(
            cylinderGeometry,
            shapeMaterial.clone()
          );
          cylinder.scale.set(0.2, 0.2, 0.2);
          cylinder.position.copy(position);
          cylinder.lookAt(new THREE.Vector3(0, 0, 0));
          cylinder.rotateOnAxis(new THREE.Vector3(1, 0, 0), Math.PI / 2.0);
          shapeGroup.add(cylinder);
          break;

        case "Würfel":
          const cubeGeometry = new THREE.BoxGeometry(0.4, 0.4, 0.4);
          const cube = new THREE.Mesh(cubeGeometry, shapeMaterial.clone());
          cube.scale.set(0.2, 0.2, 0.2);
          cube.position.copy(position);
          cube.lookAt(new THREE.Vector3(0, 0, 0));
          cube.rotateOnAxis(new THREE.Vector3(1, 0, 0), Math.PI / 2.0);
          shapeGroup.add(cube);
          break;

        case "Kugel":
          const sphereGeometry = new THREE.SphereBufferGeometry(0.26, 32, 32);
          const sphere = new THREE.Mesh(sphereGeometry, shapeMaterial.clone());
          sphere.scale.set(0.15, 0.15, 0.15);
          sphere.position.copy(position);
          shapeGroup.add(sphere);
          break;

        case "Kegel":
          const coneGeometry = new THREE.ConeGeometry(0.2, 0.5, 30);
          const cone = new THREE.Mesh(coneGeometry, shapeMaterial.clone());
          cone.scale.set(0.2, 0.2, 0.2);
          cone.position.copy(position);
          cone.lookAt(new THREE.Vector3(0, 0, 0));
          cone.rotateOnAxis(new THREE.Vector3(1, 0, 0), Math.PI / 2.0);
          shapeGroup.add(cone);
          break;

        case "Ikosaeder":
          var icosahedronGeometry = new THREE.IcosahedronGeometry(0.25, 0);
          var icosahedron = new THREE.Mesh(
            icosahedronGeometry,
            shapeMaterial.clone()
          );
          icosahedron.scale.set(0.2, 0.2, 0.2);
          icosahedron.position.copy(position);
          icosahedron.lookAt(new THREE.Vector3(0, 0, 0));
          icosahedron.rotateOnAxis(new THREE.Vector3(0, 1, 0), Math.PI / 2.0);
          shapeGroup.add(icosahedron);
          break;

        case "Oktaeder":
          var octahedronGeometry = new THREE.OctahedronGeometry(0.25, 0);
          var octahedron = new THREE.Mesh(
            octahedronGeometry,
            shapeMaterial.clone()
          );
          octahedron.position.copy(position);
          octahedron.scale.set(0.2, 0.2, 0.2);
          octahedron.lookAt(new THREE.Vector3(0, 0, 0));
          octahedron.rotateOnAxis(new THREE.Vector3(0, 1, 0), Math.PI / 2.0);
          shapeGroup.add(octahedron);
          break;
      }
      // Line
      const points = [];
      const dirVector = new THREE.Vector3().sub(position);
      dirVector.normalize();
      points.push(dirVector.multiplyScalar(-0.15));
      points.push(position.clone().multiplyScalar(0.9));
      const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
      const lineMaterial = new THREE.LineBasicMaterial({ color: 0xffffff });
      const line = new THREE.Line(lineGeometry, lineMaterial);
      scene.add(line);
    });
    scene.add(shapeGroup);

    //// COLOR MAPPING TOTEM
    colorMappings.map((c, i) => {});

    const tubeGeometry = createLineGeometry(numSides, subdivisions);
    const instTubeMaterial = tubeMaterial.clone();
    instTubeMaterial.uniforms.uPoints.value = [
      new THREE.Vector3(0, -0.5, 0),
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(0, +0.5, 0)
    ];
    const tubeMesh = new THREE.Mesh(tubeGeometry, instTubeMaterial);
    tubeMesh.frustumCulled = false;
    scene.add(tubeMesh);

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

    function onWindowResize() {
      let newSize = canvasWrapperRef.current.getBoundingClientRect();
      camera.aspect = newSize.width / newSize.height;
      camera.updateProjectionMatrix();
      renderer.setSize(newSize.width, newSize.height);
    }
    const resizeHandler = window.addEventListener(
      "resize",
      onWindowResize,
      false
    );

    // Render loop
    let frameCount = 0;
    let $dt = 0;
    var render = function() {
      requestAnimationFrame(render);
      time = clock.getElapsedTime();
      $dt = clock.getDelta();

      renderer.clear();
      renderer.render(backgroundPlane, backgroundCamera);
      renderer.render(scene, camera);

      // Analyzers
      let analyzerValues = analysers.map((analyser, i) => {
        var data = analyser.getAverageFrequency();
        const val = remap(data, 0.0, 127.0, 0.1, 0.5);
        const valNorm = remap(data, 0.0, 127.0, 0.0, 1.0);
        return valNorm;
      });
      if (analyzerValues.length > 0) {
        tubeMesh.material.uniforms.uAnalysers.value = analyzerValues;
      }
      shapeGroup.children.forEach((obj, i) => {
        if (analysers[i]) {
          var data = analysers[i].getAverageFrequency();
          const val = remap(data, 0.0, 127.0, 0.1, 0.5);
          obj.scale.set(val, val, val);
          obj.material.color = shapeMaterial.color
            .clone()
            .multiplyScalar(val * 1.0);
        }
      });
      feelingsGroup.children.forEach((curveObj, i) => {
        if (analysers[i]) {
          var data = analysers[i].getAverageFrequency();
          const val = remap(data, 0.0, 127.0, 0.1, 0.5);
          var curve = feelingCurves[i];
          var newCenter = curve.getPointAt(0.5).multiplyScalar(val * 10);
          var newCurve = new THREE.QuadraticBezierCurve3(
            curve.getPointAt(0.3),
            newCenter,
            curve.getPointAt(0.7)
          );
          feelingSpheres[i].position.copy(newCenter);
          // Update vertices
          var points = newCurve.getPoints(40);
          curveObj.geometry = new THREE.BufferGeometry().setFromPoints(points);
          curveObj.geometry.verticesNeedUpdate = true;
          curveObj.geometry.attributes.position.needsUpdate = true;
        }
      });
      tubeMesh.material.uniforms.uTime.value = time;
      frameCount++;
    };
    render();

    return () => {
      sounds.forEach(s => {
        console.log(`Stopping ${s}`);
        s.stop();
        window.removeEventListener("resize", resizeHandler);
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
