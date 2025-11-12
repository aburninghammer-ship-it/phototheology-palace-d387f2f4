import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Users, UserPlus, X, Eye, Edit } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Collaborator {
  id: string;
  user_id: string;
  permission: "view" | "edit";
  invited_at: string;
  profiles?: {
    display_name: string;
    username: string;
  };
}

interface CollaboratorManagerProps {
  studyId: string;
  isOwner: boolean;
}

export const CollaboratorManager = ({ studyId, isOwner }: CollaboratorManagerProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [email, setEmail] = useState("");
  const [permission, setPermission] = useState<"view" | "edit">("edit");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      fetchCollaborators();
    }
  }, [open, studyId]);

  const fetchCollaborators = async () => {
    try {
      const { data, error } = await supabase
        .from("study_collaborators")
        .select("*")
        .eq("study_id", studyId);

      if (error) throw error;
      
      // Fetch profiles for each collaborator
      const collabsWithProfiles = await Promise.all(
        (data || []).map(async (collab) => {
          const { data: profileData } = await supabase
            .from("profiles")
            .select("display_name, username")
            .eq("id", collab.user_id)
            .single();
          
          return {
            ...collab,
            permission: collab.permission as "view" | "edit",
            profiles: profileData || { display_name: "Unknown", username: "unknown" },
          };
        })
      );
      
      setCollaborators(collabsWithProfiles);
    } catch (error) {
      console.error("Error fetching collaborators:", error);
    }
  };

  const addCollaborator = async () => {
    if (!email.trim()) return;

    setLoading(true);
    try {
      // First, find user by email
      const { data: userData, error: userError } = await supabase
        .from("profiles")
        .select("id")
        .eq("username", email.trim())
        .single();

      if (userError || !userData) {
        toast({
          title: "User not found",
          description: "No user found with that email/username",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase
        .from("study_collaborators")
        .insert({
          study_id: studyId,
          user_id: userData.id,
          permission,
          invited_by: user?.id,
        });

      if (error) {
        if (error.code === "23505") {
          toast({
            title: "Already a collaborator",
            description: "This user is already a collaborator",
            variant: "destructive",
          });
        } else {
          throw error;
        }
        return;
      }

      toast({
        title: "Collaborator added",
        description: "User can now access this study",
      });

      setEmail("");
      fetchCollaborators();
    } catch (error) {
      console.error("Error adding collaborator:", error);
      toast({
        title: "Error",
        description: "Failed to add collaborator",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const removeCollaborator = async (collaboratorId: string) => {
    try {
      const { error } = await supabase
        .from("study_collaborators")
        .delete()
        .eq("id", collaboratorId);

      if (error) throw error;

      toast({
        title: "Collaborator removed",
        description: "User no longer has access to this study",
      });

      fetchCollaborators();
    } catch (error) {
      console.error("Error removing collaborator:", error);
      toast({
        title: "Error",
        description: "Failed to remove collaborator",
        variant: "destructive",
      });
    }
  };

  const updatePermission = async (collaboratorId: string, newPermission: "view" | "edit") => {
    try {
      const { error } = await supabase
        .from("study_collaborators")
        .update({ permission: newPermission })
        .eq("id", collaboratorId);

      if (error) throw error;

      toast({
        title: "Permission updated",
        description: "Collaborator permissions changed successfully",
      });

      fetchCollaborators();
    } catch (error) {
      console.error("Error updating permission:", error);
      toast({
        title: "Error",
        description: "Failed to update permission",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Users className="w-4 h-4" />
          Collaborators ({collaborators.length})
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Manage Collaborators</DialogTitle>
          <DialogDescription>
            {isOwner
              ? "Invite others to view or edit this study together"
              : "View who has access to this study"}
          </DialogDescription>
        </DialogHeader>

        {isOwner && (
          <div className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="Enter username..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && addCollaborator()}
              />
              <Select value={permission} onValueChange={(v: "view" | "edit") => setPermission(v)}>
                <SelectTrigger className="w-24">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="view">View</SelectItem>
                  <SelectItem value="edit">Edit</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={addCollaborator} disabled={loading} size="icon">
                <UserPlus className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}

        <div className="space-y-2 max-h-60 overflow-y-auto">
          {collaborators.map((collab) => (
            <div key={collab.id} className="flex items-center justify-between p-2 bg-muted rounded-lg">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">
                  {collab.profiles?.display_name || collab.profiles?.username}
                </span>
                <Badge variant="secondary" className="gap-1">
                  {collab.permission === "edit" ? (
                    <Edit className="w-3 h-3" />
                  ) : (
                    <Eye className="w-3 h-3" />
                  )}
                  {collab.permission}
                </Badge>
              </div>
              {isOwner && (
                <div className="flex gap-1">
                  <Select
                    value={collab.permission}
                    onValueChange={(v: "view" | "edit") => updatePermission(collab.id, v)}
                  >
                    <SelectTrigger className="h-7 w-20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="view">View</SelectItem>
                      <SelectItem value="edit">Edit</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => removeCollaborator(collab.id)}
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </div>
              )}
            </div>
          ))}
          {collaborators.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4">
              No collaborators yet. {isOwner && "Add someone to get started!"}
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
