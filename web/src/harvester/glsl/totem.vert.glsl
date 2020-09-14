varying vec3 vert_pos;
varying vec2 vert_uv;

void main() {
  vert_pos = (modelMatrix * vec4(position, 1.0)).xyz + 0.5;
  vert_uv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
