import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.76.0';
import { Resend } from "https://esm.sh/resend@4.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

/**
 * Generate a single devotional day on-demand
 */
async function generateDevotionalDay(
  supabase: any,
  planId: string,
  dayNumber: number
): Promise<{ success: boolean; error?: string }> {
  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      return { success: false, error: "LOVABLE_API_KEY not configured" };
    }

    // Get plan details
    const { data: plan, error: planError } = await supabase
      .from('devotional_plans')
      .select('*')
      .eq('id', planId)
      .single();

    if (planError || !plan) {
      return { success: false, error: "Plan not found" };
    }

    // Get personalization info if this is for a devotional profile
    let personName = "";
    let primaryIssue = "";
    let issueDescription = "";

    const { data: profile } = await supabase
      .from('devotional_profiles')
      .select('name, primary_issue, issue_description')
      .eq('active_plan_id', planId)
      .single();

    if (profile) {
      personName = profile.name;
      primaryIssue = profile.primary_issue || "";
      issueDescription = profile.issue_description || "";
    }

    const forPersonNote = personName ? `\nThis devotional is written PERSONALLY for: ${personName}. Address ${personName} BY NAME at least 2-3 times throughout the devotional.` : "";
    const issueNote = primaryIssue ? `\nPRIMARY STRUGGLE: ${primaryIssue}${issueDescription ? ` - ${issueDescription}` : ""}` : "";

    const systemPrompt = `You are Jeeves, the Phototheology devotional writer. Write devotionals as 3-5 FLOWING PARAGRAPHS of continuous prose.

FORMAT: NO bullet points. NO section headers. NO labeled parts. Just essay-style reading.

${personName ? `CRITICAL PERSONALIZATION RULES:
- This devotional is for a SPECIFIC PERSON named ${personName}
- Address ${personName} BY NAME 2-3 times throughout (naturally woven in)
- Use their name at key moments: opening greeting, mid-devotional encouragement, closing charge
- Sound like a pastor writing a personal letter to ${personName}, not a generic template
- Example: "${personName}, consider how..." or "This is where you find yourself, ${personName}..."
- Their struggles become the ENTRY POINT to Christ's provision` : ""}

SAMPLE STYLE:
"At first glance, rest feels passive. Scripture seems to confirm it: 'Be still, and know that I am God.' Stillness sounds like absence—of effort, of struggle, of resistance. Yet when Israel was commanded to rest, it was not because nothing was happening, but because something sacred already was..."

Write 500-750 words of flowing, contemplative prose that:
- Uses 2-4 Scriptures woven naturally into the text
- Reveals unexpected connections
- Moves from observation → tension → illumination → call
- Ends with stillness or resolve, not hype`;

    const userPrompt = `Create day ${dayNumber} of a ${plan.duration}-day devotional on the theme: "${plan.theme}"
${forPersonNote}${issueNote}

