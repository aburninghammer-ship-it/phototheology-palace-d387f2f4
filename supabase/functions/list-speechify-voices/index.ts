import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const speechifyApiKey = Deno.env.get('SPEECHIFY_API_KEY');
    
    if (!speechifyApiKey) {
      throw new Error('SPEECHIFY_API_KEY is not configured');
    }

    console.log('[Speechify] Fetching available voices...');

    const response = await fetch('https://api.sws.speechify.com/v1/tts/voices/list', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${speechifyApiKey}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[Speechify] API error ${response.status}: ${errorText}`);
      throw new Error(`Speechify API error: ${response.status}`);
    }

    const voices = await response.json();
    
    console.log(`[Speechify] Found ${voices.length} voices`);

    // Transform to a simpler format for the frontend
    const formattedVoices = voices
      .filter((v: any) => v.type === 'shared') // Only system voices, not personal clones
      .map((v: any) => ({
        id: v.id,
        name: v.display_name || v.id,
        description: `${v.gender || 'Voice'} - ${v.locale || 'en-US'}`,
        gender: v.gender,
        locale: v.locale,
        previewAudio: v.preview_audio,
        avatarImage: v.avatar_image,
      }));

    return new Response(
      JSON.stringify({ voices: formattedVoices }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('[Speechify] Error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
