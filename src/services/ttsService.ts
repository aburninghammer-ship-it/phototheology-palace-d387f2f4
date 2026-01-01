/**
 * TTS Service - OpenAI Text-to-Speech
 */

import { supabase } from '@/integrations/supabase/client';

// OpenAI voices
export type OpenAIVoice = 'alloy' | 'ash' | 'coral' | 'echo' | 'fable' | 'nova' | 'onyx' | 'sage' | 'shimmer';

export const OPENAI_VOICES: { id: OpenAIVoice; name: string }[] = [
  { id: 'alloy', name: 'Alloy' },
  { id: 'ash', name: 'Ash' },
  { id: 'coral', name: 'Coral' },
  { id: 'echo', name: 'Echo' },
  { id: 'fable', name: 'Fable' },
  { id: 'nova', name: 'Nova' },
  { id: 'onyx', name: 'Onyx' },
  { id: 'sage', name: 'Sage' },
  { id: 'shimmer', name: 'Shimmer' },
];

export const DEFAULT_VOICE: OpenAIVoice = 'onyx';

interface TTSOptions {
  voice?: OpenAIVoice;
  speed?: number;
  // For caching
  book?: string;
  chapter?: number;
  verse?: number;
}

/**
 * Generate TTS audio URL
 */
export async function generateTTS(text: string, options: TTSOptions = {}): Promise<string> {
  const { voice = DEFAULT_VOICE, speed = 1.0, book, chapter, verse } = options;

  if (!text?.trim()) {
    throw new Error('Text is required');
  }

  const { data, error } = await supabase.functions.invoke('text-to-speech', {
    body: {
      text: text.trim(),
      voice,
      speed,
      book,
      chapter,
      verse,
      useCache: !!(book && chapter !== undefined && verse !== undefined),
      returnType: 'url',
    },
  });

  if (error) {
    throw new Error(error.message || 'TTS generation failed');
  }

  // Prefer URL, fallback to base64
  if (data?.audioUrl) {
    return data.audioUrl;
  }

  if (data?.audioContent) {
    return `data:audio/mpeg;base64,${data.audioContent}`;
  }

  throw new Error('No audio data received');
}

/**
 * Generate commentary TTS (no verse caching)
 */
export async function generateCommentaryTTS(text: string, voice: OpenAIVoice = DEFAULT_VOICE): Promise<string> {
  return generateTTS(text, { voice });
}
