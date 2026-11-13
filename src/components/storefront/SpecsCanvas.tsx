"use client";

import { useEffect, useRef } from "react";

interface SpecsCanvasProps {
  theme: "light" | "dark";
  hovered: boolean;
}

const POUCH_RINGS = [
  { y: -1.0, r: 0.42 },
  { y: -0.78, r: 0.62 },
  { y: -0.5, r: 0.72 },
  { y: -0.22, r: 0.74 },
  { y: 0.05, r: 0.73 },
  { y: 0.34, r: 0.69 },
  { y: 0.62, r: 0.62 },
  { y: 0.84, r: 0.54 },
  { y: 1.0, r: 0.50 },
];

export default function SpecsCanvas({ theme, hovered }: SpecsCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const themeRef = useRef(theme);
  const hoveredRef = useRef(hovered);

  useEffect(() => {
    themeRef.current = theme;
  }, [theme]);

  useEffect(() => {
    hoveredRef.current = hovered;
  }, [hovered]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let angle = 0.4;
    let rafId = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.floor(canvas.clientWidth * dpr);
      const h = Math.floor(canvas.clientHeight * dpr);
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
    };

    const draw = () => {
      resize();
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      const cx = w * 0.5;
      const cy = h * 0.5;
      const scale = Math.min(w, h) * 0.34;
      const tilt = 0.34;

      const isDark = themeRef.current === "dark";
      ctx.strokeStyle = isDark ? "rgba(239, 243, 241, 0.28)" : "rgba(17, 22, 20, 0.24)";
      ctx.lineWidth = Math.max(1, (window.devicePixelRatio || 1) * 1.1);

      // 9 horizontal elliptical rings
      for (const ring of POUCH_RINGS) {
        ctx.beginPath();
        const ry = ring.r * scale * Math.sin(tilt);
        const rx = ring.r * scale;
        const py = cy + ring.y * scale * Math.cos(tilt);
        ctx.ellipse(cx, py, rx, Math.max(2, ry), 0, 0, Math.PI * 2);
        ctx.stroke();
      }

      // 12 vertical meridians
      const meridians = 12;
      for (let m = 0; m < meridians; m++) {
        const theta = angle + (m / meridians) * Math.PI * 2;
        const cosT = Math.cos(theta);
        const sinT = Math.sin(theta);

        ctx.beginPath();
        POUCH_RINGS.forEach((ring, idx) => {
          const x = cx + ring.r * scale * cosT;
          const y = cy + ring.y * scale * Math.cos(tilt) + ring.r * scale * sinT * Math.sin(tilt);
          if (idx === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        });
        ctx.stroke();
      }

      if (!reducedMotion) {
        angle += hoveredRef.current ? 0.026 : 0.008;
        rafId = requestAnimationFrame(draw);
      }
    };

    rafId = requestAnimationFrame(draw);
    window.addEventListener("resize", resize);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="w-full h-full pointer-events-none"
    />
  );
}
