"use client";

import { useRef } from "react";
import {
  motion,
  useScroll,
  useSpring,
  useMotionValue,
  useTransform,
  useMotionTemplate,
} from "framer-motion";
import { Briefcase, Brain } from "lucide-react";

const entries = [
  {
    role: "AI/ML Intern | IBM ART Security Testing",
    company: "Defence Research and Development Organisation (DRDO)",
    date: "Jan 2026 – Apr 2026 | Hybrid",
    badges: ["+40% testing coverage", "IBM ART", "Adversarial ML", "AI Reliability"],
    tech: "IBM ART, PyTorch, Model Evaluation",
    desc: "Performed adversarial testing on deep learning models using IBM Adversarial Robustness Toolbox (ART) to identify model vulnerabilities. Executed adversarial attack and defense strategies, improving model testing coverage by 40% and validating AI reliability for critical systems.",
  },
  {
    role: "Software Development Intern",
    company: "NexCraft",
    date: "Jan 2025 – Mar 2025 | Remote",
    badges: ["5+ REST APIs", "Node.js", "Postman", "SQL"],
    tech: "Node.js, SQL, Express.js, REST APIs",
    desc: "Developed and tested 5+ REST APIs using Node.js for CRUD operations and SQL-backed services. Debugged API integrations and SQL queries, utilizing Postman for testing, input validation, and structured error handling.",
  },
  {
    role: "Next Big Thing 🚀",
    company: "Your Future Company",
    date: "2026+",
    badges: ["Building something massive"],
    tech: "AI Agents, Distributed Systems, Next.js",
    desc: "Currently leveling up in agentic AI, system design, and large language models (LLMs) to build state-of-the-art intelligent products.",
  }
];


export default function Experience() {
  const containerRef = useRef<HTMLDivElement>(null);

  /* SCROLL LINE */
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end end"],
  });

  const scaleY = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
  });

  /* CURSOR GLOW */
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);

  const glow = useMotionTemplate`
    radial-gradient(circle at ${useTransform(mouseX, v => v * 100)}% ${useTransform(
    mouseY,
    v => v * 100
  )}%, rgba(124,58,237,0.12), transparent 70%)
  `;

  const handleMove = (e: any) => {
    const rect = containerRef.current!.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width);
    mouseY.set((e.clientY - rect.top) / rect.height);
  };

  return (
    <section
      id="experience"
      ref={containerRef}
      onMouseMove={handleMove}
      className="relative w-full bg-black py-32 px-6 overflow-hidden border-t border-white/5"
    >
      {/* HARD BLACK FIX */}
      <div className="absolute inset-0 bg-black z-0" />

      {/* CURSOR GLOW */}
      <motion.div
        className="absolute inset-0 pointer-events-none will-change-transform"
        style={{ background: glow }}
      />

      <div className="max-w-6xl mx-auto relative z-10">

        {/* TITLE */}
        <motion.h3
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-5xl font-bold text-white mb-24"
        >
          My Journey.
        </motion.h3>

        {/* TIMELINE */}
        <div className="hidden md:block absolute left-1/2 top-[120px] bottom-10 w-[3px] -translate-x-1/2 bg-white/5 rounded-full overflow-hidden">
          <motion.div
            className="w-full h-full origin-top bg-gradient-to-b from-purple-500 via-pink-500 to-blue-500"
            style={{ scaleY }}
          />
        </div>

        <div className="space-y-20 relative z-10">

          {entries.map((entry, idx) => {
            const isLeft = idx % 2 === 0;

            return (
              <div
                key={idx}
                className={`flex md:flex-row ${
                  isLeft ? "md:justify-start" : "md:justify-end"
                }`}
              >
                {/* DOT */}
                <div className="hidden md:flex absolute left-1/2 -translate-x-1/2">
                  <div className="w-3 h-3 bg-purple-500 rounded-full shadow-[0_0_25px_rgba(124,58,237,1)]" />
                </div>

                {/* CARD */}
                <motion.div
                  initial={{ opacity: 0, x: isLeft ? -80 : 80 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  whileHover={{ scale: 1.04, y: -8 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className="w-full md:w-[45%]"
                >
                  <div className="bg-white/[0.03] border border-white/10 backdrop-blur-md rounded-2xl p-8 hover:border-purple-400/40 hover:shadow-[0_0_60px_rgba(124,58,237,0.2)] transition-all duration-500 group will-change-transform">

                    {/* HEADER */}
                    <div className="flex justify-between mb-5">
                      <div className="flex gap-3">
                        <div className="text-purple-400">
                          {entry.role.includes("AI") ? <Brain size={22} /> : <Briefcase size={22} />}
                        </div>

                        <div>
                          <h4 className="text-xl font-bold text-white group-hover:text-purple-300">
                            {entry.role}
                          </h4>
                          <span className="text-purple-400 text-sm">
                            {entry.company}
                          </span>
                        </div>
                      </div>

                      <span className="text-xs text-neutral-400">
                        {entry.date}
                      </span>
                    </div>

                    <p className="text-neutral-300 mb-4 text-sm">
                      {entry.desc}
                    </p>

                    <div className="flex flex-wrap gap-2">
                      {entry.badges.map((b) => (
                        <span
                          key={b}
                          className="px-3 py-1 bg-black/40 border border-white/10 rounded-full text-xs text-purple-300"
                        >
                          {b}
                        </span>
                      ))}
                    </div>

                  </div>
                </motion.div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}