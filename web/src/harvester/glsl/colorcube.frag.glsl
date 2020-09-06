varying vec3 vert_pos;

void main() {
  gl_FragColor = vec4(vert_pos.x, vert_pos.y, vert_pos.z , 1.0);
}
