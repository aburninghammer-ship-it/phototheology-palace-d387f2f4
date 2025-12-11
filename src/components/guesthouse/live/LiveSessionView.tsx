import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { CallTheRoom } from "./CallTheRoom";
import { VerseFracture } from "./VerseFracture";
import { BuildTheStudy } from "./BuildTheStudy";
import { PalacePulse } from "./PalacePulse";
import { SilentCoExegesis } from "./SilentCoExegesis";
import { DrillDrop } from "./DrillDrop";
import { RevealTheGem } from "./RevealTheGem";
import { LiveSessionController } from "./LiveSessionController";
import { GuestReactions } from "../GuestReactions";
import { PresenceIndicators } from "../PresenceIndicators";
import { Loader2 } from "lucide-react";

interface LiveSessionViewProps {
  eventId: string;
  guestId: string;
  isHost: boolean;
}

type PromptType = 'call_room' | 'verse_fracture' | 'build_study' | 'pulse' | 'co_exegesis' | 'drill_drop' | 'reveal_gem';

interface ActivePrompt {
  id: string;
  type: PromptType;
  data: any;
  timeRemaining: number;
}

export function LiveSessionView({ eventId, guestId, isHost }: LiveSessionViewProps) {
  const [activePrompt, setActivePrompt] = useState<ActivePrompt | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [votes, setVotes] = useState<Record<string, number>>({});
  const [totalVotes, setTotalVotes] = useState(0);
  const [guestCount, setGuestCount] = useState(0);
  const [responsesCount, setResponsesCount] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [currentPhase, setCurrentPhase] = useState(1);
  const [totalPhases, setTotalPhases] = useState(7);
  const [drillSubmissions, setDrillSubmissions] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);

  // Subscribe to prompt changes
  useEffect(() => {
    const channel = supabase
      .channel(`live-session-${eventId}`)
      .on('broadcast', { event: 'prompt_update' }, (payload) => {
        setActivePrompt(payload.payload as ActivePrompt);
        setHasSubmitted(false);
        setDrillSubmissions([]);
      })
      .on('broadcast', { event: 'vote_update' }, (payload) => {
        setVotes(payload.payload.votes);
        setTotalVotes(payload.payload.total);
      })
      .on('broadcast', { event: 'responses_count' }, (payload) => {
        setResponsesCount(payload.payload.count);
      })
      .subscribe();

    // Initial load
    loadActivePrompt();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [eventId]);

  const loadActivePrompt = async () => {
    try {
      const { data, error } = await supabase
        .from('guesthouse_session_prompts')
        .select('*')
        .eq('event_id', eventId)
        .eq('is_active', true)
        .single();

      if (data) {
        setActivePrompt({
          id: data.id,
          type: data.prompt_type as PromptType,
          data: data.prompt_data,
          timeRemaining: 60
        });
      }
    } catch (error) {
      console.error('Error loading prompt:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitResponse = async (responseData: any) => {
    try {
      await supabase.from('guesthouse_prompt_responses').insert({
        prompt_id: activePrompt?.id,
        guest_id: guestId,
        response_type: activePrompt?.type === 'call_room' || activePrompt?.type === 'pulse' ? 'vote' : 'text',
        response_data: responseData
      });
      setHasSubmitted(true);
    } catch (error) {
      console.error('Error submitting response:', error);
    }
  };

  const handleVote = (choice: string) => {
    handleSubmitResponse({ choice });
  };

  const handleDrillSubmit = (promptIndex: number, response: string) => {
    handleSubmitResponse({ promptIndex, response });
    setDrillSubmissions(prev => [...prev, promptIndex]);
  };

  // Host controls
  const handleNextPhase = () => {
    // Broadcast next phase
    supabase.channel(`live-session-${eventId}`).send({
      type: 'broadcast',
      event: 'next_phase',
      payload: {}
    });
    setCurrentPhase(prev => Math.min(prev + 1, totalPhases));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen">
      {/* Host controller */}
      {isHost && activePrompt && (
        <LiveSessionController
          eventId={eventId}
          currentPhase={currentPhase}
          totalPhases={totalPhases}
          phaseType={activePrompt.type}
          timeRemaining={activePrompt.timeRemaining}
          guestCount={guestCount}
          responsesCount={responsesCount}
          isPaused={isPaused}
          onNextPhase={handleNextPhase}
          onPause={() => setIsPaused(true)}
          onResume={() => setIsPaused(false)}
          onViewResponses={() => {}}
        />
      )}

      {/* Presence */}
      <div className="max-w-4xl mx-auto px-4 pt-20">
        <PresenceIndicators eventId={eventId} guestCount={guestCount} />
      </div>

      {/* Active prompt content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          {activePrompt && (
            <motion.div
              key={activePrompt.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {activePrompt.type === 'call_room' && (
                <CallTheRoom
                  onVote={handleVote}
                  votes={votes}
                  hasVoted={hasSubmitted}
                  totalVotes={totalVotes}
                  isHost={isHost}
                />
              )}
              
              {activePrompt.type === 'verse_fracture' && (
                <VerseFracture
                  verse={activePrompt.data.verse}
                  verseReference={activePrompt.data.reference}
                  assignedAngle={activePrompt.data.assignedAngle || 'repeated'}
                  timeRemaining={activePrompt.timeRemaining}
                  onSubmit={(obs) => handleSubmitResponse({ observation: obs })}
                  hasSubmitted={hasSubmitted}
                  isHost={isHost}
                />
              )}
              
              {activePrompt.type === 'build_study' && (
                <BuildTheStudy
                  verseCards={activePrompt.data.verseCards || []}
                  themeWords={activePrompt.data.themeWords || []}
                  onSubmit={(selections) => handleSubmitResponse({ selections })}
                  hasSubmitted={hasSubmitted}
                  isHost={isHost}
                />
              )}
              
              {activePrompt.type === 'pulse' && (
                <PalacePulse
                  question={activePrompt.data.question || "This verse primarily points toward..."}
                  timeRemaining={activePrompt.timeRemaining}
                  onVote={handleVote}
                  hasVoted={hasSubmitted}
                  results={votes}
                  totalVotes={totalVotes}
                  isHost={isHost}
                />
              )}
              
              {activePrompt.type === 'co_exegesis' && (
                <SilentCoExegesis
                  prompt={activePrompt.data.prompt || "This verse reveals God as..."}
                  verse={activePrompt.data.verse}
                  verseReference={activePrompt.data.reference}
                  timeRemaining={activePrompt.timeRemaining}
                  onSubmit={(response) => handleSubmitResponse({ response })}
                  hasSubmitted={hasSubmitted}
                  isHost={isHost}
                  synthesizedParagraph={activePrompt.data.synthesized}
                />
              )}
              
              {activePrompt.type === 'drill_drop' && (
                <DrillDrop
                  currentPromptIndex={activePrompt.data.currentIndex || 0}
                  timeRemaining={activePrompt.timeRemaining}
                  onSubmit={handleDrillSubmit}
                  submittedPrompts={drillSubmissions}
                  isHost={isHost}
                />
              )}
              
              {activePrompt.type === 'reveal_gem' && (
                <RevealTheGem
                  verses={activePrompt.data.verses || []}
                  unifiedTheme={activePrompt.data.theme || "Christ in All Scripture"}
                  devotionalSynthesis={activePrompt.data.synthesis || ""}
                />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Reactions */}
      <GuestReactions eventId={eventId} guestId={guestId} />
    </div>
  );
}
