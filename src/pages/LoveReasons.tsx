import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { HeartBurst } from '@/components/ui/heart-burst';
import { CatchHeartsGame } from '@/components/ui/catch-hearts-game';
import { LoveLetterGenerator } from '@/components/ui/love-letter-generator';
import { SettingsPanel } from '@/components/ui/settings-panel';
import { 
  Heart, 
  Share2, 
  Settings, 
  Gamepad2, 
  Mail, 
  Sparkles,
  Filter,
  Trophy,
  Lock,
  Unlock
} from 'lucide-react';
import { useSoundEffects } from '@/hooks/use-sound-effects';
import { triggerConfetti, triggerHeartConfetti, triggerSideConfetti } from '@/lib/confetti';
import { useToast } from '@/hooks/use-toast';

type Mood = 'all' | 'romantic' | 'funny' | 'sweet' | 'deep';

interface LoveReason {
  text: string;
  mood: Mood;
}

const LOVE_REASONS: LoveReason[] = [
  { text: "Your smile lights up my entire world", mood: 'romantic' },
  { text: "You make every ordinary moment feel magical", mood: 'sweet' },
  { text: "Your laugh is my favorite sound in the universe", mood: 'romantic' },
  { text: "You understand me like no one else ever could", mood: 'deep' },
  { text: "Your kindness touches everyone around you", mood: 'sweet' },
  { text: "You make me want to be a better person", mood: 'deep' },
  { text: "Your hugs feel like coming home", mood: 'romantic' },
  { text: "You believe in me even when I doubt myself", mood: 'deep' },
  { text: "Your eyes sparkle when you talk about your dreams", mood: 'romantic' },
  { text: "You make the simplest moments unforgettable", mood: 'sweet' },
  { text: "Your passion for life is contagious", mood: 'deep' },
  { text: "You listen with your whole heart", mood: 'sweet' },
  { text: "Your strength inspires me every single day", mood: 'deep' },
  { text: "You make me laugh until my cheeks hurt", mood: 'funny' },
  { text: "Your gentle touch calms all my worries", mood: 'romantic' },
  { text: "You see beauty in things others overlook", mood: 'deep' },
  { text: "Your creativity amazes me constantly", mood: 'sweet' },
  { text: "You make me feel safe and cherished", mood: 'romantic' },
  { text: "Your optimism brightens even the darkest days", mood: 'sweet' },
  { text: "You dance like nobody's watching", mood: 'funny' },
  { text: "Your intelligence is incredibly attractive", mood: 'deep' },
  { text: "You remember the little things that matter to me", mood: 'sweet' },
  { text: "Your courage to be yourself is beautiful", mood: 'deep' },
  { text: "You make every day an adventure", mood: 'funny' },
  { text: "Your heart is pure gold", mood: 'romantic' },
  { text: "You support my wildest dreams", mood: 'deep' },
  { text: "Your presence makes everything better", mood: 'sweet' },
  { text: "You love unconditionally and fearlessly", mood: 'romantic' },
  { text: "Your quirks make you perfectly imperfect", mood: 'funny' },
  { text: "You are my favorite person in the whole world", mood: 'romantic' },
  { text: "Your snoring is somehow adorable", mood: 'funny' },
  { text: "You make the best comfort food", mood: 'sweet' },
  { text: "Your terrible jokes always make me smile", mood: 'funny' },
  { text: "You challenge me to grow and evolve", mood: 'deep' },
  { text: "Your morning bedhead is the cutest thing ever", mood: 'funny' },
  { text: "You make me believe in soulmates", mood: 'romantic' },
  { text: "Your determination is absolutely inspiring", mood: 'deep' },
  { text: "You give the warmest hugs in the world", mood: 'sweet' },
  { text: "Your random dance moves crack me up", mood: 'funny' },
  { text: "You make me feel like I can conquer anything", mood: 'deep' },
];

