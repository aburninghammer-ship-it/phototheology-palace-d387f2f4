import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription 
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { Heart, Send, HandHeart, Sparkles } from "lucide-react";

interface PrayerEntryProps {
  churchId: string;
}

export function PrayerEntry({ churchId }: PrayerEntryProps) {
  const { user } = useAuth();
  const [showDialog, setShowDialog] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!user || !title.trim() || !content.trim()) return;
    
    setSubmitting(true);
    try {
      const { error } = await (supabase
        .from('church_prayer_requests' as any)
        .insert({
          church_id: churchId,
          user_id: user.id,
          title: title.trim(),
          content: content.trim(),
          is_public: isPublic,
          category: 'general'
        }) as any);

      if (error) throw error;
      
      toast.success("Prayer request submitted. We're praying with you.");
      setTitle("");
      setContent("");
      setShowDialog(false);
    } catch (error) {
      console.error('Error submitting prayer:', error);
      toast.error("Failed to submit prayer request");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Card 
        variant="glass" 
        className="cursor-pointer hover:border-primary/50 transition-all group bg-gradient-to-br from-rose-500/5 to-amber-500/5"
        onClick={() => setShowDialog(true)}
      >
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-rose-500/20 to-amber-500/20 group-hover:from-rose-500/30 group-hover:to-amber-500/30 transition-colors">
              <HandHeart className="h-6 w-6 text-rose-500" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold">Pray With Living Manna</h3>
                <Badge variant="outline" className="bg-rose-500/10 border-rose-500/30 text-rose-600">
                  <Heart className="h-3 w-3 mr-1" />
                  Community Prayer
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                Share a prayer request or lift up the church in prayer. We believe in the power of united intercession.
              </p>
              <div className="flex gap-2 mt-3">
                <Button size="sm" variant="outline" className="text-xs">
                  Submit a Request
                </Button>
                <Button size="sm" variant="ghost" className="text-xs text-muted-foreground">
                  View Prayer Wall
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <HandHeart className="h-5 w-5 text-rose-500" />
              Share Your Prayer Request
            </DialogTitle>
            <DialogDescription>
              Your Living Manna family is here to pray with you.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Prayer Title</Label>
              <Input
                id="title"
                placeholder="e.g., Healing for a loved one"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="content">Your Prayer Request</Label>
              <Textarea
                id="content"
                placeholder="Share what's on your heart..."
                rows={4}
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="public"
                checked={isPublic}
                onChange={(e) => setIsPublic(e.target.checked)}
                className="rounded border-border"
              />
              <Label htmlFor="public" className="text-sm text-muted-foreground">
                Share publicly on the prayer wall
              </Label>
            </div>

            <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
              <div className="flex items-start gap-2">
                <Sparkles className="h-4 w-4 text-primary mt-0.5" />
                <p className="text-xs text-muted-foreground">
                  "Again I say unto you, That if two of you shall agree on earth as touching any thing that they shall ask, it shall be done for them of my Father which is in heaven." — Matthew 18:19
                </p>
              </div>
            </div>

            <Button 
              onClick={handleSubmit} 
              disabled={submitting || !title.trim() || !content.trim()}
              className="w-full"
            >
              <Send className="h-4 w-4 mr-2" />
              {submitting ? "Submitting..." : "Submit Prayer Request"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
