import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";
import { Resend } from "https://esm.sh/resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// ============================================
// ONBOARDING EMAIL CONTENT (Days 0-7)
// ============================================
const ONBOARDING_EMAILS: Record<number, { subject: string; html: string }> = {
  0: {
    subject: "You Didn't Sign Up for Another Bible App",
    html: `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Georgia, serif; line-height: 1.7; color: #1a1a1a; max-width: 600px; margin: 0 auto; padding: 20px; }
    h1 { font-size: 24px; margin-bottom: 20px; }
    p { margin-bottom: 16px; }
    .cta { display: inline-block; background: #8B5CF6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
    .signature { margin-top: 30px; color: #666; }
    .footer { margin-top: 40px; font-size: 12px; color: #888; border-top: 1px solid #eee; padding-top: 20px; }
  </style>
</head>
<body>
  <h1>You Didn't Sign Up for Another Bible App</h1>
  
  <p>You joined because something about the way the Bible is usually taught stopped working.</p>
  
  <p>Most Bible apps give you <strong>information</strong>.<br>
  Phototheology gives you <strong>orientation</strong>.</p>
  
  <p>Think of it this way:</p>
  <ul>
    <li><strong>Information</strong> tells you what a verse says</li>
    <li><strong>Orientation</strong> shows you where it fits</li>
    <li><strong>Formation</strong> happens when those two finally meet</li>
  </ul>
  
  <p>Today, don't explore everything.</p>
  
  <p><strong>Do this instead:</strong><br>
  Enter the Palace → Choose ONE room → Stay there for 5 minutes.</p>
  
  <a href="https://www.thephototheologyapp.com/palace" class="cta">Enter the Palace</a>
  
  <p>That's how power users are built.</p>
  
  <p>If you try to "understand everything," you'll quit.<br>
  If you practice orientation, clarity comes fast.</p>
  
  <p>Tomorrow, I'll show you the one mistake almost everyone makes on Day 1.</p>
  
  <p class="signature">— Ivor</p>
  
  <div class="footer">
    <p>Phototheology • The Palace Method</p>
  </div>
</body>
</html>
    `
  },
  1: {
    subject: "3 Ways People Use Phototheology (Choose One)",
    html: `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Georgia, serif; line-height: 1.7; color: #1a1a1a; max-width: 600px; margin: 0 auto; padding: 20px; }
    h1 { font-size: 24px; margin-bottom: 20px; }
    p { margin-bottom: 16px; }
    .path { background: #f8f5ff; padding: 16px; border-radius: 8px; margin: 12px 0; border-left: 4px solid #8B5CF6; }
    .path h3 { margin: 0 0 8px 0; color: #8B5CF6; }
    .cta { display: inline-block; background: #8B5CF6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
    .signature { margin-top: 30px; color: #666; }
  </style>
</head>
<body>
  <h1>3 Ways People Use Phototheology</h1>
  
  <p>Yesterday I told you this isn't a reading app. It's an orientation system.</p>
  
  <p>But orientation toward <em>what</em>?</p>
  
  <p>Here's how different users approach the Palace:</p>
  
  <div class="path">
    <h3>🔍 Path 1: The Student</h3>
    <p>You want to understand Scripture at a deeper level. You're tired of surface devotionals. Start with <strong>Living Manna</strong> for daily guided study.</p>
  </div>
  
  <div class="path">
    <h3>📖 Path 2: The Teacher</h3>
    <p>You teach others — Bible studies, sermons, classes. You need tools that help you prepare. Start with <strong>Jeeves</strong> (the AI Study Partner) and <strong>Bible Study Series Builder</strong>.</p>
  </div>
  
  <div class="path">
    <h3>🏛️ Path 3: The Master</h3>
    <p>You want to actually <em>memorize</em> how Scripture fits together. You want the structure in your bones. Start with <strong>Floor Training</strong> and the <strong>Memory Games</strong>.</p>
  </div>
  
  <p>You don't have to choose permanently. But choosing <em>one</em> entry point keeps you from drowning in options.</p>
  
  <p><strong>Which path resonates?</strong></p>
  
  <a href="https://www.thephototheologyapp.com/palace" class="cta">Choose Your Path</a>
  
  <p>Tomorrow: The Palace is not a metaphor.</p>
  
  <p class="signature">— Ivor</p>
</body>
</html>
    `
  },
  2: {
    subject: "The Palace Is Not a Metaphor",
    html: `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Georgia, serif; line-height: 1.7; color: #1a1a1a; max-width: 600px; margin: 0 auto; padding: 20px; }
    h1 { font-size: 24px; margin-bottom: 20px; }
    p { margin-bottom: 16px; }
    .floor { background: #f8f5ff; padding: 12px 16px; border-radius: 6px; margin: 8px 0; }
    .cta { display: inline-block; background: #8B5CF6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
    .signature { margin-top: 30px; color: #666; }
  </style>
</head>
<body>
  <h1>The Palace Is Not a Metaphor</h1>
  
  <p>When I say "Palace," I don't mean a nice idea. I mean a literal mental architecture.</p>
  
  <p>The ancient world used memory palaces to store vast amounts of information. Orators memorized hours of speeches. Scholars held entire libraries in their heads.</p>
  
  <p>Phototheology applies this ancient technique to Scripture.</p>
  
  <p><strong>8 Floors. Each floor unlocks skills.</strong></p>
  
  <div class="floor"><strong>Floor 1:</strong> Furnishing — Stock your mind with stories and images</div>
  <div class="floor"><strong>Floor 2:</strong> Investigation — Learn to observe like a detective</div>
  <div class="floor"><strong>Floor 3:</strong> Freestyle — Connect Scripture to everything</div>
  <div class="floor"><strong>Floor 4:</strong> Next Level — See Christ in every text</div>
  <div class="floor"><strong>Floor 5:</strong> Vision — Unlock prophecy and sanctuary</div>
  <div class="floor"><strong>Floor 6:</strong> Cycles — Understand cosmic history</div>
  <div class="floor"><strong>Floor 7:</strong> Fire — Let the Word burn</div>
  <div class="floor"><strong>Floor 8:</strong> Mastery — The Palace disappears because it's inside you</div>
  
  <p>You're not memorizing random verses. You're building a <em>structure</em> that holds everything.</p>
  
  <a href="https://www.thephototheologyapp.com/floor-training" class="cta">Start Floor Training</a>
  
  <p>Tomorrow: Most people get lost here — do this instead.</p>
  
  <p class="signature">— Ivor</p>
</body>
</html>
    `
  },
  3: {
    subject: "Most People Get Lost Here — Do This Instead",
    html: `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Georgia, serif; line-height: 1.7; color: #1a1a1a; max-width: 600px; margin: 0 auto; padding: 20px; }
    h1 { font-size: 24px; margin-bottom: 20px; }
    p { margin-bottom: 16px; }
    .warning { background: #FEF3C7; padding: 16px; border-radius: 8px; margin: 16px 0; border-left: 4px solid #F59E0B; }
    .solution { background: #DCFCE7; padding: 16px; border-radius: 8px; margin: 16px 0; border-left: 4px solid #22C55E; }
    .cta { display: inline-block; background: #8B5CF6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
    .signature { margin-top: 30px; color: #666; }
  </style>
</head>
<body>
  <h1>Most People Get Lost Here</h1>
  
  <p>Day 3. You've seen the Palace. You've seen the floors. You're thinking:</p>
  
  <p><em>"This is a lot. Where do I even start?"</em></p>
  
  <div class="warning">
    <strong>⚠️ The Mistake:</strong> Trying to explore everything at once. Clicking randomly. Getting overwhelmed. Leaving.
  </div>
  
  <p>I've watched it happen hundreds of times. It's not your fault — the system is deep. But depth without direction feels like chaos.</p>
  
  <div class="solution">
    <strong>✅ The Fix:</strong> Pick ONE entry point and stay there for a week.
    <ul style="margin-top: 8px;">
      <li><strong>Living Manna</strong> — if you want daily guided study</li>
      <li><strong>Gatehouse</strong> — if you want to learn the basics first</li>
      <li><strong>Jeeves</strong> — if you want an AI partner for deep study</li>
    </ul>
  </div>
  
  <p>One entrance. One week. Then branch out.</p>
  
  <p>The Palace rewards patience, not speed.</p>
  
  <a href="https://www.thephototheologyapp.com/living-manna" class="cta">Start with Living Manna</a>
  
  <p>Day 5: Games, memory, and why this isn't gimmicky.</p>
  
  <p class="signature">— Ivor</p>
</body>
</html>
    `
  },
  5: {
    subject: "Games, Memory, and Why This Isn't Gimmicky",
    html: `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Georgia, serif; line-height: 1.7; color: #1a1a1a; max-width: 600px; margin: 0 auto; padding: 20px; }
    h1 { font-size: 24px; margin-bottom: 20px; }
    p { margin-bottom: 16px; }
    .game { background: #f8f5ff; padding: 12px 16px; border-radius: 6px; margin: 8px 0; }
    .cta { display: inline-block; background: #8B5CF6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
    .signature { margin-top: 30px; color: #666; }
  </style>
</head>
<body>
  <h1>Games, Memory, and Why This Isn't Gimmicky</h1>
  
  <p>Some people see "games" in a Bible app and think: <em>Is this serious?</em></p>
  
  <p>Let me flip the question: Is <em>forgetting</em> Scripture serious?</p>
  
  <p>Neuroscience is clear: repetition with engagement beats passive reading every time. Games aren't a gimmick — they're a formation tool.</p>
  
  <p><strong>What the games actually train:</strong></p>
  
  <div class="game">🃏 <strong>Card Games</strong> — Learn to link verses to rooms and principles</div>
  <div class="game">🎯 <strong>Verse Sniper</strong> — Speed-recognition of Scripture patterns</div>
  <div class="game">🧩 <strong>Symbol Match</strong> — Embed biblical symbolism in visual memory</div>
  <div class="game">📊 <strong>Leaderboards</strong> — Community accountability and motivation</div>
  
  <p>The goal isn't entertainment. The goal is <em>retention that sticks</em>.</p>
  
  <p>Play for 5 minutes a day. Watch what happens after 30 days.</p>
  
  <a href="https://www.thephototheologyapp.com/games" class="cta">Try the Games</a>
  
  <p>Day 7: What power users do differently.</p>
  
  <p class="signature">— Ivor</p>
</body>
</html>
    `
  },
  7: {
    subject: "What Power Users Do Differently",
    html: `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Georgia, serif; line-height: 1.7; color: #1a1a1a; max-width: 600px; margin: 0 auto; padding: 20px; }
    h1 { font-size: 24px; margin-bottom: 20px; }
    p { margin-bottom: 16px; }
    .habit { background: #f8f5ff; padding: 16px; border-radius: 8px; margin: 12px 0; border-left: 4px solid #8B5CF6; }
    .cta { display: inline-block; background: #8B5CF6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
    .signature { margin-top: 30px; color: #666; }
    .quote { font-style: italic; color: #666; border-left: 3px solid #8B5CF6; padding-left: 16px; margin: 20px 0; }
  </style>
</head>
<body>
  <h1>What Power Users Do Differently</h1>
  
  <p>After a week, here's what separates people who transform from people who quit:</p>
  
  <div class="habit">
    <strong>1. They show up daily (even for 5 minutes)</strong>
    <p style="margin-bottom: 0;">Consistency beats intensity. A 5-minute daily session beats a 2-hour weekend binge.</p>
  </div>
  
  <div class="habit">
    <strong>2. They pick one thing and go deep</strong>
    <p style="margin-bottom: 0;">Living Manna. One floor. One room. Depth before breadth.</p>
  </div>
  
  <div class="habit">
    <strong>3. They save gems</strong>
    <p style="margin-bottom: 0;">When an insight hits, they save it. The Gems Room becomes their personal treasury.</p>
  </div>
  
  <div class="habit">
    <strong>4. They use Jeeves</strong>
    <p style="margin-bottom: 0;">The AI Study Partner isn't a shortcut — it's a sparring partner. It pushes back. It asks questions. It deepens study.</p>
  </div>
  
  <p class="quote">"I've been a pastor for 25 years. Phototheology taught me how to actually see the structure I'd been preaching about."</p>
  
  <p>You're one week in. The foundation is set.</p>
  
  <p>Now the question is: Will you build on it?</p>
  
  <a href="https://www.thephototheologyapp.com/palace" class="cta">Continue Building</a>
  
  <p class="signature">— Ivor</p>
</body>
</html>
    `
  }
};

