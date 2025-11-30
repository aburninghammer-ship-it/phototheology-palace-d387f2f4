import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sparkles, Wand2, Plus, Trash2, Save, User, Globe } from "lucide-react";
import { PRESET_SEQUENCES, ROOM_TAG_OPTIONS, ReadingSequenceBlock, SequenceItem } from "@/types/readingSequence";
import { VoiceId } from "@/hooks/useTextToSpeech";
import { useUserPresets, PresetItem, UserPreset } from "@/hooks/useUserPresets";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface PresetSequencesProps {
  onAddToSequence: (sequenceNumber: number, items: SequenceItem[]) => void;
  currentSequences: ReadingSequenceBlock[];
  onSaveAsPreset?: (items: PresetItem[], name: string, description: string, roomTags: string[], isPublic: boolean) => void;
}

export const PresetSequences = ({ onAddToSequence, currentSequences, onSaveAsPreset }: PresetSequencesProps) => {
  const { presets, isLoading, isSaving, savePreset, deletePreset } = useUserPresets();
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [newPresetName, setNewPresetName] = useState("");
  const [newPresetDescription, setNewPresetDescription] = useState("");
  const [newPresetPublic, setNewPresetPublic] = useState(false);
  const [selectedSequenceToSave, setSelectedSequenceToSave] = useState<number>(1);

  const convertToSequenceItems = (items: { book: string; chapter: number }[]): SequenceItem[] => {
    return items.map((item, idx) => ({
      id: crypto.randomUUID(),
      book: item.book,
      chapter: item.chapter,
      order: idx,
    }));
  };

  const handleSelectPreset = (preset: typeof PRESET_SEQUENCES[0] | UserPreset, targetSequence: number) => {
    const items = convertToSequenceItems(preset.items);
    onAddToSequence(targetSequence, items);
  };

  const handleSaveCurrentAsPreset = async () => {
    const selectedSeq = currentSequences.find(s => s.sequenceNumber === selectedSequenceToSave);
    if (!selectedSeq || selectedSeq.items.length === 0) return;

    const presetItems: PresetItem[] = selectedSeq.items.map(item => ({
      book: item.book,
      chapter: item.chapter
    }));

    await savePreset({
      name: newPresetName,
      description: newPresetDescription,
      room_tags: [],
      items: presetItems,
      is_public: newPresetPublic
    });

    setSaveDialogOpen(false);
    setNewPresetName("");
    setNewPresetDescription("");
    setNewPresetPublic(false);
  };

  const sequenceOptions = currentSequences.map(s => ({
    value: s.sequenceNumber,
    label: `Sequence ${s.sequenceNumber}`,
    hasItems: s.items.length > 0
  }));

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-amber-500" />
            Reading Presets
          </CardTitle>
          <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="gap-1">
                <Save className="h-4 w-4" />
                Save as Preset
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Save Current Sequence as Preset</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div>
                  <Label>Which sequence to save?</Label>
                  <Select 
                    value={String(selectedSequenceToSave)} 
                    onValueChange={(v) => setSelectedSequenceToSave(parseInt(v))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-popover">
                      {sequenceOptions.map(opt => (
                        <SelectItem key={opt.value} value={String(opt.value)} disabled={!opt.hasItems}>
                          {opt.label} {opt.hasItems ? `(${currentSequences.find(s => s.sequenceNumber === opt.value)?.items.length} chapters)` : "(empty)"}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Preset Name</Label>
                  <Input 
                    value={newPresetName} 
                    onChange={(e) => setNewPresetName(e.target.value)}
                    placeholder="e.g., My Prophecy Study"
                  />
                </div>
                <div>
                  <Label>Description (optional)</Label>
                  <Textarea 
                    value={newPresetDescription} 
                    onChange={(e) => setNewPresetDescription(e.target.value)}
                    placeholder="Brief description of this preset..."
                    rows={2}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label className="flex items-center gap-2">
                    <Globe className="h-4 w-4" />
                    Make Public
                  </Label>
                  <Switch checked={newPresetPublic} onCheckedChange={setNewPresetPublic} />
                </div>
                <Button 
                  onClick={handleSaveCurrentAsPreset} 
                  disabled={!newPresetName || isSaving}
                  className="w-full"
                >
                  {isSaving ? "Saving..." : "Save Preset"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="builtin">
          <TabsList className="mb-4">
            <TabsTrigger value="builtin" className="gap-1">
              <Wand2 className="h-3 w-3" />
              Built-in
            </TabsTrigger>
            <TabsTrigger value="my-presets" className="gap-1">
              <User className="h-3 w-3" />
              My Presets
            </TabsTrigger>
          </TabsList>

          <TabsContent value="builtin">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {PRESET_SEQUENCES.map((preset, idx) => (
                <PresetCard 
                  key={idx}
                  name={preset.name}
                  description={preset.description}
                  roomTags={preset.roomTags}
                  itemCount={preset.items.length}
                  sequenceOptions={sequenceOptions}
                  onSelect={(seq) => handleSelectPreset(preset, seq)}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="my-presets">
            {isLoading ? (
              <p className="text-muted-foreground text-center py-8">Loading presets...</p>
            ) : presets.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>No saved presets yet.</p>
                <p className="text-sm">Create a sequence above and save it as a preset!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {presets.map((preset) => (
                  <PresetCard 
                    key={preset.id}
                    name={preset.name}
                    description={preset.description}
                    roomTags={preset.room_tags}
                    itemCount={preset.items.length}
                    sequenceOptions={sequenceOptions}
                    onSelect={(seq) => handleSelectPreset(preset, seq)}
                    onDelete={() => deletePreset(preset.id)}
                    isUserPreset
                    isPublic={preset.is_public}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

interface PresetCardProps {
  name: string;
  description?: string;
  roomTags: string[];
  itemCount: number;
  sequenceOptions: { value: number; label: string; hasItems: boolean }[];
  onSelect: (sequenceNumber: number) => void;
  onDelete?: () => void;
  isUserPreset?: boolean;
  isPublic?: boolean;
}

const PresetCard = ({ 
  name, 
  description, 
  roomTags, 
  itemCount, 
  sequenceOptions, 
  onSelect, 
  onDelete,
  isUserPreset,
  isPublic
}: PresetCardProps) => {
  const [selectedSeq, setSelectedSeq] = useState<number>(1);

  return (
    <div className="p-4 rounded-lg border bg-card hover:bg-accent/10 hover:border-primary/30 transition-all space-y-3">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h4 className="font-semibold flex items-center gap-2">
            {name}
            {isPublic && <Globe className="h-3 w-3 text-muted-foreground" />}
          </h4>
          {description && (
            <p className="text-sm text-muted-foreground mt-1">{description}</p>
          )}
        </div>
        {isUserPreset && onDelete && (
          <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={onDelete}>
            <Trash2 className="h-3 w-3" />
          </Button>
        )}
      </div>
      
      <div className="flex flex-wrap gap-1">
        {roomTags.map((tag) => {
          const tagInfo = ROOM_TAG_OPTIONS.find((t) => t.value === tag);
          return (
            <Badge key={tag} variant="outline" className="text-[10px]">
              {tagInfo?.label || tag}
            </Badge>
          );
        })}
      </div>
      
      <p className="text-xs text-muted-foreground">{itemCount} chapters</p>
      
      <div className="flex gap-2 items-center pt-2 border-t">
        <Select value={String(selectedSeq)} onValueChange={(v) => setSelectedSeq(parseInt(v))}>
          <SelectTrigger className="h-8 text-xs flex-1">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-popover">
            {sequenceOptions.map(opt => (
              <SelectItem key={opt.value} value={String(opt.value)} className="text-xs">
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button size="sm" className="h-8 gap-1" onClick={() => onSelect(selectedSeq)}>
          <Plus className="h-3 w-3" />
          Add
        </Button>
      </div>
    </div>
  );
};
