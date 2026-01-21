import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Simple in-memory rate limiting (resets on function restart)
const rateLimitMap = new Map<string, number>();
const RATE_LIMIT_WINDOW = 60000; // 1 minute
const MAX_REQUESTS = 2; // Max 2 requests per minute per IP

interface ContactRequest {
  name: string;
  email: string;
  message: string;
  honeypot?: string; // Hidden field - should be empty
}

async function sendAutoReplyEmail(to: string, name: string): Promise<boolean> {
  try {
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
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #1a1a1a; margin-bottom: 20px;">Hi ${name},</h2>
            
            <p style="color: #4a4a4a; line-height: 1.6; margin-bottom: 16px;">
              Thanks for contacting RemindSwift.
            </p>
            
            <p style="color: #4a4a4a; line-height: 1.6; margin-bottom: 16px;">
              We've received your message and our team will get back to you within 24–48 hours.
            </p>
            
            <p style="color: #4a4a4a; line-height: 1.6; margin-bottom: 24px;">
              If you have additional details, feel free to reply to this email.
            </p>
            
            <p style="color: #4a4a4a; line-height: 1.6; margin-bottom: 8px;">
              Warm regards,<br/>
              <strong>RemindSwift Team</strong>
            </p>
            
            <hr style="border: none; border-top: 1px solid #e5e5e5; margin: 32px 0;" />
            
            <p style="color: #9a9a9a; font-size: 12px;">
              This is an automated response from RemindSwift.
            </p>
          </div>
        `,
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
    // Get client IP for rate limiting
    const clientIP = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || 
                     req.headers.get("cf-connecting-ip") || 
                     "unknown";

    // Rate limiting check
    const now = Date.now();
    const lastRequest = rateLimitMap.get(clientIP) || 0;
    if (now - lastRequest < RATE_LIMIT_WINDOW / MAX_REQUESTS) {
      console.log(`Rate limited: ${clientIP}`);
      return new Response(
        JSON.stringify({ error: "Too many requests. Please wait a moment." }),
        { status: 429, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }
    rateLimitMap.set(clientIP, now);

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

    // Initialize Supabase client with service role for inserting
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

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

  } catch (error: any) {
    console.error("Error in contact-form function:", error);
    return new Response(
      JSON.stringify({ error: "An unexpected error occurred. Please try again." }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
