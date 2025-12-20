import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { mode, verse1, verse2, userAnswer, difficulty } = await req.json();
    
    console.log("Bible freestyle request:", { mode, verse1, verse2, difficulty });
    
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    let systemPrompt = `You are Jeeves, a master Bible scholar specializing in "Verse Genetics"—the study of how every verse in Scripture is related to every other verse. 

Your expertise covers:
- Direct family (siblings): Verses that share the same theme, imagery, or doctrine
- Cousins: Verses connected through typology, parallel structure, or prophetic fulfillment  
- Distant relatives: Verses linked through subtle patterns, numbers, sanctuary imagery, or Christ-centered connections

Always be Christ-centered in your analysis. Look for:
- Typological connections (OT foreshadowing NT)
- Thematic parallels (same doctrine, different context)
- Verbal links (same Hebrew/Greek words or concepts)
- Structural patterns (chiasms, parallel narratives)
- Prophetic fulfillment chains
- Sanctuary/covenant connections`;

    let userPrompt = "";
    let responseFormat: any = null;

    if (mode === "test_jeeves") {
      // User provides two verses, Jeeves shows the connection
      userPrompt = `Analyze the genetic connection between these two verses:

VERSE 1: ${verse1}
VERSE 2: ${verse2}

Provide a rich analysis that includes:
1. The TYPE of relationship (siblings, cousins, distant relatives)
2. The SPECIFIC connection (theme, type, prophecy, pattern, etc.)
3. How CHRIST is central to this connection
4. At least 2 other "family members" (related verses) that share this connection

Format your response with clear sections and make it engaging and educational.`;
    } 
    else if (mode === "generate_challenge") {
      // Generate two verses for the user to connect
      const difficultyLevel = difficulty || 1;
      
      const difficultyGuide = {
        1: "Choose two verses with an OBVIOUS thematic connection (e.g., both about God's love, both about salvation). Use well-known verses.",
        2: "Choose verses with a CLEAR typological connection (e.g., OT type and NT antitype). One can be less familiar.",
        3: "Choose verses with a MODERATE connection requiring some thought (parallel structure, related imagery, connected doctrine). Mix of familiar and less common.",
        4: "Choose verses with a SUBTLE connection (verbal links, numerical patterns, chiastic parallels). Can include less familiar passages.",
        5: "Choose verses with a DEEP, MASTERFUL connection that requires advanced Bible knowledge (sanctuary typology, prophetic chains, hidden patterns)."
      };

      userPrompt = `Generate a Verse Genetics challenge at difficulty level ${difficultyLevel}/5.

DIFFICULTY GUIDE: ${difficultyGuide[difficultyLevel as keyof typeof difficultyGuide]}

You must return a JSON object with this exact structure:
{
  "verse1": {
    "reference": "Book Chapter:Verse",
    "text": "The verse text (KJV preferred)"
  },
  "verse2": {
    "reference": "Book Chapter:Verse", 
    "text": "The verse text (KJV preferred)"
  },
  "hint": "A subtle hint about the type of connection without giving away the answer",
  "connection": "The full explanation of their genetic connection (keep this for evaluation)"
}

Make sure the verses have a real, meaningful connection that demonstrates verse genetics.`;

      responseFormat = {
        type: "json_object"
      };
    }
    else if (mode === "evaluate_answer") {
      // Evaluate user's connection answer
      userPrompt = `Evaluate this Verse Genetics answer:

VERSE 1: ${verse1.reference} - "${verse1.text}"
VERSE 2: ${verse2.reference} - "${verse2.text}"
DIFFICULTY: ${difficulty}/5

USER'S ANSWER: "${userAnswer}"

Score the answer (0-100) based on:
- ACCURACY (0-25): Did they identify a real, valid connection?
- DEPTH (0-25): How thorough and insightful is the connection?
- CREATIVITY (0-25): Did they find unique or multiple angles?
- CHRIST-CENTEREDNESS (0-25): Did they connect it to Christ?

Return a JSON object:
{
  "score": <total 0-100>,
  "breakdown": {
    "accuracy": <0-25>,
    "depth": <0-25>,
    "creativity": <0-25>,
    "christCenteredness": <0-25>
  },
  "feedback": "Brief feedback on what they got right and what they missed",
  "correctConnection": "The master-level connection explanation",
  "relatedVerses": ["Other verses in this family", "Up to 3 more"]
}`;

      responseFormat = {
        type: "json_object"
      };
    }

    const requestBody: any = {
      model: "google/gemini-2.5-flash",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      temperature: 0.7,
      max_tokens: 2000
    };

    if (responseFormat) {
      requestBody.response_format = responseFormat;
    }

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI API error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }), {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Service temporarily unavailable. Please try again later." }), {
          status: 402,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      
      throw new Error(`AI API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error("No response from AI");
    }

    console.log("AI response received for mode:", mode);

    // Parse response based on mode
    if (mode === "test_jeeves") {
      return new Response(JSON.stringify({ connection: content }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    } 
    else if (mode === "generate_challenge" || mode === "evaluate_answer") {
      try {
        // Try to parse as JSON
        let jsonContent = content;
        
        // Handle markdown code blocks
        if (content.includes('```json')) {
          const match = content.match(/```json\s*([\s\S]*?)\s*```/);
          if (match) jsonContent = match[1];
        } else if (content.includes('```')) {
          const match = content.match(/```\s*([\s\S]*?)\s*```/);
          if (match) jsonContent = match[1];
        }
        
        const parsed = JSON.parse(jsonContent);
        return new Response(JSON.stringify(parsed), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      } catch (parseError) {
        console.error("JSON parse error:", parseError, "Content:", content);
        throw new Error("Failed to parse AI response as JSON");
      }
    }

    return new Response(JSON.stringify({ error: "Unknown mode" }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error("Bible freestyle error:", error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : "Unknown error" 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
