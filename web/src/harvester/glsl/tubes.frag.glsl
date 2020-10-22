#pragma glslify: pillow = require("../../shared/glsl/shader-library/pillow")

#define PI 3.14159

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

  float stride = 1.0 / 4.0;

  float t1 = 1.0 - smoothstep(0.0, stride, d);
  vec3 color1 = uColors[0];
  color1 *= uAnalysers[0];
  color += color1 * t1;

  float t2 = 1.0 - smoothstep(stride, 2.0 * stride, d) - t1;
  vec3 color2 = uColors[1];
  color2.z = 0.5 + uAnalysers[1];
  color += color2 * t2;

  float t3 = 1.0 - smoothstep(2.0 * stride, 3.0 * stride, d) - t1 - t2;
  vec3 color3 = uColors[2];
  color3 *= uAnalysers[2];
  color += color3 * t3;

  float t4 = 1.0 - smoothstep(3.0 * stride, 4.0 * stride, d) - t1 - t2 - t3;
  vec3 color4 = uColors[3];
  color4 *= uAnalysers[3];
  color += color4 * t4;

  float t5 = 1.0 - smoothstep(4.0 * stride, 5.0 * stride, d) - t1 - t2 - t3 - t4;
  vec3 color5 = uColors[4];
  color5 *= uAnalysers[4];
  color += color5 * t5;

  // vec3 color = mix(uColors[0]* uAnalysers[0], uColors[1]* uAnalysers[1], d);
  gl_FragColor = vec4(color, 1.0);
}
