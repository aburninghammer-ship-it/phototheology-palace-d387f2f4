import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { theme, recipientName, situation, struggles, relationship, depth = "standard", writingStyle = "mixed-audience" } = await req.json();

    if (!theme) {
      return new Response(
        JSON.stringify({ error: "Theme is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Build personalization context
    const hasPersonalization = recipientName || situation || struggles;
    const personalizationContext = hasPersonalization ? `
PERSONALIZATION (USE THROUGHOUT):
- Recipient's name: ${recipientName || "the reader"}
- Their relationship to sender: ${relationship || "friend"}
- Their current situation: ${situation || "not specified"}
- Their struggles: ${Array.isArray(struggles) ? struggles.join(", ") : struggles || "not specified"}

CRITICAL: Address ${recipientName || "the reader"} by name at least 2-3 times naturally woven into the devotional. Connect the biblical truth directly to their specific situation and struggles. Make them feel seen and known.` : "";

    // Depth configuration
    const depthConfig = {
      light: { paragraphs: "2-3", sentences: "3-4", readTime: "2-3 minutes" },
      standard: { paragraphs: "4-5", sentences: "4-6", readTime: "4-5 minutes" },
      deep: { paragraphs: "6-8", sentences: "5-7", readTime: "6-8 minutes" }
    };
    const selectedDepth = depthConfig[depth as keyof typeof depthConfig] || depthConfig.standard;

    // Writing style prompts
    const writingStylePrompts: Record<string, string> = {
      "mixed-audience": `
WRITING STYLE: MIXED AUDIENCE (Teens & Adults Together)
- Write at an 8th–10th grade reading level
- Use everyday, spoken English - no academic, poetic, or scholarly wording
- Avoid abstract or intellectual language
- Sound like a calm, trusted mentor speaking personally
- Clear, honest, grounded - not preachy, not dramatic, not casual slang
- Warm without hype - avoid religious jargon unless commonly understood
- Introduce Scripture naturally and briefly - prefer short verses
- Address real life: pressure, loneliness, doubt, purpose, failure, hope
- Use examples that work for both teens and adults
- No childish illustrations, no abstract theology
- Speak to the heart through clarity, not complexity

STRUCTURE:
1. Start with a relatable human experience
2. Connect it clearly to Scripture
3. Explain the meaning in plain terms
4. End with encouragement, hope, or a simple next step

AVOID: Lofty language, church clichés, over-explaining doctrine, emotional manipulation

CHECK: Would this make sense to a teenager? Would an adult feel respected? Would it sound natural read aloud?`,
      
      "pastoral": `
WRITING STYLE: PASTORAL
- Warm, shepherding tone with theological depth
- Speak as a seasoned minister offering wisdom
- Balance comfort with challenge
- Use rich biblical imagery and cross-references
- Appropriate for sermons, church settings, and mature believers
- Draw from the full counsel of Scripture`,
      
      "academic": `
WRITING STYLE: ACADEMIC
- Theologically precise and structurally sophisticated
- Use proper theological terminology with brief explanations
- Make connections across biblical genres and historical contexts
- Suitable for study groups, seminary students, teachers
- Include original language insights where helpful
- Maintain devotional warmth despite academic rigor`,
      
      "youth": `
WRITING STYLE: YOUTH-FOCUSED
- Write at a 6th-8th grade level
- Use relatable, current examples (school, friendships, family, identity)
- Short sentences, active voice
- Conversational but not condescending
- Address real teen struggles: belonging, purpose, peer pressure, doubt
- Make Scripture feel relevant and alive
- End with concrete, achievable action steps`
    };
    const selectedStyle = writingStylePrompts[writingStyle] || writingStylePrompts["mixed-audience"];

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    console.log(`Generating devotion - theme: ${theme}, depth: ${depth}, style: ${writingStyle}`);

    const systemPrompt = `You are a master of biblical theology writing PERSONALIZED devotionals that are:
- Theologically rich and structurally intelligent
- Never sentimental or emotionally vague
- Revealing unexpected connections between passages
- Moving from text → meaning → personal application
- Adventist in theology (sanctuary-shaped, Great Controversy aware)
- DEEPLY PERSONALIZED when recipient information is provided

${selectedStyle}

DESIGN GOAL: The devotional must leave the reader thinking and challenged. Never explain how you're making connections — let the insight emerge naturally.

PERSONALIZATION REQUIREMENT: When a recipient's name and situation are provided, you MUST:
- Use their name naturally 2-3 times throughout
- Connect the biblical truth directly to their specific struggles
- Make the application feel written specifically for their life

QUALITY CONTROL:
- Could this exist on a generic devotional app? If yes, write something more personal.
- Does it rely on vague encouragement? If yes, make it more specific.
- It must feel discovered rather than manufactured.`;

    const userPrompt = `Write a ${selectedDepth.paragraphs} paragraph devotional on the theme: "${theme}"
${personalizationContext}

LENGTH: ${selectedDepth.readTime} read time. Each paragraph should be ${selectedDepth.sentences} sentences.

STRUCTURE REQUIREMENTS:
• Use 2-3 Scripture passages that connect meaningfully
• Let the insight emerge naturally through the writing
• Begin with something relatable or a tension
• Deepen with Scripture that illuminates the theme
• Lead toward practical self-examination
• Conclude with a clear call to action or reflection`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "create_devotion",
              description: "Create a devotional that connects Scripture to real life",
              parameters: {
                type: "object",
                properties: {
                  title: { 
                    type: "string", 
                    description: "Clear, engaging title that hints at the theme" 
                  },
                  scripture_reference: { 
                    type: "string", 
                    description: "Primary Scripture reference (Book Chapter:Verse)" 
                  },
                  scripture_text: { 
                    type: "string", 
                    description: "Full text of the primary passage (2-4 verses)" 
                  },
                  christ_connection: { 
                    type: "string", 
                    description: `${selectedDepth.paragraphs} paragraphs (each ${selectedDepth.sentences} sentences) connecting Scripture passages to reveal truth. Begin with relatable experience, connect to Scripture, explain meaning plainly, lead to reflection.` 
                  },
                  application: { 
                    type: "string", 
                    description: "2-3 paragraphs of practical application. What should the reader notice, consider, or do differently?" 
                  },
                  prayer: { 
                    type: "string", 
                    description: "1-2 paragraphs of honest, personal prayer that connects to the devotional theme." 
                  },
                  memory_hook: { 
                    type: "string", 
                    description: "1 paragraph with a memorable image or phrase that captures the devotional's core truth." 
                  },
                },
                required: ["title", "scripture_reference", "scripture_text", "christ_connection", "application", "prayer", "memory_hook"],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "create_devotion" } },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI API error:", response.status, errorText);
      
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
      
      throw new Error(`AI API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log("AI response received");
    
    // Extract from tool call
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall?.function?.arguments) {
      // Fallback to content parsing if tool call not present
      const content = data.choices?.[0]?.message?.content;
      if (content) {
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const devotion = JSON.parse(jsonMatch[0]);
          console.log("Successfully generated devotion (from content):", devotion.title);
          return new Response(JSON.stringify(devotion), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
      }
      throw new Error("No valid response from AI");
    }

    const devotion = JSON.parse(toolCall.function.arguments);
    console.log("Successfully generated devotion:", devotion.title);

    return new Response(JSON.stringify(devotion), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in generate-quick-devotion:", error);
    const errorMessage = error instanceof Error ? error.message : "Failed to generate devotion";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
