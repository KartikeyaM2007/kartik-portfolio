"use client";

import { useEffect, useRef } from "react";

class EnergeticParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  baseSize: number;
  baseAlpha: number;
  isForeground: boolean;
  colorStr: string;

  constructor(w: number, h: number) {
    this.x = Math.random() * w;
    this.y = Math.random() * h;
    
    // 30% are foreground particles (faster, bigger, brighter)
    this.isForeground = Math.random() > 0.7;

    const baseSpeed = this.isForeground ? (Math.random() * 0.8 + 0.4) : (Math.random() * 0.3 + 0.1);
    const angle = Math.random() * Math.PI * 2;
    this.vx = Math.cos(angle) * baseSpeed;
    this.vy = Math.sin(angle) * baseSpeed;

    this.baseSize = this.isForeground ? (Math.random() * 2.5 + 1.5) : (Math.random() * 1.5 + 0.5);
    this.baseAlpha = this.isForeground ? (Math.random() * 0.4 + 0.4) : (Math.random() * 0.2 + 0.1);
    
    // Neon purple/blue variance
    this.colorStr = Math.random() > 0.5 ? "168, 85, 247" : "59, 130, 246";
  }

  update(bounds: {w: number, h: number}, mouse: {x: number, y: number}, clickBurst: {x: number, y: number, time: number} | null) {
    let targetVx = this.vx;
    let targetVy = this.vy;

    // Hover attraction/repulsion field
    const dx = this.x - mouse.x;
    const dy = this.y - mouse.y;
    const dist = Math.sqrt(dx*dx + dy*dy);
    
    if (dist < 180) {
      // Repel from cursor dynamically
      const force = (180 - dist) / 180;
      targetVx += (dx / dist) * force * (this.isForeground ? 4 : 1.5);
      targetVy += (dy / dist) * force * (this.isForeground ? 4 : 1.5);
    }

    // Click burst explosion field
    if (clickBurst && (Date.now() - clickBurst.time) < 1000) {
      const bdx = this.x - clickBurst.x;
      const bdy = this.y - clickBurst.y;
      const bdist = Math.sqrt(bdx*bdx + bdy*bdy);
      const intensityScale = 1 - ((Date.now() - clickBurst.time) / 1000); // Fades over 1 sec
      
      if (bdist < 400 * intensityScale) {
        const force = (400 - bdist) / 400;
        targetVx += (bdx / bdist) * force * 20 * intensityScale;
        targetVy += (bdy / bdist) * force * 20 * intensityScale;
      }
    }

    // Add turbulence (noise)
    targetVx += (Math.random() - 0.5) * 0.1;
    targetVy += (Math.random() - 0.5) * 0.1;

    // Dampen back to baseline speeds over time
    const currentSpeed = Math.sqrt(targetVx*targetVx + targetVy*targetVy);
    const maxSpeed = this.isForeground ? 2.5 : 1;
    
    if (currentSpeed > maxSpeed) {
      targetVx *= 0.92;
      targetVy *= 0.92;
    }

    this.x += targetVx;
    this.y += targetVy;

    // Screen wrap seamlessly
    if (this.x < -50) this.x = bounds.w + 50;
    if (this.x > bounds.w + 50) this.x = -50;
    if (this.y < -50) this.y = bounds.h + 50;
    if (this.y > bounds.h + 50) this.y = -50;
    
    // Save state so baseline doesn't drift permanently
    this.vx = targetVx;
    this.vy = targetVy;
  }

  draw(ctx: CanvasRenderingContext2D, mouse: {x:number, y:number}) {
    let alpha = this.baseAlpha;
    const dist = Math.hypot(this.x - mouse.x, this.y - mouse.y);
    if (dist < 200) {
      alpha = Math.min(1, alpha + ((200 - dist)/200) * 0.5); // Brighten heavily near cursor
    }

    ctx.beginPath();
    ctx.arc(this.x, this.y, this.baseSize, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${this.colorStr}, ${alpha})`;
    ctx.fill();

    // Foreground glowing bloom effect
    if (this.isForeground) {
      ctx.shadowBlur = 15;
      ctx.shadowColor = `rgba(${this.colorStr}, ${alpha})`;
    } else {
      ctx.shadowBlur = 0;
    }
  }
}

export default function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;

    let width = window.innerWidth;
    let height = window.innerHeight;

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      const dpr = window.devicePixelRatio || 1;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
    };

    resize();
    window.addEventListener("resize", resize);

    const NUM_PARTICLES = Math.min(Math.floor((width * height) / 10000), 80); // Capped at 80 for O(N^2) line render performance
    const particles = Array.from({ length: NUM_PARTICLES }, () => new EnergeticParticle(width, height));

    let mx = -1000;
    let my = -1000;
    let burstData: {x: number, y: number, time: number} | null = null;

    const mouseMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
    };

    const mouseClick = (e: MouseEvent) => {
      burstData = { x: e.clientX, y: e.clientY, time: Date.now() };
    };

    window.addEventListener("mousemove", mouseMove);
    window.addEventListener("click", mouseClick);

    let animationId: number;

    const loop = () => {
      ctx.clearRect(0, 0, width, height);

      // 1. Advance Physics & Render Points
      for (const p of particles) {
        p.update({w: width, h: height}, {x: mx, y: my}, burstData);
        p.draw(ctx, {x: mx, y: my});
      }

      // 2. Render Networking Lines (O(N^2) collision array)
      ctx.lineWidth = 0.6;
      ctx.shadowBlur = 0; // Disable shadow for lines to save GPU
      const connectionDistance = 120;
      
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx*dx + dy*dy);
          
          if (dist < connectionDistance) {
            const opacity = 1 - (dist / connectionDistance);
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            
            // Mix colors dynamically based on particle distance
            ctx.strokeStyle = `rgba(168, 85, 247, ${opacity * 0.35})`;
            ctx.stroke();
          }
        }
      }

      animationId = requestAnimationFrame(loop);
    };

    loop();

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", mouseMove);
      window.removeEventListener("click", mouseClick);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas 
      className="absolute inset-0 w-full h-full z-0 pointer-events-none mix-blend-screen" 
      ref={canvasRef} 
    />
  );
}