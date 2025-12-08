import { Navigation } from "@/components/Navigation";
import { SimplifiedNav } from "@/components/SimplifiedNav";
import { SEO } from "@/components/SEO";
import { useUserPreferences } from "@/hooks/useUserPreferences";
import { QuickNotes } from "@/components/notes/QuickNotes";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Cloud, CloudOff, Info } from "lucide-react";
import { useOfflineNotes } from "@/hooks/useOfflineNotes";

const Notes = () => {
  const { preferences } = useUserPreferences();
  const { isOnline, notes } = useOfflineNotes();

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="My Notes | Phototheology"
        description="Jot down thoughts, contemplations, and insights from your Bible study. Available offline."
      />
      {preferences.navigation_style === "simplified" ? <SimplifiedNav /> : <Navigation />}

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">My Notes</h1>
            <p className="text-muted-foreground">
              Capture your thoughts and contemplations
            </p>
          </div>
          <Badge variant="outline" className="flex items-center gap-2">
            {isOnline ? (
              <>
                <Cloud className="h-4 w-4 text-green-500" />
                Online
              </>
            ) : (
              <>
                <CloudOff className="h-4 w-4" />
                Offline Mode
              </>
            )}
          </Badge>
        </div>

        {/* Info Card */}
        <Card className="mb-6 bg-primary/5 border-primary/20">
          <CardContent className="pt-4">
            <div className="flex items-start gap-3">
              <Info className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm">Offline Available</h3>
                <p className="text-sm text-muted-foreground">
                  Your notes are saved locally and will sync when you're back online.
                  Write anytime, anywhere — even without internet.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Notes Component */}
        <QuickNotes />
      </div>
    </div>
  );
};

export default Notes;
