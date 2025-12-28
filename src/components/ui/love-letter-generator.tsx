import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { X, Download, Copy, Check } from 'lucide-react';
import { useState } from 'react';

interface LoveLetterGeneratorProps {
  favorites: string[];
  onClose: () => void;
}

export function LoveLetterGenerator({ favorites, onClose }: LoveLetterGeneratorProps) {
  const [copied, setCopied] = useState(false);

  const generateLetter = () => {
    const today = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    return `My Dearest Love,

${today}

As I sit here thinking about you, my heart overflows with countless reasons why I love you. Let me share some of the most special ones:

${favorites.map((reason, index) => `${index + 1}. ${reason}`).join('\n\n')}

These are just a few of the infinite reasons why you mean the world to me. Every day with you is a gift, and I am grateful for every moment we share together.

You are my sunshine, my inspiration, and my greatest adventure. Thank you for being you, and for letting me love you.

Forever yours,
With all my heart ❤️`;
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(generateLetter());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const handleDownload = () => {
    const letter = generateLetter();
    const blob = new Blob([letter], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'love-letter.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (favorites.length === 0) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
        <Card className="w-full max-w-md p-6 relative text-center">
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
          <h2 className="text-2xl font-script font-bold text-primary mb-4">
            No Favorites Yet
          </h2>
          <p className="text-muted-foreground mb-4">
            Add some favorite reasons by clicking the heart icon on reasons you love!
          </p>
          <Button onClick={onClose} className="bg-primary hover:bg-primary/90">
            Got it!
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4 overflow-y-auto">
      <Card className="w-full max-w-3xl p-6 xl:p-8 relative my-8">
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2"
          onClick={onClose}
        >
          <X className="h-4 w-4" />
        </Button>

        <h2 className="text-3xl font-script font-bold text-primary mb-6 text-center">
          Your Love Letter
        </h2>

        <div className="bg-gradient-to-br from-secondary/20 to-accent/20 p-6 xl:p-8 rounded-lg border-2 border-border mb-6 max-h-96 overflow-y-auto">
          <pre className="whitespace-pre-wrap font-sans text-sm xl:text-base leading-relaxed">
            {generateLetter()}
          </pre>
        </div>

        <div className="flex flex-col xl:flex-row gap-3 justify-center">
          <Button
            onClick={handleCopy}
            className="bg-primary hover:bg-primary/90"
            disabled={copied}
          >
            {copied ? (
              <>
                <Check className="mr-2 h-4 w-4" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="mr-2 h-4 w-4" />
                Copy to Clipboard
              </>
            )}
          </Button>
          <Button
            onClick={handleDownload}
            variant="outline"
            className="border-primary text-primary hover:bg-primary/10"
          >
            <Download className="mr-2 h-4 w-4" />
            Download as Text
          </Button>
        </div>
      </Card>
    </div>
  );
}
