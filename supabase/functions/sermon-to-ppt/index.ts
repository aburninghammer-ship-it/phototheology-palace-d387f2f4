import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SYSTEM_PROMPT = `You are a professional sermon presentation designer for Phototheology. Your task is to create a structured PowerPoint slide deck from sermon content.

## OUTPUT FORMAT
Return ONLY valid JSON matching this exact schema:
{
  "metadata": {
    "sermonTitle": "string",
    "preacher": "string (optional)",
    "date": "string (optional)", 
    "church": "string (optional)",
    "themePassage": "string (optional)",
    "bibleVersion": "KJV"
  },
  "slides": [
    {
      "type": "TITLE|BIG_IDEA|SCRIPTURE|MAIN_POINT|ILLUSTRATION|GOSPEL_CENTER|APPLICATION|APPEAL|DISCUSSION|TRANSITION|QUOTE|QUESTION|RECAP|BLANK",
      "title": "string (optional)",
      "subtitle": "string (optional)",
      "body": "string (optional)",
      "scripture": {
        "reference": "string",
        "text": "string",
        "version": "string"
      },
      "bullets": ["string array (optional)"],
      "quote": {
        "text": "string",
        "attribution": "string (optional)"
      },
      "speakerNotes": "string (optional)"
    }
  ]
}

## SLIDE TYPE GUIDELINES

1. **TITLE** - Opening slide with sermon title and theme passage
2. **BIG_IDEA** - The central message in one memorable sentence
3. **SCRIPTURE** - Full scripture passages with reference
4. **MAIN_POINT** - Key teaching points (use for "Smooth Stones")
5. **ILLUSTRATION** - Stories or examples
6. **GOSPEL_CENTER** - Christ-centered application
7. **APPLICATION** - Practical takeaways
8. **APPEAL** - Call to action/invitation
9. **DISCUSSION** - Questions for reflection
10. **TRANSITION** - Brief transitional text between sections
11. **QUOTE** - Notable quotations
12. **QUESTION** - Rhetorical or discussion questions
13. **RECAP** - Summary points
14. **BLANK** - Minimal content for emphasis/pause

## DESIGN PRINCIPLES

1. **One idea per slide** - Never overcrowd
2. **Scripture gets its own slide** - Always isolate key passages
3. **Use bullets sparingly** - Max 4-5 per slide
4. **Speaker notes are essential** - Include context for the presenter
5. **Flow matters** - Create natural progression
6. **Less text = more impact** - Summarize, don't transcribe

## SLIDE COUNT GUIDELINES

- "minimal": 8-12 slides (key points only)
- "standard": 15-20 slides (balanced coverage)
- "expanded": 25-35 slides (detailed breakdown)

## MODE-SPECIFIC INSTRUCTIONS

### Full Sermon Mode
- Extract the "movie structure" (opening, climax, resolution, call to action)
- Each "Smooth Stone" becomes a MAIN_POINT slide
- Bridges become TRANSITION or ILLUSTRATION slides
- Include APPLICATION and APPEAL slides

### Verses Only Mode
- Create a thematic scripture study
- Each verse gets a SCRIPTURE slide
- Add connecting TRANSITION slides
- Include a BIG_IDEA synthesis slide
- End with APPLICATION

## AUDIENCE ADAPTATION

- "seeker": Simpler language, more context, relatable examples
- "believer": Deeper theology, more cross-references
- "mixed": Balance accessibility with depth`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const { mode, sermonData, verses, settings } = body;

    console.log("[sermon-to-ppt] Processing request:", { mode, settings });

    let userPrompt = "";

    if (mode === "full-sermon" && sermonData) {
      userPrompt = `Generate a PowerPoint slide deck for this sermon:

**Title:** ${sermonData.title}
**Theme Passage:** ${sermonData.themePassage}
**Style:** ${sermonData.sermonStyle}

**Smooth Stones (Key Points):**
${sermonData.smoothStones?.map((s: string, i: number) => `${i + 1}. ${s.replace(/<[^>]*>/g, '')}`).join('\n') || 'None provided'}

**Bridges (Transitions):**
${sermonData.bridges?.map((b: string, i: number) => `${i + 1}. ${b.replace(/<[^>]*>/g, '')}`).join('\n') || 'None provided'}

**Movie Structure:**
- Opening Hook: ${sermonData.movieStructure?.opening || 'Not specified'}
- Climax: ${sermonData.movieStructure?.climax || 'Not specified'}
- Resolution: ${sermonData.movieStructure?.resolution || 'Not specified'}
- Call to Action: ${sermonData.movieStructure?.call_to_action || 'Not specified'}

${sermonData.fullSermon ? `**Full Sermon Text:**\n${sermonData.fullSermon.substring(0, 4000)}` : ''}

**Settings:**
- Slide Count: ${settings.slideCount}
- Bible Version: ${settings.bibleVersion}
- Audience: ${settings.audienceType}`;
    } else if (mode === "verses-only" && verses) {
      userPrompt = `Generate a Scripture-focused PowerPoint presentation for these verses:

**Verses:**
${verses.join('\n')}

**Settings:**
- Slide Count: ${settings.slideCount}
- Bible Version: ${settings.bibleVersion}
- Audience: ${settings.audienceType}

Create a thematic flow connecting these passages, with a unifying BIG_IDEA.`;
    } else {
      throw new Error("Invalid mode or missing data");
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY not configured");
    }

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
        temperature: 0.7,
        max_tokens: 8000,
      }),
    });

    if (!response.ok) {
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
      const errorText = await response.text();
      console.error("[sermon-to-ppt] AI error:", response.status, errorText);
      throw new Error(`AI request failed: ${response.status}`);
    }

    const data = await response.json();
    let content = data.choices?.[0]?.message?.content || "";

    // Extract JSON from response (handle markdown code blocks)
    const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (jsonMatch) {
      content = jsonMatch[1].trim();
    }

    // Parse and validate
    let slideDeck;
    try {
      slideDeck = JSON.parse(content);
    } catch (parseError) {
      console.error("[sermon-to-ppt] JSON parse error:", parseError);
      console.error("[sermon-to-ppt] Raw content:", content.substring(0, 500));
      throw new Error("Failed to parse AI response as JSON");
    }

    // Add theme and venue from settings
    slideDeck.theme = settings.theme;
    slideDeck.venue = settings.venue;

    console.log("[sermon-to-ppt] Generated", slideDeck.slides?.length || 0, "slides");

    return new Response(JSON.stringify(slideDeck), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("[sermon-to-ppt] Error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
