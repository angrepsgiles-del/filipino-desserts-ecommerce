"use client";

import { useEffect, useRef } from "react";
import styles from "./gawaKamayHeadline.module.css";

const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));

export default function GawaKamayHeadline() {
  const ref = useRef<HTMLDivElement | null>(null);

  const cursor = useRef({ x: 0.5, y: 0.5, inside: false });
  const blob = useRef({ x: 0.5, y: 0.5, vx: 0, vy: 0 });
  const last = useRef<number>(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const tick = (t: number) => {
      const dt = clamp((t - (last.current || t)) / 1000, 0, 0.05);
      last.current = t;

      const c = cursor.current;
      const b = blob.current;

      // evade cursor
      let tx = 0.5;
      let ty = 0.5;

      if (c.inside) {
        const dx = b.x - c.x;
        const dy = b.y - c.y;
        const dist = Math.max(Math.sqrt(dx * dx + dy * dy), 0.0001);

        // higher = more "runs away"
        const repel = 0.55;
        tx = clamp(b.x + (dx / dist) * repel, 0.05, 0.95);
        ty = clamp(b.y + (dy / dist) * repel, 0.10, 0.90);
      }

      // slime physics
      const k = 9.0;
      const damp = 0.86;

      const ax = (tx - b.x) * k;
      const ay = (ty - b.y) * k;

      b.vx = b.vx * damp + ax * dt;
      b.vy = b.vy * damp + ay * dt;

      b.x += b.vx * dt;
      b.y += b.vy * dt;

      b.x = clamp(b.x, 0.05, 0.95);
      b.y = clamp(b.y, 0.10, 0.90);

      const v = Math.sqrt(b.vx * b.vx + b.vy * b.vy);

      // drive YOUR css vars
      el.style.setProperty("--mx", `${b.x * 100}%`);
      el.style.setProperty("--my", `${b.y * 100}%`);
      el.style.setProperty("--v", `${v}`);
      el.style.setProperty("--t", `${t * 0.001}`);

      requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
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
      <svg className={styles.svgDefs} aria-hidden="true">
        <filter id="goo">
          <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
          <feColorMatrix
            in="blur"
            mode="matrix"
            values="
              1 0 0 0 0
              0 1 0 0 0
              0 0 1 0 0
              0 0 0 22 -9"
            result="goo"
          />
          <feComposite in="SourceGraphic" in2="goo" operator="atop" />
        </filter>

        <filter id="wobble">
          <feTurbulence type="fractalNoise" baseFrequency="0.012" numOctaves="2" seed="9">
            <animate attributeName="baseFrequency" dur="5s" values="0.01;0.015;0.012" repeatCount="indefinite" />
          </feTurbulence>
          <feDisplacementMap scale="28" />
        </filter>
      </svg>

      <div className={styles.slime} aria-hidden="true">
        <div className={styles.blobs}>
          <div className={styles.b1} />
          <div className={styles.b2} />
          <div className={styles.b3} />
        </div>
      </div>

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