Generate ONLY day ${dayNumber} as flowing paragraphs. This day should build on the journey so far while offering fresh insight.`;

    console.log(`Generating day ${dayNumber} for plan ${planId}...`);

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
              name: "create_devotional_days",
              description: "Return an array of devotional day objects.",
              parameters: {
                type: "object",
                properties: {
                  days: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        day_number: { type: "integer" },
                        title: { type: "string", description: "Evocative title (3-6 words)" },
                        scripture_reference: { type: "string", description: "Primary passage reference" },
                        devotional_text: { type: "string", description: "3-5 paragraph essay-style devotional (500-750 words). NO headers. NO bullet points." },
                        memory_hook: { type: "string", description: "One-line quotable insight" },
                      },
                      required: ["day_number", "title", "scripture_reference", "devotional_text", "memory_hook"],
                    },
                  },
                },
                required: ["days"],
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "create_devotional_days" } },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI API error:", response.status, errorText);
      return { success: false, error: `AI generation failed: ${response.status}` };
    }

    const data = await response.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    
    if (!toolCall?.function?.arguments) {
      return { success: false, error: "No tool call in response" };
    }

    const argsObj = JSON.parse(toolCall.function.arguments);
    const days = argsObj.days;

    if (!Array.isArray(days) || days.length === 0) {
      return { success: false, error: "No days in response" };
    }

    const day = days[0];
    
    // Insert the generated day with new essay-style format
    const { error: insertError } = await supabase
      .from('devotional_days')
      .insert({
        plan_id: planId,
        day_number: day.day_number || dayNumber,
        title: day.title,
        scripture_reference: day.scripture_reference,
        devotional_text: day.devotional_text,
        memory_hook: day.memory_hook,
        // Legacy fields for backwards compatibility
        scripture_text: "",
        christ_connection: day.devotional_text?.substring(0, 500) || "",
        application: "",
        prayer: "",
        challenge: "",
        journal_prompt: "",
      });

    if (insertError) {
      console.error("Insert error:", insertError);
      return { success: false, error: "Failed to save devotional day" };
    }

    console.log(`Day ${dayNumber} generated and saved for plan ${planId}`);
    return { success: true };
  } catch (error: any) {
    console.error("Error generating devotional day:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Daily Devotional Sender
 * 
 * This function:
 * 1. Finds all active devotional plans
 * 2. For each plan, checks which day should be unlocked based on started_at
 * 3. Generates the day's content if not already present
 * 4. Sends email with that day's content
 * 5. Creates in-app notification
 * 
 * Should be called daily via cron job at user's preferred time (default 6am)
 */

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
    const resendApiKey = Deno.env.get('RESEND_API_KEY');

    if (!resendApiKey) {
      throw new Error('RESEND_API_KEY not configured');
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const resend = new Resend(resendApiKey);

    const now = new Date();
    const today = now.toISOString().split('T')[0];

    console.log(`[${today}] Starting daily devotional delivery...`);

    // Get all active devotional plans with their users
    const { data: activePlans, error: plansError } = await supabase
      .from('devotional_plans')
      .select(`
        id,
        user_id,
        title,
        theme,
        duration,
        started_at,
        current_day
      `)
      .eq('status', 'active')
      .not('started_at', 'is', null);

    if (plansError) {
      console.error('Error fetching plans:', plansError);
      throw plansError;
    }

    console.log(`Found ${activePlans?.length || 0} active plans`);

    let emailsSent = 0;
    let notificationsCreated = 0;

    for (const plan of activePlans || []) {
      try {
        // Calculate which day number should be available today
        const startedAt = new Date(plan.started_at);
        const daysSinceStart = Math.floor((now.getTime() - startedAt.getTime()) / (1000 * 60 * 60 * 24));
        const currentDayNumber = Math.min(daysSinceStart + 1, plan.duration);

        console.log(`Plan ${plan.id}: Day ${currentDayNumber} of ${plan.duration}`);

        // Skip if plan is complete
        if (currentDayNumber > plan.duration) {
          console.log(`Plan ${plan.id} completed, skipping`);
          continue;
        }

        // Check if we already sent for THIS DAY NUMBER today (prevent duplicates)
        // Must check day_number in metadata to allow multiple days per calendar day
        const { data: existingNotif } = await supabase
          .from('notifications')
          .select('id, metadata')
          .eq('user_id', plan.user_id)
          .eq('type', 'daily_devotional')
          .gte('created_at', `${today}T00:00:00`)
          .limit(10);

        const alreadySentForThisDay = existingNotif?.some(n => {
          const meta = n.metadata as { plan_id?: string; day_number?: number } | null;
          return meta?.plan_id === plan.id && meta?.day_number === currentDayNumber;
        });

        if (alreadySentForThisDay) {
          console.log(`Already sent devotional for plan ${plan.id} day ${currentDayNumber} today, skipping`);
          continue;
        }

        // Get today's devotional day content
        let { data: dayContent, error: dayError } = await supabase
          .from('devotional_days')
          .select('*')
          .eq('plan_id', plan.id)
          .eq('day_number', currentDayNumber)
          .single();

        // If content doesn't exist yet, generate it on-demand
        if (dayError || !dayContent) {
          console.log(`No content for plan ${plan.id} day ${currentDayNumber}, generating...`);
          
          const generateResult = await generateDevotionalDay(supabase, plan.id, currentDayNumber);
          
          if (!generateResult.success) {
            console.error(`Failed to generate day ${currentDayNumber}:`, generateResult.error);
            continue;
          }
          
          // Fetch the newly generated content
          const { data: newDayContent, error: newDayError } = await supabase
            .from('devotional_days')
            .select('*')
            .eq('plan_id', plan.id)
            .eq('day_number', currentDayNumber)
            .single();
          
          if (newDayError || !newDayContent) {
            console.error(`Still no content after generation for plan ${plan.id} day ${currentDayNumber}`);
            continue;
          }
          
          dayContent = newDayContent;
        }

        // Get user email
        const { data: userData, error: userError } = await supabase.auth.admin.getUserById(plan.user_id);

        if (userError || !userData?.user?.email) {
          console.error(`No email for user ${plan.user_id}:`, userError);
          continue;
        }

        const userEmail = userData.user.email;

        // Get user profile for name
        const { data: profile } = await supabase
          .from('profiles')
          .select('display_name')
          .eq('id', plan.user_id)
          .single();

        const userName = profile?.display_name || 'Friend';

        // Get the devotional text - use new format if available, fall back to legacy
        const devotionalText = dayContent.devotional_text || dayContent.christ_connection || "";
        const memoryHook = dayContent.memory_hook || "";

        // Send email with today's devotional - essay style
        const emailHtml = `
          <div style="font-family: 'Georgia', serif; max-width: 600px; margin: 0 auto; background: #1a1a2e; color: #ffffff; border-radius: 12px; overflow: hidden;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
              <h1 style="margin: 0; font-size: 24px; color: white;">📖 ${plan.title}</h1>
              <p style="margin: 10px 0 0 0; color: rgba(255,255,255,0.9); font-size: 14px;">Day ${currentDayNumber} of ${plan.duration}</p>
            </div>
            
            <div style="padding: 30px;">
              <h2 style="color: #a78bfa; margin: 0 0 8px 0; font-size: 22px;">${dayContent.title}</h2>
              <p style="color: #8b5cf6; margin: 0 0 25px 0; font-size: 14px; font-style: italic;">${dayContent.scripture_reference}</p>
              
              <div style="color: #e4e4e7; line-height: 1.8; font-size: 16px;">
                ${devotionalText.split('\n\n').map((p: string) => `<p style="margin: 0 0 20px 0;">${p}</p>`).join('')}
              </div>
              
              ${memoryHook ? `
              <div style="background: rgba(139, 92, 246, 0.1); border-left: 4px solid #8b5cf6; padding: 16px 20px; margin: 25px 0; border-radius: 0 8px 8px 0;">
                <p style="font-style: italic; color: #a78bfa; margin: 0; font-size: 15px;">"${memoryHook}"</p>
              </div>
              ` : ''}
              
              <div style="text-align: center; margin-top: 30px;">
                <a href="https://phototheology.app/devotional/${plan.id}" 
                   style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 14px 30px; text-decoration: none; border-radius: 8px; font-weight: bold;">
                  📚 Continue Reading & Journal
                </a>
              </div>
            </div>
            
            <div style="background: rgba(255,255,255,0.05); padding: 20px; text-align: center;">
              <p style="margin: 0; color: #a1a1aa; font-size: 12px;">
                Phototheology - Master Scripture Through Visual Memory
              </p>
            </div>
          </div>
        `;

        const { error: emailError } = await resend.emails.send({
          from: "Phototheology <daily@phototheology.com>",
          to: userEmail,
          subject: `📖 Day ${currentDayNumber}: ${dayContent.title} - ${plan.title}`,
          html: emailHtml,
        });

        if (emailError) {
          console.error(`Email error for ${userEmail}:`, emailError);
        } else {
          emailsSent++;
          console.log(`Email sent to ${userEmail} for day ${currentDayNumber}`);
        }

        // Create in-app notification
        const { error: notifError } = await supabase
          .from('notifications')
          .insert({
            user_id: plan.user_id,
            type: 'daily_devotional',
            title: `📖 Day ${currentDayNumber}: ${dayContent.title}`,
            message: `Your devotional for today is ready! "${plan.title}"`,
            link: `/devotional/${plan.id}`,
            metadata: {
              plan_id: plan.id,
              day_number: currentDayNumber,
              day_id: dayContent.id,
            },
          });

        if (notifError) {
          console.error(`Notification error for ${plan.user_id}:`, notifError);
        } else {
          notificationsCreated++;
        }

      } catch (planError) {
        console.error(`Error processing plan ${plan.id}:`, planError);
      }
    }

    console.log(`Completed: ${emailsSent} emails sent, ${notificationsCreated} notifications created`);

    return new Response(
      JSON.stringify({
        success: true,
        emailsSent,
        notificationsCreated,
        plansProcessed: activePlans?.length || 0,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error: any) {
    console.error("Error in send-daily-devotional:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
