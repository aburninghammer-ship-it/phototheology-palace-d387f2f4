import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface GamePrompt {
  promptText: string;
  challenge?: string;
  verse?: string;
  instructions?: string;
  options?: string[];
  correctAnswer: string;
  explanation: string;
  timeLimit: number;
  points: number;
  hints?: string[];
}

interface GradeResult {
  score: number;
  isCorrect: boolean;
  feedback: string;
  partialCredit: boolean;
  bonusPoints: number;
}

interface GroupInsight {
  groupGem: string;
  topResponses: string[];
  commonThemes: string[];
  christConnection: string;
  followUpStudy: string;
}

interface VerseHuntData {
  targetVerse: {
    book: string;
    chapter: number;
    verse: number;
    text: string;
  };
  clueTrail: Array<{
    clue: string;
    hintBook?: string;
    hintChapter?: string;
    ptPrinciple?: string;
    revealed: boolean;
  }>;
  difficulty: string;
}

interface SymbolMatchData {
  symbols: Array<{
    id: string;
    symbol: string;
    meaning: string;
    verse: string;
  }>;
  timeLimit: number;
}

interface ChainChessData {
  startingVerse: string;
  chain: Array<{
    verse: string;
    keyword: string;
    hint?: string;
  }>;
  timeLimit: number;
}

interface ProphecyTimelineData {
  events: Array<{
    id: string;
    title: string;
    description: string;
    verse: string;
    year?: string;
    order: number;
  }>;
  timeLimit: number;
}

export async function generateGamePrompt(
  gameType: string,
  verse?: string,
  difficulty: "easy" | "medium" | "hard" = "medium"
): Promise<GamePrompt | null> {
  try {
    const { data, error } = await supabase.functions.invoke("jeeves", {
      body: {
        mode: "guesthouse_generate_prompt",
        gameType,
        verse,
        difficulty
      }
    });

    if (error) throw error;

    // Parse JSON response
    const content = data?.content || data;
    if (typeof content === "string") {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]) as GamePrompt;
      }
    }
    return content as GamePrompt;
  } catch (error) {
    console.error("Error generating game prompt:", error);
    toast.error("Failed to generate game prompt");
    return null;
  }
}

export async function gradePlayerResponse(
  gameType: string,
  playerResponse: string,
  correctAnswer: string,
  promptData: Record<string, unknown>
): Promise<GradeResult | null> {
  try {
    const { data, error } = await supabase.functions.invoke("jeeves", {
      body: {
        mode: "guesthouse_grade_response",
        gameType,
        playerResponse,
        correctAnswer,
        promptData
      }
    });

    if (error) throw error;

    const content = data?.content || data;
    if (typeof content === "string") {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]) as GradeResult;
      }
    }
    return content as GradeResult;
  } catch (error) {
    console.error("Error grading response:", error);
    return {
      score: 0,
      isCorrect: false,
      feedback: "Unable to grade response. Please try again.",
      partialCredit: false,
      bonusPoints: 0
    };
  }
}

export async function generateGroupInsight(
  responses: Array<{ response: string; score: number }>,
  promptData: Record<string, unknown>,
  gameType: string
): Promise<GroupInsight | null> {
  try {
    const { data, error } = await supabase.functions.invoke("jeeves", {
      body: {
        mode: "guesthouse_group_insight",
        responses,
        promptData,
        gameType
      }
    });

    if (error) throw error;

    const content = data?.content || data;
    if (typeof content === "string") {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]) as GroupInsight;
      }
    }
    return content as GroupInsight;
  } catch (error) {
    console.error("Error generating group insight:", error);
    return null;
  }
}

export async function generateVerseHunt(
  difficulty: "easy" | "medium" | "hard" = "medium",
  category?: string
): Promise<VerseHuntData | null> {
  try {
    const { data, error } = await supabase.functions.invoke("jeeves", {
      body: {
        mode: "verse_hunt_generate",
        difficulty,
        category
      }
    });

    if (error) throw error;

    const content = data?.content || data;
    if (typeof content === "string") {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]) as VerseHuntData;
        if (parsed.clueTrail?.length > 0) {
          parsed.clueTrail[0].revealed = true;
        }
        return parsed;
      }
    }
    
    if (content?.targetVerse && content?.clueTrail) {
      content.clueTrail[0].revealed = true;
      return content as VerseHuntData;
    }

    throw new Error("Invalid response format");
  } catch (error) {
    console.error("Error generating verse hunt:", error);
    toast.error("Failed to generate Verse Hunt game");
    return null;
  }
}

