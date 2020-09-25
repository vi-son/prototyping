attribute float position;
attribute float angle;
attribute vec2 uv;

uniform mat4 projectionMatrix;
uniform mat4 modelViewMatrix;
uniform mat3 normalMatrix;

uniform float uThickness;
uniform float uTime;
uniform float index;
uniform float uRadialSegments;
uniform float animateRadius;
uniform float animateStrength;

varying vec2 vUv;
varying vec3 vViewPosition;
varying vec3 vNormal;

#define PI 3.14159265359
#define TWO_PI 6.28318530718

// Angles to spherical coordinates
vec3 spherical (float r, float phi, float theta) {
  return r * vec3(
    cos(phi) * cos(theta),
    cos(phi) * sin(theta),
    sin(phi)
  );
}

// Creates an animated torus knot
vec3 sample (float t) {
  // float beta = t * PI;
  // // float ripple = ease(sin(t * 2.0 * PI + time) * 0.5 + 0.5) * 0.5;
  // float noise = time + index * 8.0;
  // // animate radius on click
  // float radiusAnimation = animateRadius * animateStrength * 0.25;
  // float r = sin(index * 0.75 + beta * 2.0) * (0.75 + radiusAnimation);
  // float theta = 4.0 * beta + index * 0.25;
  // float phi = sin(index * 2.0 + beta * 8.0 + noise);
  // return spherical(r, 0.0, theta);

  float x = t - 0.5;
  float y = sin(t * PI + uTime);
  float z = cos(t * PI + uTime);
  return vec3(x, y, z);
}


void createTube (float t, vec2 volume, out vec3 offset, out vec3 normal) {
  // find next sample along curve
  float nextT = t + (1.0 / lengthSegments);

  // sample the curve in two places
  vec3 current = sample(t);
  vec3 next = sample(nextT);
  
  // compute the TBN matrix
  vec3 T = normalize(next - current);
  vec3 B = normalize(cross(T, next + current));
  vec3 N = -normalize(cross(B, T));

  // // extrude outward to create a tube
  float tubeAngle = angle;
  float circX = cos(tubeAngle);
  float circY = sin(tubeAngle);

  // compute position and normal
  normal.xyz = normalize(B * circX + N * circY);
  offset.xyz = current +
               B * volume.x * circX +
               N * volume.y * circY;
}

void main() {
  // Remap from [-0.5, 0.5] to [0, 1]
  float t = (position * 2.0) * 0.5 + 0.5;
  vec2 volume = vec2(uThickness * (sin(t * PI) + 1.0));

  vec3 transformed;
  vec3 objectNormal;
  createTube(t, volume, transformed, objectNormal);

  vec4 mvPosition = modelViewMatrix * vec4(transformed, 1.0);

  gl_Position = projectionMatrix * mvPosition;
}
