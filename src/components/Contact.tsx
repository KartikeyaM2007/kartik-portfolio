"use client";

import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useMotionTemplate
} from "framer-motion";
import { useForm } from "react-hook-form";
import { useState, useRef } from "react";
import { Mail, Loader2, CheckCircle2, Phone, MapPin } from "lucide-react";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { Code2 } from "lucide-react";

type FormData = {
  name: string;
  email: string;
  message: string;
};

export default function Contact() {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>();
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const containerRef = useRef<HTMLDivElement>(null);

  /* ================= CURSOR LIGHT ================= */
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const smoothX = useSpring(mouseX, { stiffness: 120, damping: 20 });
  const smoothY = useSpring(mouseY, { stiffness: 120, damping: 20 });

  const glow = useMotionTemplate`
    radial-gradient(600px circle at ${smoothX}px ${smoothY}px,
    rgba(124,58,237,0.15),
    transparent 60%)
  `;

  const handleMove = (e: any) => {
    const rect = containerRef.current!.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

  /* ================= FORM ================= */

  const onSubmit = async (data: FormData) => {
    setStatus("loading");
    setErrorMessage("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" }
      });

      const result = await res.json();

      if (res.ok) {
        setStatus("success");
        setTimeout(() => {
          setStatus("idle");
          reset();
        }, 3000);
      } else {
        setStatus("error");
        setErrorMessage(result.error);
      }
    } catch {
      setStatus("error");
      setErrorMessage("Network error.");
    }
  };

  return (
    <section
      id="contact"
      ref={containerRef}
      onMouseMove={handleMove}
      className="w-full bg-black py-32 px-6 relative overflow-hidden border-t border-white/5"
    >
      {/* GRID BG */}
      <div className="absolute inset-0 opacity-[0.04] bg-[radial-gradient(circle,white_1px,transparent_1px)] bg-[size:30px_30px]" />

      {/* CURSOR GLOW */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{ background: glow }}
      />

      <div className="max-w-6xl mx-auto relative z-10">

        {/* HEADING */}
        <h2 className="text-5xl md:text-7xl font-bold text-center mb-20 text-white tracking-tight">
          Let’s build something.
        </h2>

        <div className="flex flex-col lg:flex-row gap-16">

          {/* ================= FORM ================= */}
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="flex-1 relative"
          >
            <div className="relative p-10 rounded-3xl bg-white/[0.04] backdrop-blur-xl border border-white/10">

              {/* LIGHT OVERLAY */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/[0.06] to-transparent opacity-0 hover:opacity-100 transition" />

              {status === "success" ? (
                <Success />
              ) : status === "error" ? (
                <Error msg={errorMessage} reset={() => setStatus("idle")} />
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6 relative z-10">
                  <Input label="Name" register={register("name", { required: true })} error={errors.name} />
                  <Input label="Email" register={register("email", { required: true })} error={errors.email} />
                  <Textarea label="Message" register={register("message", { required: true })} error={errors.message} />

                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    whileHover={{ scale: 0.98 }}
                    className="mt-4 py-4 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-semibold tracking-wide shadow-lg"
                  >
                    {status === "loading" ? <Loader2 className="animate-spin mx-auto" /> : "Send Message →"}
                  </motion.button>
                </form>
              )}
            </div>
          </motion.div>

          {/* ================= INFO ================= */}
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="w-full lg:w-[400px] flex flex-col gap-10 justify-center"
          >
            <Info icon={<Mail />} text="kartikeyamishra2134@gmail.com" />
            <Info icon={<Phone />} text="+91-9044890033" />
            <Info icon={<MapPin />} text="Greater Noida, India" />

            <div className="flex gap-4">
              <Social icon={<FaLinkedin />} href="https://www.linkedin.com/in/kartikeya-mishra-a92227191/" />
              <Social icon={<FaGithub />} href="https://github.com/KartikeyaM2007" />
              <Social icon={<Code2 />} href="https://leetcode.com/u/fixslayr23/" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ================= COMPONENTS ================= */

function Input({ label, register, error }: any) {
  return (
    <div className="relative group">
      <input
        {...register}
        placeholder={label}
        className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-5 py-4 text-white outline-none
        focus:border-purple-400 transition"
      />
      {error && <p className="text-red-400 text-xs mt-1">Required</p>}
    </div>
  );
}

function Textarea({ label, register, error }: any) {
  return (
    <div>
      <textarea
        {...register}
        placeholder={label}
        rows={4}
        className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-5 py-4 text-white outline-none
        focus:border-purple-400 transition resize-none"
      />
      {error && <p className="text-red-400 text-xs mt-1">Required</p>}
    </div>
  );
}

function Info({ icon, text }: any) {
  return (
    <div className="flex items-center gap-4 text-white/80">
      <div className="p-4 rounded-full bg-white/5 border border-white/10">{icon}</div>
      <span>{text}</span>
    </div>
  );
}

function Social({ icon, href }: { icon: React.ReactNode; href: string }) {
  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      whileHover={{ scale: 1.1 }}
      className="p-4 bg-white/5 rounded-full border border-white/10 cursor-pointer flex items-center justify-center text-white/70 hover:text-white hover:border-purple-400/40 transition-colors"
    >
      {icon}
    </motion.a>
  );
}

function Success() {
  return (
    <div className="flex flex-col items-center py-10 text-center">
      <CheckCircle2 className="w-16 h-16 text-green-400 mb-4" />
      <h3 className="text-xl text-white font-semibold">Message sent!</h3>
    </div>
  );
}

function Error({ msg, reset }: any) {
  return (
    <div className="flex flex-col items-center py-10 text-center">
      <Mail className="w-10 h-10 text-red-400 mb-4" />
      <p className="text-white mb-4">{msg}</p>
      <button onClick={reset} className="px-4 py-2 border border-white/10 rounded-lg text-white">
        Try again
      </button>
    </div>
  );
}