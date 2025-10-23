import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, Shield, Book } from "lucide-react";
import { SandboxedEmbed } from "@/components/SandboxedEmbed";

const ApologeticsGPT = () => {

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
              <SandboxedEmbed
                scriptUrl="https://phototheologygpt.com/api/embed/bundle.js"
                embedId="deployment-a3183e57-2e65-466d-bcff-ac232a6231ea"
                minHeight="600px"
                title="ApologeticsGPT Chat Interface"
              />
            </CardContent>
          </Card>

        </div>
      </main>
    </div>
  );
};

export default ApologeticsGPT;
