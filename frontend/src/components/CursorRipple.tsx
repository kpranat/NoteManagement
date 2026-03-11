import { useEffect, useRef } from "react";
import { gradientState } from "../shared/gradientState";

interface Ripple {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  alpha: number;
  hue: number;
  speed: number;
}

// Hues matching the light gradient palette cycle
const HUE_STOPS = [150, 200, 250, 320, 30, 90, 180, 270];
const GRADIENT_CYCLE_MS = 12000; // must match meshGradient animation duration

export default function CursorRipple() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let mouse = { x: -9999, y: -9999 };
    let ripples: Ripple[] = [];
    let lastSpawn = 0;
    const SPAWN_INTERVAL = 900; // ms between auto-ripples

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    // Get the current hue from the gradient cycle based on elapsed time
    const getCurrentHue = (): number => {
      const t = (Date.now() % GRADIENT_CYCLE_MS) / GRADIENT_CYCLE_MS; // 0→1 over 12s
      const scaled = t * HUE_STOPS.length;
      const idx = Math.floor(scaled) % HUE_STOPS.length;
      const next = (idx + 1) % HUE_STOPS.length;
      const frac = scaled - Math.floor(scaled);
      // Interpolate hue
      const h1 = HUE_STOPS[idx];
      const h2 = HUE_STOPS[next];
      return h1 + (h2 - h1) * frac;
    };

    const spawnRipple = () => {
      if (mouse.x < 0) return;
      ripples.push({
        x: mouse.x,
        y: mouse.y,
        radius: 0,
        maxRadius: 80 + Math.random() * 60,
        alpha: 0.55,
        hue: getCurrentHue(),
        speed: 1.4 + Math.random() * 0.8,
      });
    };

    const draw = (timestamp: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Compute current hue and publish it for LightGradient to consume
      const hue = getCurrentHue();
      gradientState.hue = hue;

      // Auto-spawn ripples at cursor
      if (timestamp - lastSpawn > SPAWN_INTERVAL && mouse.x > 0) {
        spawnRipple();
        lastSpawn = timestamp;
      }

      // Update and draw each ripple
      ripples = ripples.filter((r) => r.alpha > 0.01);

      for (const r of ripples) {
        r.radius += r.speed;
        r.alpha *= 0.960; // Gradual fade

        const progress = r.radius / r.maxRadius;

        ctx.beginPath();
        ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `hsla(${r.hue}, 70%, 60%, ${r.alpha * (1 - progress * 0.6)})`;
        ctx.lineWidth = 2 - progress * 1.2;
        ctx.stroke();

        // Inner soft glow ring
        if (progress < 0.5) {
          ctx.beginPath();
          ctx.arc(r.x, r.y, r.radius * 0.6, 0, Math.PI * 2);
          ctx.strokeStyle = `hsla(${r.hue}, 80%, 70%, ${r.alpha * 0.25})`;
          ctx.lineWidth = 4;
          ctx.stroke();
        }
      }

      // Draw a crisp, always-visible cursor indicator
      if (mouse.x > 0) {
        // Layer 1: soft hue-tinted glow halo (wide, very faint)
        const glow = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 36);
        glow.addColorStop(0, `hsla(${hue}, 80%, 55%, 0.25)`);
        glow.addColorStop(1, `hsla(${hue}, 80%, 55%, 0)`);
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, 36, 0, Math.PI * 2);
        ctx.fillStyle = glow;
        ctx.fill();

        // Layer 2: colored ring (medium, visible)
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, 10, 0, Math.PI * 2);
        ctx.strokeStyle = `hsla(${hue}, 90%, 40%, 0.9)`;
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Layer 3: sharp white core dot — always visible against any bg
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, 4, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255, 255, 255, 0.95)";
        ctx.fill();

        // Layer 4: tiny dark outline on the white dot for contrast on light bg
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, 4, 0, Math.PI * 2);
        ctx.strokeStyle = `hsla(${hue}, 60%, 30%, 0.6)`;
        ctx.lineWidth = 1;
        ctx.stroke();
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
      className="fixed inset-0 pointer-events-none z-[1]"
      aria-hidden="true"
      style={{ cursor: "none" }}
    />
  );
}
