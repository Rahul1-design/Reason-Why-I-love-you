import { useEffect, useState } from 'react';

interface Heart {
  id: number;
  x: number;
  y: number;
  size: number;
  delay: number;
}

interface HeartBurstProps {
  x: number;
  y: number;
  onComplete?: () => void;
}

export function HeartBurst({ x, y, onComplete }: HeartBurstProps) {
  const [hearts, setHearts] = useState<Heart[]>([]);

  useEffect(() => {
    // Generate multiple hearts with random positions around the click point
    const newHearts: Heart[] = Array.from({ length: 12 }, (_, i) => ({
      id: Date.now() + i,
      x: x + (Math.random() - 0.5) * 100,
      y: y + (Math.random() - 0.5) * 100,
      size: 20 + Math.random() * 20,
      delay: Math.random() * 0.3,
    }));

    setHearts(newHearts);

    // Clean up after animation completes
    const timer = setTimeout(() => {
      setHearts([]);
      onComplete?.();
    }, 1800);

    return () => clearTimeout(timer);
  }, [x, y, onComplete]);

  return (
    <div className="pointer-events-none fixed inset-0 z-50">
      {hearts.map((heart) => (
        <div
          key={heart.id}
          className="absolute animate-float-up"
          style={{
            left: `${heart.x}px`,
            top: `${heart.y}px`,
            fontSize: `${heart.size}px`,
            animationDelay: `${heart.delay}s`,
          }}
        >
          ❤️
        </div>
      ))}
    </div>
  );
}
