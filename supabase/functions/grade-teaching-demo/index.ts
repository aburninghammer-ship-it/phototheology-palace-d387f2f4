import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { roomId, roomName, floorNumber, explanation } = await req.json();

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      {
        global: {
          headers: { Authorization: req.headers.get("Authorization")! },
        },
      }
    );

    const {
      data: { user },
    } = await supabaseClient.auth.getUser();
    if (!user) throw new Error("Not authenticated");

    // Call Lovable AI for grading
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const gradingPrompt = `You are grading a student's teaching demonstration for the "${roomName}" room (Floor ${floorNumber}) in the Phototheology Palace system.

The student must demonstrate understanding by explaining:
1. Purpose: What is this room for?
2. Principles: What core concepts does it teach?
3. Practice: How do you practice this principle?
4. Mastery: How do you know you've mastered it?

Student's Explanation:
"""
${explanation}
"""

Grade this explanation on the following criteria (0-25 points each):
- Clarity: Is it well-explained and easy to understand?
- Accuracy: Does it correctly represent Phototheology principles?
- Application: Does it show practical understanding?
- Understanding: Does it demonstrate genuine comprehension vs. memorization?

Provide:
1. Score for each criterion (0-25)
2. Total score (0-100)
3. Pass/Fail (80+ = pass)
4. Constructive feedback (2-3 sentences)

Use the provided tool to return the structured grade.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "system",
            content: "You are an expert Phototheology instructor grading teaching demonstrations. Be fair but thorough.",
          },
          { role: "user", content: gradingPrompt },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "submit_grade",
              description: "Submit the final grade for the teaching demonstration",
              parameters: {
                type: "object",
                properties: {
                  clarity: { type: "number", minimum: 0, maximum: 25 },
                  accuracy: { type: "number", minimum: 0, maximum: 25 },
                  application: { type: "number", minimum: 0, maximum: 25 },
                  understanding: { type: "number", minimum: 0, maximum: 25 },
                  feedback: { type: "string" },
                },
                required: ["clarity", "accuracy", "application", "understanding", "feedback"],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "submit_grade" } },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error("AI grading failed");
    }

    const aiResult = await response.json();
    const toolCall = aiResult.choices[0]?.message?.tool_calls?.[0];
    if (!toolCall) throw new Error("No grading result returned");

    const grade = JSON.parse(toolCall.function.arguments);
    const totalScore = grade.clarity + grade.accuracy + grade.application + grade.understanding;
    const passed = totalScore >= 80;

    // Store the assessment
    const { error: insertError } = await supabaseClient.from("mastery_assessments").insert({
      user_id: user.id,
      room_id: roomId,
      floor_number: floorNumber,
      assessment_type: "teaching_demonstration",
      content: { explanation },
      score: totalScore,
      passed,
      grading_feedback: {
        breakdown: {
          clarity: grade.clarity,
          accuracy: grade.accuracy,
          application: grade.application,
          understanding: grade.understanding,
        },
        feedback: grade.feedback,
      },
    });

    if (insertError) throw insertError;

    // If passed, update mastery level
    if (passed) {
      const { error: updateError } = await supabaseClient
        .from("room_mastery_levels")
        .update({ teaching_demonstration_completed_at: new Date().toISOString() })
        .eq("user_id", user.id)
        .eq("room_id", roomId)
        .eq("floor_number", floorNumber);

      if (updateError) console.error("Failed to update mastery level:", updateError);
    }

    return new Response(
      JSON.stringify({
        score: totalScore,
        passed,
        breakdown: {
          clarity: grade.clarity,
          accuracy: grade.accuracy,
          application: grade.application,
          understanding: grade.understanding,
        },
        feedback: grade.feedback,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Grade teaching demo error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
