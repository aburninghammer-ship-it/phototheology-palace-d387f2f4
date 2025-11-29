import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { text, voice = "alloy" } = await req.json();

    if (!text) {
      throw new Error("Text is required");
    }

    // Truncate text if too long (OpenAI TTS has a 4096 character limit)
    const truncatedText = text.substring(0, 4096);

    const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");
    if (!OPENAI_API_KEY) {
      throw new Error("OPENAI_API_KEY is not configured");
    }

    console.log(`Generating TTS for ${truncatedText.length} characters with voice: ${voice}`);

    // Call OpenAI's TTS API
    const response = await fetch('https://api.openai.com/v1/audio/speech', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'tts-1',
        input: truncatedText,
        voice: voice,
        response_format: 'mp3',
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("OpenAI TTS error:", response.status, errorText);
      throw new Error(`OpenAI TTS API error: ${response.status}`);
    }

    // Convert audio buffer to base64
    const arrayBuffer = await response.arrayBuffer();
    const base64Audio = btoa(
      String.fromCharCode(...new Uint8Array(arrayBuffer))
    );

    console.log("TTS audio generated successfully");

    return new Response(
      JSON.stringify({ 
        success: true,
        audioContent: base64Audio,
        textLength: truncatedText.length,
        voice: voice
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("text-to-speech error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
