import { useState } from "react";
import { ArrowLeft, ArrowRight, Heart, Sparkles, Loader2, Gift, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useDevotionals } from "@/hooks/useDevotionals";
import { cn } from "@/lib/utils";

interface DevotionalForFriendWizardProps {
  onClose: () => void;
}

const STRUGGLES = [
  { id: "vaping", label: "Vaping/Addiction", emoji: "🚭", color: "from-red-500 to-orange-500" },
  { id: "depression", label: "Depression", emoji: "😔", color: "from-indigo-500 to-purple-500" },
  { id: "guilt", label: "Guilt & Shame", emoji: "💔", color: "from-gray-500 to-slate-600" },
  { id: "loneliness", label: "Loneliness", emoji: "🌙", color: "from-blue-500 to-cyan-500" },
  { id: "anxiety", label: "Anxiety & Fear", emoji: "😰", color: "from-amber-500 to-yellow-500" },
  { id: "anger", label: "Anger Issues", emoji: "😤", color: "from-red-600 to-rose-500" },
  { id: "relationship", label: "Relationship Pain", emoji: "💔", color: "from-pink-500 to-rose-400" },
  { id: "faith", label: "Doubting Faith", emoji: "❓", color: "from-teal-500 to-emerald-500" },
  { id: "purpose", label: "Lost Purpose", emoji: "🧭", color: "from-violet-500 to-purple-500" },
  { id: "grief", label: "Grief & Loss", emoji: "🕊️", color: "from-slate-400 to-gray-500" },
  { id: "self-worth", label: "Low Self-Worth", emoji: "💎", color: "from-cyan-500 to-blue-500" },
  { id: "temptation", label: "Temptation", emoji: "⚔️", color: "from-orange-500 to-red-500" },
];

const DURATIONS = [
  { value: 7, label: "7 Days", description: "Quick encouragement" },
  { value: 14, label: "14 Days", description: "Two week journey" },
  { value: 21, label: "21 Days", description: "Building new habits" },
];

