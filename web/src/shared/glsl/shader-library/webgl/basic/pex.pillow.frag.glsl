precision highp float;

uniform vec2 uResolution;

#pragma glslify: pillow = require(../../pillow)

void main() {
  vec2 uv = gl_FragCoord.xy / uResolution;
  vec4 color_a = vec4(0.77, 0.75, 0.74, 1.0);
  vec4 color_b = vec4(1.0, 1.0, 1.0, 1.0);
  vec4 color = pillow(color_a, color_b, vec2(6), uv);
  gl_FragColor = color;
}
