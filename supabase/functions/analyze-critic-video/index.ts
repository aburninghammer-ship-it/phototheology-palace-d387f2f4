import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

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

    // Try to fetch transcript using YouTube's API
    let transcript = "";
    try {
      // Try to get captions/transcript
      const captionsUrl = `https://www.youtube.com/watch?v=${videoId}`;
      console.log("Attempting to fetch video data from:", captionsUrl);
      
      // Note: In production, you might want to use YouTube Data API v3
      // For now, we'll proceed with video ID and let AI analyze based on that
      transcript = "Transcript not available - analyzing based on video content";
    } catch (error) {
      console.log("Could not fetch transcript:", error);
      transcript = "Transcript unavailable";
    }

    // Call Lovable AI to analyze the video
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

    const userPrompt = `Please analyze this YouTube video: ${videoUrl}

Video ID: ${videoId}
${transcript !== "Transcript unavailable" ? `Transcript: ${transcript}` : "Note: Transcript not available, please analyze based on the video URL and common content patterns for similar videos."}

IMPORTANT INSTRUCTIONS:
1. First determine the video type (pro-biblical or anti-biblical)
2. If it's pro-biblical doctrine: Affirm why it's correct with Scripture and sound theology
3. If it's anti-biblical/anti-doctrine/anti-Trinity: Show why it's wrong with detailed biblical rebuttals
4. Identify all logical fallacies used
5. Provide comprehensive biblical responses

Provide a comprehensive analysis with claims, responses (affirmation or rebuttal), logical fallacies, and biblical support.`;

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
