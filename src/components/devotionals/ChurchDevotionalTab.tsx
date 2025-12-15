import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Church, 
  Plus, 
  Sparkles, 
  Calendar, 
  Copy, 
  Trash2, 
  BookOpen,
  ChevronRight,
  Loader2
} from "lucide-react";
import { useChurchDevotionals, useChurchDevotionalEntries, GeneratedDevotional } from "@/hooks/useChurchDevotionals";
import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

const WEEKLY_THEMES = [
  { day: "monday", theme: "Identity", description: "Who we are as the church" },
  { day: "tuesday", theme: "Righteousness", description: "Personal holiness" },
  { day: "wednesday", theme: "Prayer", description: "Intercession & unity" },
  { day: "thursday", theme: "Mission", description: "Witness & evangelism" },
  { day: "friday", theme: "Encouragement", description: "Perseverance & faithfulness" },
  { day: "sabbath", theme: "Rest & Reflection", description: "Trust & abiding" },
  { day: "sunday", theme: "Vision", description: "Kingdom perspective" },
];

interface ChurchDevotionalTabProps {
  onCreateNew: () => void;
}

export function ChurchDevotionalTab({ onCreateNew }: ChurchDevotionalTabProps) {
  const { churchDevotionals, isLoading, generateDevotional, deleteChurchDevotional, isGenerating } = useChurchDevotionals();
  const [selectedMinistry, setSelectedMinistry] = useState<string | null>(null);
  const [showGenerateDialog, setShowGenerateDialog] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [selectedDay, setSelectedDay] = useState("monday");
  const [customTheme, setCustomTheme] = useState("");
  const [generatedDevotional, setGeneratedDevotional] = useState<GeneratedDevotional | null>(null);

  const currentMinistry = churchDevotionals?.find(m => m.id === selectedMinistry);
  const { entries } = useChurchDevotionalEntries(selectedMinistry);

  const handleGenerate = async () => {
    if (!currentMinistry) return;
    
    const themeInfo = WEEKLY_THEMES.find(t => t.day === selectedDay);
    const theme = customTheme || themeInfo?.theme || "General";
    
    const result = await generateDevotional.mutateAsync({
      churchDevotionalId: currentMinistry.id,
      churchName: currentMinistry.church_name,
      theologicalFrame: currentMinistry.theological_frame || undefined,
      dayTheme: theme,
      dayOfWeek: selectedDay,
    });

    if (result?.devotional) {
      setGeneratedDevotional(result.devotional);
    }
  };

  const copyToClipboard = (devotional: GeneratedDevotional) => {
    const text = `📖 ${devotional.title}

📜 ${devotional.anchorScripture}
"${devotional.scriptureText}"

${devotional.meditation}

💡 Today's Practice:
${devotional.communalPractice}

🙏 Prayer:
${devotional.closingPrayer}`;

    navigator.clipboard.writeText(text);
    toast.success("Devotional copied to clipboard!");
  };

  const handleDelete = () => {
    if (deleteId) {
      deleteChurchDevotional.mutate(deleteId);
      if (selectedMinistry === deleteId) {
        setSelectedMinistry(null);
      }
      setDeleteId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
      </div>
    );
  }

  // Empty state
  if (!churchDevotionals || churchDevotionals.length === 0) {
    return (
      <Card className="border-2 border-dashed border-emerald-300 dark:border-emerald-700 bg-gradient-to-br from-emerald-50/50 to-teal-50/50 dark:from-emerald-950/20 dark:to-teal-950/20">
        <CardContent className="py-12 text-center">
          <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center mb-4 shadow-lg">
            <Church className="h-8 w-8 text-white" />
          </div>
          <h3 className="text-xl font-bold mb-2">Church Devotional Ministry</h3>
          <p className="text-muted-foreground text-sm mb-6 max-w-md mx-auto">
            Create daily devotionals for your congregation with a consistent theological frame and weekly theme cycle. Perfect for online churches and scattered congregations.
          </p>
          <Button 
            onClick={onCreateNew}
            className="bg-gradient-to-r from-emerald-500 to-teal-500"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Church Ministry
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Ministry Selector */}
      <div className="flex items-center gap-4">
        <Select value={selectedMinistry || ""} onValueChange={setSelectedMinistry}>
          <SelectTrigger className="w-[280px]">
            <SelectValue placeholder="Select a ministry" />
          </SelectTrigger>
          <SelectContent>
            {churchDevotionals.map((ministry) => (
              <SelectItem key={ministry.id} value={ministry.id}>
                <div className="flex items-center gap-2">
                  <Church className="h-4 w-4" />
                  {ministry.church_name}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Button variant="outline" onClick={onCreateNew}>
          <Plus className="h-4 w-4 mr-2" />
          New Ministry
        </Button>
      </div>

      {/* Selected Ministry View */}
      {currentMinistry && (
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left: Generate New */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-emerald-500" />
                Generate Devotional
              </CardTitle>
              <CardDescription>
                Create today's devotional for {currentMinistry.church_name}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Day of Week</Label>
                <Select value={selectedDay} onValueChange={setSelectedDay}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {WEEKLY_THEMES.map(({ day, theme }) => (
                      <SelectItem key={day} value={day}>
                        <span className="capitalize">{day}</span> - {theme}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Custom Theme (Optional)</Label>
                <Input
                  placeholder="Override the day's default theme..."
                  value={customTheme}
                  onChange={(e) => setCustomTheme(e.target.value)}
                />
              </div>

              <Button 
                className="w-full bg-gradient-to-r from-emerald-500 to-teal-500"
                onClick={() => setShowGenerateDialog(true)}
              >
                <Sparkles className="h-4 w-4 mr-2" />
                Generate Devotional
              </Button>

              <div className="pt-4 border-t">
                <Button 
                  variant="outline" 
                  size="sm"
                  className="text-destructive hover:text-destructive"
                  onClick={() => setDeleteId(currentMinistry.id)}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Ministry
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Right: Recent Entries */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-emerald-500" />
                Recent Devotionals
              </CardTitle>
              <CardDescription>
                Previously generated devotionals for easy reuse
              </CardDescription>
            </CardHeader>
            <CardContent>
              {entries && entries.length > 0 ? (
                <div className="space-y-3">
                  {entries.slice(0, 7).map((entry) => (
                    <div
                      key={entry.id}
                      className="p-4 rounded-lg border hover:border-emerald-300 transition-colors cursor-pointer group"
                      onClick={() => setGeneratedDevotional({
                        title: entry.title,
                        anchorScripture: entry.anchor_scripture,
                        scriptureText: entry.scripture_text || "",
                        meditation: entry.meditation,
                        communalPractice: entry.communal_practice,
                        closingPrayer: entry.closing_prayer,
                      })}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-semibold group-hover:text-emerald-600 transition-colors">
                            {entry.title}
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            {entry.anchor_scripture} • {format(new Date(entry.entry_date), "MMM d, yyyy")}
                          </p>
                          {entry.day_theme && (
                            <Badge variant="secondary" className="mt-2">{entry.day_theme}</Badge>
                          )}
                        </div>
                        <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-emerald-500" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No devotionals generated yet.</p>
                  <p className="text-sm">Generate your first one to get started!</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Generate Dialog */}
      <Dialog open={showGenerateDialog} onOpenChange={setShowGenerateDialog}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Generate Church Devotional</DialogTitle>
            <DialogDescription>
              Creating a {selectedDay} devotional for {currentMinistry?.church_name}
            </DialogDescription>
          </DialogHeader>

          {isGenerating ? (
            <div className="py-12 text-center">
              <Loader2 className="h-12 w-12 mx-auto animate-spin text-emerald-500 mb-4" />
              <p className="text-muted-foreground">Crafting your devotional with pastoral care...</p>
            </div>
          ) : generatedDevotional ? (
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800">
                <h3 className="font-bold text-lg mb-2">{generatedDevotional.title}</h3>
                <p className="text-sm font-medium text-emerald-700 dark:text-emerald-300">
                  📖 {generatedDevotional.anchorScripture}
                </p>
                <p className="text-sm italic mt-1">"{generatedDevotional.scriptureText}"</p>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Meditation</h4>
                <p className="text-sm whitespace-pre-wrap">{generatedDevotional.meditation}</p>
              </div>

              <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800">
                <h4 className="font-semibold mb-1 text-amber-700 dark:text-amber-300">💡 Today's Practice</h4>
                <p className="text-sm">{generatedDevotional.communalPractice}</p>
              </div>

              <div className="p-3 rounded-lg bg-purple-50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-800">
                <h4 className="font-semibold mb-1 text-purple-700 dark:text-purple-300">🙏 Closing Prayer</h4>
                <p className="text-sm italic">{generatedDevotional.closingPrayer}</p>
              </div>
            </div>
          ) : (
            <div className="py-8 text-center">
              <p className="text-muted-foreground mb-4">
                Ready to generate a <strong className="capitalize">{selectedDay}</strong> devotional
                {customTheme ? ` with theme "${customTheme}"` : ` with theme "${WEEKLY_THEMES.find(t => t.day === selectedDay)?.theme}"`}
              </p>
            </div>
          )}

          <DialogFooter>
            {generatedDevotional ? (
              <>
                <Button variant="outline" onClick={() => setGeneratedDevotional(null)}>
                  Generate Another
                </Button>
                <Button onClick={() => copyToClipboard(generatedDevotional)}>
                  <Copy className="h-4 w-4 mr-2" />
                  Copy to Clipboard
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" onClick={() => setShowGenerateDialog(false)}>
                  Cancel
                </Button>
                <Button 
                  onClick={handleGenerate}
                  disabled={isGenerating}
                  className="bg-gradient-to-r from-emerald-500 to-teal-500"
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  Generate
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Church Ministry?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this ministry and all its generated devotionals. This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* View Devotional Dialog */}
      {generatedDevotional && !showGenerateDialog && (
        <Dialog open={!!generatedDevotional} onOpenChange={() => setGeneratedDevotional(null)}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{generatedDevotional.title}</DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800">
                <p className="text-sm font-medium text-emerald-700 dark:text-emerald-300">
                  📖 {generatedDevotional.anchorScripture}
                </p>
                <p className="text-sm italic mt-1">"{generatedDevotional.scriptureText}"</p>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Meditation</h4>
                <p className="text-sm whitespace-pre-wrap">{generatedDevotional.meditation}</p>
              </div>

              <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800">
                <h4 className="font-semibold mb-1 text-amber-700 dark:text-amber-300">💡 Today's Practice</h4>
                <p className="text-sm">{generatedDevotional.communalPractice}</p>
              </div>

              <div className="p-3 rounded-lg bg-purple-50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-800">
                <h4 className="font-semibold mb-1 text-purple-700 dark:text-purple-300">🙏 Closing Prayer</h4>
                <p className="text-sm italic">{generatedDevotional.closingPrayer}</p>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setGeneratedDevotional(null)}>
                Close
              </Button>
              <Button onClick={() => copyToClipboard(generatedDevotional)}>
                <Copy className="h-4 w-4 mr-2" />
                Copy to Clipboard
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
