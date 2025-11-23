import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "./use-toast";

export interface LearningProfile {
  top_strengths: Array<{
    room_id: string;
    skill: string;
    confidence_score: number;
    evidence?: string;
  }>;
  identified_weaknesses: Array<{
    room_id: string;
    skill: string;
    error_pattern: string;
    frequency: string;
  }>;
  blind_spots: Array<{
    room_id: string;
    principle: string;
    missed_count: number;
    context: string;
  }>;
  learning_style: string;
  optimal_difficulty: string;
  attention_span_minutes: number;
  best_study_times: string[];
  predicted_struggles: Array<{
    verse_ref: string;
    room_id: string;
    reason: string;
    confidence: number;
  }>;
  recommended_focus_areas: string[];
  next_challenge_level: string;
}

export const usePalaceAI = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch learning profile
  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ["learning-profile"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("user_learning_profiles")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      
      if (!data) return null;
      
      // Parse JSONB fields safely
      return {
        top_strengths: (data.top_strengths as any) || [],
        identified_weaknesses: (data.identified_weaknesses as any) || [],
        blind_spots: (data.blind_spots as any) || [],
        learning_style: data.learning_style || 'mixed',
        optimal_difficulty: data.optimal_difficulty || 'medium',
        attention_span_minutes: data.attention_span_minutes || 20,
        best_study_times: data.best_study_times || [],
        predicted_struggles: (data.predicted_struggles as any) || [],
        recommended_focus_areas: data.recommended_focus_areas || [],
        next_challenge_level: data.next_challenge_level || 'medium',
        last_analysis_at: data.last_analysis_at || '',
      } as LearningProfile & { last_analysis_at: string };
    },
  });

  // Analyze user data
  const analyzeProfile = useMutation({
    mutationFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase.functions.invoke("palace-ai-engine", {
        body: { action: "analyze", userId: user.id },
      });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["learning-profile"] });
      toast({
        title: "🧠 Analysis Complete",
        description: "Your learning profile has been updated with AI insights.",
      });
    },
    onError: (error) => {
      toast({
        title: "Analysis Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Fetch personalized drills
  const { data: drills, isLoading: drillsLoading } = useQuery({
    queryKey: ["personalized-drills"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("personalized_drills")
        .select("*")
        .eq("user_id", user.id)
        .eq("is_completed", false)
        .order("priority", { ascending: false })
        .order("scheduled_for", { ascending: true });

      if (error) throw error;
      return data;
    },
  });

  // Generate drills
  const generateDrills = useMutation({
    mutationFn: async ({ roomId, count }: { roomId: string; count?: number }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase.functions.invoke("palace-ai-engine", {
        body: { action: "generate_drills", userId: user.id, roomId, count },
      });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["personalized-drills"] });
      toast({
        title: "✨ Drills Generated",
        description: "Personalized practice drills are ready for you!",
      });
    },
    onError: (error) => {
      toast({
        title: "Generation Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Fetch practice schedules
  const { data: schedules, isLoading: schedulesLoading } = useQuery({
    queryKey: ["practice-schedules"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("practice_schedules")
        .select("*")
        .eq("user_id", user.id)
        .eq("is_active", true)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  // Create schedule
  const createSchedule = useMutation({
    mutationFn: async ({ focusRooms, duration }: { focusRooms: string[]; duration?: string }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase.functions.invoke("palace-ai-engine", {
        body: { action: "create_schedule", userId: user.id, focusRooms, duration },
      });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["practice-schedules"] });
      toast({
        title: "📅 Schedule Created",
        description: "Your personalized practice schedule is ready!",
      });
    },
    onError: (error) => {
      toast({
        title: "Schedule Creation Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return {
    profile,
    profileLoading,
    analyzeProfile: analyzeProfile.mutate,
    isAnalyzing: analyzeProfile.isPending,
    drills,
    drillsLoading,
    generateDrills: generateDrills.mutate,
    isGeneratingDrills: generateDrills.isPending,
    schedules,
    schedulesLoading,
    createSchedule: createSchedule.mutate,
    isCreatingSchedule: createSchedule.isPending,
  };
};