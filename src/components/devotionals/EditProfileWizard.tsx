import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { X, ChevronRight, ChevronLeft, User, Heart, Target, Sparkles, AlertCircle, Save } from "lucide-react";
import { useDevotionalProfiles, DevotionalProfile } from "@/hooks/useDevotionalProfiles";
import { cn } from "@/lib/utils";
import { CADE_ISSUES, ISSUE_SEVERITY } from "@/lib/cadeIssues";

interface EditProfileWizardProps {
  profile: DevotionalProfile;
  onClose: () => void;
  onProfileUpdated?: () => void;
}

// Categories for different devotional types
const DEVOTIONAL_CATEGORIES = [
  { value: "individual", label: "Individual", emoji: "🙏", description: "Personal ministry to one person" },
  { value: "classroom", label: "Classroom", emoji: "🏫", description: "For teachers - students at school" },
  { value: "family", label: "Family", emoji: "👨‍👩‍👧‍👦", description: "For parents - family devotions" },
  { value: "spousal", label: "Spousal", emoji: "💑", description: "For married couples" },
  { value: "dating", label: "Dating", emoji: "💕", description: "For dating couples" },
];

const RELATIONSHIPS = [
  { value: "child", label: "Child", emoji: "👶", categories: ["individual", "family"] },
  { value: "spouse", label: "Spouse", emoji: "💑", categories: ["individual", "spousal"] },
  { value: "friend", label: "Friend", emoji: "🤝", categories: ["individual"] },
  { value: "student", label: "Student", emoji: "📚", categories: ["individual", "classroom"] },
  { value: "team_member", label: "Team Member", emoji: "👥", categories: ["individual"] },
  { value: "mentee", label: "Mentee", emoji: "🌱", categories: ["individual"] },
  { value: "parent", label: "Parent", emoji: "👨‍👩‍👧", categories: ["individual"] },
  { value: "sibling", label: "Sibling", emoji: "👫", categories: ["individual", "family"] },
  { value: "dating_partner", label: "Dating Partner", emoji: "💕", categories: ["dating"] },
  { value: "class", label: "Entire Class", emoji: "🏫", categories: ["classroom"] },
  { value: "family_group", label: "Family Group", emoji: "🏠", categories: ["family"] },
];

const AGE_GROUPS = [
  { value: "child", label: "Child (0-12)" },
  { value: "teen", label: "Teen (13-17)" },
  { value: "young_adult", label: "Young Adult (18-30)" },
  { value: "adult", label: "Adult (31-60)" },
  { value: "senior", label: "Senior (60+)" },
];

const GRADE_LEVELS = [
  { value: "prek", label: "Pre-K (Ages 3-4)" },
  { value: "kindergarten", label: "Kindergarten (Age 5)" },
  { value: "elementary_lower", label: "Elementary 1-2 (Ages 6-7)" },
  { value: "elementary_upper", label: "Elementary 3-5 (Ages 8-10)" },
  { value: "middle_school", label: "Middle School 6-8 (Ages 11-13)" },
  { value: "high_school", label: "High School 9-12 (Ages 14-18)" },
  { value: "college", label: "College/University" },
];

const FAMILY_DYNAMICS = [
  { value: "young_children", label: "Young Children (0-5)", emoji: "👶" },
  { value: "school_age", label: "School Age (6-12)", emoji: "🎒" },
  { value: "teens", label: "Teenagers (13-17)", emoji: "🎮" },
  { value: "mixed_ages", label: "Mixed Ages", emoji: "👨‍👩‍👧‍👦" },
  { value: "adult_children", label: "Adult Children", emoji: "🏠" },
];

const MARRIAGE_STAGES = [
  { value: "newlywed", label: "Newlywed (0-2 years)", emoji: "💒" },
  { value: "building", label: "Building (3-10 years)", emoji: "🏗️" },
  { value: "established", label: "Established (10-25 years)", emoji: "🏠" },
  { value: "mature", label: "Mature (25+ years)", emoji: "🌳" },
  { value: "empty_nest", label: "Empty Nest", emoji: "🕊️" },
];

const DATING_STAGES = [
  { value: "new_relationship", label: "New Relationship", emoji: "🌱" },
  { value: "serious_dating", label: "Serious Dating", emoji: "💝" },
  { value: "courtship", label: "Courtship", emoji: "💍" },
  { value: "engaged", label: "Engaged", emoji: "💎" },
  { value: "long_distance", label: "Long Distance", emoji: "✈️" },
];

