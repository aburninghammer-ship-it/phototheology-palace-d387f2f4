import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Settings, Type, BookOpen } from "lucide-react";
import { useUserPreferences } from "@/hooks/useUserPreferences";

export const ReadingControls = () => {
  const { preferences, updatePreference } = useUserPreferences();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm">
          <Settings className="h-4 w-4 mr-2" />
          Reading Settings
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="space-y-4">
          <div>
            <h4 className="font-medium mb-3 flex items-center gap-2">
              <Type className="h-4 w-4" />
              Font Size
            </h4>
            <RadioGroup
              value={preferences.bible_font_size}
              onValueChange={(value: any) =>
                updatePreference("bible_font_size", value)
              }
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="small" id="small" />
                <Label htmlFor="small">Small</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="medium" id="medium" />
                <Label htmlFor="medium">Medium</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="large" id="large" />
                <Label htmlFor="large">Large</Label>
              </div>
            </RadioGroup>
          </div>

          <div>
            <h4 className="font-medium mb-3 flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Reading Mode
            </h4>
            <RadioGroup
              value={preferences.reading_mode}
              onValueChange={(value: any) =>
                updatePreference("reading_mode", value)
              }
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="default" id="default" />
                <Label htmlFor="default">Default</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="focus" id="focus" />
                <Label htmlFor="focus">Focus (minimal distractions)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="study" id="study" />
                <Label htmlFor="study">Study (with notes)</Label>
              </div>
            </RadioGroup>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
