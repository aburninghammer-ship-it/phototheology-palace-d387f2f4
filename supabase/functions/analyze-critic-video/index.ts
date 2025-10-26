import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Function to fetch YouTube video metadata
async function getYouTubeMetadata(videoId: string): Promise<{ title: string; description: string; channelTitle: string }> {
  try {
    // Use YouTube's oEmbed API which doesn't require an API key
    const oembedUrl = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`;
    const response = await fetch(oembedUrl);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch video metadata: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    return {
      title: data.title || 'Unknown Title',
      description: '',
      channelTitle: data.author_name || 'Unknown Channel'
    };
  } catch (error) {
    console.error("Error fetching metadata:", error);
    throw new Error(`Failed to fetch video metadata: ${error instanceof Error ? error.message : 'Unknown error'}`);
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

    // Fetch video metadata
    console.log("Fetching video metadata...");
    let metadata: { title: string; description: string; channelTitle: string };
    try {
      metadata = await getYouTubeMetadata(videoId);
      console.log(`Metadata fetched - Title: ${metadata.title}, Channel: ${metadata.channelTitle}`);
    } catch (error) {
      console.error("Metadata fetch error:", error);
      throw new Error(`Could not fetch video metadata. Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
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

    const userPrompt = `Please analyze this YouTube video based on its metadata:

VIDEO INFORMATION:
- URL: ${videoUrl}
- Video ID: ${videoId}
- Title: ${metadata.title}
- Channel: ${metadata.channelTitle}

ANALYSIS REQUIREMENTS:
Based on the video title and channel name, provide a thorough biblical analysis:

1. Research what you know about this channel and their typical content
2. Analyze the video title to determine the likely theological position
3. Determine if the video is pro-biblical or anti-biblical based on the available information
4. If the title/channel suggests pro-biblical content: Affirm sound biblical doctrine and explain why such positions are correct
5. If the title/channel suggests anti-biblical content: Provide detailed biblical rebuttals to common claims made by similar sources
6. Identify common logical fallacies that videos with such titles/channels typically employ
7. Provide comprehensive biblical responses with specific verse references
8. Be thorough and specific in your analysis based on the video information provided

Provide a detailed analysis that helps viewers understand the biblical perspective on the content.`;

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
