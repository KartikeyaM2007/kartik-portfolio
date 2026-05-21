"use client";

import { motion, useMotionValue, useSpring, useMotionTemplate } from "framer-motion";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { Code2, ArrowDown, FileDown } from "lucide-react";
import { useEffect, useRef } from "react";
import { useMagnetic } from "@/app/hooks/useMagnetic";
import ParticleBackground from "@/components/ParticleBackground";

// ------------------------------------------------------------------
// Internal Components
// ------------------------------------------------------------------
function MagneticWrapper({ children, strength = 40 }: { children: React.ReactNode, strength?: number }) {
  const { ref, x, y, handlers } = useMagnetic(strength);
  return (
    <motion.div ref={ref} style={{ x, y }} {...handlers} className="relative inline-block z-20">
      {children}
    </motion.div>
  );
}

function InteractiveCTA({ children, href, primary }: { children: React.ReactNode, href?: string, primary?: boolean }) {
  const btnX = useMotionValue(0);
  const btnY = useMotionValue(0);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    btnX.set(e.clientX - rect.left);
    btnY.set(e.clientY - rect.top);
  };

  const handleMouseLeave = () => {
    btnX.set(0);
    btnY.set(0);
  };

  const glowTemplate = useMotionTemplate`radial-gradient(120px circle at ${btnX}px ${btnY}px, rgba(255,255,255,0.15), transparent 80%)`;

  const styling = `bg-transparent border border-white/20 text-white shadow-[0_0_20px_rgba(168,85,247,0.3)] hover:shadow-[0_15px_40px_rgba(168,85,247,0.5)]`;

  const handleClick = () => {
    if (href?.startsWith("#")) {
      document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
    } else if (href) {
      window.open(href, "_blank");
    }
  };

  return (
    <MagneticWrapper strength={30}>
      <div>
        <motion.button
          onClick={handleClick}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`relative flex items-center px-10 py-4 rounded-full font-semibold backdrop-blur-md overflow-hidden transition-colors ${styling}`}
        >
          {/* Internal Mouse Glow Reflection */}
          <motion.div
            className="absolute inset-0 z-0 pointer-events-none"
            style={{ background: glowTemplate, opacity: 0 }}
            whileHover={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          />

          {/* Shimmer sweep overlay */}
          <motion.div
            className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12"
            animate={{ x: ["-150%", "250%"] }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear", delay: primary ? 1 : 2 }}
          />

          <span className="relative z-10 flex items-center gap-2">{children}</span>
        </motion.button>
      </div>
    </MagneticWrapper>
  );
}

// ------------------------------------------------------------------
// Main Hero Section
// ------------------------------------------------------------------
export default function Hero() {
  const globalMouseX = useMotionValue(-1000);
  const globalMouseY = useMotionValue(-1000);

  const smoothX = useSpring(globalMouseX, { damping: 20, stiffness: 100, mass: 0.5 });
  const smoothY = useSpring(globalMouseY, { damping: 20, stiffness: 100, mass: 0.5 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      globalMouseX.set(e.clientX);
      globalMouseY.set(e.clientY);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [globalMouseX, globalMouseY]);

  // Global volumetric spotlight
  const backgroundGlowTemplate = useMotionTemplate`radial-gradient(800px circle at ${smoothX}px ${smoothY}px, rgba(168,85,247,0.12), transparent 70%)`;

  const socials = [
    { Icon: FaGithub, link: "https://github.com/KartikeyaM2007" },
    { Icon: FaLinkedin, link: "https://linkedin.com/in/kartikeya-mishra" },
    { Icon: Code2, link: "https://leetcode.com/u/fixslayr23/" },
  ];

  return (
    <section className="relative w-full h-[100dvh] flex items-center justify-center overflow-hidden bg-black px-6">

      {/* Dynamic Ambient Volumetric Lighting tracking mouse globally */}
      <motion.div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{ background: backgroundGlowTemplate }}
      />

      {/* CONTINUITY BEVEL SHADOW (from SCROLLY SECTION) */}
      <div className="absolute top-0 left-0 w-full h-[30vh] bg-gradient-to-b from-[#250040] to-transparent opacity-30 pointer-events-none z-0" />

      {/* 🔥 UPGRADED EXPERIMENTAL PARTICLE BACKGROUND */}
      <ParticleBackground />

      {/* CONTENT */}
      <div className="relative z-10 text-center max-w-4xl px-4 pointer-events-none">

        <motion.h1
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, type: "spring", stiffness: 80, delay: 0.1 }}
          className="text-white font-bold tracking-tight mb-4 drop-shadow-lg"
          style={{ fontSize: "clamp(2.5rem, 6vw, 5rem)" }}
        >
          Kartikeya Krishna Mishra
        </motion.h1>

        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="text-xl md:text-2xl mb-6 font-medium"
        >
          <span className="bg-gradient-to-r from-purple-400 via-pink-300 to-cyan-400 bg-clip-text text-transparent animate-gradient-slow drop-shadow-md">
            Full-Stack Developer & AI/ML Engineer
          </span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="text-base md:text-xl text-neutral-400 max-w-2xl mx-auto mb-12 drop-shadow-sm pointer-events-auto"
        >
          Building intelligent systems — from adversarial ML at DRDO to scalable full-stack applications.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5, type: "spring" }}
          className="flex flex-wrap justify-center gap-6 mb-12 pointer-events-auto"
        >
          <InteractiveCTA href="#projects" primary>
            View Projects <ArrowDown className="w-5 h-5 ml-1" />
          </InteractiveCTA>
          <InteractiveCTA href="https://drive.google.com/file/d/1h8cU9zVJr_RtzsFqnYO8LdpufpjFhCbW/view?usp=sharing">
            Resume <FileDown className="w-5 h-5 ml-1" />
          </InteractiveCTA>
        </motion.div>

        {/* SOCIALS */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="flex justify-center gap-8 pointer-events-auto"
        >
          {socials.map(({ Icon, link }, index) => (
            <MagneticWrapper key={link} strength={25}>
              <motion.a
                href={link}
                target="_blank"
                rel="noreferrer"
                whileHover={{ scale: 1.3, rotate: index % 2 === 0 ? 15 : -15, y: -5 }}
                whileTap={{ scale: 0.9 }}
                className="block p-2 text-white/60 hover:text-white transition-colors drop-shadow-lg"
              >
                <Icon className="w-7 h-7" />
              </motion.a>
            </MagneticWrapper>
          ))}
        </motion.div>

      </div>
    </section>
  );
}