import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

function extractVideoId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /^([a-zA-Z0-9_-]{11})$/
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

async function fetchYouTubeTranscript(videoId: string): Promise<string> {
  // Fetch the YouTube page to get caption track info
  const watchUrl = `https://www.youtube.com/watch?v=${videoId}`;
  const response = await fetch(watchUrl, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    }
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch YouTube page');
  }
  
  const html = await response.text();
  
  // Extract caption track URL from the page
  const captionMatch = html.match(/"captionTracks":\s*\[(.*?)\]/);
  if (!captionMatch) {
    throw new Error('No captions available for this video. Try a video with closed captions enabled.');
  }
  
  // Parse the caption tracks
  const captionData = captionMatch[1];
  const urlMatch = captionData.match(/"baseUrl":\s*"([^"]+)"/);
  if (!urlMatch) {
    throw new Error('Could not extract caption URL');
  }
  
  // Decode the URL (it's escaped in the JSON)
  let captionUrl = urlMatch[1].replace(/\\u0026/g, '&');
  
  // Fetch the caption XML
  const captionResponse = await fetch(captionUrl);
  if (!captionResponse.ok) {
    throw new Error('Failed to fetch captions');
  }
  
  const captionXml = await captionResponse.text();
  
  // Parse XML and extract text
  const textMatches = captionXml.matchAll(/<text[^>]*>([^<]*)<\/text>/g);
  const segments: string[] = [];
  
  for (const match of textMatches) {
    // Decode HTML entities
    let text = match[1]
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/\n/g, ' ')
      .trim();
    
    if (text) {
      segments.push(text);
    }
  }
  
  return segments.join(' ');
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { youtubeUrl } = await req.json();
    
    if (!youtubeUrl) {
      return new Response(
        JSON.stringify({ error: 'YouTube URL is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    const videoId = extractVideoId(youtubeUrl);
    if (!videoId) {
      return new Response(
        JSON.stringify({ error: 'Invalid YouTube URL' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    console.log(`Extracting transcript for video: ${videoId}`);
    
    const transcript = await fetchYouTubeTranscript(videoId);
    
    if (!transcript || transcript.length < 100) {
      return new Response(
        JSON.stringify({ error: 'Could not extract sufficient transcript from this video' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    console.log(`Extracted transcript length: ${transcript.length} characters`);
    
    return new Response(
      JSON.stringify({ 
        transcript,
        videoId,
        characterCount: transcript.length
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
    
  } catch (error: unknown) {
    console.error('Error extracting transcript:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to extract transcript';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
