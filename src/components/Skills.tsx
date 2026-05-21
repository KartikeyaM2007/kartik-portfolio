"use client";

import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useMotionTemplate,
} from "framer-motion";
import { useEffect, useRef, useState, useCallback } from "react";

/* ================= SCRAMBLE TITLE ================= */
const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%";
const FROM_TEXT = "What I work with.";
const TO_TEXT = "Skills.";

function ScrambleTitle() {
  const [display, setDisplay] = useState(FROM_TEXT);
  const intervalRef = useRef<any>(null);

  const scrambleTo = useCallback((target: string) => {
    const maxLen = Math.max(FROM_TEXT.length, target.length);
    let iteration = 0;

    clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      setDisplay(
        target
          .padEnd(maxLen)
          .split("")
          .map((char, i) => {
            if (i < iteration) return char;
            return CHARS[Math.floor(Math.random() * CHARS.length)];
          })
          .join("")
          .trimEnd()
      );

      iteration++;
      if (iteration > maxLen) {
        clearInterval(intervalRef.current);
        setDisplay(target);
      }
    }, 30);
  }, []);

  return (
    <motion.h3
      onMouseEnter={() => scrambleTo(TO_TEXT)}
      onMouseLeave={() => scrambleTo(FROM_TEXT)}
      className="text-4xl md:text-5xl font-bold text-white mb-20 font-mono"
    >
      {display}
    </motion.h3>
  );
}

/* ================= PARTICLES ================= */
function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    let particles: any[] = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = canvas.offsetHeight;
    };

    resize();
    window.addEventListener("resize", resize);

    for (let i = 0; i < 60; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.7,
        vy: (Math.random() - 0.5) * 0.7,
        size: Math.random() * 2 + 1,
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p) => {
        const dx = mouse.current.x - p.x;
        const dy = mouse.current.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 120) {
          p.vx -= dx * 0.0005;
          p.vy -= dy * 0.0005;
        }

        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(139,92,246,0.7)";
        ctx.fill();
      });

      requestAnimationFrame(draw);
    };

    draw();

    window.addEventListener("mousemove", (e) => {
      mouse.current = { x: e.clientX, y: e.clientY };
    });

    return () => window.removeEventListener("resize", resize);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full z-0 opacity-70"
    />
  );
}

/* ================= MAGNETIC CHIP ================= */
function MagneticChip({ text }: { text: string }) {
  const ref = useRef<HTMLDivElement>(null);

  const handleMove = (e: any) => {
    const rect = ref.current!.getBoundingClientRect();
    const x = e.clientX - (rect.left + rect.width / 2);
    const y = e.clientY - (rect.top + rect.height / 2);

    ref.current!.style.transform = `translate(${x / 6}px, ${y / 6}px)`;
  };

  const reset = () => {
    ref.current!.style.transform = `translate(0px,0px)`;
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      whileHover={{ scale: 1.1, y: -3 }}
      className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-white/70 backdrop-blur-md cursor-pointer"
    >
      {text}
    </motion.div>
  );
}

/* ================= SKILL CARD ================= */
function SkillCard({ category }: any) {
  const cardRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);

  const smoothX = useSpring(mouseX, { stiffness: 150, damping: 15 });
  const smoothY = useSpring(mouseY, { stiffness: 150, damping: 15 });

  const rotateX = useTransform(smoothY, [0, 1], [10, -10]);
  const rotateY = useTransform(smoothX, [0, 1], [-10, 10]);

  const light = useMotionTemplate`
    radial-gradient(circle at ${useTransform(smoothX, (v) => v * 100)}% ${useTransform(
    smoothY,
    (v) => v * 100
  )}%, rgba(168,85,247,0.15), transparent 70%)
  `;

  const move = (e: any) => {
    const rect = cardRef.current!.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width);
    mouseY.set((e.clientY - rect.top) / rect.height);
  };

  return (
    <motion.div style={{ perspective: 1000 }}>
      <motion.div
        ref={cardRef}
        onMouseMove={move}
        onMouseLeave={() => {
          mouseX.set(0.5);
          mouseY.set(0.5);
        }}
        style={{ rotateX, rotateY }}
        whileHover={{ scale: 1.03, y: -5 }}
        className="relative p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl overflow-hidden"
      >
        <motion.div className="absolute inset-0" style={{ background: light }} />

        <div className="relative z-10">
          <h4 className="text-2xl font-bold mb-6 text-white">
            {category.title}
          </h4>

          <div className="flex flex-wrap gap-3">
            {category.items.map((item: string) => (
              <MagneticChip key={item} text={item} />
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ================= MAIN ================= */
export default function Skills() {
  const categories = [
    { title: "Languages", items: ["Python", "C++", "JavaScript", "TypeScript", "SQL"] },
    { title: "AI / ML", items: ["PyTorch", "TensorFlow.js", "Scikit-learn", "Computer Vision", "RAG", "Federated Learning", "Adversarial ML", "Transformers", "LLM Reranking"] },
    { title: "Frontend", items: ["React.js", "Next.js", "Tailwind CSS", "React Flow"] },
    { title: "Backend", items: ["Node.js", "Express.js", "FastAPI", "Django", "Flask", "REST APIs", "JWT", "RBAC"] },
    { title: "Full Stack", items: ["MERN Stack", "Firebase", "Convex DB", "DBMS"] },
    { title: "Tools", items: ["OpenCV", "NumPy", "Git", "GitHub", "Postman", "Vercel", "Railway", "Hugging Face"] },
    { title: "Core CS", items: ["Data Structures & Algorithms", "OOP", "DBMS", "Operating Systems", "Computer Networks"] },
  ];


  return (
    <section id="skills" className="relative w-full bg-black py-32 px-6 overflow-hidden">
      {/* PARTICLES */}
      <ParticleBackground />

      <div className="relative z-10 max-w-7xl mx-auto">
        <ScrambleTitle />

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
          {categories.map((cat) => (
            <SkillCard key={cat.title} category={cat} />
          ))}
        </div>
      </div>
    </section>
  );
}