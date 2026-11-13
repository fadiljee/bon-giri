"use client";

import { useEffect, useRef } from "react";

interface HeroCanvasProps {
  theme: "light" | "dark";
}

const VERTEX_SHADER = `#version 300 es
in vec2 a_position;
out vec2 v_uv;
void main() {
  v_uv = a_position * 0.5 + 0.5;
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`;

const FRAGMENT_SHADER = `#version 300 es
precision highp float;
in vec2 v_uv;
out vec4 outColor;

uniform vec2 u_resolution;
uniform float u_time;
uniform vec2 u_pointer;
uniform float u_isDark;

float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));
  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

void main() {
  vec2 aspect = vec2(u_resolution.x / max(u_resolution.y, 1.0), 1.0);
  vec2 p = v_uv * aspect;

  float t = u_time * 0.06;
  float n1 = noise(p * 2.3 + vec2(t, -t * 0.6));
  float n2 = noise(p * 4.7 - vec2(t * 0.4, t * 0.8));
  float elev = n1 * 0.65 + n2 * 0.35;

  float contour = abs(fract(elev * 9.0) - 0.5);
  float line = smoothstep(0.045, 0.008, contour);

  vec2 ptr = u_pointer * aspect;
  float dist = length(p - ptr);
  float glow = exp(-dist * dist * 2.4);

  vec3 bgLight = vec3(0.953, 0.965, 0.957);
  vec3 lineLight = vec3(0.239, 0.341, 0.251);
  vec3 bgDark = vec3(0.047, 0.063, 0.055);
  vec3 lineDark = vec3(0.337, 0.463, 0.353);

  vec3 base = mix(bgLight, bgDark, u_isDark);
  vec3 ink = mix(lineLight, lineDark, u_isDark);

  float lineAlpha = mix(0.09, 0.14, u_isDark) + glow * 0.08;
  vec3 color = mix(base, ink, line * lineAlpha);
  color += ink * glow * mix(0.035, 0.06, u_isDark);

  outColor = vec4(color, 1.0);
}
`;

function compileShader(gl: WebGL2RenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

export default function HeroCanvas({ theme }: HeroCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const themeRef = useRef(theme);

  useEffect(() => {
    themeRef.current = theme;
  }, [theme]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl2", {
      alpha: false,
      antialias: false,
      powerPreference: "low-power",
    });
    if (!gl) return;

    const vs = compileShader(gl, gl.VERTEX_SHADER, VERTEX_SHADER);
    const fs = compileShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
    if (!vs || !fs) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;

    const posBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
      gl.STATIC_DRAW
    );

    const posLoc = gl.getAttribLocation(program, "a_position");
    const uRes = gl.getUniformLocation(program, "u_resolution");
    const uTime = gl.getUniformLocation(program, "u_time");
    const uPointer = gl.getUniformLocation(program, "u_pointer");
    const uIsDark = gl.getUniformLocation(program, "u_isDark");

    const targetPtr = { x: 0.65, y: 0.5 };
    const currentPtr = { x: 0.65, y: 0.5 };

    const handlePointerMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      targetPtr.x = (e.clientX - rect.left) / rect.width;
      targetPtr.y = 1 - (e.clientY - rect.top) / rect.height;
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.floor(canvas.clientWidth * dpr);
      const h = Math.floor(canvas.clientHeight * dpr);
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
      gl.viewport(0, 0, canvas.width, canvas.height);
    };

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", handlePointerMove, { passive: true });

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let rafId = 0;
    let isVisible = true;
    const start = performance.now();

    const draw = (now: number) => {
      resize();
      currentPtr.x += (targetPtr.x - currentPtr.x) * 0.08;
      currentPtr.y += (targetPtr.y - currentPtr.y) * 0.08;

      gl.useProgram(program);
      gl.enableVertexAttribArray(posLoc);
      gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer);
      gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uTime, (now - start) / 1000);
      gl.uniform2f(uPointer, currentPtr.x, currentPtr.y);
      gl.uniform1f(uIsDark, themeRef.current === "dark" ? 1.0 : 0.0);

      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

      if (!reducedMotion && isVisible) {
        rafId = requestAnimationFrame(draw);
      }
    };

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) return;
        isVisible = entry.isIntersecting;
        if (isVisible && !reducedMotion) {
          cancelAnimationFrame(rafId);
          rafId = requestAnimationFrame(draw);
        }
      },
      { threshold: 0.01 }
    );
    observer.observe(canvas);

    rafId = requestAnimationFrame(draw);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", handlePointerMove);
      gl.deleteBuffer(posBuffer);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      gl.deleteProgram(program);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="absolute inset-0 w-full h-full pointer-events-none"
    />
  );
}
