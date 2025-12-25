import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { BibleReader } from "@/components/bible/BibleReader";
import { BibleNavigation } from "@/components/bible/BibleNavigation";
import { PTImageBible } from "@/components/bible/PTImageBible";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { BookMarked, HelpCircle, Headphones, BookOpen, Image } from "lucide-react";
import { Link } from "react-router-dom";
import { StudyBibleDemoDialog } from "@/components/bible/StudyBibleDemoDialog";
import { VoiceChatWidget } from "@/components/voice/VoiceChatWidget";
import { useAuth } from "@/hooks/useAuth";
import { OfflineIndicator } from "@/components/bible/OfflineIndicator";
import { usePreservePage } from "@/hooks/usePreservePage";

const Bible = () => {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [demoOpen, setDemoOpen] = useState(false);
  const tabFromUrl = searchParams.get("tab") === "images" ? "images" : "study";
  const [activeTab, setActiveTab] = useState<"study" | "images">(tabFromUrl);
  
  useEffect(() => {
    const tab = searchParams.get("tab") === "images" ? "images" : "study";
    setActiveTab(tab);
  }, [searchParams]);
  
  const handleTabChange = (value: string) => {
    const newTab = value as "study" | "images";
    setActiveTab(newTab);
    if (newTab === "images") {
      setSearchParams({ tab: "images" });
    } else {
      setSearchParams({});
    }
  };
  
  // Enable scroll position preservation for this page
  usePreservePage();

  return (
    <div className="min-h-screen gradient-subtle">
      <Navigation />
      
      <div className="pt-24 pb-16 px-3 sm:px-4 md:px-6">
        <div className="container mx-auto max-w-7xl">
          {/* Header - Glass Card */}
          <div className="glass-card mb-8 p-6 rounded-2xl">
            <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <img 
                  src="/pwa-192x192.png" 
                  alt="Phototheology" 
                  className="h-14 w-14 rounded-xl shadow-lg shadow-primary/20"
                />
                <div>
                  <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold mb-2 bg-gradient-palace bg-clip-text text-transparent">
                    Phototheology Study Bible (PSB)
                  </h1>
                  <p className="text-base sm:text-lg text-muted-foreground">
                    Scripture through principle lenses
                  </p>
                </div>
              </div>
              <div className="flex gap-2 flex-wrap">
                <Button 
                  variant="outline" 
                  className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/20 whitespace-nowrap"
                  onClick={() => setDemoOpen(true)}
                >
                  <HelpCircle className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">How to Use</span>
                  <span className="sm:hidden">Help</span>
                </Button>
                <Button asChild variant="outline" className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/20 whitespace-nowrap">
                  <Link to="/read-me-the-bible">
                    <Headphones className="h-4 w-4 mr-2" />
                    <span className="hidden sm:inline">Read Me the Bible</span>
                    <span className="sm:hidden">Listen</span>
                  </Link>
                </Button>
                <Button asChild variant="outline" className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/20 whitespace-nowrap">
                  <Link to="/memorization-verses">
                    <BookMarked className="h-4 w-4 mr-2" />
                    <span className="hidden sm:inline">My Memorization Verses</span>
                    <span className="sm:hidden">Memorization</span>
                  </Link>
                </Button>
              </div>
            </div>
          </div>

          <StudyBibleDemoDialog open={demoOpen} onOpenChange={setDemoOpen} />

          {user && (
            <VoiceChatWidget
              roomType="bible"
              roomId="study"
              className="mb-6"
            />
          )}

          {/* Main Tabs */}
          <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-6">
            <TabsList className="grid w-full max-w-md grid-cols-2 bg-card/50 backdrop-blur-md border border-border/50">
              <TabsTrigger 
                value="study" 
                className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary flex items-center gap-2"
              >
                <BookOpen className="h-4 w-4" />
                PT Study Bible
              </TabsTrigger>
              <TabsTrigger 
                value="images" 
                className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary flex items-center gap-2"
              >
                <Image className="h-4 w-4" />
                PT Image Bible
              </TabsTrigger>
            </TabsList>

            <TabsContent value="study" className="space-y-6">
              {/* Navigation */}
              <div className="mb-6 sm:mb-8">
                <BibleNavigation />
              </div>

              {/* Bible Reader */}
              <BibleReader />
            </TabsContent>

            <TabsContent value="images">
              <div className="glass-card p-6 rounded-2xl">
                <PTImageBible />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      <OfflineIndicator />
    </div>
  );
};

export default Bible;
