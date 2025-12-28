import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { HeartBurst } from '@/components/ui/heart-burst';
import { Heart } from 'lucide-react';

const LOVE_REASONS = [
  "Your smile lights up my entire world",
  "You make every ordinary moment feel magical",
  "Your laugh is my favorite sound in the universe",
  "You understand me like no one else ever could",
  "Your kindness touches everyone around you",
  "You make me want to be a better person",
  "Your hugs feel like coming home",
  "You believe in me even when I doubt myself",
  "Your eyes sparkle when you talk about your dreams",
  "You make the simplest moments unforgettable",
  "Your passion for life is contagious",
  "You listen with your whole heart",
  "Your strength inspires me every single day",
  "You make me laugh until my cheeks hurt",
  "Your gentle touch calms all my worries",
  "You see beauty in things others overlook",
  "Your creativity amazes me constantly",
  "You make me feel safe and cherished",
  "Your optimism brightens even the darkest days",
  "You dance like nobody's watching",
  "Your intelligence is incredibly attractive",
  "You remember the little things that matter to me",
  "Your courage to be yourself is beautiful",
  "You make every day an adventure",
  "Your heart is pure gold",
  "You support my wildest dreams",
  "Your presence makes everything better",
  "You love unconditionally and fearlessly",
  "Your quirks make you perfectly imperfect",
  "You are my favorite person in the whole world",
];

export default function LoveReasons() {
  const [currentReasonIndex, setCurrentReasonIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [heartBursts, setHeartBursts] = useState<Array<{ id: number; x: number; y: number }>>([]);
  const [showReason, setShowReason] = useState(true);

  useEffect(() => {
    // Initial animation
    setIsAnimating(true);
    const timer = setTimeout(() => setIsAnimating(false), 500);
    return () => clearTimeout(timer);
  }, []);

  const handleClick = (e: React.MouseEvent) => {
    // Create heart burst at click position
    const newBurst = {
      id: Date.now(),
      x: e.clientX,
      y: e.clientY,
    };
    setHeartBursts((prev) => [...prev, newBurst]);

    // Fade out current reason
    setShowReason(false);

    // Change to next reason after fade out
    setTimeout(() => {
      setCurrentReasonIndex((prev) => (prev + 1) % LOVE_REASONS.length);
      setShowReason(true);
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 500);
    }, 300);
  };

  const handleBurstComplete = (id: number) => {
    setHeartBursts((prev) => prev.filter((burst) => burst.id !== id));
  };

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center p-4 xl:p-8 cursor-pointer overflow-hidden"
      style={{
        background: 'var(--gradient-background)',
      }}
      onClick={handleClick}
    >
      {/* Heart bursts */}
      {heartBursts.map((burst) => (
        <HeartBurst
          key={burst.id}
          x={burst.x}
          y={burst.y}
          onComplete={() => handleBurstComplete(burst.id)}
        />
      ))}

      {/* Floating hearts background decoration */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute text-secondary/20 text-4xl xl:text-6xl"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float-up ${10 + Math.random() * 10}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          >
            ❤️
          </div>
        ))}
      </div>

      {/* Main content card */}
      <Card
        className="relative z-10 w-full max-w-2xl xl:max-w-4xl p-8 xl:p-16 text-center transition-all duration-300 hover:scale-105"
        style={{
          background: 'var(--gradient-card)',
          boxShadow: 'var(--shadow-card)',
        }}
      >
        {/* Decorative hearts */}
        <div className="absolute -top-4 -left-4 text-primary text-5xl xl:text-6xl animate-pulse">
          ❤️
        </div>
        <div className="absolute -top-4 -right-4 text-primary text-5xl xl:text-6xl animate-pulse" style={{ animationDelay: '0.5s' }}>
          ❤️
        </div>
        <div className="absolute -bottom-4 -left-4 text-primary text-5xl xl:text-6xl animate-pulse" style={{ animationDelay: '1s' }}>
          ❤️
        </div>
        <div className="absolute -bottom-4 -right-4 text-primary text-5xl xl:text-6xl animate-pulse" style={{ animationDelay: '1.5s' }}>
          ❤️
        </div>

        {/* Title */}
        <h1 className="font-script text-4xl xl:text-6xl font-bold text-primary mb-8 xl:mb-12">
          Reasons Why I Love You
        </h1>

        {/* Reason display */}
        <div className="min-h-[120px] xl:min-h-[160px] flex items-center justify-center mb-8 xl:mb-12">
          <p
            className={`font-script text-2xl xl:text-4xl text-foreground leading-relaxed transition-opacity duration-500 ${
              showReason && !isAnimating ? 'opacity-100' : 'opacity-0'
            }`}
          >
            {LOVE_REASONS[currentReasonIndex]}
          </p>
        </div>

        {/* Click instruction */}
        <div className="flex flex-col items-center gap-4">
          <Button
            size="lg"
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-base xl:text-lg px-8 xl:px-12 py-4 xl:py-6 rounded-full transition-all duration-300 hover:scale-110 animate-pulse-glow"
            onClick={(e) => {
              e.stopPropagation();
              handleClick(e as unknown as React.MouseEvent);
            }}
          >
            <Heart className="mr-2 h-5 w-5 xl:h-6 xl:w-6 fill-current" />
            Click for Another Reason
          </Button>

          <p className="text-muted-foreground text-sm xl:text-base">
            or click anywhere on the page
          </p>

          {/* Counter */}
          <p className="text-muted-foreground text-xs xl:text-sm mt-4">
            Reason {currentReasonIndex + 1} of {LOVE_REASONS.length}
          </p>
        </div>
      </Card>

      {/* Footer */}
      <div className="absolute bottom-4 left-0 right-0 text-center">
        <p className="text-muted-foreground text-xs xl:text-sm">
          Made with ❤️ for someone special
        </p>
      </div>
    </div>
  );
}
