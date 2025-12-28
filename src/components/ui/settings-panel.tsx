import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { X, Volume2, VolumeX, Music } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

interface SettingsPanelProps {
  soundEnabled: boolean;
  musicEnabled: boolean;
  onToggleSound: () => void;
  onToggleMusic: () => void;
  onClose: () => void;
}

export function SettingsPanel({
  soundEnabled,
  musicEnabled,
  onToggleSound,
  onToggleMusic,
  onClose,
}: SettingsPanelProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
      <Card className="w-full max-w-md p-6 relative">
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2"
          onClick={onClose}
        >
          <X className="h-4 w-4" />
        </Button>

        <h2 className="text-2xl font-script font-bold text-primary mb-6 text-center">
          Settings
        </h2>

        <div className="space-y-6">
          {/* Sound Effects Toggle */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {soundEnabled ? (
                <Volume2 className="h-5 w-5 text-primary" />
              ) : (
                <VolumeX className="h-5 w-5 text-muted-foreground" />
              )}
              <div>
                <Label htmlFor="sound-toggle" className="text-base font-semibold">
                  Sound Effects
                </Label>
                <p className="text-sm text-muted-foreground">
                  Play sounds on interactions
                </p>
              </div>
            </div>
            <Switch
              id="sound-toggle"
              checked={soundEnabled}
              onCheckedChange={onToggleSound}
            />
          </div>

          {/* Background Music Toggle */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Music className={`h-5 w-5 ${musicEnabled ? 'text-primary' : 'text-muted-foreground'}`} />
              <div>
                <Label htmlFor="music-toggle" className="text-base font-semibold">
                  Background Music
                </Label>
                <p className="text-sm text-muted-foreground">
                  Play ambient music
                </p>
              </div>
            </div>
            <Switch
              id="music-toggle"
              checked={musicEnabled}
              onCheckedChange={onToggleMusic}
            />
          </div>

          {/* Info Section */}
          <div className="pt-4 border-t border-border">
            <h3 className="font-semibold mb-2">About</h3>
            <p className="text-sm text-muted-foreground">
              This interactive website is designed to express love and affection in a playful, engaging way. Explore different features and enjoy the experience!
            </p>
          </div>
        </div>

        <Button
          onClick={onClose}
          className="w-full mt-6 bg-primary hover:bg-primary/90"
        >
          Close
        </Button>
      </Card>
    </div>
  );
}
