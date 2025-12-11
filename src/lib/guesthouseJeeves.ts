import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface GamePrompt {
  promptText: string;
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
