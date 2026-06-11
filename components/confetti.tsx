"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Particle {
  id: number;
  x: number;
  y: number;
  color: string;
  size: number;
  rotation: number;
  shape: "circle" | "square";
}

const COLORS = ["#6366f1", "#8b5cf6", "#ec4899", "#f43f5e", "#f97316", "#eab308", "#22c55e", "#06b6d4"];

export function useConfetti() {
  const [particles, setParticles] = useState<Particle[]>([]);

  const fire = useCallback(() => {
    const newParticles: Particle[] = Array.from({ length: 40 }, (_, i) => ({
      id: Date.now() + i,
      x: Math.random() * 100,
      y: -10 - Math.random() * 20,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      size: Math.random() * 8 + 4,
      rotation: Math.random() * 360,
      shape: Math.random() > 0.5 ? "circle" : "square",
    }));
    setParticles(newParticles);
    setTimeout(() => setParticles([]), 3000);
  }, []);

  return { particles, fire };
}

export function Confetti({ particles }: { particles: Particle[] }) {
  return (
    <div className="fixed inset-0 pointer-events-none z-[200] overflow-hidden">
      <AnimatePresence>
        {particles.map((p) => (
          <motion.div
            key={p.id}
            className="absolute"
            initial={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              rotate: 0,
              opacity: 1,
              scale: 0,
            }}
            animate={{
              top: "110%",
              left: `${p.x + (Math.random() - 0.5) * 40}%`,
              rotate: p.rotation + 360 * (Math.random() > 0.5 ? 1 : -1),
              opacity: 0,
              scale: 1,
            }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 2 + Math.random() * 1.5,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
            style={{
              width: p.size,
              height: p.size,
              backgroundColor: p.color,
              borderRadius: p.shape === "circle" ? "50%" : "2px",
            }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
