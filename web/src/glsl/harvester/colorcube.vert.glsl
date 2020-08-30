varying vec3 vert_pos;

void main() {
  vert_pos = (modelMatrix * vec4(position, 1.0)).xyz + 0.5;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
