import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { 
  BookOpen, 
  Heart, 
  Users, 
  Flame,
  RefreshCw,
  Copy,
  CheckCircle,
  Moon,
  Sparkles
} from "lucide-react";

// Types matching edge function responses
interface SinglePortionDevotion {
  type: 'single_portion';
  title: string;
  anchorScripture: string;
  scriptureText: string;
  ptRoom: string;
  ptFloor: string;
  reflection: string;
  prayerFocus: string;
}

interface DoublePortionDevotion {
  type: 'double_portion';
  gem1: {
    title: string;
    anchorScripture: string;
    scriptureText: string;
    reflection: string;
  };
  gem2: {
    title: string;
    anchorScripture: string;
    scriptureText: string;
    reflection: string;
  };
  ptRoom: string;
  ptFloor: string;
  prayerFocus: string;
}

interface SabbathRestDevotion {
  type: 'sabbath_rest';
  title: string;
  message: string;
  scripture: string;
  scriptureText: string;
}

type DevotionContent = SinglePortionDevotion | DoublePortionDevotion | SabbathRestDevotion;

const DAILY_THEMES = [
  { day: "Sunday", theme: "Vision & Mission", icon: Users, ptRoom: "PR", ptFloor: "5th Floor - Vision" },
  { day: "Monday", theme: "Identity in Christ", icon: Heart, ptRoom: "CR", ptFloor: "4th Floor - Next Level" },
  { day: "Tuesday", theme: "Righteousness & Holiness", icon: Flame, ptRoom: "FRt", ptFloor: "4th Floor - Next Level" },
  { day: "Wednesday", theme: "Prayer & Intercession", icon: BookOpen, ptRoom: "MR", ptFloor: "7th Floor - Spiritual" },
  { day: "Thursday", theme: "Ministry & Witness", icon: Users, ptRoom: "3A", ptFloor: "5th Floor - Vision" },
  { day: "Friday", theme: "Preparation & Double Portion", icon: Sparkles, ptRoom: "DR", ptFloor: "4th Floor - Next Level" },
  { day: "Saturday", theme: "Sabbath Rest", icon: Moon, ptRoom: "BL", ptFloor: "5th Floor - Vision" },
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
  const isFriday = dayOfWeek === 'Friday';
  const isSabbath = dayOfWeek === 'Saturday';

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
      toast.success(isSabbath ? "Sabbath rest reminder" : isFriday ? "Double portion received!" : "Today's manna received!");
    } catch (error) {
      console.error('Error generating devotion:', error);
      toast.error("Failed to generate devotion");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async () => {
    if (!devotion) return;
    
    let text = '';
    
    if (devotion.type === 'sabbath_rest') {
      text = `🕊️ ${devotion.title}\n\n📖 ${devotion.scripture}\n"${devotion.scriptureText}"\n\n${devotion.message}\n\n— ${churchName} Living Manna`;
    } else if (devotion.type === 'double_portion') {
      text = `✨ DOUBLE PORTION - FRIDAY\n\n🌅 ${devotion.gem1.title}\n📖 ${devotion.gem1.anchorScripture}\n"${devotion.gem1.scriptureText}"\n\n${devotion.gem1.reflection}\n\n---\n\n🌙 ${devotion.gem2.title}\n📖 ${devotion.gem2.anchorScripture}\n"${devotion.gem2.scriptureText}"\n\n${devotion.gem2.reflection}\n\n🙏 ${devotion.prayerFocus}\n\n— ${churchName} Living Manna`;
    } else {
      text = `📖 ${devotion.title}\n\n${devotion.anchorScripture}\n"${devotion.scriptureText}"\n\n${devotion.reflection}\n\n🙏 ${devotion.prayerFocus}\n\n— ${churchName} Living Manna`;
    }
    
    await navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const renderSabbathRest = (d: SabbathRestDevotion) => (
    <Card className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border-indigo-500/30">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Moon className="h-5 w-5 text-indigo-400" />
            {d.title}
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={copyToClipboard}>
            {copied ? <CheckCircle className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="p-4 bg-indigo-500/10 rounded-lg border-l-4 border-indigo-500">
          <p className="font-semibold text-sm text-indigo-400 mb-2">{d.scripture}</p>
          <p className="italic text-foreground/90">"{d.scriptureText}"</p>
        </div>
        <p className="text-foreground/80 leading-relaxed">{d.message}</p>
      </CardContent>
    </Card>
  );

  const renderDoublePortion = (d: DoublePortionDevotion) => (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-amber-500" />
            <CardTitle className="text-lg">Double Portion Friday</CardTitle>
          </div>
          <Button variant="ghost" size="sm" onClick={copyToClipboard}>
            {copied ? <CheckCircle className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
          </Button>
        </div>
        <div className="flex items-center gap-2 mt-2">
          <Badge variant="outline">{d.ptRoom}</Badge>
          <span className="text-xs text-muted-foreground">{d.ptFloor}</span>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Gem 1 - Preparation */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-full bg-amber-500/20 flex items-center justify-center">
              <span className="text-xs font-bold text-amber-500">1</span>
            </div>
            <h4 className="font-semibold text-amber-500">{d.gem1.title}</h4>
          </div>
          <div className="p-3 bg-muted/50 rounded-lg border-l-4 border-amber-500">
            <p className="font-semibold text-xs text-amber-500 mb-1">{d.gem1.anchorScripture}</p>
            <p className="italic text-sm text-foreground/90">"{d.gem1.scriptureText}"</p>
          </div>
          <p className="text-sm text-foreground/80 leading-relaxed">{d.gem1.reflection}</p>
        </div>

        {/* Gem 2 - Anticipation */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-full bg-indigo-500/20 flex items-center justify-center">
              <span className="text-xs font-bold text-indigo-500">2</span>
            </div>
            <h4 className="font-semibold text-indigo-400">{d.gem2.title}</h4>
          </div>
          <div className="p-3 bg-muted/50 rounded-lg border-l-4 border-indigo-500">
            <p className="font-semibold text-xs text-indigo-400 mb-1">{d.gem2.anchorScripture}</p>
            <p className="italic text-sm text-foreground/90">"{d.gem2.scriptureText}"</p>
          </div>
          <p className="text-sm text-foreground/80 leading-relaxed">{d.gem2.reflection}</p>
        </div>

        {/* Prayer Focus */}
        <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
          <div className="flex items-center gap-2 mb-2">
            <Flame className="h-4 w-4 text-primary" />
            <span className="font-semibold text-sm">Prayer for Sabbath Preparation</span>
          </div>
          <p className="text-sm text-foreground/90 italic">{d.prayerFocus}</p>
        </div>
      </CardContent>
    </Card>
  );

  const renderSinglePortion = (d: SinglePortionDevotion) => (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{d.title}</CardTitle>
          <Button variant="ghost" size="sm" onClick={copyToClipboard}>
            {copied ? <CheckCircle className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
          </Button>
        </div>
        <div className="flex items-center gap-2 mt-2">
          <Badge variant="outline">{d.ptRoom}</Badge>
          <span className="text-xs text-muted-foreground">{d.ptFloor}</span>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Scripture */}
        <div className="p-4 bg-muted/50 rounded-lg border-l-4 border-primary">
          <p className="font-semibold text-sm text-primary mb-2">{d.anchorScripture}</p>
          <p className="italic text-foreground/90">"{d.scriptureText}"</p>
        </div>

        {/* Reflection */}
        <ScrollArea className="h-auto max-h-[200px]">
          <p className="text-foreground/80 leading-relaxed">{d.reflection}</p>
        </ScrollArea>

        {/* Prayer Focus */}
        <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
          <div className="flex items-center gap-2 mb-2">
            <Flame className="h-4 w-4 text-primary" />
            <span className="font-semibold text-sm">Prayer Focus</span>
          </div>
          <p className="text-sm text-foreground/90 italic">{d.prayerFocus}</p>
        </div>
      </CardContent>
    </Card>
  );

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
                <CardTitle className="text-xl">{dayOfWeek}'s Manna</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  {isFriday ? "Double Portion Day" : isSabbath ? "Rest Day - No New Manna" : todayTheme.theme}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                {todayTheme.ptRoom}
              </Badge>
              {isFriday && (
                <Badge className="bg-amber-500/20 text-amber-500 border-amber-500/30 text-xs">
                  2x
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            {isSabbath 
              ? "The manna has already been given. Enter rest and trust the Provider."
              : isFriday
              ? "Today you receive a double portion: one for preparation, one for Sabbath anticipation."
              : "One manna gem per day, following the Exodus 16 pattern of daily dependence."}
          </p>
          <Button 
            onClick={generateDevotion} 
            disabled={loading}
            className="w-full"
            variant={isSabbath ? "secondary" : "default"}
          >
            {loading ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                {isSabbath ? "Loading..." : "Gathering Manna..."}
              </>
            ) : (
              <>
                {isSabbath ? <Moon className="h-4 w-4 mr-2" /> : isFriday ? <Sparkles className="h-4 w-4 mr-2" /> : <Flame className="h-4 w-4 mr-2" />}
                {isSabbath ? "View Sabbath Rest Message" : isFriday ? "Receive Double Portion" : "Receive Today's Manna"}
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Devotion Content */}
      {devotion && (
        devotion.type === 'sabbath_rest' 
          ? renderSabbathRest(devotion)
          : devotion.type === 'double_portion'
          ? renderDoublePortion(devotion)
          : renderSinglePortion(devotion)
      )}

      {/* Weekly Theme Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Weekly Manna Cycle</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-1">
            {DAILY_THEMES.map((theme) => {
              const Icon = theme.icon;
              const isToday = theme.day === dayOfWeek;
              const isDoublePortion = theme.day === 'Friday';
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
                    {isDoublePortion ? '2x' : theme.ptRoom}
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
