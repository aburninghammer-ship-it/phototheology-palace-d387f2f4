import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// ElevenLabs voice options
const VOICES: Record<string, string> = {
  aria: '9BWtsMINqrJLrRacOk9x',
  roger: 'CwhRBWXzGAHq8TQ4Fs17',
  sarah: 'EXAVITQu4vr4xnSDxMaL',
  laura: 'FGY2WhTYpPnrIDTdsKH5',
  charlie: 'IKne3meq5aSn9XLyUdCD',
  george: 'JBFqnCBsd6RMkjVDRZzb',
  callum: 'N2lVS1w4EtoT3dr4eOWO',
  river: 'SAz9YHcvj6GT2YYXdXww',
  liam: 'TX3LPaxmHKxFdv7VOQHJ',
  charlotte: 'XB0fDUnXU5powFXDhCwa',
  alice: 'Xb7hH8MSUJpSbSDYk0k2',
  matilda: 'XrExE9yKIg1WjnnlVkGX',
  will: 'bIHbv24MWmeRgasZH58o',
  jessica: 'cgSgspJ2msm6clMCkdW9',
  eric: 'cjVigY5qzO86Huf0OWal',
  chris: 'iP95p4xoKVk53GoZ742B',
  brian: 'nPczCjzI2devNBz1zQrb',
  daniel: 'onwK4e9ZLuTAKqWW03F9',
  lily: 'pFZP5JQG7iQjIQuC4Bku',
  bill: 'pqHfZKP75CvOlQylNhV4',
};

const MAX_CHARS = 9500;
const DEFAULT_BIBLE_VOICE = 'daniel';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Normalize book names for storage paths
function normalizeBookName(book: string): string {
  return book.toLowerCase().replace(/\s+/g, '-');
}

// Generate storage path for verse audio
function getStoragePath(book: string, chapter: number, verse: number, voiceId: string): string {
  return `${voiceId}/${normalizeBookName(book)}/${chapter}/${verse}.mp3`;
}

// Check if audio exists in cache
async function checkCache(
  supabase: any,
  book: string,
  chapter: number,
  verse: number,
  voiceId: string
): Promise<{ found: boolean; url?: string }> {
  try {
    const { data, error } = await supabase
      .from('bible_audio_cache')
      .select('storage_path')
      .eq('book', book)
      .eq('chapter', chapter)
      .eq('verse', verse)
      .eq('voice_id', voiceId)
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

// Store audio in cache
async function storeInCache(
  supabase: any,
  book: string,
  chapter: number,
  verse: number,
  voiceId: string,
  audioBuffer: ArrayBuffer
): Promise<string | null> {
  try {
    const storagePath = getStoragePath(book, chapter, verse, voiceId);
    
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
        voice_id: voiceId,
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

// Split text into chunks at sentence boundaries
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

// Call ElevenLabs API with retry logic
async function callElevenLabsWithRetry(
  text: string,
  voiceId: string,
  apiKey: string,
  maxRetries = 3
): Promise<Response> {
  let lastError: Error | null = null;
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    if (attempt > 0) {
      const waitTime = Math.pow(2, attempt) * 1000;
      console.log(`Rate limited. Waiting ${waitTime}ms before retry ${attempt + 1}/${maxRetries}`);
      await delay(waitTime);
    }

    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
      {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': apiKey,
        },
        body: JSON.stringify({
          text,
          model_id: 'eleven_turbo_v2',
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75,
          },
        }),
      }
    );

    if (response.ok) {
      return response;
    }

    if (response.status === 429) {
      const errorText = await response.text();
      console.error(`ElevenLabs rate limit: ${response.status}`, errorText);
      lastError = new Error(`Rate limited: ${response.status}`);
      continue;
    }

    const errorText = await response.text();
    console.error(`ElevenLabs API error: ${response.status}`, errorText);
    throw new Error(`ElevenLabs API error: ${response.status} - ${errorText}`);
  }

  throw lastError || new Error('Max retries exceeded');
}

// Convert array buffer to base64
function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let base64 = '';
  const chunkSize = 32768;
  for (let i = 0; i < bytes.length; i += chunkSize) {
    const chunk = bytes.subarray(i, Math.min(i + chunkSize, bytes.length));
    base64 += String.fromCharCode(...chunk);
  }
  return btoa(base64);
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { text, voice = DEFAULT_BIBLE_VOICE, book, chapter, verse, useCache = true } = await req.json();

    if (!text) {
      throw new Error("Text is required");
    }

    const ELEVENLABS_API_KEY = Deno.env.get("ELEVENLABS_API_KEY");
    if (!ELEVENLABS_API_KEY) {
      throw new Error("ELEVENLABS_API_KEY is not configured");
    }

    // Initialize Supabase client for caching
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const voiceName = voice.toLowerCase();
    const voiceId = VOICES[voiceName] || VOICES[DEFAULT_BIBLE_VOICE];

    // Check cache if verse info provided
    if (useCache && book && chapter !== undefined && verse !== undefined) {
      console.log(`[TTS] Checking cache: ${book} ${chapter}:${verse} (${voiceName})`);
      
      const cacheResult = await checkCache(supabase, book, chapter, verse, voiceName);
      
      if (cacheResult.found && cacheResult.url) {
        console.log(`[TTS] CACHE HIT - ${book} ${chapter}:${verse}`);
        return new Response(
          JSON.stringify({ 
            audioUrl: cacheResult.url,
            cached: true,
            contentType: 'audio/mpeg'
          }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      console.log(`[TTS] CACHE MISS - generating audio`);
    }

    console.log(`[TTS] Generating for ${text.length} chars with voice: ${voiceName}`);

    // Split text and generate
    const chunks = splitTextIntoChunks(text, MAX_CHARS);
    console.log(`[TTS] Split into ${chunks.length} chunks`);

    const audioBuffers: ArrayBuffer[] = [];
    
    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];
      console.log(`[TTS] Processing chunk ${i + 1}/${chunks.length} (${chunk.length} chars)`);
      
      const response = await callElevenLabsWithRetry(chunk, voiceId, ELEVENLABS_API_KEY);
      const buffer = await response.arrayBuffer();
      audioBuffers.push(buffer);
      
      if (i < chunks.length - 1) {
        await delay(100);
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

    console.log(`[TTS] Generated ${totalLength} bytes`);

    // Store in cache if verse info provided
    if (useCache && book && chapter !== undefined && verse !== undefined) {
      const cachedUrl = await storeInCache(supabase, book, chapter, verse, voiceName, combined.buffer);
      
      if (cachedUrl) {
        return new Response(
          JSON.stringify({ 
            audioUrl: cachedUrl,
            cached: false,
            justCached: true,
            contentType: 'audio/mpeg'
          }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }

    // Return base64 if not caching
    const base64Audio = arrayBufferToBase64(combined.buffer);

    return new Response(
      JSON.stringify({ 
        success: true,
        audioContent: base64Audio,
        contentType: 'audio/mpeg',
        textLength: text.length,
        voice: voiceName,
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
