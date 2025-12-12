import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

/**
 * Jeeves Live Palace Conductor Mode
 * 
 * Synthesizes collective responses into unified insights
 * while maintaining theological clarity and reverent tone.
 */

export interface SynthesisRequest {
  promptType: 'verse_fracture' | 'co_exegesis' | 'build_study' | 'drill_drop' | 'reveal_gem';
  responses: Array<{ text: string; angle?: string; guestId?: string }>;
  verse?: string;
  verseReference?: string;
  additionalContext?: string;
}

export interface SynthesisResult {
  synthesizedText: string;
  patterns?: string[];
  keyInsights?: string[];
  dominantTheme?: string;
}

export interface RevealGemResult {
  verses: string[];
  unifiedTheme: string;
  devotionalSynthesis: string;
}

/**
 * Synthesize Verse Fracture observations from multiple angles
 */
export async function synthesizeVerseFracture(
  responses: Array<{ text: string; angle: string }>,
  verse: string,
  verseReference: string
): Promise<SynthesisResult | null> {
  try {
    const { data, error } = await supabase.functions.invoke("jeeves", {
      body: {
        mode: "live_conductor_synthesize",
        promptType: "verse_fracture",
        responses,
        verse,
        verseReference
      }
    });

    if (error) throw error;
    return parseJsonResponse(data);
  } catch (error) {
    console.error("Error synthesizing verse fracture:", error);
    toast.error("Failed to synthesize observations");
    return null;
  }
}

/**
 * Synthesize Silent Co-Exegesis responses into a unified paragraph
 */
export async function synthesizeCoExegesis(
  responses: Array<{ text: string }>,
  verse: string,
  verseReference: string,
  prompt: string
): Promise<SynthesisResult | null> {
  try {
    const { data, error } = await supabase.functions.invoke("jeeves", {
      body: {
        mode: "live_conductor_synthesize",
        promptType: "co_exegesis",
        responses,
        verse,
        verseReference,
        additionalContext: prompt
      }
    });

    if (error) throw error;
    return parseJsonResponse(data);
  } catch (error) {
    console.error("Error synthesizing co-exegesis:", error);
    toast.error("Failed to synthesize responses");
    return null;
  }
}

/**
 * Identify patterns in Build the Study selections
 */
export async function analyzeStudyPatterns(
  selections: Array<{ cards: string[]; count?: number }>,
  verseCards: Array<{ id: string; reference: string }>,
  themeWords: string[]
): Promise<{ patterns: Array<{ cards: string[]; count: number; insight: string }> } | null> {
  try {
    const { data, error } = await supabase.functions.invoke("jeeves", {
      body: {
        mode: "live_conductor_patterns",
        selections,
        verseCards,
        themeWords
      }
    });

    if (error) throw error;
    return parseJsonResponse(data);
  } catch (error) {
    console.error("Error analyzing patterns:", error);
    return null;
  }
}

/**
 * Process Drill Drop rapid responses
 */
export async function processDrillDropResponses(
  responses: Array<{ question: string; answers: string[] }>
): Promise<{ sharpInsight: string; recurringPattern: string } | null> {
  try {
    const { data, error } = await supabase.functions.invoke("jeeves", {
      body: {
        mode: "live_conductor_drill",
        responses
      }
    });

    if (error) throw error;
    return parseJsonResponse(data);
  } catch (error) {
    console.error("Error processing drill responses:", error);
    return null;
  }
}

/**
 * Generate the final "Reveal the Gem" synthesis
 */
export async function generateRevealGem(
  sessionResponses: {
    verseFracture?: Array<{ angle: string; text: string }>;
    coExegesis?: Array<{ text: string }>;
    patterns?: Array<{ cards: string[]; count: number }>;
    drillDrop?: Array<{ question: string; answers: string[] }>;
  },
  primaryVerse: string,
  primaryReference: string
): Promise<RevealGemResult | null> {
  try {
    const { data, error } = await supabase.functions.invoke("jeeves", {
      body: {
        mode: "live_conductor_reveal_gem",
        sessionResponses,
        primaryVerse,
        primaryReference
      }
    });

    if (error) throw error;
    return parseJsonResponse(data);
  } catch (error) {
    console.error("Error generating gem:", error);
    toast.error("Failed to reveal the gem");
    return null;
  }
}

/**
 * Aggregate votes for Call the Room or Palace Pulse
 */
export function aggregateVotes(
  votes: Array<{ choice: string }>
): Record<string, number> {
  const counts: Record<string, number> = {};
  votes.forEach(v => {
    counts[v.choice] = (counts[v.choice] || 0) + 1;
  });
  return counts;
}

/**
 * Calculate vote percentages
 */
export function calculateVotePercentages(
  counts: Record<string, number>
): Record<string, number> {
  const total = Object.values(counts).reduce((a, b) => a + b, 0);
  if (total === 0) return {};
  
  const percentages: Record<string, number> = {};
  Object.entries(counts).forEach(([key, count]) => {
    percentages[key] = Math.round((count / total) * 100);
  });
  return percentages;
}

/**
 * Get the winning choice from votes
 */
export function getWinningChoice(counts: Record<string, number>): string | null {
  let maxCount = 0;
  let winner: string | null = null;
  
  Object.entries(counts).forEach(([choice, count]) => {
    if (count > maxCount) {
      maxCount = count;
      winner = choice;
    }
  });
  
  return winner;
}

// Helper to parse JSON responses from Jeeves
function parseJsonResponse(data: unknown): any {
  if (!data) return null;
  
  const content = (data as any)?.content || data;
  
  if (typeof content === "string") {
    // Clean control characters
    const cleaned = content.replace(/[\x00-\x1F\x7F-\x9F]/g, '');
    const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try {
        return JSON.parse(jsonMatch[0]);
      } catch {
        return null;
      }
    }
  }
  
  return content;
}
