import { useEffect, useMemo, useState } from "react";

const COLORS = ["#c084fc", "#fbbf24", "#e879f9", "#f59e0b", "#d8b4fe", "#fcd34d"];

interface Piece {
  left: number;
  delay: number;
  duration: number;
  drift: number;
  spin: number;
  color: string;
  scale: number;
}

function makePieces(count: number): Piece[] {
  return Array.from({ length: count }, (_, i) => ({
    left: Math.random() * 100,
    delay: Math.random() * 0.6,
    duration: 2.6 + Math.random() * 1.8,
    drift: (Math.random() - 0.5) * 220,
    spin: 480 + Math.random() * 900,
    color: COLORS[i % COLORS.length],
    scale: 0.7 + Math.random() * 0.9,
  }));
}

export function Confetti({ fireKey }: { fireKey: number }) {
  const [burst, setBurst] = useState<number | null>(null);
  const pieces = useMemo(() => makePieces(90), [burst]);

  useEffect(() => {
    if (fireKey === 0) return;
    setBurst(fireKey);
    const t = setTimeout(() => setBurst(null), 4800);
    return () => clearTimeout(t);
  }, [fireKey]);

  if (burst === null) return null;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[70] overflow-hidden"
    >
      {pieces.map((p, i) => (
        <span
          key={`${burst}-${i}`}
          className="confetti-piece"
          style={{
            left: `${p.left}%`,
            backgroundColor: p.color,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
            transform: `scale(${p.scale})`,
            ["--drift" as string]: `${p.drift}px`,
            ["--spin" as string]: `${p.spin}deg`,
          }}
        />
      ))}
    </div>
  );
}
