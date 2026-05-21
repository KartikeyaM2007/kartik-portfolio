"use client";

import { useRef } from "react";
import { useScroll } from "framer-motion";
import ScrollyCanvas from "@/components/ScrollyCanvas";
import Overlay from "@/components/Overlay";

export default function ScrollySection() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  return (
    <div
      ref={containerRef}
      id="scrolly"
      className="relative w-full"
      style={{ height: "500vh" }}
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <ScrollyCanvas scrollYProgress={scrollYProgress} />
        <Overlay scrollYProgress={scrollYProgress} />
      </div>
    </div>
  );
}
