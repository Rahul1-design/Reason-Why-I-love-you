import { useState, useEffect, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { X, Trophy } from 'lucide-react';

interface FallingHeart {
  id: number;
  x: number;
  y: number;
  speed: number;
  size: number;
}

interface CatchHeartsGameProps {
  onClose: () => void;
  onComplete: (score: number) => void;
}

export function CatchHeartsGame({ onClose, onComplete }: CatchHeartsGameProps) {
  const [hearts, setHearts] = useState<FallingHeart[]>([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [basketX, setBasketX] = useState(50);
  const [gameOver, setGameOver] = useState(false);
  const gameAreaRef = useRef<HTMLDivElement>(null);
  const heartIdRef = useRef(0);

  // Generate falling hearts
  useEffect(() => {
    if (gameOver) return;

    const interval = setInterval(() => {
      const newHeart: FallingHeart = {
        id: heartIdRef.current++,
        x: Math.random() * 90 + 5,
        y: 0,
        speed: 2 + Math.random() * 2,
        size: 30 + Math.random() * 20,
      };
      setHearts(prev => [...prev, newHeart]);
    }, 800);

    return () => clearInterval(interval);
  }, [gameOver]);

  // Move hearts down
  useEffect(() => {
    if (gameOver) return;

    const interval = setInterval(() => {
      setHearts(prev => {
        const updated = prev.map(heart => ({
          ...heart,
          y: heart.y + heart.speed,
        }));

        // Check for catches
        updated.forEach(heart => {
          if (
            heart.y > 80 &&
            heart.y < 95 &&
            Math.abs(heart.x - basketX) < 10
          ) {
            setScore(s => s + 10);
            heart.y = 1000; // Remove from view
          }
        });

        // Remove hearts that fell off screen
        return updated.filter(heart => heart.y < 100);
      });
    }, 50);

    return () => clearInterval(interval);
  }, [basketX, gameOver]);

  // Timer countdown
  useEffect(() => {
    if (gameOver) return;

    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setGameOver(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [gameOver]);

  // Handle game over
  useEffect(() => {
    if (gameOver) {
      setTimeout(() => {
        onComplete(score);
      }, 2000);
    }
  }, [gameOver, score, onComplete]);

  // Mouse movement
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!gameAreaRef.current || gameOver) return;
    const rect = gameAreaRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    setBasketX(Math.max(5, Math.min(95, x)));
  }, [gameOver]);

  // Touch movement
  const handleTouchMove = useCallback((e: React.TouchEvent<HTMLDivElement>) => {
    if (!gameAreaRef.current || gameOver) return;
    const rect = gameAreaRef.current.getBoundingClientRect();
    const touch = e.touches[0];
    const x = ((touch.clientX - rect.left) / rect.width) * 100;
    setBasketX(Math.max(5, Math.min(95, x)));
  }, [gameOver]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
      <Card className="w-full max-w-2xl p-6 relative">
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2"
          onClick={onClose}
        >
          <X className="h-4 w-4" />
        </Button>

        <div className="text-center mb-4">
          <h2 className="text-2xl font-script font-bold text-primary mb-2">
            Catch the Falling Hearts!
          </h2>
          <div className="flex justify-between items-center max-w-md mx-auto">
            <div className="text-lg font-semibold">
              Score: <span className="text-primary">{score}</span>
            </div>
            <div className="text-lg font-semibold">
              Time: <span className="text-primary">{timeLeft}s</span>
            </div>
          </div>
        </div>

        <div
          ref={gameAreaRef}
          className="relative w-full h-96 bg-gradient-to-b from-secondary/20 to-accent/20 rounded-lg overflow-hidden border-2 border-border cursor-none"
          onMouseMove={handleMouseMove}
          onTouchMove={handleTouchMove}
        >
          {/* Falling hearts */}
          {hearts.map(heart => (
            <div
              key={heart.id}
              className="absolute transition-none pointer-events-none"
              style={{
                left: `${heart.x}%`,
                top: `${heart.y}%`,
                fontSize: `${heart.size}px`,
                transform: 'translate(-50%, -50%)',
              }}
            >
              ❤️
            </div>
          ))}

          {/* Basket */}
          <div
            className="absolute bottom-4 transition-all duration-100"
            style={{
              left: `${basketX}%`,
              transform: 'translateX(-50%)',
            }}
          >
            <div className="text-6xl">🧺</div>
          </div>

          {/* Game over overlay */}
          {gameOver && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/90">
              <div className="text-center">
                <Trophy className="h-16 w-16 text-primary mx-auto mb-4" />
                <h3 className="text-3xl font-script font-bold text-primary mb-2">
                  Game Over!
                </h3>
                <p className="text-xl">
                  Final Score: <span className="font-bold text-primary">{score}</span>
                </p>
              </div>
            </div>
          )}
        </div>

        <p className="text-center text-sm text-muted-foreground mt-4">
          Move your mouse or finger to catch the falling hearts!
        </p>
      </Card>
    </div>
  );
}
