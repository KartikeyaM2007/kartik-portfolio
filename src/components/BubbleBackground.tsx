"use client";

import React, { useEffect, useRef } from "react";

class Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
  size: number;

  constructor(x: number, y: number, color: string) {
    this.x = x;
    this.y = y;
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 2 + 1;
    this.vx = Math.cos(angle) * speed;
    this.vy = Math.sin(angle) * speed;
    this.life = 0;
    this.maxLife = Math.random() * 30 + 20;
    this.color = color;
    this.size = Math.random() * 3 + 1;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.life++;
  }

  draw(ctx: CanvasRenderingContext2D) {
    const alpha = 1 - this.life / this.maxLife;
    ctx.save();
    ctx.globalAlpha = Math.max(0, alpha);
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

class Bubble {
  x: number;
  y: number;
  vx: number;
  vy: number;
  baseRadius: number;
  radius: number;
  colorStr: string;
  gradColor1: string;
  gradColor2: string;
  wobbleX: number = Math.random() * Math.PI * 2;
  wobbleY: number = Math.random() * Math.PI * 2;
  wobbleSpeedX: number = Math.random() * 0.02 + 0.01;
  wobbleSpeedY: number = Math.random() * 0.02 + 0.01;
  isPopping: boolean = false;
  popProgress: number = 0;
  baseAlpha: number;

  constructor(canvasWidth: number, canvasHeight: number) {
    this.baseRadius = Math.random() * 40 + 10; // small to large
    this.radius = this.baseRadius;
    this.x = Math.random() * canvasWidth;
    this.y = Math.random() * canvasHeight;
    this.vx = (Math.random() - 0.5) * 0.5;
    this.vy = (Math.random() - 0.5) * 0.5 - 0.2; // slight upward drift
    this.baseAlpha = Math.random() * 0.4 + 0.1;

    const colors = [
      { r: 168, g: 85, b: 247 }, // purple
      { r: 59, g: 130, b: 246 }, // blue
      { r: 34, g: 211, b: 238 }  // cyan
    ];
    const c = colors[Math.floor(Math.random() * colors.length)];
    this.colorStr = `${c.r}, ${c.g}, ${c.b}`;
    this.gradColor1 = `rgba(${this.colorStr}, 0.8)`;
    this.gradColor2 = `rgba(${this.colorStr}, 0.1)`;
  }

  update(canvasWidth: number, canvasHeight: number, mouseX: number, mouseY: number) {
    if (this.isPopping) {
      this.popProgress += 0.05;
      this.radius = this.baseRadius * (1 - this.popProgress);
      if (this.popProgress >= 1) return; // dead
    } else {
      // Wobble
      this.wobbleX += this.wobbleSpeedX;
      this.wobbleY += this.wobbleSpeedY;

      let targetVx = this.vx + Math.sin(this.wobbleX) * 0.1;
      let targetVy = this.vy + Math.cos(this.wobbleY) * 0.1;

      // Mouse repel
      let dx = this.x - mouseX;
      let dy = this.y - mouseY;
      let dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 150) {
        let force = (150 - dist) / 150;
        targetVx += (dx / dist) * force * 2;
        targetVy += (dy / dist) * force * 2;
      }

      this.x += targetVx;
      this.y += targetVy;

      // Wrap around screen
      if (this.x < -this.radius * 2) this.x = canvasWidth + this.radius;
      if (this.x > canvasWidth + this.radius * 2) this.x = -this.radius;
      if (this.y < -this.radius * 2) this.y = canvasHeight + this.radius;
      if (this.y > canvasHeight + this.radius * 2) this.y = -this.radius;
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    if (this.popProgress >= 1) return;

    ctx.save();
    ctx.globalAlpha = this.isPopping ? this.baseAlpha * (1 - this.popProgress) : this.baseAlpha;

    // Gradient glass effect
    const grad = ctx.createRadialGradient(
      this.x - this.radius * 0.3,
      this.y - this.radius * 0.3,
      this.radius * 0.1,
      this.x,
      this.y,
      this.radius
    );
    grad.addColorStop(0, this.gradColor1);
    grad.addColorStop(1, this.gradColor2);

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();

    // Subtle edge highlight (glass border)
    ctx.strokeStyle = `rgba(255, 255, 255, ${this.baseAlpha + 0.1})`;
    ctx.lineWidth = 0.5;
    ctx.stroke();

    ctx.restore();
  }
}

export default function BubbleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // To avoid unneeded React renders, we capture mouse locally in a ref
  const mouseRef = useRef({ x: -1000, y: -1000 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let animationFrameId: number;
    let bubbles: Bubble[] = [];
    let particles: Particle[] = [];
    let currentW = 0;
    let currentH = 0;

    const handleResize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;

      currentW = parent.clientWidth;
      currentH = parent.clientHeight;
      
      const dpr = window.devicePixelRatio || 1;
      canvas.width = currentW * dpr;
      canvas.height = currentH * dpr;
      ctx.scale(dpr, dpr);
      canvas.style.width = `${currentW}px`;
      canvas.style.height = `${currentH}px`;

      // Re-init bubbles: adaptive density based on local container
      const numBubbles = Math.min(Math.floor((currentW * currentH) / 25000), 50);
      bubbles = Array.from({ length: numBubbles }, () => new Bubble(currentW, currentH));
    };

    const resizeObserver = new ResizeObserver(handleResize);
    if (canvas.parentElement) {
      resizeObserver.observe(canvas.parentElement);
    }
    handleResize(); // Initialize sizes

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = { 
        x: e.clientX - rect.left, 
        y: e.clientY - rect.top 
      };
    };

    const handleClick = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;
      
      for (let b of bubbles) {
        if (b.isPopping) continue;
        let dx = b.x - mx;
        let dy = b.y - my;
        let dist = Math.sqrt(dx * dx + dy * dy);
        if (dist <= b.radius) {
          b.isPopping = true; // Trigger popping animation
          // Spawn particle pop burst
          for (let i = 0; i < 8; i++) {
            particles.push(new Particle(b.x, b.y, `rgba(${b.colorStr}, 1)`));
          }
          // Schedule bubble respawn off-screen
          setTimeout(() => {
            const newB = new Bubble(currentW, currentH);
            newB.x = Math.random() < 0.5 ? -newB.radius : currentW + newB.radius;
            const idx = bubbles.indexOf(b);
            if (idx > -1) bubbles[idx] = newB;
          }, 500);

          break; // Stop popping after one bubble
        }
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("click", handleClick);

    const render = () => {
      // Clear with transparent rect to allow page background color to show
      ctx.clearRect(0, 0, currentW, currentH);

      // Draw cursor glow
      if (mouseRef.current.x > -100) {
        ctx.save();
        const grad = ctx.createRadialGradient(
          mouseRef.current.x, mouseRef.current.y, 0,
          mouseRef.current.x, mouseRef.current.y, 250
        );
        // Soft white/cyan glow behind bubbles
        grad.addColorStop(0, "rgba(255, 255, 255, 0.03)");
        grad.addColorStop(1, "rgba(255, 255, 255, 0)");
        ctx.fillStyle = grad;
        // Optimization: only fill rect within cursor bounds
        ctx.fillRect(0, 0, currentW, currentH);
        ctx.restore();
      }

      // Update & Draw Bubbles
      for (let b of bubbles) {
        b.update(currentW, currentH, mouseRef.current.x, mouseRef.current.y);
        b.draw(ctx);
      }

      // Update & Draw Particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.update();
        p.draw(ctx);
        if (p.life >= p.maxLife) {
          particles.splice(i, 1);
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (canvas.parentElement) {
        resizeObserver.unobserve(canvas.parentElement);
      }
      resizeObserver.disconnect();
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("click", handleClick);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none mix-blend-screen"
      style={{ opacity: 0.8, zIndex: 0 }}
    />
  );
}
