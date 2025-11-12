import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Share2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ShareChallengeButtonProps {
  challengeData: {
    type: string;
    title: string;
    content: string;
    difficulty?: string;
  };
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg" | "icon";
}

export const ShareChallengeButton = ({
  challengeData,
  variant = "outline",
  size = "default",
}: ShareChallengeButtonProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSharing, setIsSharing] = useState(false);
  const [showDialog, setShowDialog] = useState(false);

  const handleShare = async () => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to share challenges",
        variant: "destructive",
      });
      return;
    }

    setIsSharing(true);
    try {
      // Get user's display name
      const { data: profile } = await supabase
        .from("profiles")
        .select("display_name, username")
        .eq("id", user.id)
        .single();

      const displayName = profile?.display_name || profile?.username || "A student";

      // Create emoji based on challenge type
      const emoji = challengeData.type === "chef" 
        ? "🍳" 
        : challengeData.type === "equation" 
        ? "🧮" 
        : challengeData.type === "subject-connection"
        ? "🔗"
        : "🎯";

      // Create community post
      const postTitle = `${emoji} ${displayName} shared: ${challengeData.title}`;
      const postContent = `${challengeData.content}

${challengeData.difficulty ? `⚡ Difficulty: ${challengeData.difficulty}` : ""}

💬 Can you solve this? Share your solution below!`;

      const { data: newPost, error: postError } = await supabase
        .from("community_posts")
        .insert({
          user_id: user.id,
          title: postTitle,
          content: postContent,
          category: "challenge",
        })
        .select()
        .single();

      if (postError) throw postError;

      // Get users who want challenge notifications (excluding the poster)
      const { data: interestedUsers } = await supabase
        .from("notification_preferences")
        .select("user_id")
        .or(`${challengeData.type}_challenges.eq.true,daily_challenges.eq.true`)
        .neq("user_id", user.id);

      // Create notifications for interested users
      if (interestedUsers && interestedUsers.length > 0) {
        const notifications = interestedUsers.map((u) => ({
          user_id: u.user_id,
          type: "challenge_shared",
          title: "New Challenge Shared!",
          message: `${displayName} shared a ${challengeData.type} challenge`,
          link: "/community",
          metadata: {
            post_id: newPost?.id,
            challenge_type: challengeData.type,
          },
        }));

        await supabase.from("notifications").insert(notifications);
      }

      // Broadcast to all live users
      const liveChannel = supabase.channel("live-notifications");
      await liveChannel.send({
        type: "broadcast",
        event: "challenge-shared",
        payload: {
          type: "challenge-shared",
          message: "🔔 New Challenge Alert!",
          challengeType: challengeData.type,
          userName: displayName,
          link: "/community",
        },
      });

      toast({
        title: "Success!",
        description: "Challenge shared to community!",
      });

      setShowDialog(true);
    } catch (error) {
      console.error("Error sharing challenge:", error);
      toast({
        title: "Error",
        description: "Failed to share challenge",
        variant: "destructive",
      });
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <>
      <Button
        onClick={handleShare}
        disabled={isSharing}
        variant={variant}
        size={size}
        className="gap-2"
      >
        <Share2 className="h-4 w-4" />
        {isSharing ? "Sharing..." : "Share to Community"}
      </Button>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Challenge Shared! 🎉</DialogTitle>
            <DialogDescription>
              Your challenge has been posted to the community. Other students will be notified and can now try to solve it!
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-2">
            <Button onClick={() => setShowDialog(false)} variant="outline" className="flex-1">
              Stay Here
            </Button>
            <Button onClick={() => window.location.href = "/community"} className="flex-1">
              View in Community
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};