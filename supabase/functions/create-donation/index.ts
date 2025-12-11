import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Price IDs for preset amounts
const PRICE_IDS: Record<number, string> = {
  5: "price_1ScyykFGDAd3RU8Id72ENqCz",
  50: "price_1Sd0K6FGDAd3RU8IqILqXG5l",
  500: "price_1Sd0LZFGDAd3RU8IlC2ABtJt",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("[CREATE-DONATION] Function started");
    
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2025-08-27.basil",
    });

    const { email, amount } = await req.json().catch(() => ({}));
    const donationAmount = Number(amount) || 5;
    
    console.log("[CREATE-DONATION] Amount requested:", donationAmount);

    let lineItems: Stripe.Checkout.SessionCreateParams.LineItem[];

    // Check if it's a preset amount with a price ID
    if (PRICE_IDS[donationAmount]) {
      lineItems = [
        {
          price: PRICE_IDS[donationAmount],
          quantity: 1,
        },
      ];
    } else {
      // Custom amount - use price_data
      lineItems = [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "Support Phototheology Development",
              description: `$${donationAmount} donation to support continued development`,
            },
            unit_amount: donationAmount * 100, // Convert to cents
          },
          quantity: 1,
        },
      ];
    }

    const session = await stripe.checkout.sessions.create({
      customer_email: email || undefined,
      line_items: lineItems,
      mode: "payment",
      success_url: `${req.headers.get("origin")}/donation-success`,
      cancel_url: `${req.headers.get("origin")}/`,
      submit_type: "donate",
    });

    console.log("[CREATE-DONATION] Session created:", session.id);

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("[CREATE-DONATION] Error:", errorMessage);
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
