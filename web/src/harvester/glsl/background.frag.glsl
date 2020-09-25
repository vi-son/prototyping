#pragma glslify: pillow = require(../../shared/glsl/shader-library/pillow)

uniform vec2 uResolution;

void main() {
  vec2 uv = gl_FragCoord.xy / uResolution;
  vec3 color = vec3(0.0);

  vec4 color_a = vec4(22.0 / 255.0, 18.0 / 255.0, 60.0 / 255.0, 1.0);
  vec4 color_b = vec4(57.0 / 255.0, 53.0 / 255.0, 90.0 / 255.0, 1.0);

  vec2 gamma = vec2(6.0);
  
  color = pillow(color_a, color_b, gamma, uv).rgb;

  gl_FragColor = vec4(color, 1.0);
}
