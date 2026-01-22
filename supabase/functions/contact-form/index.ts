import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Rate limiting settings - using persistent database storage
const RATE_LIMIT_WINDOW_MINUTES = 5; // 5 minute window
const MAX_REQUESTS_PER_IP = 3; // Max 3 requests per 5 minutes per IP

interface ContactRequest {
  name: string;
  email: string;
  message: string;
  honeypot?: string; // Hidden field - should be empty
}

/**
 * Check if the IP is rate limited using persistent database storage
 * Returns true if rate limited, false otherwise
 */
async function isRateLimited(
  // deno-lint-ignore no-explicit-any
  supabase: any,
  clientIP: string
): Promise<boolean> {
  const windowStart = new Date(Date.now() - RATE_LIMIT_WINDOW_MINUTES * 60 * 1000);
  
  // Count recent requests from this IP
  const { count, error } = await supabase
    .from("contact_rate_limits")
    .select("*", { count: "exact", head: true })
    .eq("ip_address", clientIP)
    .gte("created_at", windowStart.toISOString());

  if (error) {
    console.error("Rate limit check error:", error);
    // On error, allow the request but log it
    return false;
  }

  return (count || 0) >= MAX_REQUESTS_PER_IP;
}

/**
 * Log a rate limit entry for the IP
 */
async function logRateLimitEntry(
  // deno-lint-ignore no-explicit-any
  supabase: any,
  clientIP: string
): Promise<void> {
  const { error } = await supabase
    .from("contact_rate_limits")
    .insert([{ ip_address: clientIP }]);

  if (error) {
    console.error("Failed to log rate limit entry:", error);
  }
}

/**
 * Basic email domain validation - reject common disposable email domains
 */
function isDisposableEmail(email: string): boolean {
  const disposableDomains = [
    "tempmail.com", "throwaway.email", "guerrillamail.com", "mailinator.com",
    "10minutemail.com", "temp-mail.org", "fakeinbox.com", "trashmail.com",
    "yopmail.com", "getnada.com", "dispostable.com", "maildrop.cc"
  ];
  
  const domain = email.split("@")[1]?.toLowerCase();
  return disposableDomains.includes(domain);
}

