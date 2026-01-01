import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { encode as base64Encode } from "https://deno.land/std@0.168.0/encoding/base64.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Provider types
type TTSProvider = 'openai' | 'elevenlabs' | 'speechify';

// OpenAI TTS voice options (supported set)
// Note: OpenAI may reject deprecated voices; keep server-side normalization below.
const OPENAI_VOICES = ['alloy', 'ash', 'coral', 'echo', 'fable', 'nova', 'onyx', 'sage', 'shimmer'];

// Backward-compatible aliases (deprecated voice names)
const OPENAI_VOICE_ALIASES: Record<string, string> = {
  ballad: 'sage',
  verse: 'fable',
};

// ElevenLabs voice IDs
const ELEVENLABS_VOICES: Record<string, string> = {
  'george': 'JBFqnCBsd6RMkjVDRZzb',
  'aria': '9BWtsMINqrJLrRacOk9x',
  'roger': 'CwhRBWXzGAHq8TQ4Fs17',
  'sarah': 'EXAVITQu4vr4xnSDxMaL',
  'charlie': 'IKne3meq5aSn9XLyUdCD',
  'callum': 'N2lVS1w4EtoT3dr4eOWO',
  'river': 'SAz9YHcvj6GT2YYXdXww',
  'liam': 'TX3LPaxmHKxFdv7VOQHJ',
  'charlotte': 'XB0fDUnXU5powFXDhCwa',
  'alice': 'Xb7hH8MSUJpSbSDYk0k2',
  'matilda': 'XrExE9yKIg1WjnnlVkGX',
  'will': 'bIHbv24MWmeRgasZH58o',
  'jessica': 'cgSgspJ2msm6clMCkdW9',
  'eric': 'cjVigY5qzO86Huf0OWal',
  'chris': 'iP95p4xoKVk53GoZ742B',
  'brian': 'nPczCjzI2devNBz1zQrb',
  'daniel': 'onwK4e9ZLuTAKqWW03F9',
  'lily': 'pFZP5JQG7iQjIQuC4Bku',
  'bill': 'pqHfZKP75CvOlQylNhV4',
};

// Speechify voice IDs - verified working voices
// Note: More voices available via list-speechify-voices endpoint
const SPEECHIFY_VOICES: Record<string, string> = {
  'henry': 'henry',
  'mrbeast': 'mrbeast', 
  'george': 'george',
  'cliff': 'cliff',
  'cody': 'cody',
  'kristy': 'kristy',
  'natasha': 'natasha',
  'cindy': 'cindy',
};

