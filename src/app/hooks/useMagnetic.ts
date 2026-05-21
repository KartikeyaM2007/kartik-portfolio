// hooks/useMagnetic.ts
import { useRef } from "react";
import { useMotionValue, useSpring } from "framer-motion";

export function useMagnetic(strength = 40) {
  const ref = useRef<HTMLDivElement | null>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const smoothX = useSpring(x, { stiffness: 150, damping: 15 });
  const smoothY = useSpring(y, { stiffness: 150, damping: 15 });

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;

    const dx = e.clientX - (rect.left + rect.width / 2);
    const dy = e.clientY - (rect.top + rect.height / 2);

    x.set(dx / strength);
    y.set(dy / strength);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return {
    ref,
    x: smoothX,
    y: smoothY,
    handlers: {
      onMouseMove: handleMouseMove,
      onMouseLeave: handleMouseLeave,
    },
  };
}