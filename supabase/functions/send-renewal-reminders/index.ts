import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { Resend } from "https://esm.sh/resend@2.0.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ProfileWithRenewal {
  id: string;
  display_name: string;
  subscription_tier: 'essential' | 'premium';
  subscription_renewal_date: string;
  email: string;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const resendApiKey = Deno.env.get('RESEND_API_KEY')!;
    
    const supabase = createClient(supabaseUrl, supabaseKey);
    const resend = new Resend(resendApiKey);

    // Calculate date 30 days from now
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 30);
    const targetDateStr = targetDate.toISOString().split('T')[0];

    // Calculate date 31 days from now (for range query)
    const nextDay = new Date(targetDate);
    nextDay.setDate(nextDay.getDate() + 1);
    const nextDayStr = nextDay.toISOString().split('T')[0];

    console.log(`Checking for renewals between ${targetDateStr} and ${nextDayStr}`);

    // Get profiles with renewal dates 30 days from now
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('id, display_name, subscription_tier, subscription_renewal_date')
      .gte('subscription_renewal_date', targetDateStr)
      .lt('subscription_renewal_date', nextDayStr)
      .in('subscription_tier', ['essential', 'premium'])
      .eq('subscription_status', 'active');

    if (profilesError) {
      console.error('Error fetching profiles:', profilesError);
      throw profilesError;
    }

    if (!profiles || profiles.length === 0) {
      console.log('No subscriptions renewing in 30 days');
      return new Response(
        JSON.stringify({ message: 'No renewals found', count: 0 }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Found ${profiles.length} subscriptions renewing in 30 days`);

    // Get user emails from auth.users
    const userIds = profiles.map(p => p.id);
    const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
    
    if (authError) {
      console.error('Error fetching auth users:', authError);
      throw authError;
    }

    const emailMap = new Map(
      authUsers.users
        .filter(u => userIds.includes(u.id))
        .map(u => [u.id, u.email])
    );

    let sentCount = 0;
    let errorCount = 0;

    for (const profile of profiles) {
      const email = emailMap.get(profile.id);
      if (!email) {
        console.error(`No email found for user ${profile.id}`);
        errorCount++;
        continue;
      }

      // Check if we've already sent a reminder for this renewal
      const { data: existingReminder } = await supabase
        .from('renewal_reminders')
        .select('id')
        .eq('user_id', profile.id)
        .eq('renewal_date', profile.subscription_renewal_date)
        .single();

      if (existingReminder) {
        console.log(`Reminder already sent for user ${profile.id}`);
        continue;
      }

      // Send email
      try {
        const renewalDate = new Date(profile.subscription_renewal_date);
        const formattedDate = renewalDate.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });

        const tierName = profile.subscription_tier === 'essential' ? 'Essential' : 'Premium';
        const annualPrice = profile.subscription_tier === 'essential' ? '$90' : '$150';

        await resend.emails.send({
          from: 'Phototheology <onboarding@resend.dev>',
          to: [email],
          subject: `Your Phototheology ${tierName} subscription renews in 30 days`,
          html: `
            <!DOCTYPE html>
            <html>
            <head>
              <style>
                body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
                .highlight { background: #fff; padding: 20px; border-left: 4px solid #667eea; margin: 20px 0; }
                .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
                .footer { text-align: center; color: #666; font-size: 14px; margin-top: 30px; }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h1>Subscription Renewal Reminder</h1>
                </div>
                <div class="content">
                  <p>Hi ${profile.display_name || 'there'},</p>
                  
                  <p>This is a friendly reminder that your <strong>Phototheology ${tierName}</strong> annual subscription will automatically renew on <strong>${formattedDate}</strong>.</p>
                  
                  <div class="highlight">
                    <strong>Renewal Details:</strong><br>
                    Plan: ${tierName} (Annual)<br>
                    Amount: ${annualPrice}/year<br>
                    Renewal Date: ${formattedDate}
                  </div>
                  
                  <p>Your subscription includes:</p>
                  <ul>
                    <li>Full access to The Palace (8 floors, 40+ rooms)</li>
                    <li>All AI GPT assistants</li>
                    <li>Bible Reader with Strong's & Chain References</li>
                    <li>Unlimited Daily Challenges & Training Drills</li>
                    ${profile.subscription_tier === 'premium' ? '<li>All Premium courses and games</li><li>Priority support & early access to features</li>' : ''}
                  </ul>
                  
                  <p><strong>No action needed</strong> - your subscription will renew automatically using your saved payment method.</p>
                  
                  <p>If you need to update your payment method or manage your subscription, you can do so anytime:</p>
                  
                  <center>
                    <a href="${Deno.env.get('SUPABASE_URL')?.replace('https://', 'https://app.')}/profile" class="button">Manage Subscription</a>
                  </center>
                  
                  <p>Thank you for being a valued member of the Phototheology community!</p>
                  
                  <p>Blessings,<br>The Phototheology Team</p>
                  
                  <div class="footer">
                    <p>Questions? Reply to this email or visit our support page.</p>
                    <p>If you'd like to cancel your subscription, please manage it before ${formattedDate}.</p>
                  </div>
                </div>
              </div>
            </body>
            </html>
          `,
        });

        // Record that we sent the reminder
        await supabase
          .from('renewal_reminders')
          .insert({
            user_id: profile.id,
            subscription_type: profile.subscription_tier,
            billing_period: 'annual',
            renewal_date: profile.subscription_renewal_date,
          });

        sentCount++;
        console.log(`Sent renewal reminder to ${email}`);
      } catch (emailError) {
        console.error(`Error sending email to ${email}:`, emailError);
        errorCount++;
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: `Processed ${profiles.length} renewals`,
        sent: sentCount,
        errors: errorCount,
        skipped: profiles.length - sentCount - errorCount,
      }),
      { 
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error: any) {
    console.error('Error in send-renewal-reminders:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
