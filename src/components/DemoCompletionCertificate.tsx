import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, Share2, Twitter, Facebook, Copy, Check, Award } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import jsPDF from "jspdf";

interface DemoCompletionCertificateProps {
  open: boolean;
  onClose: () => void;
  userName?: string;
}

export function DemoCompletionCertificate({ open, onClose, userName = "Student" }: DemoCompletionCertificateProps) {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  const generatePDF = () => {
    const doc = new jsPDF({
      orientation: "landscape",
      unit: "mm",
      format: "a4"
    });

    // Background gradient effect
    doc.setFillColor(147, 51, 234);
    doc.rect(0, 0, 297, 210, "F");
    doc.setFillColor(255, 255, 255);
    doc.rect(10, 10, 277, 190, "F");

    // Border
    doc.setDrawColor(147, 51, 234);
    doc.setLineWidth(2);
    doc.rect(15, 15, 267, 180);

    // Title
    doc.setFontSize(40);
    doc.setTextColor(51, 51, 51);
    doc.text("Certificate of Completion", 148.5, 50, { align: "center" });

    // Decorative line
    doc.setLineWidth(0.5);
    doc.setDrawColor(147, 51, 234);
    doc.line(60, 60, 237, 60);

    // Body text
    doc.setFontSize(16);
    doc.setTextColor(100, 100, 100);
    doc.text("This is to certify that", 148.5, 80, { align: "center" });

    // User name
    doc.setFontSize(32);
    doc.setTextColor(51, 51, 51);
    doc.text(userName, 148.5, 100, { align: "center" });

    // Achievement text
    doc.setFontSize(16);
    doc.setTextColor(100, 100, 100);
    doc.text("has successfully completed the", 148.5, 115, { align: "center" });

    // Course name
    doc.setFontSize(24);
    doc.setTextColor(147, 51, 234);
    doc.text("Palace Method Interactive Demo", 148.5, 135, { align: "center" });

    // Skills learned
    doc.setFontSize(12);
    doc.setTextColor(100, 100, 100);
    const skills = [
      "✓ Story Room: Visual Memory Techniques",
      "✓ Imagination Room: Immersive Bible Study",
      "✓ 24FPS Room: Chapter-Level Anchors",
      "✓ Translation Room: Verse Visualization"
    ];
    let yPos = 150;
    skills.forEach(skill => {
      doc.text(skill, 148.5, yPos, { align: "center" });
      yPos += 7;
    });

    // Date
    doc.setFontSize(12);
    doc.setTextColor(100, 100, 100);
    const date = new Date().toLocaleDateString("en-US", { 
      year: "numeric", 
      month: "long", 
      day: "numeric" 
    });
    doc.text(`Completed on ${date}`, 148.5, 185, { align: "center" });

    // Save
    doc.save("Phototheology_Demo_Certificate.pdf");

    toast({
      title: "Certificate downloaded!",
      description: "Your completion certificate has been saved.",
    });
  };

  const shareToTwitter = () => {
    const text = "Just completed the Palace Method Interactive Demo! 🎉 Ready to transform my Bible study with visual memory techniques.";
    const url = window.location.origin + "/interactive-demo";
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
      "_blank"
    );
  };

  const shareToFacebook = () => {
    const url = window.location.origin + "/interactive-demo";
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      "_blank"
    );
  };

  const copyShareLink = async () => {
    const text = "Just completed the Palace Method Interactive Demo! 🎉 Ready to transform my Bible study with visual memory techniques.\n" + 
                 window.location.origin + "/interactive-demo";
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);

    toast({
      title: "Copied to clipboard!",
      description: "Share text has been copied.",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Award className="h-8 w-8 text-primary" />
            Congratulations!
          </DialogTitle>
          <DialogDescription>
            You've completed the Palace Method Interactive Demo
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Certificate Preview */}
          <div className="border-4 border-primary/20 rounded-lg p-8 bg-gradient-to-br from-primary/5 via-background to-accent/5 text-center">
            <div className="mb-4">
              <Award className="h-16 w-16 mx-auto text-primary animate-pulse" />
            </div>
            
            <h3 className="text-3xl font-bold mb-2">Certificate of Completion</h3>
            <div className="w-32 h-1 bg-primary mx-auto mb-4"></div>
            
            <p className="text-muted-foreground mb-2">This certifies that</p>
            <p className="text-2xl font-bold mb-2">{userName}</p>
            <p className="text-muted-foreground mb-2">has successfully completed</p>
            <p className="text-xl font-semibold text-primary mb-4">Palace Method Interactive Demo</p>
            
            <div className="grid grid-cols-2 gap-2 text-sm mb-4">
              <Badge variant="secondary" className="justify-center py-2">
                ✓ Story Room
              </Badge>
              <Badge variant="secondary" className="justify-center py-2">
                ✓ Imagination Room
              </Badge>
              <Badge variant="secondary" className="justify-center py-2">
                ✓ 24FPS Room
              </Badge>
              <Badge variant="secondary" className="justify-center py-2">
                ✓ Translation Room
              </Badge>
            </div>
            
            <p className="text-xs text-muted-foreground">
              {new Date().toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric"
              })}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button onClick={generatePDF} className="w-full gap-2" size="lg">
              <Download className="h-5 w-5" />
              Download Certificate PDF
            </Button>

            <div className="grid grid-cols-2 gap-2">
              <Button onClick={shareToTwitter} variant="outline" className="gap-2">
                <Twitter className="h-4 w-4" />
                Share on Twitter
              </Button>
              <Button onClick={shareToFacebook} variant="outline" className="gap-2">
                <Facebook className="h-4 w-4" />
                Share on Facebook
              </Button>
            </div>

            <Button onClick={copyShareLink} variant="outline" className="w-full gap-2">
              {copied ? (
                <>
                  <Check className="h-4 w-4" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  Copy Share Text
                </>
              )}
            </Button>
          </div>

          <div className="text-center pt-4 border-t">
            <p className="text-sm text-muted-foreground mb-3">
              Ready to unlock the full Palace Method?
            </p>
            <Button onClick={onClose} variant="default" size="lg">
              Continue to Sign Up
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
