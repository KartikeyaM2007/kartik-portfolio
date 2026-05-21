"use client";

import { useRef, useEffect, useState } from "react";
import { MotionValue, useMotionValueEvent, useTransform } from "framer-motion";

export default function ScrollyCanvas({ scrollYProgress }: { scrollYProgress: MotionValue<number> }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const [ready, setReady] = useState(false);
  const frameCount = 120;

  const renderFrame = (index: number) => {
    const imgs = imagesRef.current;
    const canvas = canvasRef.current;
    if (!canvas) return;

    let bestIndex = index;
    if (!imgs[index] || !imgs[index].complete || imgs[index].naturalWidth === 0) {
      let found = false;
      // Search expanding outwards from index
      for (let offset = 1; offset < frameCount; offset++) {
        const up = index + offset;
        const down = index - offset;
        
        if (down >= 0 && imgs[down] && imgs[down].complete && imgs[down].naturalWidth > 0) {
          bestIndex = down;
          found = true;
          break;
        }
        if (up < frameCount && imgs[up] && imgs[up].complete && imgs[up].naturalWidth > 0) {
          bestIndex = up;
          found = true;
          break;
        }
      }
      if (!found) return; // No frames loaded at all
    }

    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const img = imgs[bestIndex];

    const canvasRatio = canvas.width / canvas.height;
    const imgRatio = img.width / img.height;
    let drawWidth = canvas.width, drawHeight = canvas.height, offsetX = 0, offsetY = 0;

    if (canvasRatio > imgRatio) {
      drawHeight = canvas.width / imgRatio;
      offsetY = (canvas.height - drawHeight) / 2;
    } else {
      drawWidth = canvas.height * imgRatio;
      offsetX = (canvas.width - drawWidth) / 2;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
  };

  useEffect(() => {
    const loadedImages: HTMLImageElement[] = new Array(frameCount);
    imagesRef.current = loadedImages;

    // Define priority loading queue
    const queue: number[] = [];
    
    // 1. Prioritize first 15 frames for initial smooth landing
    for (let i = 0; i < 15; i++) queue.push(i);
    
    // 2. Add keyframes every 4th frame
    for (let i = 15; i < frameCount; i++) {
      if (i % 4 === 0) queue.push(i);
    }
    
    // 3. Fill in the rest
    for (let i = 15; i < frameCount; i++) {
      if (i % 4 !== 0) queue.push(i);
    }

    const batchSize = 6;
    let currentIndex = 0;

    const loadNextBatch = () => {
      if (currentIndex >= queue.length) return;
      
      const batch = queue.slice(currentIndex, currentIndex + batchSize);
      currentIndex += batchSize;
      
      let completedInBatch = 0;
      
      batch.forEach(frameIndex => {
        const img = new Image();
        const paddedIndex = frameIndex.toString().padStart(3, "0");
        img.src = `/sequence/frame_${paddedIndex}_delay-0.066s.png`;
        
        const onDone = () => {
          completedInBatch++;
          if (frameIndex === 0) {
            setReady(true);
            if (canvasRef.current) {
              canvasRef.current.width = window.innerWidth;
              canvasRef.current.height = window.innerHeight;
            }
            renderFrame(0);
          }
          if (completedInBatch === batch.length) {
            loadNextBatch();
          }
        };
        
        img.onload = onDone;
        img.onerror = onDone;
        loadedImages[frameIndex] = img;
      });
    };

    loadNextBatch();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const currentIndex = useTransform(scrollYProgress, [0, 1], [0, frameCount - 1]);

  const requestRef = useRef<number>();

  useMotionValueEvent(currentIndex, "change", (latest) => {
    if (requestRef.current) {
      cancelAnimationFrame(requestRef.current);
    }
    requestRef.current = requestAnimationFrame(() => {
      renderFrame(Math.round(latest));
    });
  });

  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current) {
        canvasRef.current.width = window.innerWidth;
        canvasRef.current.height = window.innerHeight;
        renderFrame(Math.round(currentIndex.get()));
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready]);

  return (
    <div className="absolute inset-0 h-full w-full bg-black">
      <canvas ref={canvasRef} className="block h-full w-full" />
    </div>
  );
}