// Base struggles
const BASE_STRUGGLES = [
  { value: "anxiety", label: "Anxiety", emoji: "😰" },
  { value: "depression", label: "Depression", emoji: "😢" },
  { value: "grief", label: "Grief", emoji: "💔" },
  { value: "addiction", label: "Addiction", emoji: "⛓️" },
  { value: "identity", label: "Identity Crisis", emoji: "🪞" },
  { value: "fear", label: "Fear", emoji: "😨" },
  { value: "loneliness", label: "Loneliness", emoji: "🏝️" },
  { value: "anger", label: "Anger", emoji: "😤" },
  { value: "doubt", label: "Doubt", emoji: "❓" },
  { value: "purpose", label: "Lack of Purpose", emoji: "🧭" },
  { value: "relationships", label: "Relationship Issues", emoji: "💬" },
  { value: "purity", label: "Purity", emoji: "🕊️" },
];

// Category-specific struggles
const CATEGORY_STRUGGLES: Record<string, typeof BASE_STRUGGLES> = {
  dating: [
    { value: "boundaries", label: "Boundaries", emoji: "🚧" },
    { value: "purity", label: "Physical Purity", emoji: "🕊️" },
    { value: "communication", label: "Communication", emoji: "💬" },
    { value: "trust_issues", label: "Trust Issues", emoji: "🔐" },
    { value: "different_values", label: "Different Values", emoji: "⚖️" },
    { value: "spiritual_alignment", label: "Spiritual Alignment", emoji: "🙏" },
    { value: "past_relationships", label: "Past Relationships", emoji: "📦" },
    { value: "future_uncertainty", label: "Future Uncertainty", emoji: "❓" },
    { value: "family_approval", label: "Family Approval", emoji: "👨‍👩‍👧" },
    { value: "jealousy", label: "Jealousy", emoji: "💚" },
    { value: "long_distance", label: "Long Distance", emoji: "✈️" },
    { value: "commitment_fear", label: "Fear of Commitment", emoji: "😰" },
  ],
  spousal: [
    { value: "communication", label: "Communication", emoji: "💬" },
    { value: "intimacy", label: "Intimacy Issues", emoji: "💑" },
    { value: "trust_broken", label: "Broken Trust", emoji: "💔" },
    { value: "conflict", label: "Constant Conflict", emoji: "⚔️" },
    { value: "finances", label: "Financial Stress", emoji: "💰" },
    { value: "parenting_differences", label: "Parenting Differences", emoji: "👶" },
    { value: "in_laws", label: "In-Law Issues", emoji: "🏠" },
    { value: "emotional_distance", label: "Emotional Distance", emoji: "🧊" },
    { value: "spiritual_disconnect", label: "Spiritual Disconnect", emoji: "⛪" },
    { value: "unforgiveness", label: "Unforgiveness", emoji: "🤝" },
    { value: "infidelity_recovery", label: "Infidelity Recovery", emoji: "🩹" },
    { value: "rekindling", label: "Rekindling Love", emoji: "🔥" },
  ],
  family: [
    { value: "sibling_conflict", label: "Sibling Conflict", emoji: "👫" },
    { value: "discipline", label: "Discipline Challenges", emoji: "📏" },
    { value: "screen_time", label: "Screen Time Wars", emoji: "📱" },
    { value: "spiritual_apathy", label: "Spiritual Apathy", emoji: "😴" },
    { value: "peer_pressure", label: "Peer Pressure", emoji: "👥" },
    { value: "busyness", label: "Too Busy", emoji: "⏰" },
    { value: "quality_time", label: "Quality Time", emoji: "❤️" },
    { value: "blended_family", label: "Blended Family", emoji: "🏡" },
    { value: "generational_gaps", label: "Generational Gaps", emoji: "👴" },
    { value: "prodigal_child", label: "Prodigal Child", emoji: "🚪" },
    { value: "grief_loss", label: "Family Grief/Loss", emoji: "💔" },
    { value: "moving_changes", label: "Moving/Changes", emoji: "📦" },
  ],
  classroom: [
    { value: "attention", label: "Attention Issues", emoji: "🎯" },
    { value: "behavior", label: "Behavior Problems", emoji: "🚨" },
    { value: "bullying", label: "Bullying", emoji: "😢" },
    { value: "academic_pressure", label: "Academic Pressure", emoji: "📚" },
    { value: "faith_questions", label: "Faith Questions", emoji: "❓" },
    { value: "social_anxiety", label: "Social Anxiety", emoji: "😰" },
    { value: "identity_formation", label: "Identity Formation", emoji: "🪞" },
    { value: "technology", label: "Technology Issues", emoji: "💻" },
    { value: "respect_authority", label: "Respecting Authority", emoji: "👨‍🏫" },
    { value: "peer_relationships", label: "Peer Relationships", emoji: "🤝" },
    { value: "family_struggles", label: "Home Life Struggles", emoji: "🏠" },
    { value: "worldly_influences", label: "Worldly Influences", emoji: "🌍" },
  ],
  individual: BASE_STRUGGLES,
};

