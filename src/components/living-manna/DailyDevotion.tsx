import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { 
  BookOpen, 
  Heart, 
  Users, 
  Flame,
  RefreshCw,
  Share2,
  Copy,
  CheckCircle
} from "lucide-react";

interface DevotionContent {
  title: string;
  anchorScripture: string;
  scriptureText: string;
  ptRoom: string;
  ptFloor: string;
  meditation: string;
  ministryChallenge: string;
  righteousnessCall: string;
  studyPrompt: string;
  prayerFocus: string;
}

const DAILY_THEMES = [
  { day: "Sunday", theme: "Vision & Mission", icon: Users, ptRoom: "PR", ptFloor: "5th Floor - Vision" },
  { day: "Monday", theme: "Identity in Christ", icon: Heart, ptRoom: "CR", ptFloor: "4th Floor - Next Level" },
  { day: "Tuesday", theme: "Righteousness & Holiness", icon: Flame, ptRoom: "FRt", ptFloor: "4th Floor - Next Level" },
  { day: "Wednesday", theme: "Prayer & Intercession", icon: BookOpen, ptRoom: "MR", ptFloor: "7th Floor - Spiritual" },
  { day: "Thursday", theme: "Ministry & Witness", icon: Users, ptRoom: "3A", ptFloor: "5th Floor - Vision" },
  { day: "Friday", theme: "Study & Meditation", icon: BookOpen, ptRoom: "DR", ptFloor: "4th Floor - Next Level" },
  { day: "Saturday", theme: "Rest & Reflection", icon: Heart, ptRoom: "BL", ptFloor: "5th Floor - Vision" },
];

interface DailyDevotionProps {
  churchId: string;
  churchName: string;
}

export function DailyDevotion({ churchId, churchName }: DailyDevotionProps) {
  const [devotion, setDevotion] = useState<DevotionContent | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const today = new Date();
  const dayOfWeek = today.toLocaleDateString('en-US', { weekday: 'long' });
  const todayTheme = DAILY_THEMES.find(t => t.day === dayOfWeek) || DAILY_THEMES[0];
  const ThemeIcon = todayTheme.icon;

  const generateDevotion = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-pt-devotion', {
        body: {
          churchName,
          churchId,
          dayOfWeek,
          theme: todayTheme.theme,
          ptRoom: todayTheme.ptRoom,
          ptFloor: todayTheme.ptFloor
        }
      });

      if (error) throw error;
      setDevotion(data.devotion);
      toast.success("Today's devotion generated!");
    } catch (error) {
      console.error('Error generating devotion:', error);
      toast.error("Failed to generate devotion");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async () => {
    if (!devotion) return;
    
    const text = `${devotion.title}\n\n📖 ${devotion.anchorScripture}\n"${devotion.scriptureText}"\n\n${devotion.meditation}\n\n🔥 Ministry Challenge: ${devotion.ministryChallenge}\n\n✨ Righteousness Call: ${devotion.righteousnessCall}\n\n📚 Study Prompt: ${devotion.studyPrompt}\n\n🙏 Prayer Focus: ${devotion.prayerFocus}\n\n— ${churchName} Daily Devotion`;
    
    await navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-full bg-primary/20">
                <ThemeIcon className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle className="text-xl">{dayOfWeek}'s Devotion</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Theme: {todayTheme.theme}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                {todayTheme.ptRoom}
              </Badge>
              <Badge variant="secondary" className="text-xs">
                {todayTheme.ptFloor}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Using Phototheology principles to ground {churchName} in Scripture, 
            calling members to ministry, righteous living, faithful study, and fervent prayer.
          </p>
          <Button 
            onClick={generateDevotion} 
            disabled={loading}
            className="w-full"
          >
            {loading ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Flame className="h-4 w-4 mr-2" />
                Generate Today's Devotion
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Devotion Content */}
      {devotion && (
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">{devotion.title}</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={copyToClipboard}
              >
                {copied ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="outline">{devotion.ptRoom}</Badge>
              <span className="text-xs text-muted-foreground">{devotion.ptFloor}</span>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="scripture" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="scripture" className="text-xs">Scripture</TabsTrigger>
                <TabsTrigger value="meditation" className="text-xs">Meditation</TabsTrigger>
                <TabsTrigger value="action" className="text-xs">Action</TabsTrigger>
                <TabsTrigger value="prayer" className="text-xs">Prayer</TabsTrigger>
              </TabsList>

              <TabsContent value="scripture" className="mt-4">
                <div className="space-y-4">
                  <div className="p-4 bg-muted/50 rounded-lg border-l-4 border-primary">
                    <p className="font-semibold text-sm text-primary mb-2">
                      {devotion.anchorScripture}
                    </p>
                    <p className="italic text-foreground/90">
                      "{devotion.scriptureText}"
                    </p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="meditation" className="mt-4">
                <ScrollArea className="h-[200px]">
                  <div className="prose prose-sm dark:prose-invert max-w-none">
                    <p className="text-foreground/90 leading-relaxed whitespace-pre-line">
                      {devotion.meditation}
                    </p>
                  </div>
                </ScrollArea>
              </TabsContent>

              <TabsContent value="action" className="mt-4">
                <div className="space-y-4">
                  <div className="p-3 bg-orange-500/10 rounded-lg border border-orange-500/20">
                    <div className="flex items-center gap-2 mb-2">
                      <Users className="h-4 w-4 text-orange-500" />
                      <span className="font-semibold text-sm">Ministry Challenge</span>
                    </div>
                    <p className="text-sm text-foreground/80">{devotion.ministryChallenge}</p>
                  </div>

                  <div className="p-3 bg-purple-500/10 rounded-lg border border-purple-500/20">
                    <div className="flex items-center gap-2 mb-2">
                      <Heart className="h-4 w-4 text-purple-500" />
                      <span className="font-semibold text-sm">Righteousness Call</span>
                    </div>
                    <p className="text-sm text-foreground/80">{devotion.righteousnessCall}</p>
                  </div>

                  <div className="p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
                    <div className="flex items-center gap-2 mb-2">
                      <BookOpen className="h-4 w-4 text-blue-500" />
                      <span className="font-semibold text-sm">Study Prompt</span>
                    </div>
                    <p className="text-sm text-foreground/80">{devotion.studyPrompt}</p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="prayer" className="mt-4">
                <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                  <div className="flex items-center gap-2 mb-3">
                    <Flame className="h-4 w-4 text-primary" />
                    <span className="font-semibold text-sm">Prayer Focus</span>
                  </div>
                  <p className="text-sm text-foreground/90 italic leading-relaxed whitespace-pre-line">
                    {devotion.prayerFocus}
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}

      {/* Weekly Theme Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Weekly PT Theme Cycle</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-1">
            {DAILY_THEMES.map((theme) => {
              const Icon = theme.icon;
              const isToday = theme.day === dayOfWeek;
              return (
                <div
                  key={theme.day}
                  className={`p-2 rounded-lg text-center ${
                    isToday 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-muted/50'
                  }`}
                >
                  <Icon className={`h-4 w-4 mx-auto mb-1 ${isToday ? '' : 'text-muted-foreground'}`} />
                  <p className={`text-xs font-medium ${isToday ? '' : 'text-muted-foreground'}`}>
                    {theme.day.slice(0, 3)}
                  </p>
                  <p className={`text-[10px] ${isToday ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>
                    {theme.ptRoom}
                  </p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
