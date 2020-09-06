precision mediump float;

varying vec3 vNormal;

void main () {
  gl_FragColor.rgb = vNormal;
  gl_FragColor.a = 1.0;
}