// ============================================
// HABIT EMAILS (Days 1-14)
// ============================================
const HABIT_EMAILS: Record<number, { subject: string; html: string }> = {
  1: {
    subject: "Today's 5-Minute Palace Walk",
    html: `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Georgia, serif; line-height: 1.7; color: #1a1a1a; max-width: 600px; margin: 0 auto; padding: 20px; }
    .task { background: #f8f5ff; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center; }
    .cta { display: inline-block; background: #8B5CF6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; }
    .signature { margin-top: 30px; color: #666; font-size: 14px; }
  </style>
</head>
<body>
  <p>Good morning.</p>
  
  <div class="task">
    <p style="font-size: 18px; margin-bottom: 16px;"><strong>Today's focus:</strong></p>
    <p>Open Living Manna → Read today's verse → Sit with it for 3 minutes.</p>
    <a href="https://www.thephototheologyapp.com/living-manna" class="cta">Open Living Manna</a>
  </div>
  
  <p>One verse. One moment. One step forward.</p>
  
  <p class="signature">— PT Daily</p>
</body>
</html>
    `
  },
  3: {
    subject: "One Room. One Insight.",
    html: `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Georgia, serif; line-height: 1.7; color: #1a1a1a; max-width: 600px; margin: 0 auto; padding: 20px; }
    .task { background: #f8f5ff; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center; }
    .cta { display: inline-block; background: #8B5CF6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; }
    .signature { margin-top: 30px; color: #666; font-size: 14px; }
  </style>
</head>
<body>
  <p>Day 3 check-in.</p>
  
  <div class="task">
    <p style="font-size: 18px; margin-bottom: 16px;"><strong>Today's focus:</strong></p>
    <p>Visit the <strong>Story Room</strong> on Floor 1 → Complete one exercise.</p>
    <a href="https://www.thephototheologyapp.com/floor-training" class="cta">Go to Floor Training</a>
  </div>
  
  <p>Every room you enter is a skill you're building.</p>
  
  <p class="signature">— PT Daily</p>
</body>
</html>
    `
  },
  5: {
    subject: "Quick Game, Big Impact",
    html: `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Georgia, serif; line-height: 1.7; color: #1a1a1a; max-width: 600px; margin: 0 auto; padding: 20px; }
    .task { background: #f8f5ff; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center; }
    .cta { display: inline-block; background: #8B5CF6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; }
    .signature { margin-top: 30px; color: #666; font-size: 14px; }
  </style>
</head>
<body>
  <p>Halfway through week 1.</p>
  
  <div class="task">
    <p style="font-size: 18px; margin-bottom: 16px;"><strong>Today's focus:</strong></p>
    <p>Play one round of <strong>Verse Sniper</strong> or <strong>Card Battle</strong>.</p>
    <a href="https://www.thephototheologyapp.com/games" class="cta">Play Now</a>
  </div>
  
  <p>5 minutes of play. Hours of retention.</p>
  
  <p class="signature">— PT Daily</p>
</body>
</html>
    `
  },
  7: {
    subject: "One Week In 🔥",
    html: `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Georgia, serif; line-height: 1.7; color: #1a1a1a; max-width: 600px; margin: 0 auto; padding: 20px; }
    .celebration { background: linear-gradient(135deg, #8B5CF6 0%, #6366F1 100%); color: white; padding: 24px; border-radius: 8px; margin: 20px 0; text-align: center; }
    .cta { display: inline-block; background: white; color: #8B5CF6; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; }
    .signature { margin-top: 30px; color: #666; font-size: 14px; }
  </style>
</head>
<body>
  <p>You made it through Week 1.</p>
  
  <div class="celebration">
    <p style="font-size: 20px; margin-bottom: 16px;">🎉 <strong>One Week Milestone</strong></p>
    <p style="margin-bottom: 20px;">The habit is forming. Keep going.</p>
    <a href="https://www.thephototheologyapp.com/palace" class="cta">Continue Your Journey</a>
  </div>
  
  <p>Week 2 is where transformation starts to feel real.</p>
  
  <p class="signature">— PT Daily</p>
</body>
</html>
    `
  },
  10: {
    subject: "Ask Jeeves Anything",
    html: `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Georgia, serif; line-height: 1.7; color: #1a1a1a; max-width: 600px; margin: 0 auto; padding: 20px; }
    .task { background: #f8f5ff; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center; }
    .cta { display: inline-block; background: #8B5CF6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; }
    .signature { margin-top: 30px; color: #666; font-size: 14px; }
  </style>
</head>
<body>
  <p>Day 10. Time to go deeper.</p>
  
  <div class="task">
    <p style="font-size: 18px; margin-bottom: 16px;"><strong>Today's focus:</strong></p>
    <p>Ask <strong>Jeeves</strong> one hard question about a passage you've always wondered about.</p>
    <a href="https://www.thephototheologyapp.com/jeeves" class="cta">Talk to Jeeves</a>
  </div>
  
  <p>He won't just answer. He'll teach you how to find answers.</p>
  
  <p class="signature">— PT Daily</p>
</body>
</html>
    `
  },
  14: {
    subject: "Two Weeks. You're Different Now.",
    html: `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Georgia, serif; line-height: 1.7; color: #1a1a1a; max-width: 600px; margin: 0 auto; padding: 20px; }
    .milestone { background: linear-gradient(135deg, #8B5CF6 0%, #6366F1 100%); color: white; padding: 24px; border-radius: 8px; margin: 20px 0; }
    .cta { display: inline-block; background: white; color: #8B5CF6; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; margin-top: 16px; }
    .signature { margin-top: 30px; color: #666; font-size: 14px; }
  </style>
</head>
<body>
  <p>14 days ago, you signed up for something different.</p>
  
  <div class="milestone">
    <p style="font-size: 20px; margin-bottom: 16px;"><strong>Two-Week Milestone</strong></p>
    <p>You've started building a mental palace. Not metaphorically — literally. The structure is forming.</p>
    <p>Keep going. The next two weeks are where mastery begins.</p>
    <a href="https://www.thephototheologyapp.com/palace" class="cta">Enter the Palace</a>
  </div>
  
  <p class="signature">— Ivor</p>
</body>
</html>
    `
  }
};

