import { Navigation } from "@/components/Navigation";
import { SimplifiedNav } from "@/components/SimplifiedNav";
import { SessionLibrary } from "@/components/session/SessionLibrary";
import { useUserPreferences } from "@/hooks/useUserPreferences";
import { SEO } from "@/components/SEO";

export default function Sessions() {
  const { preferences } = useUserPreferences();

  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title="Study Sessions | Phototheology"
        description="View and manage your saved Bible study sessions"
      />
      {preferences.navigation_style === "simplified" ? <SimplifiedNav /> : <Navigation />}
      
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Study Sessions</h1>
          <p className="text-muted-foreground">
            View, resume, or share your saved study sessions
          </p>
        </div>

        <SessionLibrary />
      </div>
    </div>
  );
}