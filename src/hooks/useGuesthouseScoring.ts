import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

interface GuestScore {
  id: string;
  display_name: string;
  score: number;
  rounds_played: number;
  correct_answers: number;
}

interface UseGuesthouseScoringReturn {
  leaderboard: GuestScore[];
  loading: boolean;
  submitResponse: (promptId: string, guestId: string, responseData: any) => Promise<void>;
  gradeResponse: (responseId: string, isCorrect: boolean, points: number) => Promise<void>;
  awardBonusPoints: (guestId: string, points: number, reason: string) => Promise<void>;
  refreshLeaderboard: () => Promise<void>;
}

export function useGuesthouseScoring(eventId: string): UseGuesthouseScoringReturn {
  const [leaderboard, setLeaderboard] = useState<GuestScore[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLeaderboard = useCallback(async () => {
    if (!eventId) return;
    
    try {
      const { data, error } = await supabase
        .from("guesthouse_guests")
        .select("id, display_name, score, rounds_played, correct_answers")
        .eq("event_id", eventId)
        .order("score", { ascending: false });

      if (error) throw error;
      setLeaderboard(data || []);
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
    } finally {
      setLoading(false);
    }
  }, [eventId]);

  useEffect(() => {
    fetchLeaderboard();

    // Subscribe to score updates
    const channel = supabase
      .channel(`scores-${eventId}`)
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'guesthouse_guests', filter: `event_id=eq.${eventId}` },
        () => fetchLeaderboard()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [eventId, fetchLeaderboard]);

  const submitResponse = async (promptId: string, guestId: string, responseData: any) => {
    try {
      const { error } = await supabase
        .from("guesthouse_responses")
        .upsert({
          prompt_id: promptId,
          guest_id: guestId,
          response_data: responseData,
        }, { onConflict: 'prompt_id,guest_id' });

      if (error) throw error;

      // Update rounds played - get current and increment
      const { data: currentGuest } = await supabase
        .from("guesthouse_guests")
        .select("rounds_played")
        .eq("id", guestId)
        .single();

      await supabase
        .from("guesthouse_guests")
        .update({ rounds_played: (currentGuest?.rounds_played || 0) + 1 })
        .eq("id", guestId);

      // Broadcast response submission
      await supabase.channel(`event-${eventId}`).send({
        type: 'broadcast',
        event: 'response_submitted',
        payload: { guestId, promptId }
      });
    } catch (error) {
      console.error("Error submitting response:", error);
      throw error;
    }
  };

  const gradeResponse = async (responseId: string, isCorrect: boolean, points: number) => {
    try {
      // Get response to find guest
      const { data: response, error: fetchError } = await supabase
        .from("guesthouse_responses")
        .select("guest_id")
        .eq("id", responseId)
        .single();

      if (fetchError) throw fetchError;

      // Update response with grade
      const { error: updateError } = await supabase
        .from("guesthouse_responses")
        .update({
          is_correct: isCorrect,
          points_earned: points,
          graded_at: new Date().toISOString()
        })
        .eq("id", responseId);

      if (updateError) throw updateError;

      // Update guest score
      const { data: currentGuest } = await supabase
        .from("guesthouse_guests")
        .select("score, correct_answers")
        .eq("id", response.guest_id)
        .single();

      if (currentGuest) {
        await supabase
          .from("guesthouse_guests")
          .update({
            score: (currentGuest.score || 0) + points,
            correct_answers: (currentGuest.correct_answers || 0) + (isCorrect ? 1 : 0)
          })
          .eq("id", response.guest_id);
      }

      // Broadcast score update
      await supabase.channel(`event-${eventId}`).send({
        type: 'broadcast',
        event: 'score_update',
        payload: { guestId: response.guest_id, points, isCorrect }
      });

      fetchLeaderboard();
    } catch (error) {
      console.error("Error grading response:", error);
      throw error;
    }
  };

  const awardBonusPoints = async (guestId: string, points: number, reason: string) => {
    try {
      const { data: currentGuest } = await supabase
        .from("guesthouse_guests")
        .select("score")
        .eq("id", guestId)
        .single();

      if (currentGuest) {
        await supabase
          .from("guesthouse_guests")
          .update({ score: (currentGuest.score || 0) + points })
          .eq("id", guestId);
      }

      // Broadcast bonus points
      await supabase.channel(`event-${eventId}`).send({
        type: 'broadcast',
        event: 'bonus_points',
        payload: { guestId, points, reason }
      });

      fetchLeaderboard();
    } catch (error) {
      console.error("Error awarding bonus points:", error);
      throw error;
    }
  };

  return {
    leaderboard,
    loading,
    submitResponse,
    gradeResponse,
    awardBonusPoints,
    refreshLeaderboard: fetchLeaderboard
  };
}
