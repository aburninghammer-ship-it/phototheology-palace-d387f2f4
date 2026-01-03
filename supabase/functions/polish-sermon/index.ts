import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SYSTEM_PROMPT = `You are a Sermon Coach trained in PhotoTheology principles and classical homiletics.

Your role is NOT to rewrite the sermon.
Your role is to REVEAL what's already there and what COULD be there.

ANALYSIS FRAMEWORK:

1. AMPLIFY - Find gems the preacher planted but didn't polish:
   - Phrases with deeper meaning than they realized
   - Scripture connections they touched but didn't develop
   - Typological threads they started but didn't complete

2. DISCOVER - Surface missed opportunities:
   - Christ connections they may not have seen
   - Sanctuary patterns relevant to their text
   - Prophetic frameworks that could deepen the message
   - "Three Heavens" applications if appropriate

3. TIGHTEN - Identify structural improvements:
   - Redundancies to cut
   - Transitions to smooth
   - Points to sharpen
   - Illustrations that compete with the text

4. ARC - Analyze emotional and theological flow:
   - Where is the current climax?
   - Is the "Oh Wow" moment positioned correctly?
   - Does the buildup earn the payoff?

TONE: Coach, not critic. Encouraging, not condescending.
Every suggestion should feel like a gift, not a correction.

You MUST return a valid JSON object with this exact structure:
{
  "snapshot": {
    "structureScore": 0-100,
    "structureNote": "brief assessment",
    "scriptureDensity": 0-100,
    "scriptureDensityNote": "brief assessment",
    "christConnection": 0-100,
    "christConnectionNote": "brief assessment",
    "applicationClarity": 0-100,
    "applicationClarityNote": "brief assessment",
    "emotionalArc": 0-100,
    "emotionalArcNote": "brief assessment",
    "estimatedLength": "~X minutes",
    "pointCount": "description of structure",
    "scriptureReferences": number
  },
  "amplify": [
    {
      "quote": "phrase from their sermon",
      "insight": "what deeper meaning exists",
      "suggestion": "how to amplify it"
    }
  ],
  "missed": {
    "typological": ["connection 1", "connection 2"],
    "sanctuary": ["pattern 1", "pattern 2"],
    "prophetic": ["framework 1"],
    "threeHeavens": ["application 1"]
  },
  "tighten": {
    "cut": ["suggestion 1"],
    "clarify": ["suggestion 1"],
    "strengthen": ["suggestion 1"]
  },
  "arc": {
    "currentFlow": "description of current emotional flow",
    "issue": "main issue with the arc",
    "suggestedFix": "how to improve",
    "climaxPosition": "where the climax currently is"
  },
  "ptEnhancement": {
    "currentDimensions": ["dimension used 1", "dimension used 2"],
    "missingDimensions": ["dimension missing 1"],
    "suggestions": {
      "observationRoom": ["note 1"],
      "concentrationRoom": ["connection 1"],
      "symbolsRoom": ["symbol 1"],
      "sanctuaryRoom": ["pattern 1"],
      "fireRoom": ["moment 1"]
    }
  },
  "checklist": {
    "structure": ["item 1", "item 2"],
    "content": ["item 1", "item 2"],
    "delivery": ["item 1", "item 2"],
    "spiritual": ["item 1", "item 2"]
  }
}`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { sermonText, mainText, centralTheme, analysisDepth } = await req.json();

    if (!sermonText || sermonText.length < 50) {
      return new Response(
        JSON.stringify({ error: "Please provide a sermon with at least 50 characters" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Adjust prompt based on analysis depth
    let depthInstruction = "";
    switch (analysisDepth) {
      case "quick":
        depthInstruction = "Provide a QUICK analysis. Focus on the top 2-3 insights in each category. Keep it brief and actionable.";
        break;
      case "full":
        depthInstruction = "Provide a COMPREHENSIVE PhotoTheology analysis. Go deep into typology, sanctuary patterns, prophetic frameworks, and all PT dimensions. Leave no stone unturned.";
        break;
      default: // deep
        depthInstruction = "Provide a thorough analysis covering all categories with meaningful depth. Balance comprehensiveness with clarity.";
    }

    const userPrompt = `Analyze this sermon draft and provide coaching feedback.

MAIN TEXT: ${mainText || "Not specified"}
CENTRAL THEME: ${centralTheme || "Not specified"}

ANALYSIS DEPTH: ${depthInstruction}

SERMON DRAFT:
"""
${sermonText}
"""

Remember: Be a coach, not a critic. Celebrate what's working before suggesting improvements. Every suggestion should feel like a gift.

Return ONLY the JSON object as specified in your instructions, no other text.`;

    console.log("Calling Lovable AI Gateway for sermon polish...");
    console.log("Sermon length:", sermonText.length, "characters");
    console.log("Analysis depth:", analysisDepth);

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userPrompt },
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI Gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please add credits to continue." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error("No content in AI response");
    }

    console.log("Received AI response, parsing JSON...");

    // Clean and parse JSON with robust handling
    let cleanContent = content.trim();
    
    // Remove markdown code blocks
    if (cleanContent.startsWith("```json")) {
      cleanContent = cleanContent.slice(7);
    } else if (cleanContent.startsWith("```")) {
      cleanContent = cleanContent.slice(3);
    }
    if (cleanContent.endsWith("```")) {
      cleanContent = cleanContent.slice(0, -3);
    }
    cleanContent = cleanContent.trim();

    // Try to find JSON object boundaries if parsing fails
    let analysis;
    try {
      analysis = JSON.parse(cleanContent);
    } catch (parseError) {
      console.log("Initial parse failed, attempting to extract JSON object...");
      
      // Find the first { and last } to extract just the JSON object
      const firstBrace = cleanContent.indexOf('{');
      const lastBrace = cleanContent.lastIndexOf('}');
      
      if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
        const jsonSubstring = cleanContent.substring(firstBrace, lastBrace + 1);
        try {
          analysis = JSON.parse(jsonSubstring);
        } catch (secondParseError) {
          console.error("JSON extraction also failed:", secondParseError);
          // Return a basic fallback response
          analysis = {
            snapshot: {
              structureScore: 70,
              structureNote: "Analysis parsing encountered an issue. Please try again.",
              scriptureDensity: 70,
              scriptureDensityNote: "Unable to fully analyze.",
              christConnection: 70,
              christConnectionNote: "Please retry analysis.",
              applicationClarity: 70,
              applicationClarityNote: "Retry recommended.",
              emotionalArc: 70,
              emotionalArcNote: "Analysis incomplete.",
              estimatedLength: "Unknown",
              pointCount: "Unable to determine",
              scriptureReferences: 0
            },
            amplify: [],
            missed: { typological: [], sanctuary: [], prophetic: [], threeHeavens: [] },
            tighten: { cut: [], clarify: [], strengthen: [] },
            arc: { currentFlow: "Analysis incomplete", issue: "Please retry", suggestedFix: "Try again", climaxPosition: "Unknown" },
            ptEnhancement: { currentDimensions: [], missingDimensions: [], suggestions: { observationRoom: [], concentrationRoom: [], symbolsRoom: [], sanctuaryRoom: [], fireRoom: [] } },
            checklist: { structure: ["Retry analysis"], content: [], delivery: [], spiritual: [] }
          };
        }
      } else {
        throw new Error("Could not find valid JSON in AI response");
      }
    }

    console.log("Successfully parsed sermon analysis");

    return new Response(JSON.stringify(analysis), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Error in polish-sermon function:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Failed to analyze sermon" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
