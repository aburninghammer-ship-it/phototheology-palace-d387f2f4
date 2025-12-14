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

    const forPersonNote = personName ? `\nThis devotional is specifically for: ${personName}.` : "";
    const issueNote = primaryIssue ? `\nPRIMARY STRUGGLE: ${primaryIssue}${issueDescription ? ` - ${issueDescription}` : ""}` : "";

    const systemPrompt = `You are a Phototheology devotional writer. Create deep, Christ-centered devotionals that:
- Use 2-3 Scripture passages that reveal unexpected connections
- Feel weighty and contemplative, not sentimental
- Move from text → structure → meaning → personal confrontation
- Avoid clichés, sermon language, and emotional filler
- Never explain the method, let insights emerge naturally`;

    const userPrompt = `Create day ${dayNumber} of a ${plan.duration}-day devotional on the theme: "${plan.theme}"
Format: ${plan.format}${forPersonNote}${issueNote}

Generate ONLY day ${dayNumber} as a JSON array with a single object. This day should build on the journey so far while offering fresh insight.

Generate as a JSON array with day_number: ${dayNumber}.`;

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
                        title: { type: "string" },
                        scripture_reference: { type: "string" },
                        scripture_text: { type: "string" },
                        room_assignment: { type: "string" },
                        floor_number: { type: "integer" },
                        visual_imagery: { type: "string" },
                        memory_hook: { type: "string" },
                        cross_references: { type: "array", items: { type: "string" } },
                        application: { type: "string" },
                        prayer: { type: "string" },
                        challenge: { type: "string" },
                        journal_prompt: { type: "string" },
                        sanctuary_station: { type: "string" },
                        christ_connection: { type: "string" },
                      },
                      required: ["day_number", "title", "scripture_reference", "scripture_text", "application", "prayer", "christ_connection"],
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
    
    // Insert the generated day
    const { error: insertError } = await supabase
      .from('devotional_days')
      .insert({
        plan_id: planId,
        day_number: day.day_number || dayNumber,
        title: day.title,
        scripture_reference: day.scripture_reference,
        scripture_text: day.scripture_text,
        room_assignment: day.room_assignment,
        floor_number: day.floor_number || 1,
        visual_imagery: day.visual_imagery,
        memory_hook: day.memory_hook,
        cross_references: day.cross_references || [],
        application: day.application,
        prayer: day.prayer,
        challenge: day.challenge,
        journal_prompt: day.journal_prompt,
        sanctuary_station: day.sanctuary_station,
        christ_connection: day.christ_connection,
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

        // Check if we already sent for today (prevent duplicates)
        const { data: existingNotif } = await supabase
          .from('notifications')
          .select('id')
          .eq('user_id', plan.user_id)
          .eq('type', 'daily_devotional')
          .gte('created_at', `${today}T00:00:00`)
          .like('metadata->>plan_id', plan.id)
          .limit(1);

        if (existingNotif && existingNotif.length > 0) {
          console.log(`Already sent devotional for plan ${plan.id} today, skipping`);
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

        // Send email with today's devotional
        const emailHtml = `
          <div style="font-family: 'Georgia', serif; max-width: 600px; margin: 0 auto; background: #1a1a2e; color: #ffffff; border-radius: 12px; overflow: hidden;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
              <h1 style="margin: 0; font-size: 24px; color: white;">📖 ${plan.title}</h1>
              <p style="margin: 10px 0 0 0; color: rgba(255,255,255,0.9); font-size: 14px;">Day ${currentDayNumber} of ${plan.duration}</p>
            </div>
            
            <div style="padding: 30px;">
              <h2 style="color: #a78bfa; margin: 0 0 15px 0; font-size: 22px;">${dayContent.title}</h2>
              
              <div style="background: rgba(139, 92, 246, 0.1); border-left: 4px solid #8b5cf6; padding: 20px; margin: 20px 0; border-radius: 0 8px 8px 0;">
                <p style="font-style: italic; color: #d4d4d8; margin: 0; font-size: 18px; line-height: 1.6;">
                  "${dayContent.scripture_text}"
                </p>
                <p style="color: #a78bfa; margin: 15px 0 0 0; font-weight: bold;">— ${dayContent.scripture_reference}</p>
              </div>
              
              <div style="margin: 25px 0;">
                <h3 style="color: #f472b6; font-size: 16px; margin: 0 0 10px 0;">✨ Christ Connection</h3>
                <p style="color: #e4e4e7; line-height: 1.7; margin: 0;">${dayContent.christ_connection}</p>
              </div>
              
              ${dayContent.application ? `
              <div style="margin: 25px 0;">
                <h3 style="color: #34d399; font-size: 16px; margin: 0 0 10px 0;">💡 Application</h3>
                <p style="color: #e4e4e7; line-height: 1.7; margin: 0;">${dayContent.application}</p>
              </div>
              ` : ''}
              
              ${dayContent.prayer ? `
              <div style="margin: 25px 0; background: rgba(52, 211, 153, 0.1); padding: 20px; border-radius: 8px;">
                <h3 style="color: #34d399; font-size: 16px; margin: 0 0 10px 0;">🙏 Prayer</h3>
                <p style="color: #e4e4e7; line-height: 1.7; margin: 0; font-style: italic;">${dayContent.prayer}</p>
              </div>
              ` : ''}
              
              <div style="text-align: center; margin-top: 30px;">
                <a href="https://phototheology.app/devotional/${plan.id}" 
                   style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 14px 30px; text-decoration: none; border-radius: 8px; font-weight: bold;">
                  📚 Read Full Devotional & Journal
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