export function DevotionalForFriendWizard({ onClose }: DevotionalForFriendWizardProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    friendName: "",
    struggle: "",
    customStruggle: "",
    duration: 7,
    personalMessage: "",
  });

  const { createPlan, generateDevotional, isGenerating } = useDevotionals();

  const actualStruggle = formData.customStruggle || 
    STRUGGLES.find(s => s.id === formData.struggle)?.label || "";
  const canProceed = step === 1 ? !!actualStruggle : step === 2;

  const handleCreate = async () => {
    const friendPart = formData.friendName ? ` for ${formData.friendName}` : "";
    const title = `Hope & Healing${friendPart}: ${actualStruggle}`;
    const theme = `Helping someone struggling with ${actualStruggle}. Focus on encouragement, hope, Christ's love, and practical steps toward healing. Be gentle, compassionate, and Christ-centered.`;

    const plan = await createPlan.mutateAsync({
      title,
      theme,
      format: "standard",
      duration: formData.duration,
      studyStyle: "reading",
      description: formData.personalMessage || undefined,
    });

    await generateDevotional.mutateAsync({
      planId: plan.id,
      theme,
      format: "standard",
      duration: formData.duration,
      studyStyle: "reading",
    });

    onClose();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-background to-purple-50 dark:from-pink-950/20 dark:via-background dark:to-purple-950/20 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="icon" onClick={onClose}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-full bg-gradient-to-br from-pink-500 to-purple-500 shadow-lg">
              <Gift className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                Devotional for a Friend
              </h1>
              <p className="text-muted-foreground">Create a healing journey for someone you care about</p>
            </div>
          </div>
        </div>

        {/* Progress */}
        <div className="flex gap-2 mb-8">
          {[1, 2].map((s) => (
            <div
              key={s}
              className={cn(
                "h-2 flex-1 rounded-full transition-colors",
                s <= step 
                  ? "bg-gradient-to-r from-pink-500 to-purple-500" 
                  : "bg-muted"
              )}
            />
          ))}
        </div>

        {/* Step 1: Choose Struggle */}
        {step === 1 && (
          <div className="space-y-6">
            <Card className="border-pink-200 dark:border-pink-800 bg-gradient-to-br from-white to-pink-50/50 dark:from-card dark:to-pink-950/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5 text-pink-500" />
                  What is your friend struggling with?
                </CardTitle>
                <CardDescription>
                  Jeeves will create a personalized devotional to help them find hope in Christ
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {STRUGGLES.map((struggle) => (
                    <button
                      key={struggle.id}
                      onClick={() => setFormData({ ...formData, struggle: struggle.id, customStruggle: "" })}
                      className={cn(
                        "p-4 rounded-xl border-2 transition-all text-left",
                        formData.struggle === struggle.id
                          ? "border-pink-500 bg-gradient-to-br from-pink-100 to-purple-100 dark:from-pink-950 dark:to-purple-950 shadow-lg scale-[1.02]"
                          : "border-muted hover:border-pink-300 hover:bg-pink-50/50 dark:hover:bg-pink-950/30"
                      )}
                    >
                      <span className="text-2xl block mb-1">{struggle.emoji}</span>
                      <span className="text-sm font-medium">{struggle.label}</span>
                    </button>
                  ))}
                </div>

                <div className="pt-4 border-t border-pink-200 dark:border-pink-800">
                  <Label htmlFor="customStruggle" className="text-pink-700 dark:text-pink-300">
                    Or describe their struggle:
                  </Label>
                  <Input
                    id="customStruggle"
                    placeholder="e.g., Dealing with a toxic work environment..."
                    value={formData.customStruggle}
                    onChange={(e) =>
                      setFormData({ ...formData, customStruggle: e.target.value, struggle: "" })
                    }
                    className="mt-2 border-pink-200 dark:border-pink-800 focus:ring-pink-500"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Step 2: Details */}
        {step === 2 && (
          <div className="space-y-6">
            <Card className="border-purple-200 dark:border-purple-800 bg-gradient-to-br from-white to-purple-50/50 dark:from-card dark:to-purple-950/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-purple-500" />
                  Personalize the Devotional
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="friendName">Friend's Name (Optional)</Label>
                  <Input
                    id="friendName"
                    placeholder="Their name for personalization"
                    value={formData.friendName}
                    onChange={(e) => setFormData({ ...formData, friendName: e.target.value })}
                    className="mt-2 border-purple-200 dark:border-purple-800"
                  />
                </div>

                <div>
                  <Label>Duration</Label>
                  <div className="flex gap-2 mt-2">
                    {DURATIONS.map((d) => (
                      <Button
                        key={d.value}
                        variant={formData.duration === d.value ? "default" : "outline"}
                        onClick={() => setFormData({ ...formData, duration: d.value })}
                        className={cn(
                          "flex-1",
                          formData.duration === d.value && "bg-gradient-to-r from-pink-500 to-purple-500 border-0"
                        )}
                      >
                        <div className="text-center">
                          <div className="font-medium">{d.label}</div>
                          <div className="text-xs opacity-70">{d.description}</div>
                        </div>
                      </Button>
                    ))}
                  </div>
                </div>

                <div>
                  <Label htmlFor="personalMessage">Personal Note (Optional)</Label>
                  <Textarea
                    id="personalMessage"
                    placeholder="Add a personal message to include with the devotional..."
                    value={formData.personalMessage}
                    onChange={(e) => setFormData({ ...formData, personalMessage: e.target.value })}
                    className="mt-2 min-h-[100px] border-purple-200 dark:border-purple-800"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Preview */}
            <Card className="bg-gradient-to-br from-pink-100 via-purple-100 to-indigo-100 dark:from-pink-950 dark:via-purple-950 dark:to-indigo-950 border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-amber-500" />
                  Preview
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-4 rounded-xl bg-white/60 dark:bg-black/20 backdrop-blur">
                  <p className="font-semibold text-purple-900 dark:text-purple-100">
                    Hope & Healing{formData.friendName ? ` for ${formData.friendName}` : ""}: {actualStruggle}
                  </p>
                  <p className="text-sm text-purple-700 dark:text-purple-300 mt-1">
                    {formData.duration} days of encouragement and Christ-centered healing
                  </p>
                </div>
                {formData.personalMessage && (
                  <div className="p-3 rounded-lg bg-white/40 dark:bg-black/10 text-sm italic">
                    "{formData.personalMessage}"
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between mt-8">
          <Button variant="outline" onClick={() => (step > 1 ? setStep(step - 1) : onClose())}>
            {step === 1 ? "Cancel" : "Back"}
          </Button>

          {step < 2 ? (
            <Button 
              onClick={() => setStep(step + 1)} 
              disabled={!canProceed}
              className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
            >
              Next
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          ) : (
            <Button 
              onClick={handleCreate} 
              disabled={isGenerating || !canProceed}
              className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Creating with Love...
                </>
              ) : (
                <>
                  <Gift className="h-4 w-4 mr-2" />
                  Create Gift Devotional
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
