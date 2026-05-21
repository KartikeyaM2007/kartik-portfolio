"use client";

import {
  motion,
  useMotionValue,
  useTransform,
  useSpring,
  useMotionTemplate
} from "framer-motion";
import { Award, Trophy, Star, Code } from "lucide-react";
import { useRef } from "react";

/* ================= DATA ================= */

const achievements = [
  {
    title: "LeetCode Rating: 1690",
    desc: "Solved 250+ DSA problems",
    icon: <Code className="w-8 h-8 text-purple-400" />
  },
  {
    title: "1st Runner-Up",
    desc: "Ideathon (UI/UX-driven innovation)",
    icon: <Trophy className="w-8 h-8 text-yellow-400" />
  },
  {
    title: "3rd Rank",
    desc: "Tech Arena Competition",
    icon: <Award className="w-8 h-8 text-amber-500" />
  },
  {
    title: "Technical Core Member",
    desc:
      "Google Developer Student Club, Bennett University (Sep 2023 – Nov 2024)",
    icon: <Star className="w-8 h-8 text-blue-400" />
  }
];

/* ================= MAIN ================= */

export default function Achievements() {
  return (
    <section id="achievements" className="w-full bg-black py-32 px-6 relative overflow-hidden border-y border-white/5">
      
      {/* SUBTLE GRID BACKGROUND */}
      <div className="absolute inset-0 opacity-[0.04] bg-[radial-gradient(circle_at_center,white_1px,transparent_1px)] bg-[size:32px_32px]" />

      <div className="max-w-7xl mx-auto relative z-10">

        {/* HEADER */}
        <div className="mb-20 flex items-center gap-6">
          <h3 className="text-5xl font-bold tracking-tight text-white">
            Achievements
          </h3>
          <div className="flex-1 h-[1px] bg-white/10 mt-2" />
        </div>

        {/* GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {achievements.map((item, i) => (
            <Card key={i} item={item} i={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ================= CARD ================= */

function Card({ item, i }: any) {
  const ref = useRef<HTMLDivElement>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  /* smooth physics */
  const springX = useSpring(x, { stiffness: 120, damping: 15 });
  const springY = useSpring(y, { stiffness: 120, damping: 15 });

  /* 3D tilt */
  const rotateX = useTransform(springY, [-50, 50], [10, -10]);
  const rotateY = useTransform(springX, [-50, 50], [-10, 10]);

  /* parallax */
  const textX = useTransform(springX, [-50, 50], [-8, 8]);
  const textY = useTransform(springY, [-50, 50], [-8, 8]);

  /* gradient border follows cursor */
  const gradient = useMotionTemplate`
    radial-gradient(400px circle at ${springX}px ${springY}px,
    rgba(124,58,237,0.25),
    transparent 60%)
  `;

  const handleMove = (e: any) => {
    const rect = ref.current!.getBoundingClientRect();
    x.set(e.clientX - rect.left - rect.width / 2);
    y.set(e.clientY - rect.top - rect.height / 2);
  };

  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: i * 0.1, duration: 0.5 }}
      viewport={{ once: true }}
      style={{
        rotateX,
        rotateY,
        transformPerspective: 900
      }}
      className="relative group rounded-2xl"
    >
      {/* GRADIENT BORDER */}
      <motion.div
        style={{ background: gradient }}
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition duration-500"
      />

      {/* CARD */}
      <div className="relative rounded-2xl bg-white/[0.04] backdrop-blur-xl border border-white/10 p-8 h-full
      transition-all duration-300 group-hover:border-white/20">

        {/* LIQUID LIGHT */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/[0.06] to-transparent opacity-0 group-hover:opacity-100 transition duration-500" />

        {/* ICON */}
        <motion.div
          className="mb-6 p-4 rounded-full bg-white/5 border border-white/10 w-max"
          whileHover={{ scale: 1.15 }}
          style={{
            x: useTransform(springX, [-50, 50], [-6, 6]),
            y: useTransform(springY, [-50, 50], [-6, 6])
          }}
        >
          {item.icon}
        </motion.div>

        {/* TEXT */}
        <motion.div style={{ x: textX, y: textY }}>
          <h4 className="text-xl font-semibold text-white mb-2 tracking-tight">
            {item.title}
          </h4>
          <p className="text-neutral-400 text-sm leading-relaxed">
            {item.desc}
          </p>
        </motion.div>

        {/* DEPTH SHADOW */}
        <div className="absolute inset-0 rounded-2xl shadow-[0_30px_80px_rgba(0,0,0,0.6)] opacity-0 group-hover:opacity-100 transition duration-500" />
      </div>
    </motion.div>
  );
}