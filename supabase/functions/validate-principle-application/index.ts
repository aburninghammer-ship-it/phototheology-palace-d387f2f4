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
    const { verse, verseReference, principle, principleDescription, userAnswer } = await req.json();
    
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const systemPrompt = `You are a Phototheology expert helping students learn to apply biblical study principles to Scripture.

Your task: Evaluate if the student correctly applied the given principle to the verse.

Guidelines:
- Be encouraging but accurate
- Look for thoughtful engagement with the text
- The answer doesn't need to be perfect, but should show understanding
- Consider the principle's purpose and whether the student addressed it
- Provide constructive feedback

Respond with JSON:
{
  "isCorrect": boolean,
  "feedback": "Brief encouraging feedback (1-2 sentences)"
}`;

    const userPrompt = `VERSE: "${verse}" (${verseReference})

PRINCIPLE TO APPLY: ${principle}
DESCRIPTION: ${principleDescription}

STUDENT'S ANSWER:
${userAnswer}

Did the student correctly apply this principle to the verse? Evaluate and respond in JSON format.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        tools: [{
          type: "function",
          function: {
            name: "evaluate_answer",
            description: "Evaluate if the student correctly applied the principle",
            parameters: {
              type: "object",
              properties: {
                isCorrect: {
                  type: "boolean",
                  description: "Whether the student's answer demonstrates correct application of the principle"
                },
                feedback: {
                  type: "string",
                  description: "Encouraging feedback about their answer (1-2 sentences)"
                }
              },
              required: ["isCorrect", "feedback"],
              additionalProperties: false
            }
          }
        }],
        tool_choice: { type: "function", function: { name: "evaluate_answer" } }
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
          JSON.stringify({ error: "AI service unavailable. Please contact support." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error("AI validation failed");
    }

    const data = await response.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    
    if (!toolCall) {
      throw new Error("No tool call in AI response");
    }

    const evaluation = JSON.parse(toolCall.function.arguments);

    return new Response(
      JSON.stringify(evaluation),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in validate-principle-application:", error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : "Unknown error occurred",
        isCorrect: false,
        feedback: "Sorry, there was an error validating your answer. Please try again."
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
