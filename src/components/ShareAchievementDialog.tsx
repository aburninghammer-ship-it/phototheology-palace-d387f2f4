import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, Download, Share2, Twitter, Facebook, Instagram, Copy, Check } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

interface ShareAchievementDialogProps {
  open: boolean;
  onClose: () => void;
  achievement: {
    name: string;
    description: string;
    icon: string;
    points: number;
  } | null;
}

export function ShareAchievementDialog({ open, onClose, achievement }: ShareAchievementDialogProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [generating, setGenerating] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const generateShareImage = async () => {
    if (!achievement || !user) return;

    setGenerating(true);
    try {
      // Fetch user stats
      const { data: profile } = await supabase
        .from("profiles")
        .select("display_name, username, level, daily_study_streak")
        .eq("id", user.id)
        .single();

      const { data: rooms } = await supabase
        .from("room_progress")
        .select("id")
        .eq("user_id", user.id)
        .not("completed_at", "is", null);

      const { data, error } = await supabase.functions.invoke('generate-achievement-share', {
        body: {
          achievementName: achievement.name,
          achievementIcon: achievement.icon,
          points: achievement.points,
          userName: profile?.display_name || profile?.username || 'User',
          userLevel: profile?.level || 1,
          userStreak: profile?.daily_study_streak || 0,
          roomsCompleted: rooms?.length || 0,
        }
      });

      if (error) throw error;
      
      setImageUrl(data.imageUrl);
      toast({
        title: "Share image generated!",
        description: "Your achievement image is ready to share.",
      });
    } catch (error) {
      console.error('Error generating share image:', error);
      toast({
        title: "Failed to generate image",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setGenerating(false);
    }
  };

  const downloadImage = async () => {
    if (!imageUrl) return;

    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `achievement-${achievement?.name.replace(/\s+/g, '-').toLowerCase()}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      toast({
        title: "Image downloaded!",
        description: "Your achievement image has been saved.",
      });
    } catch (error) {
      console.error('Error downloading image:', error);
      toast({
        title: "Download failed",
        description: "Please try again.",
        variant: "destructive",
      });
    }
  };

  const shareToTwitter = () => {
    const text = `Just unlocked "${achievement?.name}" on Phototheology Palace! 🎉 +${achievement?.points} points`;
    const url = window.location.origin;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
  };

  const shareToFacebook = () => {
    const url = window.location.origin;
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
  };

  const copyShareLink = async () => {
    const text = `Just unlocked "${achievement?.name}" on Phototheology Palace! 🎉 +${achievement?.points} points\n${window.location.origin}`;
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    
    toast({
      title: "Copied to clipboard!",
      description: "Share text has been copied.",
    });
  };

  const handleOpen = (isOpen: boolean) => {
    if (isOpen && !imageUrl && achievement) {
      generateShareImage();
    }
    if (!isOpen) {
      onClose();
      setImageUrl(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpen}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Share2 className="h-5 w-5" />
            Share Your Achievement
          </DialogTitle>
          <DialogDescription>
            Share your accomplishment with friends and inspire others!
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Achievement Preview */}
          <div className="p-4 rounded-lg bg-gradient-to-br from-purple-100 to-indigo-100 dark:from-purple-900/20 dark:to-indigo-900/20 border">
            <div className="flex items-center gap-3">
              <div className="text-3xl">{achievement?.icon}</div>
              <div>
                <h4 className="font-bold">{achievement?.name}</h4>
                <p className="text-sm text-muted-foreground">{achievement?.description}</p>
                <p className="text-sm font-semibold text-yellow-600 dark:text-yellow-400 mt-1">
                  +{achievement?.points} Points
                </p>
              </div>
            </div>
          </div>

          {/* Generated Image */}
          {generating && (
            <div className="flex flex-col items-center justify-center py-8 space-y-3">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">Generating your share image...</p>
            </div>
          )}

          {imageUrl && (
            <div className="space-y-3">
              <div className="rounded-lg overflow-hidden border">
                <img 
                  src={imageUrl} 
                  alt="Achievement share" 
                  className="w-full h-auto"
                />
              </div>

              <Button 
                onClick={downloadImage} 
                variant="outline" 
                className="w-full"
              >
                <Download className="mr-2 h-4 w-4" />
                Download Image
              </Button>
            </div>
          )}

          {/* Share Buttons */}
          <div className="space-y-2">
            <p className="text-sm font-medium">Share on social media:</p>
            <div className="grid grid-cols-2 gap-2">
              <Button 
                onClick={shareToTwitter} 
                variant="outline"
                className="gap-2"
              >
                <Twitter className="h-4 w-4" />
                Twitter
              </Button>
              <Button 
                onClick={shareToFacebook} 
                variant="outline"
                className="gap-2"
              >
                <Facebook className="h-4 w-4" />
                Facebook
              </Button>
              <Button 
                onClick={copyShareLink} 
                variant="outline"
                className="col-span-2 gap-2"
              >
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
          </div>

          <p className="text-xs text-muted-foreground text-center">
            Tip: Download the image and share it directly on Instagram for best results!
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
