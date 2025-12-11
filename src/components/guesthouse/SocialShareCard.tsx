import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Share2, Twitter, Facebook, Link2, Check } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export function SocialShareCard() {
  const [copied, setCopied] = useState(false);
  const shareUrl = typeof window !== "undefined" ? window.location.href : "";
  const shareText = "Join me for a free Scripture adventure in the GuestHouse! No account needed. 🏰✨";

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast.success("Link copied!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy link");
    }
  };

  const shareTwitter = () => {
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
      "_blank"
    );
  };

  const shareFacebook = () => {
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
      "_blank"
    );
  };

  return (
    <Card className="p-6 bg-card/80 backdrop-blur-xl border-border/50 text-center">
      <div className="flex items-center justify-center gap-2 mb-4">
        <Share2 className="w-5 h-5 text-primary" />
        <h3 className="font-semibold">Invite a Friend</h3>
      </div>
      
      <p className="text-sm text-muted-foreground mb-4">
        Scripture is better with friends. Share the GuestHouse!
      </p>

      <div className="flex items-center justify-center gap-3">
        <Button 
          variant="outline" 
          size="icon" 
          onClick={shareTwitter}
          className="rounded-full hover:bg-primary/10 hover:text-primary hover:border-primary/30"
        >
          <Twitter className="w-4 h-4" />
        </Button>
        
        <Button 
          variant="outline" 
          size="icon" 
          onClick={shareFacebook}
          className="rounded-full hover:bg-primary/10 hover:text-primary hover:border-primary/30"
        >
          <Facebook className="w-4 h-4" />
        </Button>
        
        <Button 
          variant="outline" 
          size="icon" 
          onClick={copyLink}
          className="rounded-full hover:bg-primary/10 hover:text-primary hover:border-primary/30"
        >
          {copied ? <Check className="w-4 h-4 text-green-500" /> : <Link2 className="w-4 h-4" />}
        </Button>
      </div>
    </Card>
  );
}
