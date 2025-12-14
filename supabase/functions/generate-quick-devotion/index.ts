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
    const { theme } = await req.json();

    if (!theme) {
      return new Response(
        JSON.stringify({ error: "Theme is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    console.log(`Generating Phototheology devotion for theme: ${theme}`);

    const systemPrompt = `You are Jeeves, a Phototheology devotional writer. Create Christ-centered, biblically grounded devotionals that are:
- Fresh, imaginative, and spiritually piercing
- Adventist in theology (sanctuary-shaped, Great Controversy aware)
- Free from clichés and shallow moralism
- Revealing hidden connections in Scripture

CRITICAL REQUIREMENT: Each major content section (christ_connection, application, memory_hook, prayer) MUST be 3-5 FULL PARAGRAPHS. Not sentences - PARAGRAPHS. Each paragraph should be 3-4 sentences with deep theological insight and vivid imagery.`;

    const userPrompt = `Create a rich Phototheology devotion on: "${theme}"

ABSOLUTE REQUIREMENT: Each content field MUST contain 3-5 PARAGRAPHS (not sentences). Separate paragraphs with blank lines.

FIELD REQUIREMENTS:
1. title: An evocative, non-generic title that intrigues
2. scripture_reference: Book Chapter:Verse(s) - e.g., "Psalm 46:10"
3. scripture_text: The FULL KJV text of 3-5 verses
4. christ_connection: 3-5 PARAGRAPHS (each 3-4 sentences) explaining how Christ is specifically revealed in this text. Show Christological depth across multiple angles - His work, character, mission, typology, and fulfillment.
5. application: 3-5 PARAGRAPHS (each 3-4 sentences) with practical, heart-transforming application. Address different life situations, provide specific guidance, and connect to real struggles with real wisdom.
6. memory_hook: 3-5 PARAGRAPHS (each 3-4 sentences) building an extended metaphor or mental image. Paint a vivid scene with sensory details, then draw out multiple spiritual parallels.
7. prayer: 3-5 PARAGRAPHS (each 3-4 sentences) of heartfelt, text-specific prayer. Each paragraph should address a different aspect of the devotion's truth.

EXAMPLE of proper paragraph structure for christ_connection:
"In this passage, we see Christ as the ultimate source of peace that transcends all earthly circumstances. The stillness He commands is not mere passivity, but the confident rest of one who knows the Father holds all things together. This is the same peace Jesus embodied when He slept through the storm on Galilee.

Consider how the sanctuary language echoes here - the holy calm of the Most Holy Place where God's presence dwells. Christ, as our High Priest, invites us into that sacred stillness, covering us with His righteousness. The veil is torn; the way is open.

Furthermore, this text points forward to the ultimate 'stillness' of the grave that Christ entered on our behalf. He descended into death's chaos so that we might know eternal rest. His resurrection proves that no storm - not even death itself - can overcome the one who trusts in Him.

The Great Controversy theme emerges powerfully here. While Satan rages and kingdoms fall, God's throne remains unshaken. Christ's victory at Calvary ensures that those who are 'still' in Him will share in His ultimate triumph when He comes again."

EVERY content field must follow this multi-paragraph pattern. Do NOT give brief responses.`;

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
              description: "Create a structured Phototheology devotional with substantial, multi-sentence content in each field",
              parameters: {
                type: "object",
                properties: {
                  title: { 
                    type: "string", 
                    description: "Evocative, non-generic title that intrigues" 
                  },
                  scripture_reference: { 
                    type: "string", 
                    description: "Book Chapter:Verse(s) format" 
                  },
                  scripture_text: { 
                    type: "string", 
                    description: "Full KJV text of 2-4 verses" 
                  },
                  christ_connection: { 
                    type: "string", 
                    description: "3-5 PARAGRAPHS (each 3-4 sentences) explaining how Christ is revealed in this text with deep theological insight from multiple angles" 
                  },
                  application: { 
                    type: "string", 
                    description: "3-5 PARAGRAPHS (each 3-4 sentences) of practical, heart-transforming application addressing different life situations" 
                  },
                  prayer: { 
                    type: "string", 
                    description: "3-5 PARAGRAPHS (each 3-4 sentences) of heartfelt, text-specific prayer addressing different aspects of the truth" 
                  },
                  memory_hook: { 
                    type: "string", 
                    description: "3-5 PARAGRAPHS (each 3-4 sentences) building an extended metaphor with vivid sensory details and spiritual parallels" 
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
