const createContext = require("pex-context");
const createCube = require("primitive-cube");
const createQuad = require("primitive-quad");
const createCamera = require("pex-cam/perspective");
const createOrbiter = require("pex-cam/orbiter");
const mat4 = require("pex-math/mat4");
const glsl = require("glslify");
const bezier = require("./bezier.js");

const size = {
  width: document.body.clientWidth,
  height: document.body.clientHeight
};

const ctx = createContext(size);
const cube = createCube();
const quad = createQuad();
const camera = createCamera({
  fov: Math.PI / 10,
  aspect: ctx.gl.canvas.width / ctx.gl.canvas.height,
  position: [0, 0, 50],
  target: [0, 0, 0],
  near: 0.01,
  far: 100.0
});

createOrbiter({ camera: camera, distance: 10 });

const drawCmd = {
  pass: ctx.pass({
    clearColor: [0, 0, 0, 1]
  }),
  pipeline: ctx.pipeline({
    vert: glsl.compile(
      require("../glsl/shader-library/webgl/basic/pex.basic.vert.glsl")
    ),
    frag: glsl.compile(
      require("../glsl/shader-library/webgl/basic/pex.pillow.frag.glsl")
    )
  }),
  attributes: {
    aPosition: ctx.vertexBuffer(quad.positions),
    aNormal: ctx.vertexBuffer(quad.normals)
  },
  indices: ctx.indexBuffer(quad.cells),
  uniforms: {
    uColor: [0, 1, 0, 1],
    uResolution: [size.width, size.height]
  }
};

const curve = bezier([-5, 0, -5], [-3, 2, -4], [3, -10, 4], [5, 0, 10]);

const vertexShader = glsl.compile(
  require("../glsl/shader-library/webgl/basic/pex.lines.vert.glsl")
);
const fragmentShader = glsl.compile(
  require("../glsl/shader-library/webgl/basic/pex.fillcolor.frag.glsl")
);

const drawPoints = {
  pipeline: ctx.pipeline({
    vert: vertexShader,
    frag: fragmentShader,
    depthTest: true,
    primitive: ctx.Primitive.Points
  }),
  attributes: {
    aPosition: ctx.vertexBuffer(curve.points)
  },
  indices: ctx.indexBuffer([0, 1, 2, 3]),
  uniforms: {
    uProjectionMatrix: camera.projectionMatrix,
    uViewMatrix: camera.viewMatrix,
    uModelMatrix: mat4.create(),
    uColor: [1, 0, 0, 1]
  }
};

const drawLineStrip = {
  pipeline: ctx.pipeline({
    vert: vertexShader,
    frag: fragmentShader,
    depthTest: true,
    primitive: ctx.Primitive.LineStrip
  }),
  attributes: {
    aPosition: ctx.vertexBuffer(curve.curve)
  },
  indices: ctx.indexBuffer(
    new Array(curve.curve.length).fill(0).map((_, i) => i)
  ),
  uniforms: {
    uProjectionMatrix: camera.projectionMatrix,
    uViewMatrix: camera.viewMatrix,
    uModelMatrix: mat4.create(),
    uColor: [0, 0, 0, 1]
  }
};

ctx.frame(() => {
  ctx.submit(drawCmd);
  ctx.submit(drawLineStrip);
  ctx.submit(drawPoints);
});