const getStrugglesForCategory = (category: string) => {
  return CATEGORY_STRUGGLES[category] || BASE_STRUGGLES;
};

const TONES = [
  { value: "comforting", label: "Comforting", description: "Gentle, reassuring approach" },
  { value: "straight-forward", label: "Straight-forward", description: "Direct, clear guidance" },
  { value: "motivational", label: "Motivational", description: "Encouraging, uplifting" },
  { value: "discipleship", label: "Discipleship", description: "Teaching, growth-focused" },
  { value: "theological", label: "Theological", description: "Deep, doctrinal study" },
];

const THEMES = [
  { value: "hope", label: "Hope", gradient: "from-amber-500 to-orange-500" },
  { value: "forgiveness", label: "Forgiveness", gradient: "from-green-500 to-emerald-500" },
  { value: "peace", label: "Peace", gradient: "from-blue-500 to-cyan-500" },
  { value: "strength", label: "Strength", gradient: "from-red-500 to-pink-500" },
  { value: "identity", label: "Identity in Christ", gradient: "from-purple-500 to-violet-500" },
  { value: "faith", label: "Growing Faith", gradient: "from-yellow-500 to-amber-500" },
  { value: "love", label: "God's Love", gradient: "from-rose-500 to-pink-500" },
  { value: "endtime", label: "End-Time Readiness", gradient: "from-indigo-500 to-purple-500" },
];

const AVATAR_EMOJIS = ["🙏", "❤️", "🌟", "🌈", "🕊️", "🌸", "🌻", "🦋", "🌿", "💎", "⭐", "🔥"];

// Helper to derive category from relationship
const getCategoryFromRelationship = (relationship: string): string => {
  switch (relationship) {
    case "class": return "classroom";
    case "family_group": return "family";
    case "spouse": return "spousal";
    case "dating_partner": return "dating";
    default: return "individual";
  }
};

