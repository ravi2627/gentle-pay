import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Rate limit settings
const MAX_EMAIL_ATTEMPTS = 3;
const EMAIL_WINDOW_MINUTES = 15;
const MAX_IP_ATTEMPTS = 5;
const IP_WINDOW_MINUTES = 60;

interface ResetRequest {
  email: string;
}

const getClientIP = (req: Request): string => {
  return req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || 
         req.headers.get("x-real-ip") || 
         "unknown";
};

const generateResetEmailHtml = (resetLink: string): string => {
  const currentYear = new Date().getFullYear();
  
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reset Your Password</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f4f4f5;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="min-width: 100%; background-color: #f4f4f5;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);">
          
          <!-- Header with Logo -->
          <tr>
            <td style="background: linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%); padding: 32px 40px; text-align: center;">
              <table role="presentation" cellspacing="0" cellpadding="0" style="margin: 0 auto;">
                <tr>
                  <td style="vertical-align: middle; padding-right: 10px;">
                    <div style="width: 40px; height: 40px; background-color: rgba(255,255,255,0.2); border-radius: 10px; display: inline-block; text-align: center; line-height: 40px;">
                      <span style="font-size: 20px;">🔐</span>
                    </div>
                  </td>
                  <td style="vertical-align: middle;">
                    <span style="font-size: 28px; font-weight: 700; color: #ffffff; letter-spacing: -0.5px;">
                      Remind<span style="color: #c7d2fe;">Swift</span>
                    </span>
                  </td>
                </tr>
              </table>
              <p style="margin: 16px 0 0 0; color: rgba(255,255,255,0.9); font-size: 14px;">Security Team</p>
            </td>
          </tr>

          <!-- Main Content -->
          <tr>
            <td style="padding: 40px;">
              <h1 style="margin: 0 0 16px 0; font-size: 24px; font-weight: 700; color: #18181b; text-align: center;">
                Reset Your Password
              </h1>
              
              <p style="margin: 0 0 24px 0; font-size: 16px; line-height: 1.6; color: #52525b; text-align: center;">
                We received a request to reset your password. Click the button below to create a new password.
              </p>

              <!-- CTA Button -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td align="center" style="padding: 8px 0 24px 0;">
                    <a href="${resetLink}" target="_blank" style="display: inline-block; padding: 16px 48px; background: linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%); color: #ffffff; text-decoration: none; font-size: 16px; font-weight: 600; border-radius: 12px; box-shadow: 0 4px 14px rgba(79, 70, 229, 0.4);">
                      Reset Password
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Expiry Notice -->
              <div style="background-color: #fef3c7; border-radius: 12px; padding: 16px; margin-bottom: 24px;">
                <p style="margin: 0; font-size: 14px; color: #92400e; text-align: center;">
                  ⏰ This link will expire in <strong>1 hour</strong>
                </p>
              </div>

              <!-- Plain text link -->
              <p style="margin: 0 0 8px 0; font-size: 13px; color: #71717a; text-align: center;">
                Or copy and paste this link into your browser:
              </p>
              <p style="margin: 0 0 24px 0; font-size: 12px; color: #4F46E5; word-break: break-all; text-align: center;">
                ${resetLink}
              </p>

              <!-- Security Notice -->
              <div style="border-top: 1px solid #e4e4e7; padding-top: 24px;">
                <p style="margin: 0; font-size: 13px; color: #71717a; text-align: center; line-height: 1.5;">
                  🔒 <strong>Didn't request this?</strong><br>
                  If you didn't request a password reset, you can safely ignore this email. Your password won't be changed.
                </p>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #fafafa; padding: 24px 40px; border-top: 1px solid #e4e4e7;">
              <p style="margin: 0 0 8px 0; font-size: 12px; color: #71717a; text-align: center;">
                © ${currentYear} RemindSwift. All rights reserved.
              </p>
              <p style="margin: 0; font-size: 11px; color: #a1a1aa; text-align: center;">
                This is an automated security email. Please do not reply.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;
};

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    const { email }: ResetRequest = await req.json();
    
    if (!email) {
      return new Response(
        JSON.stringify({ error: "Email is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();
    const clientIP = getClientIP(req);
    const now = new Date();

    // Check rate limits
    const emailWindowStart = new Date(now.getTime() - EMAIL_WINDOW_MINUTES * 60 * 1000);
    const ipWindowStart = new Date(now.getTime() - IP_WINDOW_MINUTES * 60 * 1000);

    // Check email attempts
    const { count: emailAttempts } = await supabaseAdmin
      .from("password_reset_attempts")
      .select("*", { count: "exact", head: true })
      .eq("email", normalizedEmail)
      .gte("created_at", emailWindowStart.toISOString());

    if (emailAttempts && emailAttempts >= MAX_EMAIL_ATTEMPTS) {
      return new Response(
        JSON.stringify({ error: "Too many attempts. Please try again later." }),
        { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Check IP attempts
    const { count: ipAttempts } = await supabaseAdmin
      .from("password_reset_attempts")
      .select("*", { count: "exact", head: true })
      .eq("ip_address", clientIP)
      .gte("created_at", ipWindowStart.toISOString());

    if (ipAttempts && ipAttempts >= MAX_IP_ATTEMPTS) {
      return new Response(
        JSON.stringify({ error: "Too many attempts. Please try again later." }),
        { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Log the attempt
    await supabaseAdmin.from("password_reset_attempts").insert({
      email: normalizedEmail,
      ip_address: clientIP,
    });

    // Check if user exists (but don't reveal this to the client)
    const { data: users } = await supabaseAdmin.auth.admin.listUsers();
    const userExists = users?.users?.some(u => u.email?.toLowerCase() === normalizedEmail);

    if (!userExists) {
      // Return success even if user doesn't exist (prevent enumeration)
      console.log("Password reset requested for non-existent user:", normalizedEmail);
      return new Response(
        JSON.stringify({ success: true }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Generate reset link using Supabase
    const { data: resetData, error: resetError } = await supabaseAdmin.auth.admin.generateLink({
      type: "recovery",
      email: normalizedEmail,
      options: {
        redirectTo: `${req.headers.get("origin") || "https://remindswift.com"}/reset-password`,
      },
    });

    if (resetError) {
      console.error("Reset link generation error:", resetError);
      throw resetError;
    }

    const resetLink = resetData.properties?.action_link;
    
    if (!resetLink) {
      throw new Error("Failed to generate reset link");
    }

    // Send branded email via Resend
    if (!RESEND_API_KEY) {
      console.error("RESEND_API_KEY not configured");
      throw new Error("Email service not configured");
    }

    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "RemindSwift Security <support@remindswift.com>",
        to: [normalizedEmail],
        subject: "Reset your RemindSwift password",
        html: generateResetEmailHtml(resetLink),
        text: `Reset your RemindSwift password\n\nWe received a request to reset your password. Click the link below to create a new password:\n\n${resetLink}\n\nThis link will expire in 1 hour.\n\nIf you didn't request this, you can safely ignore this email.\n\n© ${new Date().getFullYear()} RemindSwift. All rights reserved.`,
      }),
    });

    if (!emailResponse.ok) {
      const errorData = await emailResponse.text();
      console.error("Resend API error:", errorData);
      throw new Error("Failed to send email");
    }

    console.log("Password reset email sent to:", normalizedEmail);

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    console.error("Password reset error:", error);
    
    // Don't reveal specific errors to prevent enumeration
    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
};

serve(handler);
