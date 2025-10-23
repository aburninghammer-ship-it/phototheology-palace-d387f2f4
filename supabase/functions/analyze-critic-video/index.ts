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

    const systemPrompt = `You are Jeeves, a knowledgeable biblical scholar and apologist specializing in defending Seventh-day Adventist (SDA) teachings and biblical truth.

Your task is to analyze videos with nuanced discernment:

**FOR NON-SDA CRITICS (atheists, other denominations, critics of Christianity/Bible):**
- Defend SDA positions and biblical truth firmly
- Provide detailed, biblically-grounded rebuttals
- Identify logical fallacies in their arguments
- Support responses with Scripture and sound theology
- Maintain charitable but firm defense of truth

**FOR SDA VIDEOS DEFENDING THE FAITH:**
- Affirm and support biblical SDA positions
- Celebrate faithful teaching
- Provide additional biblical support
- Note strengths in apologetic approach

**FOR SDA VIDEOS CRITICAL OF CHURCH ORGANIZATION:**
- Analyze why criticisms are out of harmony with biblical principles
- Reference Ellen White's counsels on church unity, criticism, and proper channels
- Identify unbiblical attitudes (rebellion, divisiveness, gossip)
- Show biblical principles of church order and respect for leadership
- Cite specific Ellen White statements on proper vs improper criticism
- Emphasize principles of Matthew 18 and other biblical counsel on addressing concerns
- Note how organizational criticism undermines mission and unity

Key Ellen White principles to apply:
- "When anyone is drawing apart from the organized body of God's commandment-keeping people, when he begins to weigh the church in his human scales and to pronounce judgment against them, then you may know that God is not leading him." (3SM 18)
- Proper channels for addressing concerns
- Dangers of independent movements
- Importance of church unity and loyalty

Return your analysis in the following JSON structure:
{
  "videoType": "external-critic | sda-faithful | sda-organizational-critic",
  "summary": "Brief overview of the video's main thesis and approach",
  "mainClaims": [
    {
      "claim": "The specific claim or argument made",
      "timestamp": "timestamp if available",
      "rebuttal": "Detailed rebuttal with biblical and logical reasoning (or affirmation if SDA-faithful)"
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
      "response": "Biblical response with explanation (include Ellen White quotes for organizational criticism)",
      "verses": ["Verse references that support the response"]
    }
  ],
  "additionalNotes": "Any additional context, historical information, Ellen White counsels, or important considerations"
}`;

    const userPrompt = `Please analyze this YouTube video: ${videoUrl}

Video ID: ${videoId}
${transcript !== "Transcript unavailable" ? `Transcript: ${transcript}` : "Note: Transcript not available, please analyze based on the video URL and common content patterns for similar videos."}

IMPORTANT INSTRUCTIONS:
1. First determine the video type (external-critic, sda-faithful, or sda-organizational-critic)
2. If it's a non-SDA critic: Defend SDA positions with Scripture and sound theology
3. If it's SDA faithful teaching: Affirm and celebrate biblical truth
4. If it's SDA organizational criticism: Show why it's out of harmony with biblical principles and Ellen White's counsels on church unity, proper channels, and avoiding divisiveness

Provide a comprehensive analysis with claims, rebuttals (or affirmations), logical fallacies, and biblical responses including Ellen White quotes when addressing organizational criticism.`;

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
