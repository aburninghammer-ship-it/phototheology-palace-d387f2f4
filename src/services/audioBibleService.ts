/**
 * Audio Bible Service
 * Handles TTS generation and commentary fetching
 */

import { supabase } from "@/integrations/supabase/client";

export type CommentaryTier = "surface" | "intermediate" | "scholarly";

export type OpenAIVoice = "alloy" | "ash" | "coral" | "echo" | "fable" | "nova" | "onyx" | "sage" | "shimmer";

export const OPENAI_VOICES: { id: OpenAIVoice; name: string; description: string }[] = [
  { id: "onyx", name: "Onyx", description: "Deep, authoritative" },
  { id: "nova", name: "Nova", description: "Warm, friendly" },
  { id: "alloy", name: "Alloy", description: "Balanced, neutral" },
  { id: "echo", name: "Echo", description: "Clear, precise" },
  { id: "fable", name: "Fable", description: "Expressive, narrative" },
  { id: "shimmer", name: "Shimmer", description: "Bright, optimistic" },
  { id: "coral", name: "Coral", description: "Conversational" },
  { id: "sage", name: "Sage", description: "Wise, measured" },
  { id: "ash", name: "Ash", description: "Calm, steady" },
];

interface GenerateAudioOptions {
  text: string;
  voice?: OpenAIVoice;
  cacheKey?: string;
}

interface CommentaryOptions {
  book: string;
  chapter: number;
  verse: number;
  verseText: string;
  tier?: CommentaryTier;
  generateAudio?: boolean;
  voice?: OpenAIVoice;
}

interface CommentaryResult {
  commentary: string;
  audioUrl: string | null;
  cached: boolean;
}

/**
 * Generate TTS audio from text using OpenAI
 */
export async function generateTTSAudio(options: GenerateAudioOptions): Promise<string | null> {
  const { text, voice = "onyx" } = options;

  try {
    const { data, error } = await supabase.functions.invoke("text-to-speech", {
      body: { text, voice, returnUrl: true },
    });

    if (error) {
      console.error("[TTS] Error:", error);
      return null;
    }

    return data?.audioUrl || data?.url || null;
  } catch (error) {
    console.error("[TTS] Error:", error);
    return null;
  }
}

/**
 * Generate commentary for a verse with optional TTS
 */
export async function generateCommentary(options: CommentaryOptions): Promise<CommentaryResult | null> {
  const { book, chapter, verse, verseText, tier = "surface", generateAudio = false, voice = "onyx" } = options;

  try {
    const { data, error } = await supabase.functions.invoke("generate-audio-commentary", {
      body: { book, chapter, verse, verseText, tier, generateAudio, voice },
    });

    if (error) {
      console.error("[Commentary] Error:", error);
      return null;
    }

    return {
      commentary: data?.commentary || "",
      audioUrl: data?.audioUrl || null,
      cached: data?.cached || false,
    };
  } catch (error) {
    console.error("[Commentary] Error:", error);
    return null;
  }
}

/**
 * Get cached commentary from database
 */
export async function getCachedCommentary(
  book: string,
  chapter: number,
  verse: number,
  tier: CommentaryTier = "surface"
): Promise<CommentaryResult | null> {
  try {
    const { data, error } = await supabase
      .from("bible_commentaries")
      .select("commentary_text, audio_url")
      .eq("book", book)
      .eq("chapter", chapter)
      .eq("verse", verse)
      .eq("tier", tier)
      .maybeSingle();

    if (error || !data) return null;

    return {
      commentary: data.commentary_text,
      audioUrl: data.audio_url,
      cached: true,
    };
  } catch {
    return null;
  }
}

/**
 * Get available themes
 */
export async function getThemes() {
  const { data, error } = await supabase
    .from("commentary_themes")
    .select("*")
    .order("name");

  if (error) {
    console.error("[Themes] Error:", error);
    return [];
  }

  return data || [];
}

/**
 * Get verses for a theme
 */
export async function getThemeVerses(themeId: string) {
  const { data, error } = await supabase
    .from("theme_verses")
    .select("*")
    .eq("theme_id", themeId)
    .order("relevance_score", { ascending: false });

  if (error) {
    console.error("[ThemeVerses] Error:", error);
    return [];
  }

  return data || [];
}

// Pre-defined reading series
export const READING_SERIES = [
  {
    id: "prophecy",
    name: "Prophecy Pack",
    description: "Daniel & Revelation prophetic sequence",
    items: [
      { book: "Daniel", chapter: 7 },
      { book: "Revelation", chapter: 13 },
      { book: "Daniel", chapter: 8 },
      { book: "Daniel", chapter: 9 },
      { book: "Revelation", chapter: 14 },
    ],
  },
  {
    id: "sanctuary",
    name: "Sanctuary Journey",
    description: "Walk through the sanctuary system",
    items: [
      { book: "Exodus", chapter: 25 },
      { book: "Exodus", chapter: 26 },
      { book: "Leviticus", chapter: 16 },
      { book: "Hebrews", chapter: 8 },
      { book: "Hebrews", chapter: 9 },
    ],
  },
  {
    id: "gospels",
    name: "Gospel Harmony",
    description: "Christ's story across the Gospels",
    items: [
      { book: "Luke", chapter: 2 },
      { book: "John", chapter: 1 },
      { book: "Matthew", chapter: 5 },
      { book: "Mark", chapter: 15 },
      { book: "John", chapter: 20 },
    ],
  },
  {
    id: "creation",
    name: "Creation to Fall",
    description: "The beginning of everything",
    items: [
      { book: "Genesis", chapter: 1 },
      { book: "Genesis", chapter: 2 },
      { book: "Genesis", chapter: 3 },
    ],
  },
  {
    id: "psalms",
    name: "Psalms of Praise",
    description: "Songs of worship and devotion",
    items: [
      { book: "Psalms", chapter: 23 },
      { book: "Psalms", chapter: 91 },
      { book: "Psalms", chapter: 119 },
      { book: "Psalms", chapter: 139 },
      { book: "Psalms", chapter: 150 },
    ],
  },
];
