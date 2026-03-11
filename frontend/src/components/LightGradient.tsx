import { useEffect, useRef } from "react";
import { gradientState } from "../shared/gradientState";

export default function LightGradient() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const draw = () => {
      const h = gradientState.hue;
      const w = canvas.width;
      const ht = canvas.height;

      // Build a large mesh from 4 corner radial gradients, each offset by
      // a fraction of the current hue so colours fan across the spectrum.
      ctx.clearRect(0, 0, w, ht);

      const blobs: { cx: number; cy: number; hueOffset: number }[] = [
        { cx: 0,      cy: 0,      hueOffset: 0   },
        { cx: w,      cy: 0,      hueOffset: 72  },
        { cx: 0,      cy: ht,     hueOffset: 144 },
        { cx: w,      cy: ht,     hueOffset: 216 },
        { cx: w / 2,  cy: ht / 2, hueOffset: 288 },
      ];

      const radius = Math.sqrt(w * w + ht * ht) * 1.1; // larger radius = softer blend

      for (const b of blobs) {
        const bh = (h + b.hueOffset) % 360;
        const grad = ctx.createRadialGradient(b.cx, b.cy, 0, b.cx, b.cy, radius);
        grad.addColorStop(0,    `hsla(${bh}, 70%, 82%, 0.42)`);
        grad.addColorStop(0.45, `hsla(${bh}, 60%, 88%, 0.18)`);
        grad.addColorStop(1,    `hsla(${bh}, 55%, 95%, 0)`);

        ctx.beginPath();
        ctx.rect(0, 0, w, ht);
        ctx.fillStyle = grad;
        ctx.fill();
      }

      animId = requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener("resize", resize);
    animId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      aria-hidden="true"
    />
  );
}

