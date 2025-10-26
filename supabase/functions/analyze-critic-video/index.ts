import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Function to fetch YouTube transcript
async function getYouTubeTranscript(videoId: string): Promise<string | null> {
  try {
    // Try multiple methods to get transcript
    
    // Method 1: Try to get auto-generated captions
    const videoPageUrl = `https://www.youtube.com/watch?v=${videoId}`;
    const response = await fetch(videoPageUrl);
    const html = await response.text();
    
    // Look for caption tracks in the page data
    const captionRegex = /"captions":\s*(\{[^}]+\})/;
    const match = html.match(captionRegex);
    
    if (match) {
      try {
        // Try to extract caption URL patterns
        const captionUrlRegex = /"baseUrl":"([^"]+)"/g;
        const urls = [...html.matchAll(captionUrlRegex)];
        
        if (urls.length > 0) {
          // Get the first caption track URL
          const captionUrl = urls[0][1].replace(/\\u0026/g, '&');
          
          const captionResponse = await fetch(captionUrl);
          const captionXml = await captionResponse.text();
          
          // Parse the XML to extract text
          const textRegex = /<text[^>]*>(.*?)<\/text>/g;
          const texts = [...captionXml.matchAll(textRegex)];
          
          if (texts.length > 0) {
            const transcript = texts
              .map(m => m[1]
                .replace(/&amp;/g, '&')
                .replace(/&lt;/g, '<')
                .replace(/&gt;/g, '>')
                .replace(/&quot;/g, '"')
                .replace(/&#39;/g, "'")
                .replace(/<[^>]*>/g, '')
              )
              .join(' ')
              .trim();
            
            if (transcript.length > 100) {
              console.log(`Transcript fetched: ${transcript.length} characters`);
              return transcript;
            }
          }
        }
      } catch (error) {
        console.error("Error parsing captions:", error);
      }
    }
    
    console.log("No transcript available, will use metadata only");
    return null;
  } catch (error) {
    console.error("Error fetching transcript:", error);
    return null;
  }
}

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

    // Try to fetch transcript
    console.log("Attempting to fetch transcript...");
    const transcript = await getYouTubeTranscript(videoId);

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY not configured");
    }

    const systemPrompt = `You are Jeeves, an expert Seventh-day Adventist apologist and biblical scholar with deep knowledge of SDA theology, church history, and common criticisms.

Your mission is to provide EXTREMELY DETAILED, ROBUST defenses of SDA doctrine with:
- Specific verse-by-verse biblical analysis
- Historical context and church history
- Point-by-point refutation of specific claims
- Multiple layers of biblical evidence
- Theological depth and scholarly rigor

**FOR PRO-SDA CONTENT:**
- Provide detailed affirmation with extensive biblical support
- Explain the theological foundation in depth
- Connect to the broader SDA prophetic framework
- Cite Ellen G. White where appropriate
- Show how it fits into the Three Angels' Messages

**FOR ANTI-SDA CONTENT:**
- Extract SPECIFIC statements and quote them directly
- Provide detailed, multi-layered biblical rebuttals
- Address both explicit claims and underlying assumptions
- Use multiple lines of biblical evidence for each point
- Cite relevant Ellen G. White statements that address the criticism
- Provide historical context showing how SDA position developed
- Address common misunderstandings of SDA theology
- Show logical fallacies in reasoning

**KEY SDA DOCTRINES TO DEFEND WITH DEPTH:**
1. **Seventh-day Sabbath**: Creation ordinance, fourth commandment, Mark of the Beast context, Colossians 2 explanation, Acts 20:7 clarification
2. **Sanctuary & Investigative Judgment**: Hebrews 8-10, Daniel 8:14, Day of Atonement typology, pre-advent judgment
3. **State of the Dead**: Ecclesiastes 9:5, 1 Thessalonians 4:13-18, conditional immortality, no consciousness in death
4. **Spirit of Prophecy**: Joel 2:28-29, Revelation 12:17, Revelation 19:10, testing a prophet, Ellen White's role
5. **Three Angels' Messages**: Revelation 14:6-12, everlasting gospel, worship the Creator, Babylon identified
6. **Health Message**: 1 Corinthians 6:19-20, Daniel 1, biblical principles
7. **Second Coming**: Literal, visible, audible return; Matthew 24, 1 Thessalonians 4
8. **Law & Gospel**: Romans 3:31, James 2:10-12, covenant relationship

**ANALYSIS DEPTH REQUIREMENTS:**
- Quote specific statements from the video when available
- Provide 3-5 biblical references for each major point
- Explain the Greek/Hebrew context where relevant
- Address both the surface argument and underlying theology
- Show how SDA position is consistent across all Scripture
- Anticipate and pre-empt common counter-arguments
- Provide practical application for SDA believers

Return your analysis in the following JSON structure with MAXIMUM DETAIL:
{
  "videoType": "pro-SDA | anti-SDA",
  "summary": "Comprehensive 2-3 paragraph overview of the video's theological position and approach, explaining why it's pro or anti-SDA",
  "mainClaims": [
    {
      "claim": "EXACT QUOTE from the video or detailed description of the claim made",
      "timestamp": "timestamp if available",
      "rebuttal": "EXTREMELY DETAILED SDA response with 4-6 paragraphs including: biblical evidence (4-6 verses with context), Greek/Hebrew word studies, historical theology, Ellen White citations, logical analysis, and practical application"
    }
  ],
  "logicalFallacies": [
    {
      "fallacy": "Specific name of the logical fallacy",
      "explanation": "Detailed 2-3 paragraph explanation of why this is fallacious reasoning",
      "example": "SPECIFIC quoted example from the video showing this fallacy"
    }
  ],
  "biblicalResponses": [
    {
      "topic": "Specific SDA doctrine being addressed (e.g., 'Sabbath Observance', 'Investigative Judgment')",
      "response": "COMPREHENSIVE 3-5 paragraph biblical defense including: foundational verses, supporting passages, Greek/Hebrew context, systematic theology, Ellen White perspective, practical application",
      "verses": ["List 5-8 specific verse references with brief explanations of how each supports the SDA position"]
    }
  ],
  "additionalNotes": "2-3 paragraphs of additional context including: historical background of this criticism, how this fits into the Great Controversy theme, resources for further study, encouragement for SDA believers"
}`;

    let userPrompt: string;
    
    if (transcript && transcript.length > 200) {
      // We have a transcript - do detailed analysis
      userPrompt = `Analyze this YouTube video with MAXIMUM DETAIL and ROBUST SDA defense:

VIDEO INFORMATION:
- URL: ${videoUrl}
- Video ID: ${videoId}
- Title: ${metadata.title}
- Channel: ${metadata.channelTitle}

FULL VIDEO TRANSCRIPT:
${transcript}

CRITICAL ANALYSIS REQUIREMENTS:
1. **Extract Specific Statements**: Quote 5-10 specific statements from the transcript verbatim
2. **Detailed Rebuttal**: For each anti-SDA statement:
   - Provide 4-6 biblical references with full context
   - Explain the Greek/Hebrew meaning where relevant
   - Show how SDA interpretation is consistent with broader Scripture
   - Address the underlying theological error
   - Anticipate counter-arguments and pre-empt them
   - Cite Ellen White where she addresses this topic
3. **Logical Analysis**: Identify every logical fallacy with specific examples from the transcript
4. **Comprehensive Defense**: For each SDA doctrine attacked:
   - Provide multiple layers of biblical evidence
   - Show historical development of the doctrine
   - Address common misunderstandings
   - Connect to the Great Controversy theme
5. **Practical Application**: Help SDA believers understand how to respond to these specific claims

Make this analysis EXTREMELY THOROUGH and DEEPLY BIBLICAL. This should be a masterclass in SDA apologetics.`;
    } else {
      // No transcript - use metadata analysis but still be thorough
      userPrompt = `Analyze this YouTube video and provide ROBUST SDA apologetic analysis:

VIDEO INFORMATION:
- URL: ${videoUrl}
- Video ID: ${videoId}
- Title: ${metadata.title}
- Channel: ${metadata.channelTitle}

ANALYSIS REQUIREMENTS (without transcript):
1. Research this channel's known positions on SDA theology
2. Analyze the video title to determine specific doctrines likely addressed
3. Provide DETAILED defense of SDA doctrines likely challenged, including:
   - 5-7 biblical references per doctrine
   - Greek/Hebrew word studies where relevant
   - Historical context of the doctrine
   - Common criticisms and how to answer them
   - Ellen White's perspective on the topic
4. Anticipate specific arguments likely made based on the title/channel
5. Provide comprehensive biblical rebuttals to those anticipated arguments
6. Include practical guidance for SDA believers encountering these arguments

Even without the transcript, make this analysis EXTREMELY DETAILED and BIBLICALLY ROBUST.`;
    }

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
