import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Function to fetch YouTube transcript
async function getYouTubeTranscript(videoId: string): Promise<string> {
  try {
    // Fetch the video page to get the initial data
    const videoPageResponse = await fetch(`https://www.youtube.com/watch?v=${videoId}`);
    const videoPageHtml = await videoPageResponse.text();
    
    // Extract the ytInitialPlayerResponse from the page
    const playerResponseMatch = videoPageHtml.match(/var ytInitialPlayerResponse = ({.+?});/);
    if (!playerResponseMatch) {
      throw new Error("Could not find player response in video page");
    }
    
    const playerResponse = JSON.parse(playerResponseMatch[1]);
    const captionTracks = playerResponse?.captions?.playerCaptionsTracklistRenderer?.captionTracks;
    
    if (!captionTracks || captionTracks.length === 0) {
      throw new Error("No captions available for this video");
    }
    
    // Get the first available caption track (preferably English)
    const englishTrack = captionTracks.find((track: any) => 
      track.languageCode === 'en' || track.languageCode.startsWith('en')
    ) || captionTracks[0];
    
    // Fetch the transcript
    const transcriptResponse = await fetch(englishTrack.baseUrl);
    const transcriptXml = await transcriptResponse.text();
    
    // Parse XML and extract text
    const textMatches = transcriptXml.matchAll(/<text[^>]*>([^<]+)<\/text>/g);
    const transcriptParts: string[] = [];
    
    for (const match of textMatches) {
      // Decode HTML entities
      const text = match[1]
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'");
      transcriptParts.push(text);
    }
    
    return transcriptParts.join(' ');
  } catch (error) {
    console.error("Error fetching transcript:", error);
    throw new Error(`Failed to fetch video transcript: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { videoUrl } = await req.json();
    console.log("Analyzing video:", videoUrl);

    if (!videoUrl) {
      throw new Error("Video URL is required");
    }

    // Extract video ID
    const videoIdMatch = videoUrl.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
    if (!videoIdMatch) {
      throw new Error("Invalid YouTube URL");
    }
    const videoId = videoIdMatch[1];
    console.log("Video ID:", videoId);

    // Fetch the actual video transcript
    console.log("Fetching transcript...");
    let transcript: string;
    try {
      transcript = await getYouTubeTranscript(videoId);
      console.log(`Transcript fetched: ${transcript.length} characters`);
    } catch (error) {
      console.error("Transcript fetch error:", error);
      throw new Error(`Could not fetch video transcript. The video may not have captions available, or there was an error accessing YouTube. Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY not configured");
    }

    const systemPrompt = `You are Jeeves, a knowledgeable biblical scholar and apologist specializing in defending biblical truth.

Your task is to analyze videos with discernment:

**FOR PRO-BIBLICAL/PRO-DOCTRINE VIDEOS:**
- Affirm why the biblical position is correct
- Celebrate faithful teaching
- Provide additional biblical support
- Note strengths in apologetic approach
- Explain the theological foundation

**FOR ANTI-BIBLICAL/ANTI-DOCTRINE/ANTI-TRINITY VIDEOS:**
- Defend biblical truth firmly
- Provide detailed, biblically-grounded rebuttals
- Identify logical fallacies in their arguments
- Support responses with Scripture and sound theology
- Show why the criticism is wrong
- Maintain charitable but firm defense of truth

Return your analysis in the following JSON structure:
{
  "videoType": "pro-biblical | anti-biblical",
  "summary": "Brief overview of the video's main thesis and approach",
  "mainClaims": [
    {
      "claim": "The specific claim or argument made",
      "timestamp": "timestamp if available",
      "rebuttal": "Detailed response with biblical reasoning (affirmation if pro-biblical, rebuttal if anti-biblical)"
    }
  ],
  "logicalFallacies": [
    {
      "fallacy": "Name of the logical fallacy",
      "explanation": "Why this is a fallacy",
      "example": "Specific example from the video"
    }
  ],
  "biblicalResponses": [
    {
      "topic": "Topic or doctrine addressed",
      "response": "Biblical response with explanation",
      "verses": ["Verse references that support the response"]
    }
  ],
  "additionalNotes": "Any additional context, historical information, or important considerations"
}`;

    const userPrompt = `Please analyze this YouTube video based on its actual transcript:

VIDEO URL: ${videoUrl}
VIDEO ID: ${videoId}

VIDEO TRANSCRIPT:
${transcript}

ANALYSIS REQUIREMENTS:
1. Carefully read the entire transcript to understand the video's actual content and message
2. Determine if the video is pro-biblical or anti-biblical based on what is actually said
3. Identify specific claims made in the transcript with their context
4. If pro-biblical: Affirm sound doctrine with Scripture and explain why it's correct
5. If anti-biblical: Provide detailed biblical rebuttals to the specific claims made
6. Identify any logical fallacies present in the actual arguments
7. Provide comprehensive biblical responses with specific verse references
8. Base all analysis on what is actually said in the transcript, not assumptions

This is a real transcript analysis - be accurate and thorough based on the actual content.`;

    console.log("Calling Lovable AI...");
    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        response_format: { type: "json_object" }
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error("AI API error:", aiResponse.status, errorText);
      throw new Error(`AI analysis failed: ${errorText}`);
    }

    const aiData = await aiResponse.json();
    console.log("AI response received");
    
    const analysisText = aiData.choices[0].message.content;
    const analysis = JSON.parse(analysisText);

    return new Response(
      JSON.stringify({ analysis }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error('Error in analyze-critic-video:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'An error occurred during analysis'
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
});
