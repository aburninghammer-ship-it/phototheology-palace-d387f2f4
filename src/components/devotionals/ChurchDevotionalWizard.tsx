import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ArrowRight, Church, Sparkles, Calendar, BookOpen, Users } from "lucide-react";
import { useChurchDevotionals } from "@/hooks/useChurchDevotionals";

interface ChurchDevotionalWizardProps {
  onClose: () => void;
}

const WEEKLY_THEMES = [
  { day: "monday", theme: "Identity", description: "Who we are as the church" },
  { day: "tuesday", theme: "Righteousness", description: "Personal holiness in private spaces" },
  { day: "wednesday", theme: "Prayer", description: "Intercession, spiritual warfare, unity" },
  { day: "thursday", theme: "Mission", description: "Witness, digital evangelism, conversations" },
  { day: "friday", theme: "Encouragement", description: "Perseverance, faithfulness, endurance" },
  { day: "sabbath", theme: "Rest & Reflection", description: "Trust, dependence, abiding" },
  { day: "sunday", theme: "Vision", description: "Kingdom perspective, eternal focus" },
];

const DEFAULT_THEOLOGICAL_FRAME = `The church is not defined by shared space, but by shared Spirit.

Living Manna devotionals are:
• A theology of presence without proximity
• A call to faithfulness without visibility
• A summons to mission without platforms
• A discipline of righteousness without applause

Core thesis: Living Manna exists to form disciples who walk with God, love one another, and proclaim Christ—whether gathered or scattered, seen or unseen.`;

export function ChurchDevotionalWizard({ onClose }: ChurchDevotionalWizardProps) {
  const [step, setStep] = useState(1);
  const [churchName, setChurchName] = useState("");
  const [theologicalFrame, setTheologicalFrame] = useState(DEFAULT_THEOLOGICAL_FRAME);
  const [customGuidelines, setCustomGuidelines] = useState("");
  const [selectedThemes, setSelectedThemes] = useState<string[]>(WEEKLY_THEMES.map(t => t.day));
  
  const { createChurchDevotional, generateDevotional, isGenerating } = useChurchDevotionals();

  const handleCreate = async () => {
    const result = await createChurchDevotional.mutateAsync({
      churchName,
      theologicalFrame,
      themeCycle: "weekly",
    });
    
    if (result) {
      onClose();
    }
  };

  const toggleTheme = (day: string) => {
    setSelectedThemes(prev => 
      prev.includes(day) 
        ? prev.filter(d => d !== day)
        : [...prev, day]
    );
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-600 py-8 px-4">
        <div className="max-w-3xl mx-auto">
          <Button variant="ghost" onClick={onClose} className="text-white mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Devotionals
          </Button>
          <div className="flex items-center gap-4">
            <div className="p-4 rounded-2xl bg-white/20 backdrop-blur-sm">
              <Church className="h-10 w-10 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Church Devotional Ministry</h1>
              <p className="text-white/80">Create daily devotionals for your congregation</p>
            </div>
          </div>
          
          {/* Progress */}
          <div className="flex items-center gap-2 mt-6">
            {[1, 2, 3].map(s => (
              <div key={s} className={`h-2 flex-1 rounded-full ${s <= step ? 'bg-white' : 'bg-white/30'}`} />
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Step 1: Church Info */}
        {step === 1 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Church className="h-5 w-5 text-emerald-600" />
                Your Church Ministry
              </CardTitle>
              <CardDescription>
                Tell us about your church and its devotional needs
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="churchName">Church/Ministry Name *</Label>
                <Input
                  id="churchName"
                  placeholder="e.g., Living Manna, Grace Online Fellowship"
                  value={churchName}
                  onChange={(e) => setChurchName(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  This will be referenced in each devotional
                </p>
              </div>

              <div className="p-4 rounded-lg bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800">
                <h4 className="font-semibold text-emerald-700 dark:text-emerald-300 mb-2 flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  Perfect for Online Churches
                </h4>
                <p className="text-sm text-muted-foreground">
                  These devotionals are designed for scattered congregations—members who gather in spirit though not in space. Each devotional reinforces that the church is defined by shared Spirit, not shared location.
                </p>
              </div>

              <div className="flex justify-end">
                <Button 
                  onClick={() => setStep(2)} 
                  disabled={!churchName.trim()}
                  className="bg-gradient-to-r from-emerald-500 to-teal-500"
                >
                  Next: Theological Frame
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Theological Frame */}
        {step === 2 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-emerald-600" />
                Theological Frame
              </CardTitle>
              <CardDescription>
                Define the theological foundation for your devotionals
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="theologicalFrame">Core Theological Identity</Label>
                <Textarea
                  id="theologicalFrame"
                  value={theologicalFrame}
                  onChange={(e) => setTheologicalFrame(e.target.value)}
                  rows={10}
                  className="font-mono text-sm"
                />
                <p className="text-xs text-muted-foreground">
                  This guides the AI to write devotionals aligned with your church's theology and mission
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="customGuidelines">Additional Guidelines (Optional)</Label>
                <Textarea
                  id="customGuidelines"
                  placeholder="Any specific emphases, topics to avoid, or stylistic preferences..."
                  value={customGuidelines}
                  onChange={(e) => setCustomGuidelines(e.target.value)}
                  rows={4}
                />
              </div>

              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setStep(1)}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
                <Button 
                  onClick={() => setStep(3)}
                  className="bg-gradient-to-r from-emerald-500 to-teal-500"
                >
                  Next: Weekly Themes
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Weekly Themes */}
        {step === 3 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-emerald-600" />
                Weekly Theme Cycle
              </CardTitle>
              <CardDescription>
                Select which days you'll publish devotionals and their themes
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-3">
                {WEEKLY_THEMES.map(({ day, theme, description }) => (
                  <div
                    key={day}
                    onClick={() => toggleTheme(day)}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      selectedThemes.includes(day)
                        ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/20'
                        : 'border-muted hover:border-emerald-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold capitalize">{day}</span>
                          <Badge variant="secondary">{theme}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{description}</p>
                      </div>
                      <div className={`w-5 h-5 rounded-full border-2 ${
                        selectedThemes.includes(day)
                          ? 'bg-emerald-500 border-emerald-500'
                          : 'border-muted-foreground'
                      }`}>
                        {selectedThemes.includes(day) && (
                          <svg className="w-full h-full text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-4 rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800">
                <h4 className="font-semibold text-amber-700 dark:text-amber-300 mb-2 flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Building Community Through Rhythm
                </h4>
                <p className="text-sm text-muted-foreground">
                  Consistent themes create expectation and depth. Your members will learn to anticipate Monday's identity focus, Wednesday's prayer emphasis, and Sabbath's rest—building spiritual culture over time.
                </p>
              </div>

              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setStep(2)}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
                <Button 
                  onClick={handleCreate}
                  disabled={createChurchDevotional.isPending || selectedThemes.length === 0}
                  className="bg-gradient-to-r from-emerald-500 to-teal-500"
                >
                  {createChurchDevotional.isPending ? (
                    <>Creating...</>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4 mr-2" />
                      Create Ministry
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
