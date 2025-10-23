import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, Scroll, Crown } from "lucide-react";
import { SandboxedEmbed } from "@/components/SandboxedEmbed";

const DanielRevelationGPT = () => {

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-5xl font-bold flex items-center justify-center gap-2 text-primary">
              <Crown className="h-10 w-10" />
              Daniel & Revelation GPT
            </h1>
            <p className="text-xl text-muted-foreground">AI-Powered Prophecy Study Assistant</p>
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Sparkles className="h-4 w-4" />
              <span>Unlock the mysteries of biblical prophecy with AI guidance</span>
            </div>
          </div>

          <Card className="border-2 border-primary/20">
            <CardHeader className="bg-gradient-to-r from-purple-500/10 to-blue-500/10">
              <CardTitle className="text-2xl">Chat with Daniel & Revelation GPT</CardTitle>
              <CardDescription className="text-base">
                Explore the prophetic books of Daniel and Revelation. Ask questions about prophecy, symbolism, historical fulfillment, and end-time events from a historicist perspective.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <SandboxedEmbed
                scriptUrl="https://phototheologygpt.com/api/embed/bundle.js"
                embedId="deployment-f476232e-cd16-4b73-b412-d9492c0f5fb7"
                minHeight="600px"
                title="Daniel & Revelation GPT Chat Interface"
              />
            </CardContent>
          </Card>

        </div>
      </main>
    </div>
  );
};

export default DanielRevelationGPT;
