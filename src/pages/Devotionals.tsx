import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Book, Plus, Sparkles, Clock, Calendar, ChevronRight, Trash2, Gift, Heart, Star, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useDevotionals } from "@/hooks/useDevotionals";
import { CreateDevotionalWizard } from "@/components/devotionals/CreateDevotionalWizard";
import { DevotionalForFriendWizard } from "@/components/devotionals/DevotionalForFriendWizard";
import { ShareDevotionalDialog } from "@/components/devotionals/ShareDevotionalDialog";
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
import { format } from "date-fns";

const formatLabels: Record<string, { label: string; color: string; gradient: string }> = {
  standard: { label: "Standard", color: "bg-blue-500", gradient: "from-blue-500 to-cyan-500" },
  "24fps": { label: "24FPS Visual", color: "bg-purple-500", gradient: "from-purple-500 to-pink-500" },
  blueprint: { label: "Blueprint", color: "bg-amber-500", gradient: "from-amber-500 to-orange-500" },
  "room-driven": { label: "Palace Tour", color: "bg-emerald-500", gradient: "from-emerald-500 to-teal-500" },
  "verse-genetics": { label: "Verse Genetics", color: "bg-rose-500", gradient: "from-rose-500 to-red-500" },
};

export default function Devotionals() {
  const navigate = useNavigate();
  const { plans, plansLoading, deletePlan } = useDevotionals();
  const [showWizard, setShowWizard] = useState(false);
  const [showFriendWizard, setShowFriendWizard] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const activePlans = plans?.filter((p) => p.status === "active") || [];
  const completedPlans = plans?.filter((p) => p.status === "completed") || [];
  const draftPlans = plans?.filter((p) => p.status === "draft" || p.status === "generating") || [];

  const handleDelete = () => {
    if (deleteId) {
      deletePlan.mutate(deleteId);
      setDeleteId(null);
    }
  };

  if (showWizard) {
    return <CreateDevotionalWizard onClose={() => setShowWizard(false)} />;
  }

  if (showFriendWizard) {
    return <DevotionalForFriendWizard onClose={() => setShowFriendWizard(false)} />;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section - Vibrant Gradient */}
      <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 py-12 px-4">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-amber-400/30 to-pink-400/30 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-cyan-400/30 to-purple-400/30 rounded-full blur-3xl" />
        
        <div className="relative max-w-6xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-4 rounded-2xl bg-white/20 backdrop-blur-sm shadow-xl">
              <Book className="h-10 w-10 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white drop-shadow-lg">Phototheology Devotionals</h1>
              <p className="text-white/80 text-lg">AI-powered, Palace-structured daily encounters with God</p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4 mt-8">
            {/* Create New */}
            <Card 
              className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 transition-all cursor-pointer group shadow-xl" 
              onClick={() => setShowWizard(true)}
            >
              <CardContent className="p-6 flex items-center gap-4">
                <div className="p-4 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-400 shadow-lg group-hover:scale-110 transition-transform">
                  <Plus className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-lg">Create Devotional</h3>
                  <p className="text-sm text-white/70">Start your personalized journey</p>
                </div>
              </CardContent>
            </Card>

            {/* For a Friend - NEW */}
            <Card 
              className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 transition-all cursor-pointer group shadow-xl" 
              onClick={() => setShowFriendWizard(true)}
            >
              <CardContent className="p-6 flex items-center gap-4">
                <div className="p-4 rounded-full bg-gradient-to-br from-pink-400 to-rose-400 shadow-lg group-hover:scale-110 transition-transform">
                  <Gift className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-lg">For a Friend</h3>
                  <p className="text-sm text-white/70">Help someone who's struggling</p>
                </div>
              </CardContent>
            </Card>

            {/* Stats */}
            <Card className="bg-white/10 backdrop-blur-sm border-white/20 shadow-xl">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="p-4 rounded-full bg-gradient-to-br from-amber-400 to-orange-400 shadow-lg">
                  <Star className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-lg">5 Unique Formats</h3>
                  <p className="text-sm text-white/70">24FPS, Blueprint, Palace Tour & more</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        {/* Active Devotionals */}
        {activePlans.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <div className="p-2 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500">
                <Zap className="h-5 w-5 text-white" />
              </div>
              <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                Active Devotionals
              </span>
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {activePlans.map((plan) => (
                <Card 
                  key={plan.id} 
                  className="group hover:shadow-xl transition-all cursor-pointer border-2 hover:border-primary/40 overflow-hidden"
                >
                  <div className={`h-2 bg-gradient-to-r ${formatLabels[plan.format]?.gradient || "from-blue-500 to-cyan-500"}`} />
                  <CardHeader className="pb-2" onClick={() => navigate(`/devotionals/${plan.id}`)}>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg group-hover:text-primary transition-colors">{plan.title}</CardTitle>
                        <CardDescription>{plan.theme}</CardDescription>
                      </div>
                      <Badge className={`${formatLabels[plan.format]?.color} text-white`}>
                        {formatLabels[plan.format]?.label}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent onClick={() => navigate(`/devotionals/${plan.id}`)}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="font-medium">Day {plan.current_day} of {plan.duration}</span>
                        <div className="h-3 w-32 bg-muted rounded-full overflow-hidden">
                          <div
                            className={`h-full bg-gradient-to-r ${formatLabels[plan.format]?.gradient || "from-blue-500 to-cyan-500"} transition-all`}
                            style={{ width: `${(plan.current_day / plan.duration) * 100}%` }}
                          />
                        </div>
                      </div>
                      <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                  </CardContent>
                  <div className="px-6 pb-4 flex gap-2">
                    <ShareDevotionalDialog plan={plan} />
                  </div>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* Draft/Generating */}
        {draftPlans.length > 0 && (
          <section>
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Clock className="h-5 w-5 text-amber-500" />
              In Progress
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {draftPlans.map((plan) => (
                <Card key={plan.id} className="border-dashed border-2 border-amber-300 dark:border-amber-700 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20">
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{plan.title}</CardTitle>
                        <CardDescription>{plan.theme}</CardDescription>
                      </div>
                      <Badge variant="outline" className="border-amber-400 text-amber-700 dark:text-amber-300 animate-pulse">
                        {plan.status === "generating" ? "✨ Generating..." : "Draft"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">{plan.duration} days • {formatLabels[plan.format]?.label}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeleteId(plan.id);
                        }}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* Completed */}
        {completedPlans.length > 0 && (
          <section>
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Heart className="h-5 w-5 text-rose-500" />
              Completed Journeys
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {completedPlans.map((plan) => (
                <Card 
                  key={plan.id} 
                  className="group hover:shadow-lg transition-all cursor-pointer bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 border-slate-200 dark:border-slate-700"
                >
                  <CardHeader className="pb-2" onClick={() => navigate(`/devotionals/${plan.id}`)}>
                    <CardTitle className="text-base group-hover:text-primary transition-colors">{plan.title}</CardTitle>
                    <CardDescription className="text-xs">
                      ✅ Completed {plan.completed_at ? format(new Date(plan.completed_at), "MMM d, yyyy") : ""}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between text-sm" onClick={() => navigate(`/devotionals/${plan.id}`)}>
                      <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300">
                        {plan.duration} days
                      </Badge>
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="mt-3 pt-3 border-t">
                      <ShareDevotionalDialog plan={plan} />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* Empty State */}
        {!plansLoading && plans?.length === 0 && (
          <Card className="border-2 border-dashed border-purple-300 dark:border-purple-700 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20">
            <CardContent className="py-16 text-center">
              <div className="mx-auto w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mb-6 shadow-xl">
                <Book className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-2 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                No Devotionals Yet
              </h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Create your first Phototheology devotional and start your spiritual journey with Christ-centered, Palace-structured daily encounters.
              </p>
              <div className="flex gap-4 justify-center flex-wrap">
                <Button 
                  onClick={() => setShowWizard(true)}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Devotional
                </Button>
                <Button 
                  onClick={() => setShowFriendWizard(true)}
                  variant="outline"
                  className="border-pink-300 text-pink-700 hover:bg-pink-50 dark:border-pink-700 dark:text-pink-300 dark:hover:bg-pink-950"
                >
                  <Gift className="h-4 w-4 mr-2" />
                  For a Friend
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Devotional?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this devotional plan and all progress.
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
    </div>
  );
}
