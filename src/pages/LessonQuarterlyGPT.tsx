import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, BookOpen, Calendar } from "lucide-react";
import { SandboxedEmbed } from "@/components/SandboxedEmbed";

const LessonQuarterlyGPT = () => {

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-5xl font-bold flex items-center justify-center gap-2 text-primary">
              <Calendar className="h-10 w-10" />
              Lesson Quarterly GPT
            </h1>
            <p className="text-xl text-muted-foreground">AI-Powered Sabbath School Study Guide</p>
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Sparkles className="h-4 w-4" />
              <span>Deepen your weekly Bible study with AI insights</span>
            </div>
          </div>

          <Card className="border-2 border-primary/20">
            <CardHeader className="bg-gradient-to-r from-green-500/10 to-blue-500/10">
              <CardTitle className="text-2xl">Chat with Lesson Quarterly GPT</CardTitle>
              <CardDescription className="text-base">
                Get deeper insights into your quarterly lessons. Ask questions, explore connections, and discover practical applications for each week's study.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <SandboxedEmbed
                scriptUrl="https://phototheologygpt.com/api/embed/bundle.js"
                embedId="deployment-1d681f37-c416-46d5-b565-d7e9673aeb14"
                minHeight="600px"
                title="Lesson Quarterly GPT Chat Interface"
              />
            </CardContent>
          </Card>

        </div>
      </main>
    </div>
  );
};

export default LessonQuarterlyGPT;
