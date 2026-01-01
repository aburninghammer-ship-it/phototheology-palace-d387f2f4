/**
 * TTS Service - OpenAI-only Text-to-Speech API wrapper
 */

import { supabase } from '@/integrations/supabase/client';

// OpenAI TTS voices
export type OpenAIVoice = 'alloy' | 'ash' | 'coral' | 'echo' | 'fable' | 'nova' | 'onyx' | 'sage' | 'shimmer';

// Simple array of voice IDs
export const OPENAI_VOICE_IDS: OpenAIVoice[] = ['alloy', 'ash', 'coral', 'echo', 'fable', 'nova', 'onyx', 'sage', 'shimmer'];

// Detailed voice info for UI (backward compatible with old useTextToSpeech)
export const OPENAI_VOICES = [
  { id: 'alloy' as OpenAIVoice, name: 'Alloy', description: 'Neutral and balanced voice' },
  { id: 'ash' as OpenAIVoice, name: 'Ash', description: 'Warm and conversational' },
  { id: 'coral' as OpenAIVoice, name: 'Coral', description: 'Clear and professional' },
  { id: 'echo' as OpenAIVoice, name: 'Echo', description: 'Clear and articulate male voice' },
  { id: 'fable' as OpenAIVoice, name: 'Fable', description: 'Warm British male voice' },
  { id: 'nova' as OpenAIVoice, name: 'Nova', description: 'Friendly and energetic female voice' },
  { id: 'onyx' as OpenAIVoice, name: 'Onyx', description: 'Deep and authoritative male voice' },
  { id: 'sage' as OpenAIVoice, name: 'Sage', description: 'Wise and thoughtful' },
  { id: 'shimmer' as OpenAIVoice, name: 'Shimmer', description: 'Soft and gentle female voice' },
] as const;

export const DEFAULT_VOICE: OpenAIVoice = 'onyx';

export interface TTSRequest {
  text: string;
  voice?: OpenAIVoice;
  speed?: number;
  // For caching
  book?: string;
  chapter?: number;
  verse?: number;
}

export interface TTSResponse {
  audioUrl: string;
  cached: boolean;
  audioContent?: string; // base64 fallback for immediate playback
}

/**
 * Generate TTS audio using OpenAI
 */
export async function generateTTS(request: TTSRequest): Promise<TTSResponse> {
  const { text, voice = DEFAULT_VOICE, speed = 1.0, book, chapter, verse } = request;

  if (!text?.trim()) {
    throw new Error('Text is required for TTS');
  }

  console.log(`[TTS] Generating: voice=${voice}, text length=${text.length}`);

  const { data, error } = await supabase.functions.invoke('text-to-speech', {
    body: {
      text: text.trim(),
      voice,
      speed,
      book,
      chapter,
      verse,
      useCache: !!(book && chapter !== undefined && verse !== undefined),
      provider: 'openai',
      returnType: 'url',
    },
  });

  if (error) {
    console.error('[TTS] Edge function error:', error);
    throw new Error(error.message || 'TTS generation failed');
  }

  if (data?.error) {
    throw new Error(data.error);
  }

  // Prefer audioUrl, fallback to base64
  const audioUrl = data?.audioUrl;
  const audioContent = data?.audioContent;

  if (audioUrl) {
    console.log(`[TTS] Got URL response, cached=${data?.cached}`);
    return {
      audioUrl,
      cached: data?.cached || false,
      audioContent,
    };
  }

  // Convert base64 to data URL if no audioUrl
  if (audioContent) {
    console.log('[TTS] Got base64 response, converting to data URL');
    return {
      audioUrl: `data:audio/mpeg;base64,${audioContent}`,
      cached: false,
    };
  }

  throw new Error('No audio data received from TTS service');
}

/**
 * Generate commentary TTS (no caching by verse)
 */
export async function generateCommentaryTTS(
  text: string,
  voice: OpenAIVoice = DEFAULT_VOICE,
  speed: number = 1.0
): Promise<TTSResponse> {
  return generateTTS({ text, voice, speed });
}

/**
 * Prefetch a verse for future playback
 * Returns immediately, caches in background
 */
export async function prefetchVerse(
  book: string,
  chapter: number,
  verse: number,
  text: string,
  voice: OpenAIVoice = DEFAULT_VOICE
): Promise<void> {
  try {
    await generateTTS({ text, voice, book, chapter, verse });
    console.log(`[TTS] Prefetched ${book} ${chapter}:${verse}`);
  } catch (e) {
    console.warn(`[TTS] Prefetch failed for ${book} ${chapter}:${verse}:`, e);
  }
}

/**
 * Prefetch multiple verses
 */
export async function prefetchVerses(
  verses: Array<{ book: string; chapter: number; verse: number; text: string }>,
  voice: OpenAIVoice = DEFAULT_VOICE,
  concurrency: number = 2
): Promise<void> {
  // Process in batches
  for (let i = 0; i < verses.length; i += concurrency) {
    const batch = verses.slice(i, i + concurrency);
    await Promise.all(
      batch.map(v => prefetchVerse(v.book, v.chapter, v.verse, v.text, voice))
    );
  }
}
