import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Share2, Copy, Download, Check, Mail, MessageCircle, Gift, Twitter, Facebook } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { DevotionalDay, DevotionalPlan } from "@/hooks/useDevotionals";
import { supabase } from "@/integrations/supabase/client";

interface ShareDevotionalDialogProps {
  plan: DevotionalPlan;
  day?: DevotionalDay;
  trigger?: React.ReactNode;
  isPublicView?: boolean;
}

export const ShareDevotionalDialog = ({ plan, day, trigger, isPublicView }: ShareDevotionalDialogProps) => {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [shareToken, setShareToken] = useState(plan.share_token);
  const { toast } = useToast();

  // Generate share token if it doesn't exist and make plan public
  useEffect(() => {
    const ensureShareToken = async () => {
      if (!plan.share_token && open) {
        const token = crypto.randomUUID().slice(0, 12);
        const { error } = await supabase
          .from("devotional_plans")
          .update({ share_token: token, is_public: true })
          .eq("id", plan.id);
        
        if (!error) {
          setShareToken(token);
        }
      }
    };
    ensureShareToken();
  }, [open, plan.id, plan.share_token]);

  const shareUrl = shareToken 
    ? `${window.location.origin}/shared-devotional/${shareToken}`
    : `${window.location.origin}/devotionals/${plan.id}`;

  const getShareContent = () => {
    const appLink = `${window.location.origin}`;
    const appInvite = `\n\n---\n✨ Check out the Phototheology app: ${appLink}`;
    
    if (day) {
      // Include full devotional content
      const devotionalContent = day.devotional_text 
        ? day.devotional_text 
        : `${day.scripture_reference}\n"${day.scripture_text}"\n\n${day.christ_connection}`;
      
      return `📖 ${day.title}\n\n${devotionalContent}${appInvite}`;
    }
    return `📘 ${plan.title}\n\nA ${plan.duration}-day devotional journey on: ${plan.theme}\n\nJoin me on this spiritual journey!${appInvite}`;
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({
      title: "Link Copied",
      description: "Share link copied to clipboard",
    });
  };

  const handleCopyContent = () => {
    navigator.clipboard.writeText(getShareContent() + `\n\n${shareUrl}`);
    toast({
      title: "Content Copied",
      description: "Devotional content copied to clipboard",
    });
  };

  const handleDownload = () => {
    const content = day
      ? `${day.title}\n\n${day.scripture_reference}\n${day.scripture_text}\n\nVisual Imagery:\n${day.visual_imagery}\n\nApplication:\n${day.application}\n\nChrist Connection:\n${day.christ_connection}\n\nPrayer:\n${day.prayer}\n\nChallenge:\n${day.challenge}\n\n---\nGet free access to personalized devotionals at: ${window.location.origin}`
      : `${plan.title}\n\nTheme: ${plan.theme}\nDuration: ${plan.duration} days\nFormat: ${plan.format}\n\n---\nGet free access to personalized devotionals at: ${window.location.origin}`;
    
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${(day?.title || plan.title).replace(/[^a-z0-9]/gi, "_").toLowerCase()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast({
      title: "Downloaded",
      description: "Devotional saved as text file",
    });
  };

  const handleShareViaEmail = () => {
    const subject = encodeURIComponent(day ? day.title : plan.title);
    const body = encodeURIComponent(getShareContent() + `\n\n${shareUrl}`);
    window.open(`mailto:?subject=${subject}&body=${body}`);
  };

  const handleShareViaSMS = () => {
    const text = encodeURIComponent(getShareContent() + `\n\n${shareUrl}`);
    window.open(`sms:?body=${text}`);
  };

  const handleShareViaTwitter = () => {
    const text = encodeURIComponent(day ? `📖 ${day.title} - ${day.scripture_reference}\n\n${shareUrl}` : `📘 ${plan.title}\n\n${shareUrl}`);
    window.open(`https://twitter.com/intent/tweet?text=${text}`, "_blank");
  };

  const handleShareViaFacebook = () => {
    // Use edge function URL for Facebook so crawlers get dynamic OG tags
    const ogUrl = shareToken 
      ? `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/og-devotional?token=${shareToken}`
      : shareUrl;
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(ogUrl)}`, "_blank");
  };

  const handleShareViaWhatsApp = () => {
    const text = encodeURIComponent(getShareContent());
    window.open(`https://api.whatsapp.com/send?text=${text}`, "_blank");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ? (
          React.cloneElement(trigger as React.ReactElement, {
            onClick: (e: React.MouseEvent) => {
              e.preventDefault();
              e.stopPropagation();
              setOpen(true);
            }
          })
        ) : (
          <Button 
            variant="outline" 
            size="sm" 
            className="gap-2 border-purple-300 text-purple-700 hover:bg-purple-50 dark:border-purple-700 dark:text-purple-300 dark:hover:bg-purple-950"
          >
            <Share2 className="w-4 h-4" />
            Share
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="bg-gradient-to-br from-background via-background to-purple-50/50 dark:to-purple-950/20">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="p-2 rounded-full bg-gradient-to-br from-purple-500 to-pink-500">
              <Share2 className="w-4 h-4 text-white" />
            </div>
            Share {day ? "Today's Devotion" : "Devotional"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Preview */}
          <div className="p-4 rounded-xl bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-950 dark:to-pink-950 border border-purple-200 dark:border-purple-800">
            <p className="text-sm font-medium text-purple-900 dark:text-purple-100 line-clamp-3">
              {day ? day.title : plan.title}
            </p>
            <p className="text-xs text-purple-700 dark:text-purple-300 mt-1">
              {day ? day.scripture_reference : `${plan.duration}-day journey on ${plan.theme}`}
            </p>
          </div>

          {/* Share Link */}
          <div>
            <label className="text-sm font-medium mb-2 block">Share Link</label>
            <div className="flex gap-2">
              <Input value={shareUrl} readOnly className="bg-muted/50" />
              <Button onClick={handleCopyLink} size="icon" variant="secondary">
                {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
              </Button>
            </div>
          </div>

          {/* Quick Share Buttons */}
          <div className="grid grid-cols-2 gap-2">
            <Button onClick={handleShareViaEmail} variant="outline" className="gap-2 border-amber-300 hover:bg-amber-50 dark:border-amber-700 dark:hover:bg-amber-950">
              <Mail className="w-4 h-4 text-amber-600" />
              Email
            </Button>
            <Button onClick={handleShareViaSMS} variant="outline" className="gap-2 border-emerald-300 hover:bg-emerald-50 dark:border-emerald-700 dark:hover:bg-emerald-950">
              <MessageCircle className="w-4 h-4 text-emerald-600" />
              Text
            </Button>
            <Button onClick={handleShareViaWhatsApp} variant="outline" className="gap-2 border-green-300 hover:bg-green-50 dark:border-green-700 dark:hover:bg-green-950">
              <MessageCircle className="w-4 h-4 text-green-600" />
              WhatsApp
            </Button>
            <Button onClick={handleShareViaTwitter} variant="outline" className="gap-2 border-sky-300 hover:bg-sky-50 dark:border-sky-700 dark:hover:bg-sky-950">
              <Twitter className="w-4 h-4 text-sky-500" />
              Twitter/X
            </Button>
            <Button onClick={handleShareViaFacebook} variant="outline" className="gap-2 border-blue-300 hover:bg-blue-50 dark:border-blue-700 dark:hover:bg-blue-950 col-span-2">
              <Facebook className="w-4 h-4 text-blue-600" />
              Facebook
            </Button>
          </div>

          {/* Other Options */}
          <div className="space-y-2 pt-2 border-t">
            <Button onClick={handleCopyContent} variant="ghost" className="w-full justify-start gap-2">
              <Copy className="w-4 h-4" />
              Copy Content
            </Button>
            <Button onClick={handleDownload} variant="ghost" className="w-full justify-start gap-2">
              <Download className="w-4 h-4" />
              Download as Text
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
