import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";
import { Webhook } from "https://esm.sh/standardwebhooks@1.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, svix-id, svix-timestamp, svix-signature",
};

interface ResendWebhookPayload {
  type: string;
  created_at: string;
  data: {
    email_id: string;
    from: string;
    to: string[];
    subject: string;
    headers?: Array<{ name: string; value: string }>;
  };
}

/**
 * Verify webhook signature using Standard Webhooks library
 * Returns the parsed payload if valid, throws error if invalid
 */
async function verifyWebhookSignature(req: Request): Promise<ResendWebhookPayload> {
  const webhookSecret = Deno.env.get("RESEND_WEBHOOK_SECRET");
  
  if (!webhookSecret) {
    console.error("RESEND_WEBHOOK_SECRET not configured");
    throw new Error("Webhook secret not configured");
  }

  // Get the raw body as text for signature verification
  const payload = await req.text();
  
  // Extract Svix headers for verification
  const svixId = req.headers.get("svix-id");
  const svixTimestamp = req.headers.get("svix-timestamp");
  const svixSignature = req.headers.get("svix-signature");

  if (!svixId || !svixTimestamp || !svixSignature) {
    console.error("Missing Svix headers for webhook verification");
    throw new Error("Missing webhook signature headers");
  }

  try {
    const wh = new Webhook(webhookSecret);
    
    // Verify the webhook signature
    const verified = wh.verify(payload, {
      "svix-id": svixId,
      "svix-timestamp": svixTimestamp,
      "svix-signature": svixSignature,
    }) as ResendWebhookPayload;

    return verified;
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    throw new Error("Invalid webhook signature");
  }
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verify webhook signature before processing
    let payload: ResendWebhookPayload;
    try {
      payload = await verifyWebhookSignature(req);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Verification failed";
      console.error("Webhook verification error:", errorMessage);
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        {
          status: 401,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Create Supabase client with service role for webhook processing
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    console.log("Resend webhook received (verified):", payload.type, payload.data.email_id);

    // Extract tracking ID from email headers
    const trackingIdHeader = payload.data.headers?.find(
      (h) => h.name.toLowerCase() === "x-tracking-id"
    );
    const trackingId = trackingIdHeader?.value;

    if (!trackingId) {
      console.log("No tracking ID found in email headers");
      return new Response(JSON.stringify({ success: true, message: "No tracking ID" }), {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    const now = new Date().toISOString();

    switch (payload.type) {
      case "email.sent":
        console.log(`Email sent: ${trackingId}`);
        break;

      case "email.delivered":
        console.log(`Email delivered: ${trackingId}`);
        
        // Update email_logs
        await supabase
          .from("email_logs")
          .update({ 
            status: "delivered",
            delivered_at: now,
          })
          .eq("tracking_id", trackingId);
        break;

      case "email.opened":
        console.log(`Email opened: ${trackingId}`);
        
        // Update email_logs - increment open count
        const { data: emailLog } = await supabase
          .from("email_logs")
          .select("id, invoice_id, user_id, open_count, opened_at")
          .eq("tracking_id", trackingId)
          .single();

        if (emailLog) {
          const isFirstOpen = !emailLog.opened_at;
          
          await supabase
            .from("email_logs")
            .update({ 
              status: "opened",
              opened_at: emailLog.opened_at || now,
              open_count: (emailLog.open_count || 0) + 1,
            })
            .eq("id", emailLog.id);

          // Update invoice_reminders if linked
          const newOpenCount = 1;
          await supabase
            .from("invoice_reminders")
            .update({
              opened_at: now,
              open_count: newOpenCount,
            })
            .eq("tracking_id", trackingId)
            .is("opened_at", null); // Only update if not already opened

          // Log activity only on first open
          if (isFirstOpen) {
            await supabase.from("invoice_activity_logs").insert({
              invoice_id: emailLog.invoice_id,
              user_id: emailLog.user_id,
              event_type: "email_opened",
              event_data: {
                tracking_id: trackingId,
                opened_at: now,
              },
            });
          }
        }
        break;

      case "email.clicked":
        console.log(`Email link clicked: ${trackingId}`);
        
        // Log click event
        const { data: clickEmailLog } = await supabase
          .from("email_logs")
          .select("invoice_id, user_id")
          .eq("tracking_id", trackingId)
          .single();

        if (clickEmailLog) {
          await supabase.from("invoice_activity_logs").insert({
            invoice_id: clickEmailLog.invoice_id,
            user_id: clickEmailLog.user_id,
            event_type: "payment_link_clicked",
            event_data: {
              tracking_id: trackingId,
              clicked_at: now,
            },
          });
        }
        break;

      case "email.bounced":
      case "email.complained":
        console.log(`Email ${payload.type}: ${trackingId}`);
        
        await supabase
          .from("email_logs")
          .update({ 
            status: "failed",
            failed_at: now,
            failure_reason: payload.type === "email.bounced" ? "Email bounced" : "Spam complaint",
          })
          .eq("tracking_id", trackingId);

        // Update reminder status
        await supabase
          .from("invoice_reminders")
          .update({
            status: "failed",
            failure_reason: payload.type === "email.bounced" ? "Email bounced" : "Spam complaint",
          })
          .eq("tracking_id", trackingId);
        break;

      default:
        console.log(`Unhandled event type: ${payload.type}`);
    }

    return new Response(
      JSON.stringify({ success: true, event: payload.type }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Webhook error:", errorMessage);
    
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
