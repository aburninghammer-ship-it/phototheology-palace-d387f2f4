import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface PresetItem {
  book: string;
  chapter: number;
}

export interface UserPreset {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  room_tags: string[];
  items: PresetItem[];
  is_public: boolean;
  created_at: string;
  updated_at: string;
}

export const useUserPresets = () => {
  const [presets, setPresets] = useState<UserPreset[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const fetchPresets = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("user_reading_presets")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      
      // Parse items from JSONB
      const parsed = (data || []).map(p => ({
        ...p,
        items: (p.items as unknown as PresetItem[]) || [],
        room_tags: p.room_tags || []
      }));
      
      setPresets(parsed);
    } catch (error) {
      console.error("Error fetching presets:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPresets();
  }, [fetchPresets]);

  const savePreset = async (preset: Omit<UserPreset, "id" | "user_id" | "created_at" | "updated_at">) => {
    setIsSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("user_reading_presets")
        .insert([{
          user_id: user.id,
          name: preset.name,
          description: preset.description,
          room_tags: preset.room_tags,
          items: JSON.parse(JSON.stringify(preset.items)),
          is_public: preset.is_public
        }])
        .select()
        .single();

      if (error) throw error;

      const newPreset: UserPreset = {
        ...data,
        items: (data.items as unknown as PresetItem[]) || [],
        room_tags: data.room_tags || []
      };

      setPresets(prev => [newPreset, ...prev]);
      toast.success("Preset saved!");
      return newPreset;
    } catch (error) {
      console.error("Error saving preset:", error);
      toast.error("Failed to save preset");
      return null;
    } finally {
      setIsSaving(false);
    }
  };

  const deletePreset = async (id: string) => {
    try {
      const { error } = await supabase
        .from("user_reading_presets")
        .delete()
        .eq("id", id);

      if (error) throw error;

      setPresets(prev => prev.filter(p => p.id !== id));
      toast.success("Preset deleted");
    } catch (error) {
      console.error("Error deleting preset:", error);
      toast.error("Failed to delete preset");
    }
  };

  return {
    presets,
    isLoading,
    isSaving,
    savePreset,
    deletePreset,
    fetchPresets
  };
};