async function sendAutoReplyEmail(to: string, name: string): Promise<boolean> {
  try {
    const emailHtml = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Message Received - RemindSwift</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f8fafc; line-height: 1.6;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f8fafc;">
          <tr>
            <td align="center" style="padding: 40px 20px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);">
                
                <!-- Header with Logo -->
                <tr>
                  <td style="background: linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%); padding: 32px 40px; text-align: center;">
                    <table role="presentation" cellspacing="0" cellpadding="0" style="margin: 0 auto;">
                      <tr>
                        <td style="vertical-align: middle; padding-right: 12px;">
                          <div style="width: 48px; height: 48px; background-color: rgba(255, 255, 255, 0.2); border-radius: 12px; display: inline-flex; align-items: center; justify-content: center;">
                            <span style="font-size: 24px;">🔔</span>
                          </div>
                        </td>
                        <td style="vertical-align: middle;">
                          <span style="font-size: 28px; font-weight: 700; color: #ffffff; letter-spacing: -0.5px;">
                            Remind<span style="color: #c4b5fd;">Swift</span>
                          </span>
                        </td>
                      </tr>
                    </table>
                    <p style="color: rgba(255, 255, 255, 0.9); font-size: 14px; margin: 16px 0 0 0;">
                      Message Received ✓
                    </p>
                  </td>
                </tr>
                
                <!-- Main Content -->
                <tr>
                  <td style="padding: 40px;">
                    <h1 style="color: #1e293b; font-size: 24px; font-weight: 700; margin: 0 0 24px 0;">
                      Hi ${name}! 👋
                    </h1>
                    
                    <p style="color: #475569; font-size: 16px; margin: 0 0 20px 0;">
                      Thank you for reaching out to us. We've received your message and our team will review it shortly.
                    </p>
                    
                    <!-- Info Card -->
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%); border-radius: 12px; margin: 24px 0;">
                      <tr>
                        <td style="padding: 24px;">
                          <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                            <tr>
                              <td style="vertical-align: top; padding-right: 16px; width: 40px;">
                                <span style="font-size: 24px;">⏱️</span>
                              </td>
                              <td>
                                <p style="color: #0369a1; font-size: 14px; font-weight: 600; margin: 0 0 4px 0;">
                                  Expected Response Time
                                </p>
                                <p style="color: #0c4a6e; font-size: 18px; font-weight: 700; margin: 0;">
                                  24–48 Hours
                                </p>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                    
                    <p style="color: #475569; font-size: 16px; margin: 20px 0;">
                      If you have any additional details or questions, feel free to reply directly to this email.
                    </p>
                    
                    <p style="color: #475569; font-size: 16px; margin: 24px 0 0 0;">
                      Warm regards,<br/>
                      <strong style="color: #1e293b;">The RemindSwift Team</strong>
                    </p>
                  </td>
                </tr>
                
                <!-- Footer -->
                <tr>
                  <td style="background-color: #f8fafc; padding: 24px 40px; border-top: 1px solid #e2e8f0;">
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                      <tr>
                        <td align="center">
                          <p style="color: #64748b; font-size: 12px; margin: 0 0 8px 0;">
                            This is an automated response from RemindSwift.
                          </p>
                          <p style="color: #94a3b8; font-size: 11px; margin: 0;">
                            © ${new Date().getFullYear()} RemindSwift. All rights reserved.
                          </p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `;

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "RemindSwift <onboarding@resend.dev>",
        to: [to],
        subject: "We received your message – RemindSwift",
        html: emailHtml,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error("Resend API error:", errorData);
      return false;
    }

    console.log("Auto-reply email sent to:", to);
    return true;
  } catch (error) {
    console.error("Failed to send auto-reply email:", error);
    return false;
  }
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Initialize Supabase client with service role for rate limiting and inserting
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get client IP for rate limiting
    const clientIP = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || 
                     req.headers.get("cf-connecting-ip") || 
                     "unknown";

    // Persistent rate limiting check
    if (await isRateLimited(supabase, clientIP)) {
      console.log(`Rate limited (persistent): ${clientIP}`);
      return new Response(
        JSON.stringify({ error: "Too many requests. Please wait a few minutes before trying again." }),
        { status: 429, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Parse and validate request
    const { name, email, message, honeypot }: ContactRequest = await req.json();

    // Honeypot check - if filled, it's a bot
    if (honeypot && honeypot.trim() !== "") {
      console.log("Honeypot triggered - bot detected");
      // Return success to not reveal detection
      return new Response(
        JSON.stringify({ success: true }),
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Server-side validation
    if (!name || !email || !message) {
      return new Response(
        JSON.stringify({ error: "All fields are required" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new Response(
        JSON.stringify({ error: "Invalid email address" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Check for disposable email domains
    if (isDisposableEmail(email)) {
      return new Response(
        JSON.stringify({ error: "Please use a valid email address" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Check for suspiciously short or long inputs
    if (name.trim().length < 2 || name.length > 100) {
      return new Response(
        JSON.stringify({ error: "Name must be between 2 and 100 characters" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    if (message.trim().length < 10 || message.length > 5000) {
      return new Response(
        JSON.stringify({ error: "Message must be between 10 and 5000 characters" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Log rate limit entry AFTER validation passes
    await logRateLimitEntry(supabase, clientIP);

    // Save to database
    const { data: contactMessage, error: dbError } = await supabase
      .from("contact_messages")
      .insert({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        message: message.trim(),
        ip_address: clientIP,
      })
      .select()
      .single();

    if (dbError) {
      console.error("Database error:", dbError);
      return new Response(
        JSON.stringify({ error: "Failed to save message. Please try again." }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    console.log("Contact message saved:", contactMessage.id);

    // Send auto-reply email (fail silently)
    await sendAutoReplyEmail(email.trim(), name.trim());

    return new Response(
      JSON.stringify({ success: true, id: contactMessage.id }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Error in contact-form function:", errorMessage);
    return new Response(
      JSON.stringify({ error: "An unexpected error occurred. Please try again." }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