const MAX_CHARS = 4096;
const DEFAULT_VOICE = 'onyx';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function sha256Hex(input: string): Promise<string> {
  const data = new TextEncoder().encode(input);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

function normalizeBookName(book: string): string {
  return book.toLowerCase().replace(/\s+/g, '-');
}

function getStoragePath(book: string, chapter: number, verse: number, voiceId: string, provider: TTSProvider): string {
  return `${provider}/${voiceId}/${normalizeBookName(book)}/${chapter}/${verse}.mp3`;
}

async function checkCache(
  supabase: any,
  book: string,
  chapter: number,
  verse: number,
  voiceId: string,
  provider: TTSProvider
): Promise<{ found: boolean; url?: string }> {
  try {
    // Include provider in cache lookup
    const storagePath = getStoragePath(book, chapter, verse, voiceId, provider);

    const { data, error } = await supabase
      .from('bible_audio_cache')
      .select('storage_path')
      .eq('book', book)
      .eq('chapter', chapter)
      .eq('verse', verse)
      .eq('voice_id', `${provider}:${voiceId}`)
      .single();

    if (error || !data) {
      return { found: false };
    }

    const { data: urlData } = supabase.storage
      .from('bible-audio')
      .getPublicUrl(data.storage_path);

    return { found: true, url: urlData.publicUrl };
  } catch {
    return { found: false };
  }
}

async function storeInCache(
  supabase: any,
  book: string,
  chapter: number,
  verse: number,
  voiceId: string,
  provider: TTSProvider,
  audioBuffer: ArrayBuffer
): Promise<string | null> {
  try {
    const storagePath = getStoragePath(book, chapter, verse, voiceId, provider);

    const { error: uploadError } = await supabase.storage
      .from('bible-audio')
      .upload(storagePath, audioBuffer, {
        contentType: 'audio/mpeg',
        upsert: true
      });

    if (uploadError) {
      console.error('[Cache] Storage upload error:', uploadError);
      return null;
    }

    const { error: dbError } = await supabase
      .from('bible_audio_cache')
      .upsert({
        book,
        chapter,
        verse,
        voice_id: `${provider}:${voiceId}`,
        storage_path: storagePath,
        file_size_bytes: audioBuffer.byteLength,
      }, {
        onConflict: 'book,chapter,verse,voice_id'
      });

    if (dbError) {
      console.error('[Cache] DB error:', dbError);
    }

    const { data: urlData } = supabase.storage
      .from('bible-audio')
      .getPublicUrl(storagePath);

    console.log(`[Cache] Stored: ${storagePath}`);
    return urlData.publicUrl;
  } catch (err) {
    console.error('[Cache] Store error:', err);
    return null;
  }
}

function splitTextIntoChunks(text: string, maxChars: number): string[] {
  if (text.length <= maxChars) {
    return [text];
  }

  const chunks: string[] = [];
  let remaining = text;

  while (remaining.length > 0) {
    if (remaining.length <= maxChars) {
      chunks.push(remaining);
      break;
    }

    let breakPoint = maxChars;
    const searchText = remaining.substring(0, maxChars);
    const sentenceEndings = ['. ', '! ', '? ', '.\n', '!\n', '?\n'];
    let lastSentenceEnd = -1;

    for (const ending of sentenceEndings) {
      const idx = searchText.lastIndexOf(ending);
      if (idx > lastSentenceEnd) {
        lastSentenceEnd = idx + 1;
      }
    }

    if (lastSentenceEnd > maxChars * 0.5) {
      breakPoint = lastSentenceEnd;
    } else {
      const paragraphBreak = searchText.lastIndexOf('\n\n');
      if (paragraphBreak > maxChars * 0.3) {
        breakPoint = paragraphBreak + 1;
      } else {
        const newlineBreak = searchText.lastIndexOf('\n');
        if (newlineBreak > maxChars * 0.3) {
          breakPoint = newlineBreak + 1;
        }
      }
    }

    chunks.push(remaining.substring(0, breakPoint).trim());
    remaining = remaining.substring(breakPoint).trim();
  }

  return chunks.filter(chunk => chunk.length > 0);
}

// OpenAI TTS
async function generateOpenAI(
  text: string,
  voice: string,
  speed: number,
  apiKey: string
): Promise<ArrayBuffer> {
  const voiceKey = (voice || '').toLowerCase();
  const aliased = OPENAI_VOICE_ALIASES[voiceKey] ?? voiceKey;
  const selectedVoice = OPENAI_VOICES.includes(aliased) ? aliased : DEFAULT_VOICE;

  const response = await fetch('https://api.openai.com/v1/audio/speech', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'tts-1',
      input: text,
      voice: selectedVoice,
      speed: Math.max(0.25, Math.min(4.0, speed)),
      response_format: 'mp3',
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`OpenAI API error: ${response.status} - ${errorText}`);
  }

  return response.arrayBuffer();
}

