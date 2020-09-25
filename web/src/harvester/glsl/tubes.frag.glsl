#pragma glslify: pillow = require("../../shared/glsl/shader-library/pillow")

uniform vec2 uResolution;

void main() {
  vec2 uv = gl_FragCoord.xy / uResolution;
  // vec3 color = pillow()

  gl_FragColor = vec4(uv, 0.0, 1.0);
}
