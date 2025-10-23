import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Search, Sparkles, Mic } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

const ResearchMode = () => {
  const { toast } = useToast();
  const [query, setQuery] = useState("");
  const [research, setResearch] = useState("");
  const [researching, setResearching] = useState(false);

  const startResearch = async () => {
    if (!query.trim()) {
      toast({
        title: "Please enter a topic",
        description: "Enter a topic, theme, or scripture to research",
        variant: "destructive",
      });
      return;
    }

    setResearching(true);

    try {
      const { data, error } = await supabase.functions.invoke("jeeves", {
        body: {
          mode: "research",
          query: query,
        },
      });

      if (error) throw error;

      setResearch(data.content);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setResearching(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="pt-16">
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-blue-600 via-indigo-600 to-blue-700 text-white py-16 px-4">
          <div className="container mx-auto max-w-6xl text-center">
            <div className="inline-block bg-white rounded-2xl p-6 shadow-lg mb-6">
              <Search className="h-16 w-16 text-blue-600" />
            </div>
            <h1 className="text-5xl font-bold mb-4">Research Mode</h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto">
              An AI-powered assistant for deep biblical study
            </p>
          </div>
        </div>

        {/* Research Section */}
        <div className="container mx-auto px-4 py-12 max-w-6xl">
          <Card className="mb-8">
            <CardContent className="p-8">
              <h2 className="text-3xl font-bold mb-4">Start Your Research Journey</h2>
              <p className="text-muted-foreground mb-8">
                Enter a topic above to begin a deep dive with Jeeves. Get comprehensive, scholarly
                research with citations and sources.
              </p>

              <div className="flex gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    placeholder="Enter a topic, theme, or scripture..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && startResearch()}
                    className="pl-12 pr-12 h-16 text-lg"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-1/2 -translate-y-1/2"
                  >
                    <Mic className="h-5 w-5" />
                  </Button>
                </div>
                <Button
                  onClick={startResearch}
                  disabled={researching}
                  className="h-16 px-8 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                >
                  {researching ? (
                    <>
                      <Sparkles className="mr-2 h-5 w-5 animate-spin" />
                      Researching...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-5 w-5" />
                      Start Research
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {!research && !researching && (
            <div className="text-center py-20">
              <Search className="h-32 w-32 text-muted-foreground mx-auto mb-6 opacity-20" />
              <h2 className="text-3xl font-bold mb-2 text-muted-foreground">
                Start Your Research Journey
              </h2>
              <p className="text-muted-foreground">
                Enter a topic above to begin your deep biblical research
              </p>
            </div>
          )}

          {research && (
            <Card>
              <CardContent className="p-8">
                <div className="flex items-center gap-2 mb-6">
                  <Search className="h-6 w-6 text-primary" />
                  <h3 className="text-2xl font-bold">Research Results</h3>
                </div>
                <ScrollArea className="h-[700px] pr-4">
                  <div className="prose prose-lg dark:prose-invert max-w-none">
                    {research.split("\n").map((paragraph, idx) => (
                      <p key={idx} className="mb-4">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
};

export default ResearchMode;
