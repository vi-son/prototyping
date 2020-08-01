const createContext = require("pex-context");
const createCube = require("primitive-cube");
const createCamera = require("pex-cam/perspective");
const createOrbiter = require("pex-cam/orbiter");
const mat4 = require("pex-math/mat4");
const glsl = require("glslify");

const size = {
  width: document.body.clientWidth,
  height: document.body.clientHeight
};

const ctx = createContext(size);
const cube = createCube();
const camera = createCamera({
  fov: Math.PI / 5,
  aspect: ctx.gl.canvas.width / ctx.gl.canvas.height,
  position: [0, 0, 50],
  target: [0, 0, 0]
});

createOrbiter({ camera: camera, distance: 10 });

const clearCmd = {
  pass: ctx.pass({
    clearColor: [0.9, 0.9, 0.9, 1],
    clearDepth: 1
  })
};

const drawCmd = {
  pass: ctx.pass({
    clearColor: [0.2, 0.2, 0.2, 1],
    clearDepth: 1
  }),
  pipeline: ctx.pipeline({
    depthTest: true,
    vert: glsl.compile(
      require("../glsl/shader-library/webgl/basic/pex.basic.vert.glsl")
    ),
    frag: glsl.compile(
      require("../glsl/shader-library/webgl/basic/pex.basic.frag.glsl")
    )
  }),
  attributes: {
    aPosition: ctx.vertexBuffer(cube.positions),
    aNormal: ctx.vertexBuffer(cube.normals)
  },
  indices: ctx.indexBuffer(cube.cells),
  uniforms: {
    uProjectionMatrix: camera.projectionMatrix,
    uViewMatrix: camera.viewMatrix
  }
};

const corners = [
  [-10, 0, 0],
  [-8, 2, 0],
  [8, -2, 0],
  [10, 0, 0]
];

const vertexShader = glsl.compile(
  require("../glsl/shader-library/webgl/basic/pex.lines.vert.glsl")
);
const fragmentShader = glsl.compile(
  require("../glsl/shader-library/webgl/basic/pex.white.frag.glsl")
);

const drawPoints = {
  pipeline: ctx.pipeline({
    vert: vertexShader,
    frag: fragmentShader,
    depthTest: true,
    primitive: ctx.Primitive.Points
  }),
  attributes: {
    aPosition: ctx.vertexBuffer(corners)
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
    aPosition: ctx.vertexBuffer(corners)
  },
  indices: ctx.indexBuffer([0, 1, 2, 3]),
  uniforms: {
    uProjectionMatrix: camera.projectionMatrix,
    uViewMatrix: camera.viewMatrix,
    uModelMatrix: mat4.create(),
    uColor: [0, 0, 0, 1]
  }
};

ctx.frame(() => {
  ctx.submit(clearCmd);
  // ctx.submit(drawCmd);
  ctx.submit(drawLineStrip);
  ctx.submit(drawPoints);
});
