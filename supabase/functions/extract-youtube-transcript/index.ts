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

function extractChannelFromUrl(url: string): string | null {
  const patterns = [
    /youtube\.com\/@([^\/\?]+)/i,
    /youtube\.com\/channel\/([^\/\?]+)/i,
    /youtube\.com\/c\/([^\/\?]+)/i,
    /youtube\.com\/user\/([^\/\?]+)/i,
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1].toLowerCase();
  }
  return null;
}

async function fetchYouTubeTranscript(videoId: string, churchChannelUrl?: string): Promise<{ transcript: string; channelId?: string }> {
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
  
  // Validate channel if church channel URL is provided
  if (churchChannelUrl) {
    const churchChannelId = extractChannelFromUrl(churchChannelUrl);
    
    if (churchChannelId) {
      // Look for channel info in the page
      const channelPatterns = [
        /"ownerChannelName":"([^"]+)"/,
        /"channelId":"([^"]+)"/,
        /@([a-zA-Z0-9_-]+)/,
        /\/channel\/([^"\/]+)/,
        /"author":"([^"]+)"/
      ];
      
      let foundChannelId: string | null = null;
      for (const pattern of channelPatterns) {
        const match = html.match(pattern);
        if (match) {
          foundChannelId = match[1].toLowerCase();
          break;
        }
      }
      
      // Also check for the channel handle in the page
      const handleMatch = html.match(/"vanityChannelUrl":"https?:\/\/www\.youtube\.com\/@([^"]+)"/);
      const channelNameMatch = html.match(/"ownerChannelName":"([^"]+)"/);
      
      // Get all possible identifiers from the video page
      const videoChannelIdentifiers: string[] = [];
      if (foundChannelId) videoChannelIdentifiers.push(foundChannelId);
      if (handleMatch) videoChannelIdentifiers.push(handleMatch[1].toLowerCase());
      if (channelNameMatch) videoChannelIdentifiers.push(channelNameMatch[1].toLowerCase().replace(/\s+/g, ''));
      
      // Check if any identifier matches the church channel
      const churchIdentifier = churchChannelId.toLowerCase();
      const isFromChurchChannel = videoChannelIdentifiers.some(id => 
        id.includes(churchIdentifier) || churchIdentifier.includes(id)
      );
      
      if (!isFromChurchChannel && videoChannelIdentifiers.length > 0) {
        console.log(`Channel validation failed. Church: ${churchChannelId}, Video: ${videoChannelIdentifiers.join(', ')}`);
        throw new Error('This video is not from your church\'s YouTube channel. Only videos from your registered channel can be used.');
      }
    }
  }
  
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
  
  return { transcript: segments.join(' ') };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { youtubeUrl, churchChannelUrl } = await req.json();
    
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
    if (churchChannelUrl) {
      console.log(`Validating against church channel: ${churchChannelUrl}`);
    }
    
    const result = await fetchYouTubeTranscript(videoId, churchChannelUrl);
    
    if (!result.transcript || result.transcript.length < 100) {
      return new Response(
        JSON.stringify({ error: 'Could not extract sufficient transcript from this video' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    console.log(`Extracted transcript length: ${result.transcript.length} characters`);
    
    return new Response(
      JSON.stringify({ 
        transcript: result.transcript,
        videoId,
        characterCount: result.transcript.length
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
