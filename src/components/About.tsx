"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import Image from "next/image";
import { useEffect } from "react";
import { useMagnetic } from "@/app/hooks/useMagnetic";
import BubbleBackground from "@/components/BubbleBackground";

// Shimmering Text Component for highlighted keywords
const ShimmerText = ({ children }: { children: React.ReactNode }) => (
  <motion.span
    animate={{ backgroundPosition: ["200% center", "-200% center"] }}
    transition={{ repeat: Infinity, duration: 6, ease: "linear" }}
    className="bg-[linear-gradient(110deg,#c084fc,45%,#fff,55%,#c084fc)] bg-[length:200%_auto] bg-clip-text text-transparent font-semibold border-b border-purple-500/30 pb-0.5 inline-block"
  >
    {children}
  </motion.span>
);

// Magnetic Chip Component matching user specs (float, hover scale, distance-based)
function MagneticChip({ text, delay }: { text: string; delay: number }) {
  const { ref, x, y, handlers } = useMagnetic(15); 
  
  return (
    <motion.div 
      variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
      className="p-4 -m-4 relative" // expanded hit area for "following when near"
    >
      <motion.div ref={ref} style={{ x, y }} {...handlers} className="relative z-10 w-fit">
        {/* Subtle Idle Floating */}
        <motion.div
           animate={{ y: [0, -5, 0] }} 
           transition={{ repeat: Infinity, duration: 4 + delay * 0.1, ease: "easeInOut" }}
        >
          <motion.button
            whileHover={{ scale: 1.08, y: -2 }}
            whileTap={{ scale: 0.93, transition: { duration: 0.1 } }}
            className="px-6 py-2.5 rounded-full border border-purple-500/20 bg-white/5 text-purple-200 text-sm font-semibold tracking-wide shadow-[0_0_15px_rgba(124,58,237,0)] hover:shadow-[0_0_20px_rgba(124,58,237,0.5)] hover:border-purple-400/50 hover:bg-white/10 transition-colors backdrop-blur-md relative overflow-hidden group outline-none"
          >
            {/* Hover ripple visual */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-[150%] group-hover:translate-x-[150%] transition-transform duration-700 ease-out" />
            <span className="relative z-10">{text}</span>
          </motion.button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

export default function About() {
  const chips = [
    "RAG",
    "Agentic AI",
    "Federated Learning",
    "Adversarial ML",
    "Computer Vision",
    "Full-Stack Web"
  ];

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const smoothX = useSpring(mouseX, { stiffness: 40, damping: 20 });
  const smoothY = useSpring(mouseY, { stiffness: 40, damping: 20 });

  // Background Parallax Glows
  const layer1X = useTransform(smoothX, (x) => x * 60);
  const layer1Y = useTransform(smoothY, (y) => y * 60);
  const layer2X = useTransform(smoothX, (x) => x * -40);
  const layer2Y = useTransform(smoothY, (y) => y * -40);
  
  // Follow-cursor Glow
  const cursorX = useTransform(smoothX, (x) => x * 400);
  const cursorY = useTransform(smoothY, (y) => y * 400);

  // 3D Parallax Tilt for Profile Avatar
  const tiltX = useTransform(smoothY, [-0.5, 0.5], [15, -15]);
  const tiltY = useTransform(smoothX, [-0.5, 0.5], [-15, 15]);

  useEffect(() => {
    const move = (e: MouseEvent) => {
      mouseX.set(e.clientX / window.innerWidth - 0.5);
      mouseY.set(e.clientY / window.innerHeight - 0.5);
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, [mouseX, mouseY]);

  return (
    <section
      id="about"
      className="relative w-full bg-black text-white py-32 px-6 overflow-hidden"
    >
      <BubbleBackground />
      {/* Dynamic Background Glows */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Soft radial glow following cursor */}
        <motion.div
           style={{ x: cursorX, y: cursorY }}
           className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[50vw] h-[50vw] bg-[radial-gradient(ellipse_at_center,_rgba(168,85,247,0.12)_0%,_transparent_60%)] blur-[80px]"
        />
        <motion.div style={{ x: layer1X, y: layer1Y }} className="absolute top-20 left-1/4 w-[40vw] h-[40vw] bg-purple-600/10 rounded-full blur-[140px]" />
        <motion.div style={{ x: layer2X, y: layer2Y }} className="absolute bottom-10 right-1/4 w-[40vw] h-[40vw] bg-blue-500/10 rounded-full blur-[140px]" />
      </div>

      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-16 md:gap-24 relative z-10">

        {/* Profile Avatar with 3D Tilt & Glow */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, type: "spring", bounce: 0.3 }}
          className="relative flex-shrink-0 perspective-1000"
          style={{ perspective: 1000 }}
        >
          <motion.div
            style={{ rotateX: tiltX, rotateY: tiltY }}
            whileHover={{ scale: 1.05 }}
            className="relative group cursor-pointer"
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            {/* Rotating Minimal Ring */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 15, ease: "linear" }}
              className="absolute -inset-6 rounded-full border border-dashed border-purple-400/20 group-hover:border-purple-400/40 transition-colors duration-500"
            />

            {/* Intensifying Glow on Hover */}
            <div className="absolute -inset-3 rounded-full bg-gradient-to-tr from-purple-500 to-blue-500 blur-2xl opacity-20 group-hover:opacity-50 transition-opacity duration-500" />

            {/* Avatar Core */}
            <div className="w-52 h-52 md:w-72 md:h-72 rounded-full overflow-hidden relative z-10 shadow-[0_0_40px_rgba(124,58,237,0.2)] group-hover:shadow-[0_0_80px_rgba(124,58,237,0.6)] border border-white/10 group-hover:border-white/30 transition-all duration-500 bg-neutral-900">
              <Image
                src="/picture/Main.png"
                alt="Kartikeya Krishna Mishra"
                fill
                className="object-cover object-top scale-100 group-hover:scale-105 transition-transform duration-700 ease-out"
                priority
              />
            </div>
          </motion.div>
        </motion.div>

        {/* Content with Staggered Animations */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.15 } },
          }}
          className="flex-1 text-center md:text-left"
        >
          <motion.h3 
            variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } }}
            transition={{ type: "spring", damping: 25, stiffness: 100 }}
            className="text-3xl md:text-5xl font-bold tracking-tighter mb-8"
          >
            Hello, World.
          </motion.h3>

          <motion.p 
            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
            className="text-lg md:text-xl text-neutral-400 font-medium leading-relaxed mb-6"
          >
            I’m an <ShimmerText>AI/ML and Full Stack Developer</ShimmerText> pursuing my B.Tech in CSE at Bennett University (2023–2027). 
            I build intelligent web applications, robust REST APIs, and privacy-preserving ML systems.
          </motion.p>

          <motion.p 
            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
            className="text-lg md:text-xl text-neutral-400 font-medium leading-relaxed mb-10"
          >
            Currently, I am an AI/ML Intern at <ShimmerText>DRDO</ShimmerText> specializing in security testing deep learning models 
            with <ShimmerText>IBM ART</ShimmerText> to evaluate model robustness and address real-world system vulnerabilities.
          </motion.p>

          {/* Magnetic Floating Chips */}
          <motion.div 
             variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
             className="flex flex-wrap justify-center md:justify-start gap-4 md:gap-6"
          >
            {chips.map((chip, idx) => (
              <MagneticChip key={chip} text={chip} delay={idx} />
            ))}
          </motion.div>
        </motion.div>

      </div>
    </section>
  );
}