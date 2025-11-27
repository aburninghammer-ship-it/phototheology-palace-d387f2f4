import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Copy, Share2, Globe, Lock, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface SeriesShareDialogProps {
  seriesId: string;
  seriesTitle: string;
  isPublic?: boolean;
  shareToken?: string;
  onUpdate: () => void;
}

export function SeriesShareDialog({ 
  seriesId, 
  seriesTitle, 
  isPublic = false, 
  shareToken,
  onUpdate 
}: SeriesShareDialogProps) {
  const [open, setOpen] = useState(false);
  const [publicStatus, setPublicStatus] = useState(isPublic);
  const [token, setToken] = useState(shareToken || '');
  const [saving, setSaving] = useState(false);

  const generateShareToken = () => {
    return 'BSS' + Math.random().toString(36).substring(2, 10).toUpperCase();
  };

  const handleTogglePublic = async (checked: boolean) => {
    setSaving(true);
    try {
      const newToken = checked && !token ? generateShareToken() : token;
      
      const { error } = await supabase
        .from('bible_study_series')
        .update({ 
          is_public: checked,
          share_token: checked ? newToken : null
        })
        .eq('id', seriesId);

      if (error) throw error;

      setPublicStatus(checked);
      setToken(checked ? newToken : '');
      onUpdate();
      toast.success(checked ? 'Series is now public!' : 'Series is now private');
    } catch (error) {
      console.error('Error updating share settings:', error);
      toast.error('Failed to update share settings');
    } finally {
      setSaving(false);
    }
  };

  const copyShareLink = () => {
    const link = `${window.location.origin}/series/shared/${token}`;
    navigator.clipboard.writeText(link);
    toast.success('Share link copied to clipboard!');
  };

  const shareLink = token ? `${window.location.origin}/series/shared/${token}` : '';

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">
          <Share2 className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Share2 className="h-5 w-5" />
            Share Series
          </DialogTitle>
          <DialogDescription>
            Share "{seriesTitle}" with others
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="flex items-center gap-2">
                {publicStatus ? (
                  <Globe className="h-4 w-4 text-primary" />
                ) : (
                  <Lock className="h-4 w-4 text-muted-foreground" />
                )}
                Make series public
              </Label>
              <p className="text-sm text-muted-foreground">
                {publicStatus 
                  ? "Anyone with the link can view and enroll" 
                  : "Only you can access this series"}
              </p>
            </div>
            <Switch
              checked={publicStatus}
              onCheckedChange={handleTogglePublic}
              disabled={saving}
            />
          </div>

          {publicStatus && token && (
            <div className="space-y-2">
              <Label>Share Link</Label>
              <div className="flex gap-2">
                <Input 
                  value={shareLink} 
                  readOnly 
                  className="bg-muted"
                />
                <Button onClick={copyShareLink} size="icon">
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Share this link with others to let them view and follow your series
              </p>
            </div>
          )}

          {saving && (
            <div className="flex items-center justify-center py-2">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
