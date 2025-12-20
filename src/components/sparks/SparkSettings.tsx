import { Settings2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import type { SparkPreferences } from '@/hooks/useSparks';

interface SparkSettingsProps {
  preferences: SparkPreferences;
  onUpdate: (prefs: Partial<SparkPreferences>) => void;
}

export function SparkSettings({ preferences, onUpdate }: SparkSettingsProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Settings2 size={16} />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Spark Settings</DialogTitle>
          <DialogDescription>
            Customize how Jeeves surfaces discovery sparks during your study.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* Intensity */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Spark Intensity</Label>
            <RadioGroup
              value={preferences.intensity}
              onValueChange={(val) => onUpdate({ intensity: val as SparkPreferences['intensity'] })}
              className="grid grid-cols-4 gap-2"
            >
              {['off', 'subtle', 'normal', 'rich'].map((level) => (
                <div key={level} className="flex items-center space-x-2">
                  <RadioGroupItem value={level} id={`intensity-${level}`} />
                  <Label htmlFor={`intensity-${level}`} className="capitalize text-sm">
                    {level}
                  </Label>
                </div>
              ))}
            </RadioGroup>
            <p className="text-xs text-muted-foreground">
              Controls how many sparks appear per session.
            </p>
          </div>

          {/* Mode */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Study Mode</Label>
            <RadioGroup
              value={preferences.mode}
              onValueChange={(val) => onUpdate({ mode: val as SparkPreferences['mode'] })}
              className="grid grid-cols-3 gap-2"
            >
              {[
                { value: 'beginner', label: 'Beginner', desc: 'High relevance, moderate novelty' },
                { value: 'standard', label: 'Standard', desc: 'Balanced insights' },
                { value: 'master', label: 'Master', desc: 'High novelty required' }
              ].map((mode) => (
                <div key={mode.value} className="flex flex-col space-y-1">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value={mode.value} id={`mode-${mode.value}`} />
                    <Label htmlFor={`mode-${mode.value}`} className="text-sm">
                      {mode.label}
                    </Label>
                  </div>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* Toggles */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-sm">Auto-open Sparks</Label>
                <p className="text-xs text-muted-foreground">
                  Automatically show spark cards when generated
                </p>
              </div>
              <Switch
                checked={preferences.auto_open}
                onCheckedChange={(checked) => onUpdate({ auto_open: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-sm">Only After Save</Label>
                <p className="text-xs text-muted-foreground">
                  Only show sparks after you save your work
                </p>
              </div>
              <Switch
                checked={preferences.only_after_save}
                onCheckedChange={(checked) => onUpdate({ only_after_save: checked })}
              />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
