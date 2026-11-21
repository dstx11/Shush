// Adapted from the Silk fold field and Light Rays phase functions in React Bits.
// Both materials use one pass. See /licenses/react-bits.txt.
const header = `precision mediump float;
uniform vec2 resolution;
uniform float time;
`;

export const silk = header + `
void main() {
  vec2 uv = gl_FragCoord.xy / resolution;
  vec2 tex = vec2(uv.x * 1.24 + 0.2 * uv.y, uv.y * 0.8 - 0.16 * uv.x);
  tex.y += 0.03 * sin(8.0 * tex.x - time);
  float fold = 0.5 + 0.5 * sin(5.0 * (tex.x + tex.y +
    cos(3.0 * tex.x + 5.0 * tex.y) + 0.02 * time) +
    0.28 * sin(20.0 * (tex.x + tex.y - 0.1 * time)));
  vec3 cloth = mix(vec3(0.048, 0.029, 0.069), vec3(0.24, 0.15, 0.30), fold * fold);
  cloth += vec3(0.16, 0.12, 0.18) * pow(fold, 14.0);
  gl_FragColor = vec4(cloth, 1.0);
}`;

export const rays = header + `
void main() {
  vec2 uv = gl_FragCoord.xy / resolution;
  vec2 delta = vec2((uv.x - 0.15) * resolution.x / resolution.y, 1.16 - uv.y);
  float angle = dot(normalize(delta), normalize(vec2(0.48, 1.0)));
  float phaseA = angle * 36.2214 + time * 1.5;
  float phaseB = -angle * 21.11349 + time * 1.5;
  float phaseC = angle * 22.3991 + time * 1.1;
  float phaseD = -angle * 18.0234 + time * 1.1;
  float band = 0.54 + 0.16 * sin(phaseA) + 0.18 * cos(phaseB)
                    + 0.12 * sin(phaseC) + 0.12 * cos(phaseD);
  float energy = smoothstep(0.45, 0.91, band) * pow(max(angle, 0.0), 7.0)
                 * exp(-0.9 * length(delta));
  float alpha = energy * 0.72;
  gl_FragColor = vec4(vec3(0.84, 0.72, 0.96) * alpha, alpha);
}`;
