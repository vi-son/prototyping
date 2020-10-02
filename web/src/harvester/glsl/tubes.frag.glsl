#pragma glslify: pillow = require("../../shared/glsl/shader-library/pillow")

uniform vec2 uResolution;

varying vec3 vViewPosition;

void main() {
  float d = vViewPosition.x;
  gl_FragColor = vec4(vec3(d), 1.0);
}