export default function LoveReasons() {
  const [currentReasonIndex, setCurrentReasonIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [heartBursts, setHeartBursts] = useState<Array<{ id: number; x: number; y: number }>>([]);
  const [showReason, setShowReason] = useState(true);
  const [viewedReasons, setViewedReasons] = useState<Set<number>>(new Set([0]));
  const [favorites, setFavorites] = useState<Set<number>>(new Set());
  const [selectedMood, setSelectedMood] = useState<Mood>('all');
  const [showGame, setShowGame] = useState(false);
  const [showLetter, setShowLetter] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showMoodFilter, setShowMoodFilter] = useState(false);
  const [unlockedFeatures, setUnlockedFeatures] = useState<Set<string>>(new Set());
  const [gameScore, setGameScore] = useState(0);
  
  const { toast } = useToast();
  const {
    soundEnabled,
    musicEnabled,
    playHeartClick,
    playSuccess,
    playClick,
    playUnlock,
    toggleSound,
    toggleMusic,
  } = useSoundEffects();

  // Filter reasons by mood
  const filteredReasons = selectedMood === 'all' 
    ? LOVE_REASONS 
    : LOVE_REASONS.filter(r => r.mood === selectedMood);

  // Ensure currentReasonIndex is within bounds
  const safeIndex = Math.min(currentReasonIndex, filteredReasons.length - 1);
  const currentReason = filteredReasons[safeIndex] || filteredReasons[0];
  const progress = (viewedReasons.size / LOVE_REASONS.length) * 100;

  useEffect(() => {
    setIsAnimating(true);
    const timer = setTimeout(() => setIsAnimating(false), 500);
    return () => clearTimeout(timer);
  }, []);

  // Check for milestones and unlock features
  useEffect(() => {
    if (viewedReasons.size >= 10 && !unlockedFeatures.has('game')) {
      setUnlockedFeatures(prev => new Set(prev).add('game'));
      playUnlock();
      triggerHeartConfetti();
      toast({
        title: "🎮 Game Unlocked!",
        description: "You've unlocked the Catch Hearts mini-game!",
      });
    }
    if (viewedReasons.size >= 20 && !unlockedFeatures.has('letter')) {
      setUnlockedFeatures(prev => new Set(prev).add('letter'));
      playUnlock();
      triggerSideConfetti();
      toast({
        title: "💌 Love Letter Unlocked!",
        description: "You can now generate a love letter from your favorites!",
      });
    }
    if (viewedReasons.size === LOVE_REASONS.length && !unlockedFeatures.has('complete')) {
      setUnlockedFeatures(prev => new Set(prev).add('complete'));
      playSuccess();
      triggerConfetti();
      toast({
        title: "🎉 All Reasons Discovered!",
        description: "You've seen all the reasons why you're loved!",
      });
    }
  }, [viewedReasons.size, unlockedFeatures, playUnlock, playSuccess, toast]);

  const handleClick = useCallback((e: React.MouseEvent) => {
    playHeartClick();
    
    const newBurst = {
      id: Date.now(),
      x: e.clientX,
      y: e.clientY,
    };
    setHeartBursts((prev) => [...prev, newBurst]);

    setShowReason(false);

    setTimeout(() => {
      const nextIndex = (currentReasonIndex + 1) % filteredReasons.length;
      setCurrentReasonIndex(nextIndex);
      const actualIndex = LOVE_REASONS.findIndex(r => r.text === filteredReasons[nextIndex].text);
      setViewedReasons(prev => new Set(prev).add(actualIndex));
      setShowReason(true);
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 500);
    }, 300);
  }, [currentReasonIndex, filteredReasons, playHeartClick]);

  const handleBurstComplete = (id: number) => {
    setHeartBursts((prev) => prev.filter((burst) => burst.id !== id));
  };

  const toggleFavorite = useCallback(() => {
    if (!currentReason) return;
    
    playClick();
    const actualIndex = LOVE_REASONS.findIndex(r => r.text === currentReason.text);
    if (actualIndex === -1) return;
    
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(actualIndex)) {
        newFavorites.delete(actualIndex);
        toast({
          title: "Removed from favorites",
          description: "Reason removed from your collection",
        });
      } else {
        newFavorites.add(actualIndex);
        triggerHeartConfetti();
        toast({
          title: "❤️ Added to favorites!",
          description: "Reason saved to your collection",
        });
      }
      return newFavorites;
    });
  }, [currentReason, playClick, toast]);

  const handleShare = useCallback(async () => {
    if (!currentReason) return;
    
    playClick();
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'Reasons Why I Love You',
          text: currentReason.text,
        });
      } else {
        await navigator.clipboard.writeText(currentReason.text);
        toast({
          title: "Copied to clipboard!",
          description: "Share this reason with someone special",
        });
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  }, [currentReason, playClick, toast]);

  const handleMoodChange = useCallback((mood: Mood) => {
    playClick();
    setSelectedMood(mood);
    setCurrentReasonIndex(0);
    setShowMoodFilter(false);
    toast({
      title: `Filter: ${mood === 'all' ? 'All Reasons' : mood.charAt(0).toUpperCase() + mood.slice(1)}`,
      description: `Showing ${mood === 'all' ? 'all' : mood} reasons`,
    });
  }, [playClick, toast]);

  const handleGameComplete = useCallback((score: number) => {
    setGameScore(prev => Math.max(prev, score));
    setShowGame(false);
    playSuccess();
    triggerConfetti();
    toast({
      title: "🏆 Great Job!",
      description: `You scored ${score} points!`,
    });
  }, [playSuccess, toast]);

  const actualIndex = currentReason ? LOVE_REASONS.findIndex(r => r.text === currentReason.text) : -1;
  const isFavorite = actualIndex >= 0 && favorites.has(actualIndex);
  const favoriteReasons = Array.from(favorites)
    .sort((a, b) => a - b)
    .map(index => LOVE_REASONS[index].text);

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center p-4 xl:p-8 cursor-pointer overflow-hidden relative"
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

      {/* Top bar with controls */}
      <div className="absolute top-4 left-4 right-4 z-20 flex justify-between items-start pointer-events-none">
        <div className="pointer-events-auto">
          <Card className="p-3 bg-card/95 backdrop-blur-sm">
            <div className="flex items-center gap-2">
              <Trophy className="h-4 w-4 text-primary" />
              <div className="text-xs">
                <div className="font-semibold">Progress</div>
                <div className="text-muted-foreground">
                  {viewedReasons.size}/{LOVE_REASONS.length}
                </div>
              </div>
            </div>
            <div className="mt-2 w-32 h-2 bg-secondary/30 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </Card>
        </div>

        <div className="flex gap-2 pointer-events-auto">
          <Button
            size="icon"
            variant="outline"
            className="bg-card/95 backdrop-blur-sm hover:bg-primary hover:text-primary-foreground"
            onClick={(e) => {
              e.stopPropagation();
              playClick();
              setShowSettings(true);
            }}
          >
            <Settings className="h-4 w-4" />
          </Button>
        </div>
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
        <h1 className="font-script text-4xl xl:text-6xl font-bold text-primary mb-4 xl:mb-6">
          Reasons Why I Love You
        </h1>

        {/* Mood badge */}
        {selectedMood !== 'all' && (
          <div className="inline-flex items-center gap-2 px-4 py-1 bg-primary/20 rounded-full text-sm text-primary mb-4">
            <Sparkles className="h-3 w-3" />
            {selectedMood.charAt(0).toUpperCase() + selectedMood.slice(1)}
          </div>
        )}

        {/* Reason display */}
        <div className="min-h-[120px] xl:min-h-[160px] flex items-center justify-center mb-6 xl:mb-8">
          <p
            className={`font-script text-2xl xl:text-4xl text-foreground leading-relaxed transition-opacity duration-500 ${
              showReason && !isAnimating ? 'opacity-100' : 'opacity-0'
            }`}
          >
            {currentReason?.text || ''}
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex flex-wrap justify-center gap-3 mb-6">
          <Button
            size="lg"
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-full transition-all duration-300 hover:scale-110 animate-pulse-glow"
            onClick={(e) => {
              e.stopPropagation();
              handleClick(e as unknown as React.MouseEvent);
            }}
          >
            <Heart className="mr-2 h-5 w-5 fill-current" />
            Next Reason
          </Button>

          <Button
            size="icon"
            variant="outline"
            className={`rounded-full transition-all ${
              isFavorite ? 'bg-primary text-primary-foreground border-primary' : ''
            }`}
            onClick={(e) => {
              e.stopPropagation();
              toggleFavorite();
            }}
          >
            <Heart className={`h-5 w-5 ${isFavorite ? 'fill-current' : ''}`} />
          </Button>

          <Button
            size="icon"
            variant="outline"
            className="rounded-full"
            onClick={(e) => {
              e.stopPropagation();
              handleShare();
            }}
          >
            <Share2 className="h-5 w-5" />
          </Button>

          <Button
            size="icon"
            variant="outline"
            className="rounded-full"
            onClick={(e) => {
              e.stopPropagation();
              playClick();
              setShowMoodFilter(!showMoodFilter);
            }}
          >
            <Filter className="h-5 w-5" />
          </Button>
        </div>

        {/* Mood filter dropdown */}
        {showMoodFilter && (
          <Card className="mb-6 p-4 bg-card/95 backdrop-blur-sm">
            <div className="flex flex-wrap justify-center gap-2">
              {(['all', 'romantic', 'funny', 'sweet', 'deep'] as Mood[]).map((mood) => (
                <Button
                  key={mood}
                  size="sm"
                  variant={selectedMood === mood ? 'default' : 'outline'}
                  className={selectedMood === mood ? 'bg-primary' : ''}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleMoodChange(mood);
                  }}
                >
                  {mood === 'all' ? 'All' : mood.charAt(0).toUpperCase() + mood.slice(1)}
                </Button>
              ))}
            </div>
          </Card>
        )}

        {/* Feature buttons */}
        <div className="flex flex-wrap justify-center gap-3">
          <Button
            variant="outline"
            className="border-primary text-primary hover:bg-primary/10"
            onClick={(e) => {
              e.stopPropagation();
              if (unlockedFeatures.has('game')) {
                playClick();
                setShowGame(true);
              } else {
                toast({
                  title: "🔒 Locked",
                  description: "View 10 reasons to unlock the mini-game!",
                });
              }
            }}
          >
            {unlockedFeatures.has('game') ? (
              <Unlock className="mr-2 h-4 w-4" />
            ) : (
              <Lock className="mr-2 h-4 w-4" />
            )}
            <Gamepad2 className="mr-2 h-4 w-4" />
            Play Game
            {gameScore > 0 && <span className="ml-2 text-xs">({gameScore})</span>}
          </Button>

          <Button
            variant="outline"
            className="border-primary text-primary hover:bg-primary/10"
            onClick={(e) => {
              e.stopPropagation();
              if (unlockedFeatures.has('letter')) {
                playClick();
                setShowLetter(true);
              } else {
                toast({
                  title: "🔒 Locked",
                  description: "View 20 reasons to unlock the love letter generator!",
                });
              }
            }}
          >
            {unlockedFeatures.has('letter') ? (
              <Unlock className="mr-2 h-4 w-4" />
            ) : (
              <Lock className="mr-2 h-4 w-4" />
            )}
            <Mail className="mr-2 h-4 w-4" />
            Love Letter
            {favorites.size > 0 && <span className="ml-2 text-xs">({favorites.size})</span>}
          </Button>
        </div>

        {/* Instruction text */}
        <p className="text-muted-foreground text-sm xl:text-base mt-6">
          Click anywhere or use the button to discover more reasons
        </p>
      </Card>

      {/* Footer */}
      <div className="absolute bottom-4 left-0 right-0 text-center pointer-events-none">
        <p className="text-muted-foreground text-xs xl:text-sm">
          Made with ❤️ for someone special
        </p>
      </div>

      {/* Modals */}
      {showGame && (
        <CatchHeartsGame
          onClose={() => setShowGame(false)}
          onComplete={handleGameComplete}
        />
      )}

      {showLetter && (
        <LoveLetterGenerator
          favorites={favoriteReasons}
          onClose={() => setShowLetter(false)}
        />
      )}

      {showSettings && (
        <SettingsPanel
          soundEnabled={soundEnabled}
          musicEnabled={musicEnabled}
          onToggleSound={toggleSound}
          onToggleMusic={toggleMusic}
          onClose={() => setShowSettings(false)}
        />
      )}
    </div>
  );
}
