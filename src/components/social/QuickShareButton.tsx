import { useState } from "react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Share2, Facebook, Twitter, Linkedin, Copy, Check, Loader2, ExternalLink, Link2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

interface QuickShareButtonProps {
  title: string;
  content: string;
  url?: string;
  type?: "gem" | "achievement" | "study" | "insight" | "challenge";
  size?: "default" | "sm" | "lg" | "icon";
  variant?: "default" | "outline" | "ghost" | "secondary";
}

export const QuickShareButton = ({
  title,
  content,
  url,
  type = "insight",
  size = "sm",
  variant = "outline"
}: QuickShareButtonProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [posting, setPosting] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const shareUrl = url || window.location.href;

  const { data: connections } = useQuery({
    queryKey: ['social-connections', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from('social_media_connections')
        .select('platform, is_active')
        .eq('user_id', user.id)
        .eq('is_active', true);
      
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const isConnected = (platform: string) => {
    return connections?.some(c => c.platform === platform);
  };

  const hasAnyConnection = connections && connections.length > 0;

  const handleDirectPost = async (platform: 'facebook' | 'twitter' | 'linkedin') => {
    if (!user) {
      toast.error("Please sign in to share");
      return;
    }

    if (!isConnected(platform)) {
      toast.error(`Connect ${platform} in your profile to post directly`, {
        action: {
          label: "Connect",
          onClick: () => navigate('/profile')
        }
      });
      return;
    }

    setPosting(platform);

    try {
      const shareMessage = `${content}\n\n#Phototheology #BibleStudy`;
      
      const { error } = await supabase.functions.invoke('post-to-social', {
        body: {
          platform,
          content: shareMessage,
          url: shareUrl,
        }
      });

      if (error) throw error;

      toast.success(`Posted to ${platform}!`, {
        description: "Your insight has been shared"
      });
    } catch (error: any) {
      console.error(`Error posting to ${platform}:`, error);
      toast.error(`Failed to post to ${platform}`, {
        description: error.message || "Please try again"
      });
    } finally {
      setPosting(null);
    }
  };

  const handleNativeShare = async () => {
    const shareText = `${title}\n\n${content}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: shareText,
          url: shareUrl,
        });
        toast.success("Shared successfully!");
      } catch (error) {
        if ((error as Error).name !== 'AbortError') {
          handleCopy();
        }
      }
    } else {
      handleCopy();
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(`${title}\n\n${content}\n\n${shareUrl}`);
      setCopied(true);
      toast.success("Copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error("Failed to copy");
    }
  };

  const getTypeLabel = () => {
    switch (type) {
      case "gem": return "Gem";
      case "achievement": return "Achievement";
      case "study": return "Study";
      case "challenge": return "Challenge";
      default: return "Insight";
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={variant} size={size} className="gap-2">
          <Share2 className="h-4 w-4" />
          {size !== "icon" && "Share"}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <div className="px-2 py-1.5 text-xs text-muted-foreground">
          Share this {getTypeLabel()}
        </div>
        <DropdownMenuSeparator />
        
        {/* Direct Post Options */}
        {hasAnyConnection && (
          <>
            {isConnected('facebook') && (
              <DropdownMenuItem 
                onClick={() => handleDirectPost('facebook')}
                disabled={posting === 'facebook'}
                className="gap-2"
              >
                {posting === 'facebook' ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Facebook className="h-4 w-4 text-blue-600" />
                )}
                Post to Facebook
              </DropdownMenuItem>
            )}
            
            {isConnected('twitter') && (
              <DropdownMenuItem 
                onClick={() => handleDirectPost('twitter')}
                disabled={posting === 'twitter'}
                className="gap-2"
              >
                {posting === 'twitter' ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Twitter className="h-4 w-4 text-sky-500" />
                )}
                Post to Twitter
              </DropdownMenuItem>
            )}
            
            {isConnected('linkedin') && (
              <DropdownMenuItem 
                onClick={() => handleDirectPost('linkedin')}
                disabled={posting === 'linkedin'}
                className="gap-2"
              >
                {posting === 'linkedin' ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Linkedin className="h-4 w-4 text-blue-700" />
                )}
                Post to LinkedIn
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
          </>
        )}

        {/* Native Share / Copy */}
        <DropdownMenuItem onClick={handleNativeShare} className="gap-2">
          <ExternalLink className="h-4 w-4" />
          Share via...
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={handleCopy} className="gap-2">
          {copied ? (
            <Check className="h-4 w-4 text-green-500" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
          {copied ? "Copied!" : "Copy Link"}
        </DropdownMenuItem>

        {/* Connect More */}
        {user && !hasAnyConnection && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate('/profile')} className="gap-2 text-primary">
              <Link2 className="h-4 w-4" />
              Connect Social Accounts
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
