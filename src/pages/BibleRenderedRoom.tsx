import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Home, Info } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Footer } from "@/components/Footer";
import BibleRenderedDrill from "@/components/rooms/BibleRenderedDrill";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const BibleRenderedRoom = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 p-4 md:p-8">
      <div className="container max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <Button variant="outline" size="icon" onClick={() => navigate('/palace')}>
                <Home className="h-4 w-4" />
              </Button>
              <h1 className="text-4xl font-bold bg-gradient-palace bg-clip-text text-transparent">
                Bible Rendered Room
              </h1>
            </div>
            <p className="text-muted-foreground max-w-2xl">
              Compress all 1,189 chapters of Scripture into 50 memorable symbols. 
              Each symbol represents ~24 chapters—one image to hold an entire arc.
            </p>
          </div>
          <Badge variant="outline" className="hidden md:flex items-center gap-2">
            <BookOpen className="h-3 w-3" />
            Floor 1: Furnishing
          </Badge>
        </div>

        {/* Core Concept Card */}
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="h-5 w-5 text-primary" />
              The Bible in 50 Symbols
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              The Bible Rendered system divides Scripture into 50 blocks of approximately 24 chapters each. 
              Every block is captured by a single symbolic glyph that encodes its major theme:
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div className="p-3 rounded-lg bg-background border">
                <div className="text-3xl mb-1">÷</div>
                <p className="text-xs font-medium">Genesis 1–24</p>
                <p className="text-xs text-muted-foreground">Division</p>
              </div>
              <div className="p-3 rounded-lg bg-background border">
                <div className="text-3xl mb-1">×</div>
                <p className="text-xs font-medium">Genesis 25–50</p>
                <p className="text-xs text-muted-foreground">Multiplication</p>
              </div>
              <div className="p-3 rounded-lg bg-background border">
                <div className="text-3xl mb-1">➤</div>
                <p className="text-xs font-medium">Exodus 1–24</p>
                <p className="text-xs text-muted-foreground">Deliverance</p>
              </div>
              <div className="p-3 rounded-lg bg-background border">
                <div className="text-3xl mb-1">🌅</div>
                <p className="text-xs font-medium">Revelation 20–22</p>
                <p className="text-xs text-muted-foreground">Heaven</p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground italic">
              Master all 50 symbols and you can mentally "scan" the entire Bible in under a minute.
            </p>
          </CardContent>
        </Card>

        {/* Main Drill Component */}
        <BibleRenderedDrill />

        {/* Room Info Accordion */}
        <Accordion type="single" collapsible className="bg-muted/30 rounded-lg">
          <AccordionItem value="about" className="border-none">
            <AccordionTrigger className="px-4 py-3 hover:no-underline">
              <span className="flex items-center gap-2 text-sm font-medium">
                <Info className="h-4 w-4" />
                About the Bible Rendered Room
              </span>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4">
              <div className="space-y-4 text-sm text-muted-foreground">
                <p>
                  The Bible Rendered Room gives you the ultimate macro-view—compressing all 1,189 chapters 
                  of Scripture into 50 ultra-high-level frames. Each set captures the essence of a major 
                  biblical arc with a single symbolic glyph.
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h4 className="font-semibold text-foreground">Core Question:</h4>
                    <p>"What single symbol captures this section's essence?"</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold text-foreground">Purpose:</h4>
                    <p>
                      Train your mind to hold the WHOLE counsel of God in view, so you can see how 
                      individual passages fit into the grand narrative.
                    </p>
                  </div>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-foreground">How to Use:</h4>
                  <ol className="list-decimal list-inside space-y-1">
                    <li><strong>Learn Mode:</strong> Flip through all 50 symbols like flashcards</li>
                    <li><strong>Symbol → Range:</strong> See the symbol, identify the chapters</li>
                    <li><strong>Range → Symbol:</strong> See the chapters, identify the symbol</li>
                    <li><strong>Name → Symbol:</strong> See the theme name, identify the symbol</li>
                    <li><strong>Full Quiz:</strong> Combined drill for mastery</li>
                  </ol>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
      <Footer />
    </div>
  );
};

export default BibleRenderedRoom;
