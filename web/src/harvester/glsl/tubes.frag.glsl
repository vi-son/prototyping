precision highp float;
precision highp int;

#pragma glslify: pillow = require("../../shared/glsl/shader-library/pillow")

#define PI 3.14159

uniform int uStopCount;
uniform vec2 uResolution;
uniform vec3 uColors[5];
uniform float uAnalysers[5];

varying vec3 vViewPosition;

vec3 rgb_2_hsv(in vec3 rgb) {
  vec4 k = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
  vec4 p = mix(vec4(rgb.bg, k.wz),
               vec4(rgb.gb, k.xy),
               step(rgb.b, rgb.g));
  vec4 q = mix(vec4(p.xyw, rgb.r),
               vec4(rgb.r, p.yzw),
               step(p.x, rgb.r));
  float d = q.x - min(q.w, q.y);
  float e = 1.0e-10;
  return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)),
              d / (q.x + e),
              q.x);
}

//  Function from Iñigo Quiles
//  https://www.shadertoy.com/view/MsS3Wc
vec3 hsb_2_rgb( in vec3 c ){
  vec3 rgb = clamp(abs(mod(c.x*6.0+vec3(0.0,4.0,2.0),
                           6.0)-3.0)-1.0,
                   0.0,
                   1.0 );
  rgb = rgb*rgb*(3.0-2.0*rgb);
  return c.z * mix(vec3(1.0), rgb, c.y);
}

void main() {
  float d = vViewPosition.x;
  vec3 color = vec3(0);

  float stepSize = 1.0 / float(uStopCount - 1);
  for (int i = 0; i < 5; i++) {
    if (i == uStopCount) break;
    float t_prev = smoothstep(float(i) * stepSize, float(i + 1) * stepSize, d);
    float t_next = smoothstep(float(i - 1) * stepSize, float(i) * stepSize, d);
    vec3 color_stop = uColors[i] * vec3(t_next - t_prev);
    vec3 color_hsv = color_stop;
    color_stop *= 0.5 + uAnalysers[i];
    color += color_stop;
  }

  gl_FragColor = vec4(color, 1.0);
}
