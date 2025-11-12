import { useEffect, useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { RealtimeChannel } from "@supabase/supabase-js";
import { useToast } from "@/hooks/use-toast";

interface ActiveUser {
  user_id: string;
  display_name: string;
  cursor_position?: number;
}

interface StudyUpdate {
  title?: string;
  content?: string;
  tags?: string[];
  is_favorite?: boolean;
  updated_by: string;
}

export const useCollaborativeStudy = (
  studyId: string,
  onExternalUpdate: (update: StudyUpdate) => void
) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeUsers, setActiveUsers] = useState<ActiveUser[]>([]);
  const [permission, setPermission] = useState<"view" | "edit" | "owner">("owner");
  const channelRef = useRef<RealtimeChannel | null>(null);
  const updateTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!studyId || !user) return;

    // Check user's permission level
    const checkPermission = async () => {
      // Check if owner
      const { data: studyData } = await supabase
        .from("user_studies")
        .select("user_id")
        .eq("id", studyId)
        .single();

      if (studyData?.user_id === user.id) {
        setPermission("owner");
        return;
      }

      // Check if collaborator
      const { data: collabData } = await supabase
        .from("study_collaborators")
        .select("permission")
        .eq("study_id", studyId)
        .eq("user_id", user.id)
        .single();

      if (collabData) {
        setPermission(collabData.permission as "view" | "edit");
      }
    };

    checkPermission();

    // Set up realtime channel for presence and study updates
    const channel = supabase.channel(`study:${studyId}`, {
      config: {
        presence: {
          key: user.id,
        },
      },
    });

    // Track user presence
    channel
      .on("presence", { event: "sync" }, () => {
        const state = channel.presenceState();
        const users: ActiveUser[] = [];
        
        Object.keys(state).forEach((presenceKey) => {
          const presences = state[presenceKey];
          presences.forEach((presence: any) => {
            if (presence.user_id !== user.id) {
              users.push({
                user_id: presence.user_id,
                display_name: presence.display_name,
                cursor_position: presence.cursor_position,
              });
            }
          });
        });

        setActiveUsers(users);
      })
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "user_studies",
          filter: `id=eq.${studyId}`,
        },
        (payload) => {
          // Only apply updates from other users
          if (payload.new.updated_by && payload.new.updated_by !== user.id) {
            onExternalUpdate(payload.new as StudyUpdate);
            
            // Show notification about external update
            toast({
              title: "Study updated",
              description: "Another collaborator made changes",
              duration: 2000,
            });
          }
        }
      )
      .subscribe(async (status) => {
        if (status === "SUBSCRIBED") {
          // Get user's display name
          const { data: profileData } = await supabase
            .from("profiles")
            .select("display_name")
            .eq("id", user.id)
            .single();

          // Track presence
          await channel.track({
            user_id: user.id,
            display_name: profileData?.display_name || "Anonymous",
            online_at: new Date().toISOString(),
          });
        }
      });

    channelRef.current = channel;

    return () => {
      channel.unsubscribe();
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current);
      }
    };
  }, [studyId, user, onExternalUpdate]);

  const updateCursorPosition = (position: number) => {
    if (channelRef.current && user) {
      // Debounce cursor updates
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current);
      }

      updateTimeoutRef.current = setTimeout(() => {
        channelRef.current?.track({
          user_id: user.id,
          cursor_position: position,
        });
      }, 100);
    }
  };

  return {
    activeUsers,
    permission,
    isOwner: permission === "owner",
    canEdit: permission === "edit" || permission === "owner",
    updateCursorPosition,
  };
};
