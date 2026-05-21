"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import ScrollySection from "@/components/ScrollySection";
import About from "@/components/About";
import Skills from "@/components/Skills";
import Experience from "@/components/Experience";
import Projects from "@/components/Projects";
import Achievements from "@/components/Achievements";
import Contact from "@/components/Contact";

export default function Home() {
  const [showLoadingScreen, setShowLoadingScreen] = useState(true);
  const [loadingPercent, setLoadingPercent] = useState(1);

  useEffect(() => {
    const loadingDuration = 6500;
    const intervalTime = loadingDuration / 100;
    
    const interval = window.setInterval(() => {
      setLoadingPercent((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 1;
      });
    }, intervalTime);

    const timer = window.setTimeout(() => {
      setShowLoadingScreen(false);
    }, loadingDuration + 200);

    return () => {
      window.clearInterval(interval);
      window.clearTimeout(timer);
    };
  }, []);

  return (
    <main className="bg-[#121212] min-h-screen text-white selection:bg-accent/30 flex flex-col font-sans relative">
      {showLoadingScreen && (
        <div className="site-loader" role="status" aria-live="polite" aria-label="Loading site">
          <div className="site-loader__ambient" />
          <div className="site-loader__core">
            <div className="site-loader__ring site-loader__ring--outer" />
            <div className="site-loader__ring site-loader__ring--inner" />
            <div className="site-loader__brand">KKM</div>
          </div>
          <div className="absolute text-neutral-400 font-mono text-sm tracking-widest opacity-80 mt-40">
            {loadingPercent}%
          </div>
        </div>
      )}
      <Navbar />
      <ScrollySection />
      <Hero />
      <About />
      <Skills />
      <Experience />
      <Projects />
      <Achievements />
      <Contact />
    </main>
  );
}