export function EditProfileWizard({ profile, onClose, onProfileUpdated }: EditProfileWizardProps) {
  const [step, setStep] = useState(1);
  const { updateProfile } = useDevotionalProfiles();

  const derivedCategory = getCategoryFromRelationship(profile.relationship);

  const [formData, setFormData] = useState({
    category: derivedCategory,
    name: profile.name,
    relationship: profile.relationship,
    age_group: profile.age_group || "",
    avatar_emoji: profile.avatar_emoji || "🙏",
    struggles: profile.struggles || [],
    current_situation: profile.current_situation || "",
    spiritual_goals: profile.spiritual_goals || [],
    preferred_tones: profile.preferred_tone ? profile.preferred_tone.split(", ").filter(Boolean) : [],
    preferred_themes: profile.preferred_themes || [],
    // Category-specific fields (derived from age_group)
    grade_level: derivedCategory === "classroom" ? (profile.age_group || "") : "",
    family_dynamic: derivedCategory === "family" ? (profile.age_group || "") : "",
    marriage_stage: derivedCategory === "spousal" ? (profile.age_group || "") : "",
    dating_stage: derivedCategory === "dating" ? (profile.age_group || "") : "",
    // CADE fields
    primary_issue: profile.primary_issue || "",
    issue_description: profile.issue_description || "",
    issue_severity: profile.issue_severity || "moderate",
  });

  const toggleStruggle = (struggle: string) => {
    setFormData((prev) => ({
      ...prev,
      struggles: prev.struggles.includes(struggle)
        ? prev.struggles.filter((s) => s !== struggle)
        : [...prev.struggles, struggle],
    }));
  };

  const toggleTheme = (theme: string) => {
    setFormData((prev) => ({
      ...prev,
      preferred_themes: prev.preferred_themes.includes(theme)
        ? prev.preferred_themes.filter((t) => t !== theme)
        : [...prev.preferred_themes, theme],
    }));
  };

  const toggleTone = (tone: string) => {
    setFormData((prev) => ({
      ...prev,
      preferred_tones: prev.preferred_tones.includes(tone)
        ? prev.preferred_tones.filter((t) => t !== tone)
        : [...prev.preferred_tones, tone],
    }));
  };

  const getRelationshipForCategory = () => {
    switch (formData.category) {
      case "classroom": return "class";
      case "family": return "family_group";
      case "spousal": return "spouse";
      case "dating": return "dating_partner";
      default: return formData.relationship;
    }
  };

  const handleUpdate = async () => {
    const tonesString = formData.preferred_tones.join(", ");
    
    await updateProfile.mutateAsync({
      id: profile.id,
      name: formData.name,
      relationship: getRelationshipForCategory(),
      age_group: formData.age_group || formData.grade_level || formData.family_dynamic || formData.marriage_stage || formData.dating_stage || undefined,
      avatar_emoji: formData.avatar_emoji,
      struggles: formData.struggles,
      current_situation: formData.current_situation || undefined,
      preferred_tone: tonesString,
      preferred_themes: formData.preferred_themes,
      // CADE fields
      primary_issue: formData.primary_issue || undefined,
      issue_description: formData.issue_description || undefined,
      issue_severity: formData.issue_severity || "moderate",
    });

    onProfileUpdated?.();
    onClose();
  };

  const canProceed = () => {
    switch (step) {
      case 1:
        if (!formData.name.trim()) return false;
        if (formData.category === "individual" && !formData.relationship) return false;
        if (formData.category === "classroom" && !formData.grade_level) return false;
        if (formData.category === "family" && !formData.family_dynamic) return false;
        if (formData.category === "spousal" && !formData.marriage_stage) return false;
        if (formData.category === "dating" && !formData.dating_stage) return false;
        return true;
      case 2:
        return formData.struggles.length > 0 || formData.current_situation.trim();
      case 3:
        return formData.preferred_tones.length > 0 && formData.preferred_themes.length > 0;
      default:
        return false;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 pb-20 md:pb-4">
      <Card className="w-full max-w-2xl max-h-[85vh] md:max-h-[90vh] overflow-y-auto">
        <CardHeader className="relative border-b">
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-4"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            Edit Devotional Profile
          </CardTitle>
          <div className="flex gap-2 mt-4">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={cn(
                  "h-2 flex-1 rounded-full transition-colors",
                  s <= step ? "bg-primary" : "bg-muted"
                )}
              />
            ))}
          </div>
        </CardHeader>

        <CardContent className="p-6">
          {/* Step 1: Basic Info */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h3 className="text-lg font-semibold">Profile Information</h3>
                <p className="text-sm text-muted-foreground">Update basic information</p>
              </div>

              {/* Category (read-only display) */}
              <div>
                <Label className="text-sm font-medium mb-2 block">Category</Label>
                <div className="p-3 rounded-lg border bg-muted/50">
                  {DEVOTIONAL_CATEGORIES.find(c => c.value === formData.category)?.emoji}{" "}
                  {DEVOTIONAL_CATEGORIES.find(c => c.value === formData.category)?.label}
                </div>
              </div>

              {/* Avatar Emoji */}
              <div>
                <Label className="text-sm font-medium mb-2 block">Avatar</Label>
                <div className="flex flex-wrap gap-2">
                  {AVATAR_EMOJIS.map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      className={cn(
                        "text-3xl p-2 rounded-lg transition-all hover:scale-110",
                        formData.avatar_emoji === emoji
                          ? "bg-primary/20 ring-2 ring-primary"
                          : "bg-muted/50 hover:bg-muted"
                      )}
                      onClick={() => setFormData((prev) => ({ ...prev, avatar_emoji: emoji }))}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>

              {/* Name */}
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter a name..."
                  className="mt-1"
                />
              </div>

              {/* Category-specific fields */}
              {formData.category === "individual" && (
                <div>
                  <Label className="text-sm font-medium mb-3 block">Relationship</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {RELATIONSHIPS.filter((r) => r.categories.includes("individual")).map((rel) => (
                      <button
                        key={rel.value}
                        type="button"
                        className={cn(
                          "p-3 rounded-lg border text-left transition-all hover:border-primary/50",
                          formData.relationship === rel.value
                            ? "border-primary bg-primary/10"
                            : "border-muted"
                        )}
                        onClick={() => setFormData((prev) => ({ ...prev, relationship: rel.value }))}
                      >
                        <span className="mr-2">{rel.emoji}</span>
                        {rel.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {formData.category === "classroom" && (
                <div>
                  <Label className="text-sm font-medium mb-3 block">Grade Level</Label>
                  <RadioGroup
                    value={formData.grade_level}
                    onValueChange={(v) => setFormData((prev) => ({ ...prev, grade_level: v }))}
                  >
                    <div className="grid grid-cols-2 gap-2">
                      {GRADE_LEVELS.map((grade) => (
                        <div key={grade.value} className="flex items-center space-x-2">
                          <RadioGroupItem value={grade.value} id={grade.value} />
                          <Label htmlFor={grade.value}>{grade.label}</Label>
                        </div>
                      ))}
                    </div>
                  </RadioGroup>
                </div>
              )}

              {formData.category === "family" && (
                <div>
                  <Label className="text-sm font-medium mb-3 block">Family Dynamic</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {FAMILY_DYNAMICS.map((fd) => (
                      <button
                        key={fd.value}
                        type="button"
                        className={cn(
                          "p-3 rounded-lg border text-left transition-all hover:border-primary/50",
                          formData.family_dynamic === fd.value
                            ? "border-primary bg-primary/10"
                            : "border-muted"
                        )}
                        onClick={() => setFormData((prev) => ({ ...prev, family_dynamic: fd.value }))}
                      >
                        <span className="mr-2">{fd.emoji}</span>
                        {fd.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {formData.category === "spousal" && (
                <div>
                  <Label className="text-sm font-medium mb-3 block">Marriage Stage</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {MARRIAGE_STAGES.map((ms) => (
                      <button
                        key={ms.value}
                        type="button"
                        className={cn(
                          "p-3 rounded-lg border text-left transition-all hover:border-primary/50",
                          formData.marriage_stage === ms.value
                            ? "border-primary bg-primary/10"
                            : "border-muted"
                        )}
                        onClick={() => setFormData((prev) => ({ ...prev, marriage_stage: ms.value }))}
                      >
                        <span className="mr-2">{ms.emoji}</span>
                        {ms.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {formData.category === "dating" && (
                <div>
                  <Label className="text-sm font-medium mb-3 block">Dating Stage</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {DATING_STAGES.map((ds) => (
                      <button
                        key={ds.value}
                        type="button"
                        className={cn(
                          "p-3 rounded-lg border text-left transition-all hover:border-primary/50",
                          formData.dating_stage === ds.value
                            ? "border-primary bg-primary/10"
                            : "border-muted"
                        )}
                        onClick={() => setFormData((prev) => ({ ...prev, dating_stage: ds.value }))}
                      >
                        <span className="mr-2">{ds.emoji}</span>
                        {ds.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {formData.category === "individual" && (
                <div>
                  <Label className="text-sm font-medium mb-3 block">Age Group</Label>
                  <RadioGroup
                    value={formData.age_group}
                    onValueChange={(v) => setFormData((prev) => ({ ...prev, age_group: v }))}
                  >
                    <div className="grid grid-cols-2 gap-2">
                      {AGE_GROUPS.map((ag) => (
                        <div key={ag.value} className="flex items-center space-x-2">
                          <RadioGroupItem value={ag.value} id={ag.value} />
                          <Label htmlFor={ag.value}>{ag.label}</Label>
                        </div>
                      ))}
                    </div>
                  </RadioGroup>
                </div>
              )}
            </div>
          )}

          {/* Step 2: Struggles */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h3 className="text-lg font-semibold flex items-center justify-center gap-2">
                  <Heart className="h-5 w-5 text-rose-500" />
                  Struggles & Situation
                </h3>
                <p className="text-sm text-muted-foreground">Update what they're facing</p>
              </div>

              <div>
                <Label className="text-sm font-medium mb-3 block">Current Struggles (select all that apply)</Label>
                <div className="grid grid-cols-2 gap-2">
                  {getStrugglesForCategory(formData.category).map((struggle) => (
                    <button
                      key={struggle.value}
                      type="button"
                      className={cn(
                        "p-3 rounded-lg border text-left transition-all hover:border-primary/50",
                        formData.struggles.includes(struggle.value)
                          ? "border-primary bg-primary/10"
                          : "border-muted"
                      )}
                      onClick={() => toggleStruggle(struggle.value)}
                    >
                      <span className="mr-2">{struggle.emoji}</span>
                      {struggle.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="situation">Current Situation (optional)</Label>
                <Textarea
                  id="situation"
                  value={formData.current_situation}
                  onChange={(e) => setFormData((prev) => ({ ...prev, current_situation: e.target.value }))}
                  placeholder="Describe what they're going through..."
                  className="mt-1"
                  rows={4}
                />
              </div>

              {/* CADE Fields */}
              <div className="border-t pt-4">
                <div className="flex items-center gap-2 mb-4">
                  <AlertCircle className="h-5 w-5 text-amber-500" />
                  <h4 className="font-medium">Crisis Assessment (Optional)</h4>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label>Primary Issue</Label>
                    <RadioGroup
                      value={formData.primary_issue}
                      onValueChange={(v) => setFormData((prev) => ({ ...prev, primary_issue: v }))}
                      className="mt-2"
                    >
                      <div className="grid grid-cols-2 gap-2">
                        {CADE_ISSUES.map((issue) => (
                          <div key={issue.value} className="flex items-center space-x-2">
                            <RadioGroupItem value={issue.value} id={`issue-${issue.value}`} />
                            <Label htmlFor={`issue-${issue.value}`} className="text-sm">
                              {issue.emoji} {issue.label}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </RadioGroup>
                  </div>

                  {formData.primary_issue && (
                    <>
                      <div>
                        <Label>Issue Severity</Label>
                        <RadioGroup
                          value={formData.issue_severity}
                          onValueChange={(v) => setFormData((prev) => ({ ...prev, issue_severity: v }))}
                          className="mt-2"
                        >
                          <div className="flex gap-4">
                            {ISSUE_SEVERITY.map((sev) => (
                              <div key={sev.value} className="flex items-center space-x-2">
                                <RadioGroupItem value={sev.value} id={`sev-${sev.value}`} />
                                <Label htmlFor={`sev-${sev.value}`} className="text-sm">
                                  {sev.label}
                                </Label>
                              </div>
                            ))}
                          </div>
                        </RadioGroup>
                      </div>

                      <div>
                        <Label htmlFor="issue_description">Issue Description</Label>
                        <Textarea
                          id="issue_description"
                          value={formData.issue_description}
                          onChange={(e) => setFormData((prev) => ({ ...prev, issue_description: e.target.value }))}
                          placeholder="Describe the situation in more detail..."
                          className="mt-1"
                          rows={3}
                        />
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Preferences */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h3 className="text-lg font-semibold flex items-center justify-center gap-2">
                  <Sparkles className="h-5 w-5 text-amber-500" />
                  Devotional Preferences
                </h3>
                <p className="text-sm text-muted-foreground">Update preferred tones & themes</p>
              </div>

              <div>
                <Label className="text-sm font-medium mb-3 block">Preferred Tones</Label>
                <div className="grid grid-cols-2 gap-2">
                  {TONES.map((tone) => (
                    <button
                      key={tone.value}
                      type="button"
                      className={cn(
                        "p-3 rounded-lg border text-left transition-all hover:border-primary/50",
                        formData.preferred_tones.includes(tone.value)
                          ? "border-primary bg-primary/10"
                          : "border-muted"
                      )}
                      onClick={() => toggleTone(tone.value)}
                    >
                      <div className="font-medium">{tone.label}</div>
                      <div className="text-xs text-muted-foreground">{tone.description}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium mb-3 block">Preferred Themes</Label>
                <div className="grid grid-cols-2 gap-2">
                  {THEMES.map((theme) => (
                    <button
                      key={theme.value}
                      type="button"
                      className={cn(
                        "p-3 rounded-lg border text-left transition-all",
                        formData.preferred_themes.includes(theme.value)
                          ? `bg-gradient-to-r ${theme.gradient} text-white border-transparent`
                          : "border-muted hover:border-primary/50"
                      )}
                      onClick={() => toggleTheme(theme.value)}
                    >
                      {theme.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between mt-8 pt-4 border-t pb-20 md:pb-0">
            <Button
              variant="outline"
              onClick={() => (step > 1 ? setStep(step - 1) : onClose())}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              {step === 1 ? "Cancel" : "Back"}
            </Button>

            {step < 3 ? (
              <Button onClick={() => setStep(step + 1)} disabled={!canProceed()}>
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            ) : (
              <Button
                onClick={handleUpdate}
                disabled={!canProceed() || updateProfile.isPending}
                className="bg-gradient-to-r from-emerald-500 to-teal-500"
              >
                {updateProfile.isPending ? (
                  <>
                    <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