export async function generateSymbolMatch(
  difficulty: "easy" | "medium" | "hard" = "medium"
): Promise<SymbolMatchData | null> {
  try {
    const { data, error } = await supabase.functions.invoke("jeeves", {
      body: {
        mode: "guesthouse_symbol_match",
        difficulty
      }
    });

    if (error) throw error;

    const content = data?.content || data;
    if (typeof content === "string") {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]) as SymbolMatchData;
      }
    }
    return content as SymbolMatchData;
  } catch (error) {
    console.error("Error generating symbol match:", error);
    // Return fallback data
    return {
      symbols: [
        { id: "1", symbol: "🐑", meaning: "Christ as the Lamb of God", verse: "John 1:29" },
        { id: "2", symbol: "🪨", meaning: "Christ the Rock of our salvation", verse: "1 Cor 10:4" },
        { id: "3", symbol: "💧", meaning: "Living Water / Holy Spirit", verse: "John 7:38" },
        { id: "4", symbol: "🔥", meaning: "God's presence and purification", verse: "Exodus 3:2" },
        { id: "5", symbol: "🌿", meaning: "Olive branch - Peace and Spirit", verse: "Romans 11:17" },
      ],
      timeLimit: 120
    };
  }
}

export async function generateChainChess(
  startingVerse: string,
  difficulty: "easy" | "medium" | "hard" = "medium"
): Promise<ChainChessData | null> {
  try {
    const { data, error } = await supabase.functions.invoke("jeeves", {
      body: {
        mode: "guesthouse_chain_chess",
        startingVerse,
        difficulty
      }
    });

    if (error) throw error;

    const content = data?.content || data;
    if (typeof content === "string") {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]) as ChainChessData;
      }
    }
    return content as ChainChessData;
  } catch (error) {
    console.error("Error generating chain chess:", error);
    // Return fallback data
    return {
      startingVerse: startingVerse || "John 3:16",
      chain: [
        { verse: "Romans 5:8", keyword: "love", hint: "Paul also writes about God's love..." },
        { verse: "1 John 4:8", keyword: "God is love", hint: "The apostle John defines God..." },
        { verse: "1 Corinthians 13:4", keyword: "love is patient", hint: "Paul describes love's characteristics..." },
      ],
      timeLimit: 180
    };
  }
}

export async function generateProphecyTimeline(
  difficulty: "easy" | "medium" | "hard" = "medium"
): Promise<ProphecyTimelineData | null> {
  try {
    const { data, error } = await supabase.functions.invoke("jeeves", {
      body: {
        mode: "guesthouse_prophecy_timeline",
        difficulty
      }
    });

    if (error) throw error;

    const content = data?.content || data;
    if (typeof content === "string") {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]) as ProphecyTimelineData;
      }
    }
    return content as ProphecyTimelineData;
  } catch (error) {
    console.error("Error generating prophecy timeline:", error);
    toast.error("Failed to generate prophecy timeline");
    return null;
  }
}

interface EventSuggestion {
  title: string;
  description: string;
  gameTypes: string[];
  targetAudience: string;
  estimatedDuration: number;
  suggestedTime: string;
  theme: string;
}

export async function suggestEventFromPrompt(
  prompt: string
): Promise<EventSuggestion | null> {
  try {
    const { data, error } = await supabase.functions.invoke("jeeves", {
      body: {
        mode: "guesthouse_suggest_event",
        prompt
      }
    });

    if (error) throw error;

    const content = data?.content || data;
    if (typeof content === "string") {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]) as EventSuggestion;
      }
    }
    return content as EventSuggestion;
  } catch (error) {
    console.error("Error suggesting event:", error);
    toast.error("Failed to generate event suggestion");
    return null;
  }
}
