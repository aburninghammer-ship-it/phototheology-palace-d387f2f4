import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Daily tips content
const DAILY_TIPS = [
  // Room suggestions
  { type: "room", message: "📖 Try the Story Room today! Recall Bible narratives as vivid mental movies. https://phototheology.app/palace?floor=1" },
  { type: "room", message: "🔍 Room Spotlight: The Observation Room teaches detective-level text analysis. https://phototheology.app/palace?floor=2" },
  { type: "room", message: "🔥 The Fire Room (Floor 7) brings emotional weight to Scripture study. https://phototheology.app/palace?floor=7" },
  { type: "room", message: "✝️ Visit the Concentration Room — keep Christ at the center of every text. https://phototheology.app/palace?floor=4" },
  
  // Game suggestions  
  { type: "game", message: "🎮 Try Genesis HighRise today! Build the Genesis tower chapter by chapter. https://phototheology.app/games" },
  { type: "game", message: "🕵️ Game of the Day: Verse Detective challenges you to find hidden details in Scripture. https://phototheology.app/games" },
  { type: "game", message: "🦁 Symbol Safari — Hunt for biblical symbols across the pages! https://phototheology.app/games" },
  
  // Verses
  { type: "verse", message: "📜 Verse of the Day: \"Thy word is a lamp unto my feet, and a light unto my path.\" — Psalm 119:105" },
  { type: "verse", message: "🍇 Today's Scripture: \"I am the vine, ye are the branches.\" — John 15:5" },
  { type: "verse", message: "❤️ \"For God so loved the world...\" — John 3:16. The gospel in one verse." },
  
  // Did you know
  { type: "didYouKnow", message: "💡 Did You Know? David picked 5 stones because Goliath had 4 brothers! (2 Sam 21:22)" },
  { type: "didYouKnow", message: "🐟 Fun Fact: Jesus fed 5,000 with 12 baskets leftover — one for each tribe of Israel!" },
  { type: "didYouKnow", message: "📅 Bible Insight: The word \"fear\" appears 365 times in the Bible — one for each day!" },
  
  // Gems
  { type: "gem", message: "💎 Powerful Gem: The Passover lamb points directly to Christ's crucifixion — same day, same hour." },
  { type: "gem", message: "🌍 Hidden Treasure: Babel scattered languages; Pentecost reunited them through the Spirit!" },
  { type: "gem", message: "⛵ Today's Gem: Christ is the true Ark — salvation through Him alone, one door, one refuge." },
];

interface SMSRequest {
  userId?: string;
  testMode?: boolean;
  phoneNumber?: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const twilioAccountSid = Deno.env.get("TWILIO_ACCOUNT_SID");
    const twilioAuthToken = Deno.env.get("TWILIO_AUTH_TOKEN");
    const twilioPhoneNumber = Deno.env.get("TWILIO_PHONE_NUMBER");
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    const body: SMSRequest = await req.json().catch(() => ({}));
    
    // If this is a test request, just verify the configuration
    if (body.testMode) {
      const configured = !!(twilioAccountSid && twilioAuthToken && twilioPhoneNumber);
      return new Response(
        JSON.stringify({ 
          configured,
          message: configured ? "SMS service is configured" : "SMS credentials not yet configured. Add TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, and TWILIO_PHONE_NUMBER secrets."
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get users who have opted in to SMS notifications
    let query = supabase
      .from("sms_notification_preferences")
      .select("*")
      .eq("is_enabled", true)
      .not("phone_number", "is", null);

    // If specific userId provided, only send to that user
    if (body.userId) {
      query = query.eq("user_id", body.userId);
    }

    const { data: subscribers, error: fetchError } = await query;

    if (fetchError) {
      throw new Error(`Failed to fetch subscribers: ${fetchError.message}`);
    }

    if (!subscribers || subscribers.length === 0) {
      return new Response(
        JSON.stringify({ message: "No subscribers to notify", sent: 0 }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Check if Twilio is configured
    if (!twilioAccountSid || !twilioAuthToken || !twilioPhoneNumber) {
      console.log("SMS credentials not configured, logging tips instead");
      
      // Log the tips that would be sent
      for (const subscriber of subscribers) {
        const dayIndex = new Date().getDate() % DAILY_TIPS.length;
        const tip = DAILY_TIPS[dayIndex];
        
        await supabase.from("daily_tip_logs").insert({
          user_id: subscriber.user_id,
          tip_type: tip.type,
          tip_content: tip.message,
          delivery_status: "logged_no_sms_config"
        });
      }
      
      return new Response(
        JSON.stringify({ 
          message: "SMS not configured, tips logged for " + subscribers.length + " users",
          sent: 0,
          logged: subscribers.length
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Send SMS to each subscriber
    let sentCount = 0;
    let failedCount = 0;

    for (const subscriber of subscribers) {
      try {
        // Get a tip based on the day
        const dayIndex = new Date().getDate() % DAILY_TIPS.length;
        const tip = DAILY_TIPS[dayIndex];
        
        // Send via Twilio
        const twilioUrl = `https://api.twilio.com/2010-04-01/Accounts/${twilioAccountSid}/Messages.json`;
        const twilioResponse = await fetch(twilioUrl, {
          method: "POST",
          headers: {
            "Authorization": "Basic " + btoa(`${twilioAccountSid}:${twilioAuthToken}`),
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({
            To: subscriber.phone_number,
            From: twilioPhoneNumber,
            Body: `Phototheology: ${tip.message}`,
          }),
        });

        if (twilioResponse.ok) {
          sentCount++;
          
          // Log successful send
          await supabase.from("daily_tip_logs").insert({
            user_id: subscriber.user_id,
            tip_type: tip.type,
            tip_content: tip.message,
            delivery_status: "sent"
          });

          // Update last sent timestamp
          await supabase
            .from("sms_notification_preferences")
            .update({ last_sent_at: new Date().toISOString() })
            .eq("user_id", subscriber.user_id);
        } else {
          failedCount++;
          console.error(`Failed to send SMS to ${subscriber.phone_number}:`, await twilioResponse.text());
          
          await supabase.from("daily_tip_logs").insert({
            user_id: subscriber.user_id,
            tip_type: tip.type,
            tip_content: tip.message,
            delivery_status: "failed"
          });
        }
      } catch (error) {
        failedCount++;
        console.error(`Error sending SMS:`, error);
      }
    }

    return new Response(
      JSON.stringify({ 
        message: `Sent ${sentCount} SMS, ${failedCount} failed`,
        sent: sentCount,
        failed: failedCount
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error: unknown) {
    console.error("Error in send-daily-tip-sms:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { 
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
};

serve(handler);
