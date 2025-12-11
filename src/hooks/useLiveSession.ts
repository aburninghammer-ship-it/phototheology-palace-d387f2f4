import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

type PromptType = 'call_room' | 'verse_fracture' | 'build_study' | 'pulse' | 'co_exegesis' | 'drill_drop' | 'reveal_gem';

interface SessionPrompt {
  id: string;
  type: PromptType;
  data: any;
  sequenceOrder: number;
  isActive: boolean;
  startedAt?: string;
  endedAt?: string;
}

interface LiveSessionState {
  eventId: string;
  isLive: boolean;
  isPaused: boolean;
  currentPrompt: SessionPrompt | null;
  prompts: SessionPrompt[];
  guestCount: number;
  responsesCount: number;
}

export function useLiveSession(eventId: string, isHost: boolean) {
  const [state, setState] = useState<LiveSessionState>({
    eventId,
    isLive: false,
    isPaused: false,
    currentPrompt: null,
    prompts: [],
    guestCount: 0,
    responsesCount: 0
  });
  const { toast } = useToast();

  // Load session data
  useEffect(() => {
    loadSessionData();
    
    const channel = supabase
      .channel(`live-session-control-${eventId}`)
      .on('broadcast', { event: 'session_update' }, (payload) => {
        setState(prev => ({ ...prev, ...payload.payload }));
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [eventId]);

  const loadSessionData = async () => {
    try {
      // Load prompts
      const { data: prompts, error } = await supabase
        .from('guesthouse_session_prompts')
        .select('*')
        .eq('event_id', eventId)
        .order('sequence_order');

      if (error) throw error;

      const mappedPrompts: SessionPrompt[] = (prompts || []).map(p => ({
        id: p.id,
        type: p.prompt_type as PromptType,
        data: p.prompt_data,
        sequenceOrder: p.sequence_order,
        isActive: p.is_active,
        startedAt: p.started_at || undefined,
        endedAt: p.ended_at || undefined
      }));

      const activePrompt = mappedPrompts.find(p => p.isActive) || null;

      setState(prev => ({
        ...prev,
        prompts: mappedPrompts,
        currentPrompt: activePrompt,
        isLive: !!activePrompt
      }));
    } catch (error) {
      console.error('Error loading session data:', error);
    }
  };

  // Host-only functions
  const startSession = useCallback(async () => {
    if (!isHost) return;

    try {
      const firstPrompt = state.prompts[0];
      if (!firstPrompt) {
        toast({ title: "No prompts configured", variant: "destructive" });
        return;
      }

      await supabase
        .from('guesthouse_session_prompts')
        .update({ is_active: true, started_at: new Date().toISOString() })
        .eq('id', firstPrompt.id);

      await supabase
        .from('guesthouse_events')
        .update({ status: 'live' })
        .eq('id', eventId);

      // Broadcast update
      await supabase.channel(`live-session-control-${eventId}`).send({
        type: 'broadcast',
        event: 'session_update',
        payload: { isLive: true, currentPrompt: firstPrompt }
      });

      setState(prev => ({ ...prev, isLive: true, currentPrompt: firstPrompt }));
    } catch (error) {
      console.error('Error starting session:', error);
      toast({ title: "Failed to start session", variant: "destructive" });
    }
  }, [isHost, state.prompts, eventId, toast]);

  const advanceToNextPrompt = useCallback(async () => {
    if (!isHost || !state.currentPrompt) return;

    try {
      const currentIndex = state.prompts.findIndex(p => p.id === state.currentPrompt?.id);
      const nextPrompt = state.prompts[currentIndex + 1];

      // End current prompt
      await supabase
        .from('guesthouse_session_prompts')
        .update({ is_active: false, ended_at: new Date().toISOString() })
        .eq('id', state.currentPrompt.id);

      if (nextPrompt) {
        // Start next prompt
        await supabase
          .from('guesthouse_session_prompts')
          .update({ is_active: true, started_at: new Date().toISOString() })
          .eq('id', nextPrompt.id);

        // Broadcast update
        await supabase.channel(`live-session-control-${eventId}`).send({
          type: 'broadcast',
          event: 'session_update',
          payload: { currentPrompt: nextPrompt }
        });

        // Also broadcast to guest channel
        await supabase.channel(`live-session-${eventId}`).send({
          type: 'broadcast',
          event: 'prompt_update',
          payload: { ...nextPrompt, timeRemaining: 60 }
        });

        setState(prev => ({ ...prev, currentPrompt: nextPrompt }));
      } else {
        // Session complete
        await supabase
          .from('guesthouse_events')
          .update({ status: 'completed' })
          .eq('id', eventId);

        setState(prev => ({ ...prev, isLive: false, currentPrompt: null }));
      }
    } catch (error) {
      console.error('Error advancing prompt:', error);
      toast({ title: "Failed to advance", variant: "destructive" });
    }
  }, [isHost, state.currentPrompt, state.prompts, eventId, toast]);

  const pauseSession = useCallback(async () => {
    if (!isHost) return;
    setState(prev => ({ ...prev, isPaused: true }));
    
    await supabase.channel(`live-session-control-${eventId}`).send({
      type: 'broadcast',
      event: 'session_update',
      payload: { isPaused: true }
    });
  }, [isHost, eventId]);

  const resumeSession = useCallback(async () => {
    if (!isHost) return;
    setState(prev => ({ ...prev, isPaused: false }));
    
    await supabase.channel(`live-session-control-${eventId}`).send({
      type: 'broadcast',
      event: 'session_update',
      payload: { isPaused: false }
    });
  }, [isHost, eventId]);

  return {
    ...state,
    startSession,
    advanceToNextPrompt,
    pauseSession,
    resumeSession,
    refresh: loadSessionData
  };
}
