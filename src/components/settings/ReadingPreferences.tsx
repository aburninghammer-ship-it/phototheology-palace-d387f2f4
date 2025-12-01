import { useUserPreferences } from '@/hooks/useUserPreferences';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Volume2, BookOpen, Sparkles } from 'lucide-react';

/**
 * Component for managing reading experience preferences
 * Allows users to configure audio vs read-along preferences
 */
export function ReadingPreferences() {
  const { preferences, updatePreference } = useUserPreferences();

  const handleReadingExperienceChange = (value: string) => {
    updatePreference('preferred_reading_experience', value as 'audio' | 'read-along' | 'auto');
  };

  const handleSpeedChange = (value: number[]) => {
    updatePreference('read_along_speed', value[0]);
  };

  const estimatedMinutes = (wordCount: number) => {
    return Math.ceil(wordCount / preferences.read_along_speed);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="h-5 w-5" />
          Reading Experience
        </CardTitle>
        <CardDescription>
          Choose your preferred way to experience Bible readings and content
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Reading Mode Selection */}
        <div className="space-y-3">
          <Label className="text-base font-semibold">Preferred Reading Mode</Label>
          <RadioGroup
            value={preferences.preferred_reading_experience}
            onValueChange={handleReadingExperienceChange}
            className="space-y-3"
          >
            <div className="flex items-start space-x-3 space-y-0 rounded-lg border p-4 hover:bg-accent/50 transition-colors">
              <RadioGroupItem value="audio" id="audio" />
              <div className="flex-1">
                <Label htmlFor="audio" className="flex items-center gap-2 font-medium cursor-pointer">
                  <Volume2 className="h-4 w-4" />
                  Audio Narration
                </Label>
                <p className="text-sm text-muted-foreground mt-1">
                  Listen to high-quality AI voices. Automatically falls back to browser voices when offline.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3 space-y-0 rounded-lg border p-4 hover:bg-accent/50 transition-colors">
              <RadioGroupItem value="read-along" id="read-along" />
              <div className="flex-1">
                <Label htmlFor="read-along" className="flex items-center gap-2 font-medium cursor-pointer">
                  <BookOpen className="h-4 w-4" />
                  Read-Along Mode
                </Label>
                <p className="text-sm text-muted-foreground mt-1">
                  Follow along as words are highlighted. Works completely offline, no internet required.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3 space-y-0 rounded-lg border p-4 hover:bg-accent/50 transition-colors">
              <RadioGroupItem value="auto" id="auto" />
              <div className="flex-1">
                <Label htmlFor="auto" className="flex items-center gap-2 font-medium cursor-pointer">
                  <Sparkles className="h-4 w-4" />
                  Automatic
                </Label>
                <p className="text-sm text-muted-foreground mt-1">
                  Uses audio when online, automatically switches to read-along when offline.
                </p>
              </div>
            </div>
          </RadioGroup>
        </div>

        {/* Read-Along Speed Setting */}
        <div className="space-y-3 pt-4 border-t">
          <div className="flex items-center justify-between">
            <Label className="text-base font-semibold">Read-Along Speed</Label>
            <span className="text-sm text-muted-foreground font-mono">
              {preferences.read_along_speed} WPM
            </span>
          </div>
          <Slider
            value={[preferences.read_along_speed]}
            onValueChange={handleSpeedChange}
            min={100}
            max={400}
            step={25}
            className="w-full"
          />
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Slower (100 WPM)</span>
            <span>Faster (400 WPM)</span>
          </div>

          {/* Reading Time Examples */}
          <div className="mt-4 p-3 bg-muted/50 rounded-lg space-y-2">
            <p className="text-sm font-medium">Estimated Reading Times:</p>
            <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
              <div>• 100 words: ~{estimatedMinutes(100)} min</div>
              <div>• 500 words: ~{estimatedMinutes(500)} min</div>
              <div>• 1,000 words: ~{estimatedMinutes(1000)} min</div>
              <div>• 2,000 words: ~{estimatedMinutes(2000)} min</div>
            </div>
          </div>
        </div>

        {/* Info Section */}
        <div className="pt-4 border-t">
          <p className="text-sm text-muted-foreground">
            💡 <strong>Tip:</strong> You can always toggle between audio and read-along modes
            using the tab buttons when reading content, regardless of your default preference.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