// Helper to get email content by sequence and day
function getEmailContent(sequenceType: string, day: number): { subject: string; html: string } | null {
  if (sequenceType === 'onboarding') {
    return ONBOARDING_EMAILS[day] || null;
  }
  if (sequenceType === 'habit') {
    return HABIT_EMAILS[day] || null;
  }
  return null;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Starting daily email orchestrator...");

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get all active sequences where next_email_due_at <= now
    const { data: dueSequences, error: fetchError } = await supabase
      .from("email_sequence_progress")
      .select(`
        id,
        user_id,
        sequence_type,
        current_day,
        metadata
      `)
      .eq("is_active", true)
      .eq("is_completed", false)
      .lte("next_email_due_at", new Date().toISOString());

    if (fetchError) {
      console.error("Error fetching due sequences:", fetchError);
      throw fetchError;
    }

    console.log(`Found ${dueSequences?.length || 0} sequences due for emails`);

    const results: { success: number; failed: number; skipped: number } = {
      success: 0,
      failed: 0,
      skipped: 0
    };

    for (const seq of dueSequences || []) {
      try {
        // Get user email
        const { data: profile } = await supabase
          .from("profiles")
          .select("id")
          .eq("id", seq.user_id)
          .single();

        if (!profile) {
          console.log(`No profile for user ${seq.user_id}, skipping`);
          results.skipped++;
          continue;
        }

        // Get user email from auth
        const { data: { user }, error: userError } = await supabase.auth.admin.getUserById(seq.user_id);
        
        if (userError || !user?.email) {
          console.log(`Cannot get email for user ${seq.user_id}, skipping`);
          results.skipped++;
          continue;
        }

        // Get email content for this day
        const emailContent = getEmailContent(seq.sequence_type, seq.current_day);
        
        if (!emailContent) {
          // No email for this day, advance to next
          const nextDay = seq.current_day + 1;
          const maxDays = seq.sequence_type === 'onboarding' ? 7 : 14;
          
          if (nextDay > maxDays) {
            // Sequence complete
            await supabase
              .from("email_sequence_progress")
              .update({
                is_completed: true,
                completed_at: new Date().toISOString()
              })
              .eq("id", seq.id);
          } else {
            // Move to next day
            await supabase
              .from("email_sequence_progress")
              .update({
                current_day: nextDay,
                next_email_due_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
              })
              .eq("id", seq.id);
          }
          results.skipped++;
          continue;
        }

        // Send the email
        console.log(`Sending ${seq.sequence_type} day ${seq.current_day} email to ${user.email}`);
        
        const { error: emailError } = await resend.emails.send({
          from: "Phototheology <ivor@thephototheologyapp.com>",
          to: [user.email],
          subject: emailContent.subject,
          html: emailContent.html
        });

        if (emailError) {
          console.error(`Failed to send email to ${user.email}:`, emailError);
          
          // Log the failure
          await supabase.from("email_send_log").insert({
            user_id: seq.user_id,
            sequence_type: seq.sequence_type,
            day_number: seq.current_day,
            email_subject: emailContent.subject,
            status: "failed",
            error_message: JSON.stringify(emailError)
          });
          
          results.failed++;
          continue;
        }

        // Log success
        await supabase.from("email_send_log").insert({
          user_id: seq.user_id,
          sequence_type: seq.sequence_type,
          day_number: seq.current_day,
          email_subject: emailContent.subject,
          status: "sent"
        });

        // Advance to next day
        const nextDay = seq.current_day + 1;
        const maxDays = seq.sequence_type === 'onboarding' ? 7 : 14;
        
        if (nextDay > maxDays) {
          await supabase
            .from("email_sequence_progress")
            .update({
              current_day: nextDay,
              last_email_sent_at: new Date().toISOString(),
              is_completed: true,
              completed_at: new Date().toISOString()
            })
            .eq("id", seq.id);
        } else {
          await supabase
            .from("email_sequence_progress")
            .update({
              current_day: nextDay,
              last_email_sent_at: new Date().toISOString(),
              next_email_due_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
            })
            .eq("id", seq.id);
        }

        results.success++;
        console.log(`Successfully sent email to ${user.email}`);

      } catch (seqError) {
        console.error(`Error processing sequence ${seq.id}:`, seqError);
        results.failed++;
      }
    }

    console.log("Email orchestrator complete:", results);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Processed ${(dueSequences?.length || 0)} sequences`,
        results 
      }),
      { 
        status: 200, 
        headers: { "Content-Type": "application/json", ...corsHeaders } 
      }
    );

  } catch (error: any) {
    console.error("Email orchestrator error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { "Content-Type": "application/json", ...corsHeaders } 
      }
    );
  }
});
