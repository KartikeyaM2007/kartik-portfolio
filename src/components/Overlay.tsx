"use client";

import {
  motion,
  MotionValue,
  useTransform,
  useSpring,
} from "framer-motion";

export default function Overlay({
  scrollYProgress,
}: {
  scrollYProgress: MotionValue<number>;
}) {
  // Smooth animation config
  const smooth = { stiffness: 80, damping: 20, mass: 0.5 };

  // -------- SECTION 1 --------
  const opacity1 = useTransform(scrollYProgress, [0, 0.1, 0.25], [1, 1, 0]);
  const y1 = useTransform(scrollYProgress, [0, 0.25], [0, -120]);
  const scale1 = useTransform(scrollYProgress, [0, 0.25], [1, 0.95]);
  const blur1Raw = useTransform(scrollYProgress, [0, 0.25], [0, 8]);
  const blur1 = useTransform(blur1Raw, (b) => `blur(${b}px)`);

  const opacity1Smooth = useSpring(opacity1, smooth);
  const y1Smooth = useSpring(y1, smooth);

  // -------- SECTION 2 --------
  const opacity2 = useTransform(
    scrollYProgress,
    [0.25, 0.4, 0.6],
    [0, 1, 0]
  );
  const y2 = useTransform(
    scrollYProgress,
    [0.25, 0.4, 0.6],
    [120, 0, -120]
  );
  const scale2 = useTransform(scrollYProgress, [0.25, 0.6], [0.95, 1]);
  const blur2Raw = useTransform(scrollYProgress, [0.25, 0.4], [8, 0]);
  const blur2 = useTransform(blur2Raw, (b) => `blur(${b}px)`);

  const opacity2Smooth = useSpring(opacity2, smooth);
  const y2Smooth = useSpring(y2, smooth);

  // -------- SECTION 3 --------
  const opacity3 = useTransform(
    scrollYProgress,
    [0.55, 0.7, 0.9],
    [0, 1, 0]
  );
  const y3 = useTransform(
    scrollYProgress,
    [0.55, 0.7, 0.9],
    [120, 0, -120]
  );
  const scale3 = useTransform(scrollYProgress, [0.55, 0.9], [0.95, 1]);
  const blur3Raw = useTransform(scrollYProgress, [0.55, 0.7], [8, 0]);
  const blur3 = useTransform(blur3Raw, (b) => `blur(${b}px)`);

  const opacity3Smooth = useSpring(opacity3, smooth);
  const y3Smooth = useSpring(y3, smooth);

  return (
    <div className="absolute inset-0 z-10 pointer-events-none px-6 md:px-12">
      
      {/* -------- SECTION 1 -------- */}
      <motion.div
        style={{
          opacity: opacity1Smooth,
          y: y1Smooth,
          scale: scale1,
          filter: blur1,
        }}
        className="absolute inset-0 flex items-center justify-center text-center"
      >
        <h1 className="text-3xl sm:text-4xl md:text-7xl font-bold tracking-tight text-white drop-shadow-2xl leading-tight">
          Kartikeya Krishna Mishra. <br className="md:hidden" />
          <span className="text-neutral-400">
            Full-Stack AI Developer.
          </span>
        </h1>
      </motion.div>

      {/* -------- SECTION 2 -------- */}
      <motion.div
        style={{
          opacity: opacity2Smooth,
          y: y2Smooth,
          scale: scale2,
          filter: blur2,
        }}
        className="absolute inset-0 flex items-center justify-start md:ml-[10%]"
      >
        <h2 className="text-3xl sm:text-4xl md:text-6xl font-semibold tracking-tight text-white drop-shadow-2xl w-full max-w-xl leading-tight">
          building <br />
          <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-emerald-400 bg-clip-text text-transparent">
            intelligent applications.
          </span>
        </h2>
      </motion.div>

      {/* -------- SECTION 3 -------- */}
      <motion.div
        style={{
          opacity: opacity3Smooth,
          y: y3Smooth,
          scale: scale3,
          filter: blur3,
        }}
        className="absolute inset-0 flex items-center justify-end md:mr-[10%] text-right"
      >
        <h2 className="text-3xl sm:text-4xl md:text-6xl font-semibold tracking-tight text-white drop-shadow-2xl w-full max-w-xl leading-tight">
          Bridging <br />
          <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-rose-400 bg-clip-text text-transparent">
            machine learning and software engineering.
          </span>
        </h2>
      </motion.div>
    </div>
  );
}