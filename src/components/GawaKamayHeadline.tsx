"use client";

import { useEffect, useRef } from "react";
import styles from "./gawaKamayHeadline.module.css";

const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));

export default function GawaKamayHeadline() {
  const ref = useRef<HTMLDivElement | null>(null);

  const cursor = useRef({ x: 0.5, y: 0.5, inside: false });
  const liquidTarget = useRef({ x: 0.5, y: 0.5, vx: 0, vy: 0 }); // Represents the center of the liquid effect
  const last = useRef<number>(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let animationFrameId: number;

    const tick = (t: number) => {
      const dt = clamp((t - (last.current || t)) / 1000, 0, 0.05);
      last.current = t;

      const c = cursor.current;
      const lt = liquidTarget.current;

      // Target point for the liquid, defaults to center
      let tx = 0.5;
      let ty = 0.5;

      if (c.inside) {
        // Calculate vector from cursor to liquid target
        const dx = lt.x - c.x;
        const dy = lt.y - c.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        // Repel the liquid target from the cursor
        // The further the cursor, the stronger the repulsion, up to a limit
        const repelStrength = 0.8; // How strongly it repels
        const minRepelDist = 0.1; // Distance below which repulsion becomes very strong
        const effectiveDist = Math.max(dist, minRepelDist);

        tx = clamp(lt.x + (dx / effectiveDist) * repelStrength, 0.05, 0.95);
        ty = clamp(lt.y + (dy / effectiveDist) * repelStrength, 0.05, 0.95);

      } else {
        // Relax to center when cursor leaves
        tx = 0.5;
        ty = 0.5;
      }

      // Spring physics for viscous movement
      const springK = 8.0; // Spring constant
      const dampingFactor = 0.7; // Damping to simulate viscosity

      const ax = (tx - lt.x) * springK;
      const ay = (ty - lt.y) * springK;

      lt.vx = (lt.vx + ax * dt) * dampingFactor;
      lt.vy = (lt.vy + ay * dt) * dampingFactor;

      lt.x += lt.vx * dt;
      lt.y += lt.vy * dt;

      // Clamp liquid position to prevent it from going too far out
      lt.x = clamp(lt.x, -0.2, 1.2); // Allow some spill, but not excessive
      lt.y = clamp(lt.y, -0.2, 1.2);

      const v = Math.sqrt(lt.vx * lt.vx + lt.vy * lt.vy); // Velocity magnitude

      // Set CSS variables (0-100% for mx/my, 0-1 for v)
      el.style.setProperty("--mx", `${lt.x * 100}%`);
      el.style.setProperty("--my", `${lt.y * 100}%`);
      el.style.setProperty("--v", `${clamp(v * 0.5, 0, 1)}`); // Scale velocity for --v range

      animationFrameId = requestAnimationFrame(tick);
    };

    animationFrameId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const onMove = (x: number, y: number) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    cursor.current = {
      x: clamp((x - r.left) / r.width, 0, 1),
      y: clamp((y - r.top) / r.height, 0, 1),
      inside: true,
    };
  };

  return (
    <div
      ref={ref}
      className={styles.frame}
      onMouseMove={(e) => onMove(e.clientX, e.clientY)}
      onMouseLeave={() => (cursor.current.inside = false)}
      onTouchMove={(e) => {
        const t = e.touches[0];
        if (t) onMove(t.clientX, t.clientY);
      }}
      onTouchEnd={() => (cursor.current.inside = false)}
    >
      {/* Liquid effect layer */}
      <div className={styles.liquidEffect}></div>

      {/* Existing ::before and ::after elements are handled by CSS module */}

      <div className={styles.inner}>
        <div className="text-center my-8">
          <h1 className="text-5xl font-extrabold text-black dark:text-white leading-tight">
            GawaKamay
          </h1>
          <p className="text-xl text-zinc-800 dark:text-zinc-200 mt-2">
            Home-Baked Filipino Desserts. Slow. Soft. Dangerous.
          </p>
        </div>
      </div>
    </div>
  );
}
