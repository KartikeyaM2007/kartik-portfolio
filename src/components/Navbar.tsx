"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Smile, Bot, Sun, Moon, Sparkles, Zap, Ghost, Rocket, Cpu, Code } from "lucide-react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [iconIndex, setIconIndex] = useState(0);

  const icons = [Menu, Smile, Bot, Sun, Moon, Sparkles, Zap, Ghost, Rocket, Cpu, Code];

  const links = [
    { label: "About", href: "#about" },
    { label: "Skills", href: "#skills" },
    { label: "Experience", href: "#experience" },
    { label: "Projects", href: "#projects" },
    { label: "Achievements", href: "#achievements" },
    { label: "Contact", href: "#contact" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setIconIndex((prev) => (prev + 1) % icons.length);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const scrollTo = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  };

  const CurrentIcon = icons[iconIndex];

  return (
    <>
      <motion.nav
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.6, type: "spring", stiffness: 80, damping: 20 }}
        className={`fixed top-0 left-0 w-full z-[90] transition-all duration-500 ${
          scrolled
            ? "bg-white/[0.03] backdrop-blur-2xl border-b border-white/[0.05] shadow-[0_4px_30px_rgba(0,0,0,0.1)]"
            : "bg-transparent border-b border-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <a
            href="#top"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: "smooth" });
              setMobileMenuOpen(false);
            }}
            className="text-accent font-mono text-2xl font-bold tracking-tighter"
          >
            KKM
          </a>

          <div className="hidden xl:flex items-center gap-8">
            <div className="flex items-center gap-6">
              {links.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={(e) => scrollTo(e, link.href)}
                  className="text-white/80 hover:text-accent-light text-sm font-medium transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </div>
            <a
              href="#contact"
              onClick={(e) => scrollTo(e, "#contact")}
              className="bg-accent/10 border border-accent/30 text-accent-light px-5 py-2 rounded-full text-sm font-semibold hover:bg-accent/20 transition-colors"
            >
              Hire Me
            </a>
          </div>

          <button
            className="xl:hidden text-white/80 hover:text-accent-light transition-colors p-2"
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Open Menu"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={iconIndex}
                initial={{ opacity: 0, scale: 0.5, rotate: -90 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                exit={{ opacity: 0, scale: 0.5, rotate: 90 }}
                transition={{ duration: 0.2 }}
              >
                <CurrentIcon className="w-6 h-6" />
              </motion.div>
            </AnimatePresence>
          </button>
        </div>
      </motion.nav>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-[#121212]/80 backdrop-blur-xl flex flex-col p-6 overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-10">
              <span className="text-accent font-mono text-2xl font-bold tracking-tighter">KKM</span>
              <button
                className="text-white/80 hover:text-accent-light transition-colors p-2"
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Close Menu"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="flex flex-col gap-6 flex-1 justify-center items-center pb-20">
              {links.map((link, i) => (
                <motion.a
                  key={link.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * i, duration: 0.5 }}
                  href={link.href}
                  onClick={(e) => scrollTo(e, link.href)}
                  className="text-3xl font-semibold text-white hover:text-accent-light transition-colors"
                >
                  {link.label}
                </motion.a>
              ))}
              <motion.a
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * links.length, duration: 0.5 }}
                href="#contact"
                onClick={(e) => scrollTo(e, "#contact")}
                className="mt-6 bg-accent text-white px-8 py-3 rounded-full text-lg font-semibold shadow-[0_0_20px_rgba(124,58,237,0.3)]"
              >
                Hire Me
              </motion.a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}