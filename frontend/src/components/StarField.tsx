import { useEffect, useRef } from "react";

interface Star {
  x: number;
  y: number;
  ox: number; // original x
  oy: number; // original y
  vx: number; // drift velocity x
  vy: number; // drift velocity y
  radius: number;
  alpha: number;
  twinkleSpeed: number;
  twinkleOffset: number;
}

const STAR_COUNT = 260;
const ATTRACT_RADIUS = 120; // px — how close cursor needs to be
const ATTRACT_STRENGTH = 0.035; // how hard stars pull toward cursor
const RETURN_STRENGTH = 0.015; // how fast they drift back to origin
const DRIFT_SPEED = 0.15; // base slow drift speed

export default function StarField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let mouse = { x: -9999, y: -9999 };
    let stars: Star[] = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initStars();
    };

    const initStars = () => {
      stars = Array.from({ length: STAR_COUNT }, () => {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        return {
          x,
          y,
          ox: x,
          oy: y,
          vx: (Math.random() - 0.5) * DRIFT_SPEED,
          vy: (Math.random() - 0.5) * DRIFT_SPEED,
          radius: Math.random() * 1.4 + 0.3,
          alpha: Math.random() * 0.5 + 0.3,
          twinkleSpeed: Math.random() * 0.02 + 0.005,
          twinkleOffset: Math.random() * Math.PI * 2,
        };
      });
    };

    const draw = (time: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const star of stars) {
        const dx = mouse.x - star.x;
        const dy = mouse.y - star.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        // Cursor attraction
        if (dist < ATTRACT_RADIUS) {
          const force = (1 - dist / ATTRACT_RADIUS) * ATTRACT_STRENGTH;
          star.vx += dx * force;
          star.vy += dy * force;
        }

        // Spring back to origin
        star.vx += (star.ox - star.x) * RETURN_STRENGTH;
        star.vy += (star.oy - star.y) * RETURN_STRENGTH;

        // Dampen velocity
        star.vx *= 0.9;
        star.vy *= 0.9;

        // Move
        star.x += star.vx;
        star.y += star.vy;

        // Slowly drift origin position so stars wander over time
        star.ox += (Math.random() - 0.5) * 0.08;
        star.oy += (Math.random() - 0.5) * 0.08;

        // Wrap origin at edges
        if (star.ox < 0) star.ox = canvas.width;
        if (star.ox > canvas.width) star.ox = 0;
        if (star.oy < 0) star.oy = canvas.height;
        if (star.oy > canvas.height) star.oy = 0;

        // Twinkle
        const twinkle = star.alpha + Math.sin(time * star.twinkleSpeed + star.twinkleOffset) * 0.2;
        const glow = dist < ATTRACT_RADIUS ? 1 - dist / ATTRACT_RADIUS : 0;

        // Draw star glow when near cursor
        if (glow > 0) {
          const glowGrad = ctx.createRadialGradient(star.x, star.y, 0, star.x, star.y, star.radius * 6 * glow);
          glowGrad.addColorStop(0, `rgba(160, 140, 255, ${glow * 0.5})`);
          glowGrad.addColorStop(1, "rgba(0,0,0,0)");
          ctx.beginPath();
          ctx.arc(star.x, star.y, star.radius * 6 * glow, 0, Math.PI * 2);
          ctx.fillStyle = glowGrad;
          ctx.fill();
        }

        // Draw star dot
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius + glow * 1.2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(220, 215, 255, ${Math.min(1, twinkle + glow * 0.4)})`;
        ctx.fill();
      }

      animId = requestAnimationFrame(draw);
    };

    const onMouseMove = (e: MouseEvent) => {
      mouse = { x: e.clientX, y: e.clientY };
    };
    const onMouseLeave = () => {
      mouse = { x: -9999, y: -9999 };
    };

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseleave", onMouseLeave);
    animId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseleave", onMouseLeave);
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
