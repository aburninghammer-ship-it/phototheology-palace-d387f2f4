import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { toast } from "sonner";

export interface ChurchDevotional {
  id: string;
  church_id: string | null;
  user_id: string;
  church_name: string;
  theological_frame: string | null;
  day_of_week: string | null;
  theme_cycle: string | null;
  created_at: string;
  updated_at: string;
}

export interface ChurchDevotionalEntry {
  id: string;
  church_devotional_id: string;
  title: string;
  anchor_scripture: string;
  scripture_text: string | null;
  meditation: string;
  communal_practice: string;
  closing_prayer: string;
  day_theme: string | null;
  entry_date: string;
  is_published: boolean;
  created_at: string;
}

export interface GeneratedDevotional {
  title: string;
  anchorScripture: string;
  scriptureText: string;
  meditation: string;
  communalPractice: string;
  closingPrayer: string;
}

export function useChurchDevotionals() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Fetch all church devotional configs for the user
  const { data: churchDevotionals, isLoading } = useQuery({
    queryKey: ["church-devotionals", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("church_devotionals")
        .select("*")
        .eq("user_id", user!.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as ChurchDevotional[];
    },
    enabled: !!user,
  });

  // Create a new church devotional config
  const createChurchDevotional = useMutation({
    mutationFn: async (params: {
      churchName: string;
      theologicalFrame?: string;
      themeCycle?: string;
    }) => {
      const { data, error } = await supabase
        .from("church_devotionals")
        .insert({
          user_id: user!.id,
          church_name: params.churchName,
          theological_frame: params.theologicalFrame || null,
          theme_cycle: params.themeCycle || "weekly",
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["church-devotionals"] });
      toast.success("Church devotional ministry created!");
    },
    onError: (error) => {
      toast.error("Failed to create church devotional ministry");
      console.error(error);
    },
  });

  // Generate a single devotional entry
  const generateDevotional = useMutation({
    mutationFn: async (params: {
      churchDevotionalId: string;
      churchName: string;
      theologicalFrame?: string;
      dayTheme: string;
      dayOfWeek: string;
      customGuidelines?: string;
    }) => {
      const { data, error } = await supabase.functions.invoke(
        "generate-church-devotional",
        {
          body: {
            churchName: params.churchName,
            theologicalFrame: params.theologicalFrame,
            dayTheme: params.dayTheme,
            dayOfWeek: params.dayOfWeek,
            customGuidelines: params.customGuidelines,
          },
        }
      );

      if (error) throw error;
      if (data.error) throw new Error(data.error);

      const devotional = data.devotional as GeneratedDevotional;

      // Save to database
      const { data: entry, error: insertError } = await supabase
        .from("church_devotional_entries")
        .insert({
          church_devotional_id: params.churchDevotionalId,
          title: devotional.title,
          anchor_scripture: devotional.anchorScripture,
          scripture_text: devotional.scriptureText,
          meditation: devotional.meditation,
          communal_practice: devotional.communalPractice,
          closing_prayer: devotional.closingPrayer,
          day_theme: params.dayTheme,
          entry_date: new Date().toISOString().split("T")[0],
        })
        .select()
        .single();

      if (insertError) throw insertError;
      return { devotional, entry };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["church-devotional-entries"] });
      toast.success("Devotional generated!");
    },
    onError: (error) => {
      toast.error("Failed to generate devotional");
      console.error(error);
    },
  });

  // Delete a church devotional config
  const deleteChurchDevotional = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("church_devotionals")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["church-devotionals"] });
      toast.success("Church devotional ministry deleted");
    },
    onError: (error) => {
      toast.error("Failed to delete church devotional ministry");
      console.error(error);
    },
  });

  return {
    churchDevotionals,
    isLoading,
    createChurchDevotional,
    generateDevotional,
    deleteChurchDevotional,
    isGenerating: generateDevotional.isPending,
  };
}

export function useChurchDevotionalEntries(churchDevotionalId: string | null) {
  const { data: entries, isLoading } = useQuery({
    queryKey: ["church-devotional-entries", churchDevotionalId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("church_devotional_entries")
        .select("*")
        .eq("church_devotional_id", churchDevotionalId!)
        .order("entry_date", { ascending: false });

      if (error) throw error;
      return data as ChurchDevotionalEntry[];
    },
    enabled: !!churchDevotionalId,
  });

  return { entries, isLoading };
}
