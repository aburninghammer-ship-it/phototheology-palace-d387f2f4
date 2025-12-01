import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';
import { Resend } from "https://esm.sh/resend@4.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

type EmailType =
  | "admin-signup"
  | "daily-challenge"
  | "engagement"
  | "feedback"
  | "invitation"
  | "partner-nudge"
  | "purchase-notification"
  | "renewal-reminder"
  | "signup-notification";

interface EmailRequest {
  type: EmailType;
  data: Record<string, any>;
}

/**
 * Consolidated email function that handles all email types
 * Replaces 8 separate email functions with a single unified handler
 */
const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const resendApiKey = Deno.env.get('RESEND_API_KEY');
    if (!resendApiKey) {
      throw new Error('RESEND_API_KEY not configured');
    }

    const resend = new Resend(resendApiKey);
    const { type, data }: EmailRequest = await req.json();

    console.log(`Sending ${type} email with data:`, data);

    let emailConfig: {
      from: string;
      to: string | string[];
      subject: string;
      html: string;
    };

    // Route to appropriate email template based on type
    switch (type) {
      case "admin-signup":
        emailConfig = {
          from: "Phototheology <onboarding@resend.dev>",
          to: ["aburninghammer@gmail.com"],
          subject: `📧 Latest Signup Details: ${data.userName}`,
          html: `
            <h2>Latest User Signup</h2>
            <p><strong>Name:</strong> ${data.userName}</p>
            <p><strong>Email:</strong> ${data.userEmail}</p>
            <p><strong>Signed Up:</strong> ${data.signupTime}</p>
            <hr>
            <p style="color: #666; font-size: 12px;">Sent from Phototheology Admin</p>
          `,
        };
        break;

      case "daily-challenge":
        emailConfig = {
          from: "Phototheology <daily@phototheology.com>",
          to: data.email,
          subject: `🎯 Your Daily Challenge for ${data.date}`,
          html: `
            <h2>Today's Challenge</h2>
            <p>Hi ${data.name},</p>
            <p>${data.challengeText}</p>
            <p><strong>Category:</strong> ${data.category}</p>
            <a href="${data.challengeUrl}" style="display: inline-block; padding: 10px 20px; background: #4F46E5; color: white; text-decoration: none; border-radius: 5px; margin-top: 10px;">
              Start Challenge
            </a>
            <hr>
            <p style="color: #666; font-size: 12px;">Don't want daily emails? <a href="${data.unsubscribeUrl}">Unsubscribe</a></p>
          `,
        };
        break;

      case "engagement":
        emailConfig = {
          from: "Phototheology <hello@phototheology.com>",
          to: data.email,
          subject: data.subject || "We miss you at Phototheology!",
          html: `
            <h2>${data.heading}</h2>
            <p>Hi ${data.name},</p>
            <p>${data.message}</p>
            ${data.ctaUrl ? `
              <a href="${data.ctaUrl}" style="display: inline-block; padding: 10px 20px; background: #4F46E5; color: white; text-decoration: none; border-radius: 5px; margin-top: 10px;">
                ${data.ctaText || 'Continue Learning'}
              </a>
            ` : ''}
            <hr>
            <p style="color: #666; font-size: 12px;">Phototheology - Master Scripture Through Visual Memory</p>
          `,
        };
        break;

      case "feedback":
        emailConfig = {
          from: "Phototheology <feedback@phototheology.com>",
          to: ["aburninghammer@gmail.com"],
          subject: `💬 New Feedback from ${data.userName}`,
          html: `
            <h2>New User Feedback</h2>
            <p><strong>From:</strong> ${data.userName} (${data.userEmail})</p>
            <p><strong>Category:</strong> ${data.category || 'General'}</p>
            <p><strong>Rating:</strong> ${data.rating ? '⭐'.repeat(data.rating) : 'N/A'}</p>
            <hr>
            <p><strong>Message:</strong></p>
            <p>${data.message}</p>
            <hr>
            <p style="color: #666; font-size: 12px;">Sent: ${data.timestamp}</p>
          `,
        };
        break;

      case "invitation":
        const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
        const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
        const supabase = createClient(supabaseUrl, supabaseServiceKey);

        // Verify user authorization for invitations
        const authHeader = req.headers.get('authorization');
        if (!authHeader) throw new Error('No authorization header');

        const token = authHeader.replace('Bearer ', '');
        const { data: { user }, error: authError } = await supabase.auth.getUser(token);
        if (authError || !user) throw new Error('Unauthorized');

        emailConfig = {
          from: "Phototheology <invite@phototheology.com>",
          to: data.recipientEmail,
          subject: `${data.senderName || 'Someone'} invited you to Phototheology!`,
          html: `
            <h2>You're Invited to Phototheology!</h2>
            <p>Hi ${data.recipientName || 'there'},</p>
            <p>${data.senderName || 'Someone'} has invited you to join Phototheology, the visual Bible memory platform.</p>
            ${data.message ? `<p><em>"${data.message}"</em></p>` : ''}
            <a href="${data.inviteUrl}" style="display: inline-block; padding: 10px 20px; background: #4F46E5; color: white; text-decoration: none; border-radius: 5px; margin-top: 10px;">
              Accept Invitation
            </a>
            <p style="margin-top: 20px; color: #666; font-size: 14px;">
              This invitation ${data.maxUses ? `can be used ${data.maxUses} times` : 'is for single use'}
              ${data.expiresAt ? ` and expires on ${new Date(data.expiresAt).toLocaleDateString()}` : ''}.
            </p>
            <hr>
            <p style="color: #666; font-size: 12px;">Phototheology - Master Scripture Through Visual Memory</p>
          `,
        };
        break;

      case "partner-nudge":
        emailConfig = {
          from: "Phototheology <partners@phototheology.com>",
          to: data.email,
          subject: `👥 Your study partner ${data.partnerName} is waiting!`,
          html: `
            <h2>Study Partner Activity</h2>
            <p>Hi ${data.name},</p>
            <p>${data.partnerName} ${data.activityMessage}</p>
            <p>Keep the momentum going!</p>
            <a href="${data.activityUrl}" style="display: inline-block; padding: 10px 20px; background: #4F46E5; color: white; text-decoration: none; border-radius: 5px; margin-top: 10px;">
              View Activity
            </a>
            <hr>
            <p style="color: #666; font-size: 12px;">Partner notifications • <a href="${data.settingsUrl}">Settings</a></p>
          `,
        };
        break;

      case "purchase-notification":
        emailConfig = {
          from: "Phototheology <billing@phototheology.com>",
          to: ["aburninghammer@gmail.com"],
          subject: `💰 New Purchase: ${data.amount} - ${data.userName}`,
          html: `
            <h2>New Purchase Alert</h2>
            <p><strong>Customer:</strong> ${data.userName} (${data.userEmail})</p>
            <p><strong>Amount:</strong> $${data.amount}</p>
            <p><strong>Plan:</strong> ${data.planName}</p>
            <p><strong>Payment Method:</strong> ${data.paymentMethod}</p>
            <p><strong>Transaction ID:</strong> ${data.transactionId}</p>
            <p><strong>Date:</strong> ${data.purchaseDate}</p>
            <hr>
            <p style="color: #666; font-size: 12px;">Phototheology Admin Notification</p>
          `,
        };
        break;

      case "renewal-reminder":
        emailConfig = {
          from: "Phototheology <billing@phototheology.com>",
          to: data.email,
          subject: `🔔 Your Phototheology subscription ${data.daysUntilRenewal <= 0 ? 'has renewed' : 'renews soon'}`,
          html: `
            <h2>Subscription ${data.daysUntilRenewal <= 0 ? 'Renewed' : 'Renewal Reminder'}</h2>
            <p>Hi ${data.name},</p>
            ${data.daysUntilRenewal > 0 ? `
              <p>Your ${data.planName} subscription will renew in ${data.daysUntilRenewal} days.</p>
              <p><strong>Renewal Amount:</strong> $${data.amount}</p>
              <p><strong>Renewal Date:</strong> ${new Date(data.renewalDate).toLocaleDateString()}</p>
            ` : `
              <p>Your ${data.planName} subscription has been renewed successfully.</p>
              <p><strong>Amount Charged:</strong> $${data.amount}</p>
              <p><strong>Next Renewal:</strong> ${new Date(data.nextRenewalDate).toLocaleDateString()}</p>
            `}
            <a href="${data.manageUrl}" style="display: inline-block; padding: 10px 20px; background: #4F46E5; color: white; text-decoration: none; border-radius: 5px; margin-top: 10px;">
              Manage Subscription
            </a>
            <hr>
            <p style="color: #666; font-size: 12px;">Questions? Contact support@phototheology.com</p>
          `,
        };
        break;

      case "signup-notification":
        emailConfig = {
          from: "Phototheology <welcome@phototheology.com>",
          to: data.email,
          subject: "🎉 Welcome to Phototheology!",
          html: `
            <h2>Welcome to Phototheology!</h2>
            <p>Hi ${data.name},</p>
            <p>We're excited to have you join our community of Scripture masters!</p>
            <p><strong>Here's what you can do next:</strong></p>
            <ul>
              <li>📖 Explore your first Memory Palace</li>
              <li>🎮 Try a Bible memory game</li>
              <li>🎯 Complete your first daily challenge</li>
              <li>👥 Find a study partner</li>
            </ul>
            <a href="${data.dashboardUrl}" style="display: inline-block; padding: 10px 20px; background: #4F46E5; color: white; text-decoration: none; border-radius: 5px; margin-top: 10px;">
              Get Started
            </a>
            ${data.hasPromoCode ? `
              <p style="margin-top: 20px; padding: 15px; background: #F3F4F6; border-radius: 5px;">
                <strong>🎁 Special Offer:</strong> Use code <code style="background: white; padding: 2px 8px; border-radius: 3px;">${data.promoCode}</code> for ${data.promoDiscount} off!
              </p>
            ` : ''}
            <hr>
            <p style="color: #666; font-size: 12px;">Need help getting started? <a href="${data.helpUrl}">Check out our guide</a></p>
          `,
        };
        break;

      default:
        throw new Error(`Unknown email type: ${type}`);
    }

    const emailResponse = await resend.emails.send(emailConfig);
    console.log(`${type} email sent successfully:`, emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error sending email:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
