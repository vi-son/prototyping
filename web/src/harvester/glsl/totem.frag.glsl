varying vec3 vert_pos;
varying vec2 vert_uv;

uniform lowp int u_color_point_count;
uniform vec2 u_resolution;
uniform float u_color_points[3];
uniform vec3 u_colors[3];

void main() {
  vec2 uv = vert_uv;

  vec3 color = vec3(0);

  for (lowp int i = 0; i < u_color_point_count; i++) {
    vec3 c = u_colors[i];
    float d = distance(u_color_points[i], uv.y);
    color += c * d;
  }

  gl_FragColor = vec4(color, 1.0);
}
