import { useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, Shield, Book } from "lucide-react";

const ApologeticsGPT = () => {
  useEffect(() => {
    // Load the Phototheology embed script
    const script = document.createElement("script");
    script.src = "https://phototheologygpt.com/api/embed/bundle.js";
    script.defer = true;
    document.body.appendChild(script);

    return () => {
      // Cleanup script on unmount
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-5xl font-bold flex items-center justify-center gap-2 text-primary">
              <Shield className="h-10 w-10" />
              ApologeticsGPT
            </h1>
            <p className="text-xl text-muted-foreground">AI-Powered Defense of the Faith</p>
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Sparkles className="h-4 w-4" />
              <span>Equip yourself to defend biblical truth with confidence</span>
            </div>
          </div>

          <Card className="border-2 border-primary/20">
            <CardHeader className="bg-gradient-to-r from-blue-500/10 to-green-500/10">
              <CardTitle className="text-2xl">Chat with ApologeticsGPT</CardTitle>
              <CardDescription className="text-base">
                Get answers to tough questions about faith, science, history, and biblical reliability. Learn to defend the gospel with grace and truth.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div 
                id="deployment-a3183e57-2e65-466d-bcff-ac232a6231ea"
                className="min-h-[600px] w-full"
              />
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-3 gap-4 text-center">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center justify-center gap-2">
                  <Shield className="h-5 w-5" />
                  Defend the Faith
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Answer skeptics and critics with biblical evidence and logic
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center justify-center gap-2">
                  <Book className="h-5 w-5" />
                  Biblical Reliability
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Explore manuscript evidence, archaeology, and fulfilled prophecy
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center justify-center gap-2">
                  <Sparkles className="h-5 w-5" />
                  Grace & Truth
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Learn to share your faith with both compassion and conviction
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ApologeticsGPT;
