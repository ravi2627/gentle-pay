import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Rate limit settings
const MAX_ATTEMPTS_PER_EMAIL = 5;
const MAX_ATTEMPTS_PER_IP = 10;
const WINDOW_MINUTES = 15;

interface RateLimitRequest {
  email: string;
  action: "check" | "record";
}

function getClientIP(req: Request): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown"
  );
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    const { email, action }: RateLimitRequest = await req.json();

    if (!email) {
      return new Response(
        JSON.stringify({ error: "Email is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const clientIP = getClientIP(req);
    const windowStart = new Date(Date.now() - WINDOW_MINUTES * 60 * 1000).toISOString();

    if (action === "check") {
      // Check email-based rate limit
      const { count: emailCount } = await supabaseAdmin
        .from("login_rate_limits")
        .select("*", { count: "exact", head: true })
        .eq("email", email.toLowerCase())
        .gte("created_at", windowStart);

      // Check IP-based rate limit
      const { count: ipCount } = await supabaseAdmin
        .from("login_rate_limits")
        .select("*", { count: "exact", head: true })
        .eq("ip_address", clientIP)
        .gte("created_at", windowStart);

      const isLimited = (emailCount || 0) >= MAX_ATTEMPTS_PER_EMAIL || (ipCount || 0) >= MAX_ATTEMPTS_PER_IP;

      return new Response(
        JSON.stringify({
          isLimited,
          emailAttempts: emailCount || 0,
          ipAttempts: ipCount || 0,
          maxEmailAttempts: MAX_ATTEMPTS_PER_EMAIL,
          maxIpAttempts: MAX_ATTEMPTS_PER_IP,
          windowMinutes: WINDOW_MINUTES,
        }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (action === "record") {
      // Record the login attempt
      await supabaseAdmin.from("login_rate_limits").insert({
        email: email.toLowerCase(),
        ip_address: clientIP,
      });

      return new Response(
        JSON.stringify({ success: true }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ error: "Invalid action" }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Rate limit error:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
};

serve(handler);