// ElevenLabs TTS
async function generateElevenLabs(
  text: string,
  voice: string,
  speed: number,
  apiKey: string
): Promise<ArrayBuffer> {
  // Get voice ID from name or use directly if it looks like an ID
  const voiceId = ELEVENLABS_VOICES[voice.toLowerCase()] || voice;

  // Use monolingual English model to prevent Hebrew/other language auto-detection
  // eleven_multilingual_v2 can incorrectly detect Hebrew in biblical text
  const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
    method: 'POST',
    headers: {
      'xi-api-key': apiKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      text: text,
      model_id: 'eleven_turbo_v2_5', // English-optimized model, faster and won't read Hebrew
      voice_settings: {
        stability: 0.5,
        similarity_boost: 0.75,
        style: 0.3,
        use_speaker_boost: true,
        speed: Math.max(0.7, Math.min(1.2, speed)), // ElevenLabs range is 0.7-1.2
      },
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`ElevenLabs API error: ${response.status} - ${errorText}`);
  }

  return response.arrayBuffer();
}

// Speechify TTS
async function generateSpeechify(
  text: string,
  voice: string,
  speed: number,
  apiKey: string
): Promise<ArrayBuffer> {
  const voiceId = SPEECHIFY_VOICES[voice.toLowerCase()] || voice;

  console.log(`[Speechify] Generating speech with voice: ${voiceId}`);

  // Clean the text - remove SSML tags if present, Speechify expects plain text or proper SSML
  const cleanText = text.replace(/<[^>]*>/g, '');

  const response = await fetch('https://api.sws.speechify.com/v1/audio/speech', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      input: cleanText,
      voice_id: voiceId,
      audio_format: 'mp3',
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`[Speechify] API error ${response.status}: ${errorText}`);
    throw new Error(`Speechify API error: ${response.status} - ${errorText}`);
  }

  const data = await response.json();

  // Speechify returns base64 audio
  if (data.audio_data) {
    const binaryString = atob(data.audio_data);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
  }

  throw new Error('No audio data received from Speechify');
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const {
      text,
      voice = DEFAULT_VOICE,
      speed = 1.0,
      book,
      chapter,
      verse,
      useCache = true,
      provider = 'openai' as TTSProvider,
      // Backward-compatible: callers can request a URL response to avoid huge base64 payloads
      returnType = 'base64' as 'base64' | 'url'
    } = await req.json();

    if (!text) {
      throw new Error("Text is required");
    }

    // Normalize OpenAI voice (handles deprecated voices like "ballad" / "verse")
    const effectiveVoice = provider === 'openai'
      ? (OPENAI_VOICE_ALIASES[(voice || '').toLowerCase()] ?? (voice || '').toLowerCase())
      : voice;

    const finalVoice = provider === 'openai'
      ? (OPENAI_VOICES.includes(String(effectiveVoice)) ? String(effectiveVoice) : DEFAULT_VOICE)
      : voice;

    console.log(`[TTS] Provider: ${provider}, Voice: ${voice} -> ${finalVoice}, Text length: ${text.length}`);

    // Get appropriate API key
    let apiKey: string | undefined;
    switch (provider) {
      case 'elevenlabs':
        apiKey = Deno.env.get("ELEVENLABS_API_KEY");
        if (!apiKey) throw new Error("ELEVENLABS_API_KEY is not configured");
        break;
      case 'speechify':
        apiKey = Deno.env.get("SPEECHIFY_API_KEY");
        if (!apiKey) throw new Error("SPEECHIFY_API_KEY is not configured");
        break;
      case 'openai':
      default:
        apiKey = Deno.env.get("OPENAI_API_KEY");
        if (!apiKey) throw new Error("OPENAI_API_KEY is not configured");
        break;
    }

    // Initialize Supabase client for caching
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Check cache if verse info provided
    if (useCache && book && chapter !== undefined && verse !== undefined) {
      console.log(`[TTS] Checking cache: ${book} ${chapter}:${verse} (${provider}:${finalVoice})`);

      const cacheResult = await checkCache(supabase, book, chapter, verse, finalVoice, provider);

      if (cacheResult.found && cacheResult.url) {
        console.log(`[TTS] CACHE HIT - ${book} ${chapter}:${verse}`);
        return new Response(
          JSON.stringify({
            audioUrl: cacheResult.url,
            cached: true,
            provider,
            contentType: 'audio/mpeg'
          }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      console.log(`[TTS] CACHE MISS - generating audio with ${provider}`);
    }

    // Split text and generate
    const chunks = splitTextIntoChunks(text, MAX_CHARS);
    console.log(`[TTS] Split into ${chunks.length} chunks`);

    const audioBuffers: ArrayBuffer[] = [];

    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];
      console.log(`[TTS] Processing chunk ${i + 1}/${chunks.length} (${chunk.length} chars)`);

      let buffer: ArrayBuffer;
      switch (provider) {
        case 'elevenlabs':
          buffer = await generateElevenLabs(chunk, finalVoice, speed, apiKey);
          break;
        case 'speechify':
          buffer = await generateSpeechify(chunk, finalVoice, speed, apiKey);
          break;
        case 'openai':
        default:
          buffer = await generateOpenAI(chunk, finalVoice, speed, apiKey);
          break;
      }

      audioBuffers.push(buffer);

      if (i < chunks.length - 1) {
        await delay(50); // Reduced from 100ms for faster mobile TTS generation
      }
    }

    // Combine audio buffers
    const totalLength = audioBuffers.reduce((sum, buf) => sum + buf.byteLength, 0);
    const combined = new Uint8Array(totalLength);
    let offset = 0;
    for (const buffer of audioBuffers) {
      combined.set(new Uint8Array(buffer), offset);
      offset += buffer.byteLength;
    }

    console.log(`[TTS] Generated ${totalLength} bytes with ${provider}`);

    // For cache-enabled requests, return audio immediately and cache in background
    if (useCache && book && chapter !== undefined && verse !== undefined) {
      const storagePath = getStoragePath(book, chapter, verse, finalVoice, provider);
      
      // Start caching in background (fire and forget - don't await)
      const cachePromise = storeInCache(supabase, book, chapter, verse, finalVoice, provider, combined.buffer);
      cachePromise.catch(e => console.error('[TTS] Background cache failed:', e));
      
      // Return URL immediately - the file will be available shortly
      const { data: urlData } = supabase.storage
        .from('bible-audio')
        .getPublicUrl(storagePath);
      
      // Also return base64 for immediate playback while cache uploads
      const base64Audio = base64Encode(combined.buffer);
      
      return new Response(
        JSON.stringify({
          audioUrl: urlData.publicUrl,
          audioContent: base64Audio,
          cached: false,
          justCached: true,
          provider,
          contentType: 'audio/mpeg'
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // If requested, return a URL response to avoid huge base64 payloads (better for mobile)
    if (returnType === 'url') {
      try {
        const stableKey = await sha256Hex(JSON.stringify({
          provider,
          voice: finalVoice,
          speed: Math.round(speed * 100) / 100,
          text: text.trim(),
        }));

        const storagePath = `tts/${provider}/${finalVoice}/${stableKey}.mp3`;

        const { error: uploadError } = await supabase.storage
          .from('bible-audio')
          .upload(storagePath, combined.buffer, {
            contentType: 'audio/mpeg',
            upsert: true,
          });

        if (!uploadError) {
          const { data: urlData } = supabase.storage
            .from('bible-audio')
            .getPublicUrl(storagePath);

          return new Response(
            JSON.stringify({
              audioUrl: urlData.publicUrl,
              cached: false,
              justCached: false,
              provider,
              contentType: 'audio/mpeg'
            }),
            { headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        console.error('[TTS] URL upload failed, falling back to base64:', uploadError);
      } catch (err) {
        console.error('[TTS] Failed to return URL, falling back to base64:', err);
      }
    }

    // Return base64 (legacy behavior)
    const base64Audio = base64Encode(combined.buffer);

    return new Response(
      JSON.stringify({
        success: true,
        audioContent: base64Audio,
        contentType: 'audio/mpeg',
        textLength: text.length,
        voice: finalVoice,
        provider,
        chunks: chunks.length
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("[TTS Error]:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
