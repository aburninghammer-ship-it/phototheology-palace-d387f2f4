import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Settings, Youtube, Save, Loader2 } from "lucide-react";

interface ChurchSettingsProps {
  churchId: string;
}

export function ChurchSettings({ churchId }: ChurchSettingsProps) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    youtube_channel_url: "",
    youtube_channel_name: "",
  });

  useEffect(() => {
    loadSettings();
  }, [churchId]);

  const loadSettings = async () => {
    try {
      const { data, error } = await supabase
        .from("churches")
        .select("youtube_channel_url, youtube_channel_name")
        .eq("id", churchId)
        .single();

      if (error) throw error;

      setSettings({
        youtube_channel_url: data?.youtube_channel_url || "",
        youtube_channel_name: data?.youtube_channel_name || "",
      });
    } catch (error) {
      console.error("Error loading settings:", error);
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async () => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from("churches")
        .update({
          youtube_channel_url: settings.youtube_channel_url,
          youtube_channel_name: settings.youtube_channel_name,
        })
        .eq("id", churchId);

      if (error) throw error;

      toast.success("Settings saved successfully!");
    } catch (error) {
      console.error("Error saving settings:", error);
      toast.error("Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Youtube className="h-5 w-5 text-red-500" />
            YouTube Settings
          </CardTitle>
          <CardDescription>
            Configure your church's YouTube channel for the Sermon Hub
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="youtube_channel_name">Channel Name</Label>
            <Input
              id="youtube_channel_name"
              placeholder="e.g., Living Manna"
              value={settings.youtube_channel_name}
              onChange={(e) =>
                setSettings({ ...settings, youtube_channel_name: e.target.value })
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="youtube_channel_url">YouTube Channel URL</Label>
            <Input
              id="youtube_channel_url"
              placeholder="e.g., https://www.youtube.com/@mylivingmanna"
              value={settings.youtube_channel_url}
              onChange={(e) =>
                setSettings({ ...settings, youtube_channel_url: e.target.value })
              }
            />
            <p className="text-xs text-muted-foreground">
              Enter the full URL to your YouTube channel (e.g., https://www.youtube.com/@YourChannel)
            </p>
          </div>

          <Button onClick={saveSettings} disabled={saving} className="w-full sm:w-auto">
            {saving ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            Save YouTube Settings
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
