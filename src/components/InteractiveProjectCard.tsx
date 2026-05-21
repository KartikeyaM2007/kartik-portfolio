"use client";

import { motion, useMotionValue, useSpring, useTransform, useMotionTemplate } from "framer-motion";
import { useEffect, useRef, useState, useCallback } from "react";
import { FaGithub, FaArrowRight } from "react-icons/fa";
import { useMagnetic } from "@/app/hooks/useMagnetic";

interface ProjectCardProps {
  title: string;
  desc: string;
  stat: string;
  stack: string[];
  github?: string;
  webCode?: string;
  appCode?: string;
  live?: string;
  app?: string;
  image?: string;
  workflow?: string;
  onViewDetails?: () => void;
}

// ------------------------------------------------------------------
// Internal Magnetic Wrapper for Chips/Links
// ------------------------------------------------------------------
function MagneticElement({ children, strength = 30 }: { children: React.ReactNode, strength?: number }) {
  const { ref, x, y, handlers } = useMagnetic(strength);
  return (
    <motion.div 
      ref={ref} 
      style={{ x, y }} 
      {...handlers} 
      className="relative z-20 inline-block"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {children}
    </motion.div>
  );
}

// ------------------------------------------------------------------
// Main Interactive Card Component
// ------------------------------------------------------------------
export default function InteractiveProjectCard({ title, desc, stat, stack, github, webCode, appCode, live, app, image, workflow, onViewDetails }: ProjectCardProps) {
  const rectRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Raw Normalized Mouse Coordinates [-0.5, 0.5]
  const rawMouseX = useMotionValue(0);
  const rawMouseY = useMotionValue(0);

  // Smooth springs for 3D mechanics
  const springConfig = { damping: 20, stiffness: 100, mass: 0.5 };
  const smoothMouseX = useSpring(rawMouseX, springConfig);
  const smoothMouseY = useSpring(rawMouseY, springConfig);

  // 3D Parallax Tilt Values
  const rotateX = useTransform(smoothMouseY, [-0.5, 0.5], [12, -12]);
  const rotateY = useTransform(smoothMouseX, [-0.5, 0.5], [-12, 12]);

  // Dynamic Lighting Template mapped to raw coordinate edges
  const lightGradient = useMotionTemplate`radial-gradient(circle at ${(useTransform(smoothMouseX, x => (x + 0.5) * 100))}% ${(useTransform(smoothMouseY, y => (y + 0.5) * 100))}%, rgba(168, 85, 247, 0.15) 0%, transparent 70%)`;

  const [mousePosPx, setMousePosPx] = useState({ x: -1000, y: -1000 });
  const [clickShockwave, setClickShockwave] = useState<{ x: number, y: number, time: number } | null>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!rectRef.current) return;
    const rect = rectRef.current.getBoundingClientRect();
    const localX = e.clientX - rect.left;
    const localY = e.clientY - rect.top;
    
    // Set for Canvas (exact px)
    setMousePosPx({ x: localX, y: localY });

    // Set for Framer (normalized)
    const nx = localX / rect.width - 0.5;
    const ny = localY / rect.height - 0.5;
    rawMouseX.set(nx);
    rawMouseY.set(ny);
  };

  const handleMouseLeave = () => {
    rawMouseX.set(0);
    rawMouseY.set(0);
    setMousePosPx({ x: -1000, y: -1000 }); // Push mouse off canvas map
  };

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!rectRef.current) return;
    const rect = rectRef.current.getBoundingClientRect();
    setClickShockwave({ x: e.clientX - rect.left, y: e.clientY - rect.top, time: Date.now() });
  };

  // ------------------------------------------------------------------
  // Independent Canvas Physics System
  // ------------------------------------------------------------------
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !rectRef.current) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    // Fixed sizing tracking
    let width = rectRef.current.clientWidth;
    let height = rectRef.current.clientHeight;
    
    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    class CardParticle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      baseColor: string;
      alpha: number;

      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5 - 0.2;
        this.radius = Math.random() * 2 + 0.5;
        this.alpha = Math.random() * 0.4 + 0.1;
        this.baseColor = Math.random() > 0.5 ? "168, 85, 247" : "59, 130, 246"; // purple / blue
      }

      update(mx: number, my: number, shock: {x:number, y:number, time:number} | null) {
        let tvx = this.vx;
        let tvy = this.vy;

        // Hover Repel
        const dx = this.x - mx;
        const dy = this.y - my;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 100) {
          const force = (100 - dist) / 100;
          tvx += (dx / dist) * force * 1.5;
          tvy += (dy / dist) * force * 1.5;
          this.alpha = Math.min(1, this.alpha + 0.05); // glow up near cursor
        } else {
          this.alpha = Math.max(0.1, this.alpha - 0.01);
        }

        // Click Shockwave Burst
        if (shock) {
          const sdx = this.x - shock.x;
          const sdy = this.y - shock.y;
          const sdist = Math.sqrt(sdx * sdx + sdy * sdy);
          const age = Date.now() - shock.time;
          if (age < 300 && sdist < 150) { // burst radius
            tvx += (sdx / sdist) * 4;
            tvy += (sdy / sdist) * 4;
            this.alpha = 1; // pure white burst
          }
        }

        this.x += tvx;
        this.y += tvy;

        // Wrap around bounds softly
        if (this.x < -10) this.x = width + 10;
        if (this.x > width + 10) this.x = -10;
        if (this.y < -10) this.y = height + 10;
        if (this.y > height + 10) this.y = -10;
      }

      draw(ctx: CanvasRenderingContext2D) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${this.baseColor}, ${this.alpha})`;
        ctx.fill();
        
        ctx.shadowBlur = 10;
        ctx.shadowColor = `rgba(${this.baseColor}, ${this.alpha})`;
      }
    }

    const particles = Array.from({ length: 20 }, () => new CardParticle());
    let animationId: number;
    let shockRadius = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Render shockwave ripple visually if ongoing
      if (clickShockwave && (Date.now() - clickShockwave.time) < 600) {
        shockRadius += 5;
        const waveAlpha = 1 - (Date.now() - clickShockwave.time) / 600;
        ctx.save();
        ctx.beginPath();
        ctx.arc(clickShockwave.x, clickShockwave.y, shockRadius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(168, 85, 247, ${waveAlpha * 0.5})`;
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.restore();
      } else if (clickShockwave && (Date.now() - clickShockwave.time) >= 600) {
        shockRadius = 0;
      }

      // Render particles & connects
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.update(mousePosPx.x, mousePosPx.y, clickShockwave);
        p.draw(ctx);
        
        // Connect nearby particles lightly stringing them together
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
          if (dist < 40) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(255, 255, 255, ${(40 - dist) / 40 * 0.15})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      animationId = window.requestAnimationFrame(render);
    };

    render();

    return () => {
      window.cancelAnimationFrame(animationId);
    };
  }, [mousePosPx.x, mousePosPx.y, clickShockwave]);

  return (
    <motion.div
      style={{ perspective: 1200 }} // Establishes 3D space
      className="relative w-full h-[520px]"
    >
      <motion.div
        ref={rectRef}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
        whileHover={{ scale: 1.02, y: -5 }} // Subtle lift
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="w-full h-full rounded-[24px] border border-white/10 bg-[#1a1a1a]/60 backdrop-blur-md relative cursor-crosshair overflow-hidden group shadow-[0_15px_50px_-20px_rgba(0,0,0,0.5)] hover:shadow-[0_20px_50px_-20px_rgba(168,85,247,0.3)] duration-300"
      >
        {/* Dynamic Inner Light */}
        <motion.div 
          style={{ background: lightGradient }}
          className="absolute inset-0 z-0 pointer-events-none"
        />
        
        {/* Particle Canvas (Always Rendered) */}
        <canvas ref={canvasRef} className="absolute inset-0 z-10 pointer-events-none" />

        {/* Image Background (Below canvas) */}
        {image && (
          <div 
            className="absolute inset-0 z-0 opacity-10 bg-cover bg-center transition-opacity duration-500 group-hover:opacity-25" 
            style={{ backgroundImage: `url(${image})` }} 
          />
        )}

        {/* 3D Depth Layers for Content */}
        <div 
          className="relative z-20 p-8 h-full flex flex-col justify-between"
          style={{ transform: "translateZ(30px)" }} // Pushes content out towards user
        >
          {/* Header Area */}
          <div>
            <motion.div 
              className="flex flex-wrap gap-2 mb-6"
              style={{ transform: "translateZ(15px)" }}
            >
              {stack.map((tech) => (
                <MagneticElement key={tech} strength={15}>
                  <div className="px-3 py-1 font-mono text-xs tracking-wider uppercase bg-white/5 border border-white/10 text-cyan-200 rounded-lg group-hover:bg-purple-600/10 group-hover:border-purple-500/30 transition-colors">
                    {tech}
                  </div>
                </MagneticElement>
              ))}
            </motion.div>

            <motion.h4 
              style={{ transform: "translateZ(40px)" }}
              className="text-2xl font-bold text-white mb-4 tracking-tight drop-shadow-md group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-300 group-hover:to-cyan-300 transition-all"
            >
              {title}
            </motion.h4>

            <motion.p 
              style={{ transform: "translateZ(20px)" }}
              className="text-neutral-400 text-sm leading-relaxed mb-4 font-medium"
            >
              {desc}
            </motion.p>
            
            {workflow && (
              <motion.div
                style={{ transform: "translateZ(25px)" }}
                className="text-xs text-purple-200/80 font-mono bg-black/40 p-2.5 rounded-lg border border-purple-500/20 leading-relaxed shadow-inner"
              >
                <span className="text-purple-400 font-bold block mb-1">Workflow Pipeline:</span>
                {workflow}
              </motion.div>
            )}
          </div>

          {/* Footer Area */}
          <motion.div 
            style={{ transform: "translateZ(35px)" }}
            className="flex flex-col sm:flex-row sm:items-center justify-between border-t border-white/10 pt-6 mt-auto gap-4"
          >
            <span className="text-sm font-bold text-white/90 bg-purple-500/10 px-4 py-1.5 rounded-full border border-purple-500/20 shadow-sm flex items-center gap-2 w-max">
              <span className="text-purple-400">⚡</span> {stat}
            </span>
            
            <div className="flex flex-wrap gap-2 items-center">
              {onViewDetails && (
                <MagneticElement strength={25}>
                  <button 
                    onClick={(e) => { e.stopPropagation(); onViewDetails(); }}
                    className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-purple-600/20 to-cyan-600/20 hover:from-purple-600/40 hover:to-cyan-600/40 border border-purple-500/30 hover:border-cyan-500/50 rounded-full transition-all font-semibold text-xs text-white group/btn backdrop-blur-md"
                  >
                    View Details
                  </button>
                </MagneticElement>
              )}
              {app && (
                <MagneticElement strength={20}>
                  <a 
                    href={app} 
                    target="_blank" 
                    rel="noreferrer"
                    className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 rounded-full hover:shadow-[0_0_15px_rgba(168,85,247,0.4)] transition-all font-semibold text-xs text-white"
                  >
                    App
                  </a>
                </MagneticElement>
              )}
              {live && (
                <MagneticElement strength={20}>
                  <a 
                    href={live} 
                    target="_blank" 
                    rel="noreferrer"
                    className="flex items-center gap-1.5 px-4 py-2 bg-cyan-600/20 border border-cyan-500/30 hover:bg-cyan-600/40 rounded-full hover:shadow-[0_0_15px_rgba(6,182,212,0.3)] transition-all font-semibold text-xs text-cyan-200"
                  >
                    Live
                  </a>
                </MagneticElement>
              )}
              {github && (
                <MagneticElement strength={25}>
                  <a 
                    href={github} 
                    target="_blank" 
                    rel="noreferrer"
                    className="flex items-center gap-1.5 px-4 py-2 bg-white/10 border border-white/5 hover:bg-white/20 rounded-full transition-all font-semibold text-xs text-white group/btn"
                  >
                    Code <FaGithub className="w-3.5 h-3.5 group-hover/btn:scale-110 transition-transform" />
                  </a>
                </MagneticElement>
              )}
              {appCode && (
                <MagneticElement strength={25}>
                  <a 
                    href={appCode} 
                    target="_blank" 
                    rel="noreferrer"
                    className="flex items-center gap-1.5 px-4 py-2 bg-white/10 border border-white/5 hover:bg-white/20 rounded-full transition-all font-semibold text-xs text-white group/btn"
                  >
                    App Code <FaGithub className="w-3.5 h-3.5 group-hover/btn:scale-110 transition-transform" />
                  </a>
                </MagneticElement>
              )}
              {webCode && (
                <MagneticElement strength={25}>
                  <a 
                    href={webCode} 
                    target="_blank" 
                    rel="noreferrer"
                    className="flex items-center gap-1.5 px-4 py-2 bg-white/10 border border-white/5 hover:bg-white/20 rounded-full transition-all font-semibold text-xs text-white group/btn"
                  >
                    Web Code <FaGithub className="w-3.5 h-3.5 group-hover/btn:scale-110 transition-transform" />
                  </a>
                </MagneticElement>
              )}
            </div>
          </motion.div>

        </div>
      </motion.div>
    </motion.div>
  );
}
