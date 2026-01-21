import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

async function sendEmailWithResend(to: string[], subject: string, html: string, trackingId: string) {
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "RemindSwift <support@remindswift.com>",
      to,
      subject,
      html,
      headers: {
        "X-Tracking-Id": trackingId,
      },
    }),
  });

  const data = await response.json();
  
  if (!response.ok) {
    return { error: { message: data.message || "Failed to send email" }, data: null };
  }
  
  return { error: null, data };
}

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// Template types
type TemplateTone = "polite" | "professional" | "firm";

interface TemplateVariables {
  clientName: string;
  invoiceNumber: string;
  amount: string;
  currency: string;
  dueDate: string;
  paymentLink: string;
  senderName: string;
}

interface EmailTemplate {
  subject: string;
  body: string;
}

// Email templates
const emailTemplates: Record<TemplateTone, EmailTemplate> = {
  polite: {
    subject: "Friendly Reminder: Invoice {{invoiceNumber}}",
    body: `Hi {{clientName}},

I hope this message finds you well! Just a polite reminder about invoice {{invoiceNumber}} for {{currency}}{{amount}}, which is due on {{dueDate}}.

When you have a moment, you can complete the payment using the link below:
{{paymentLink}}

If you've already sent the payment, please disregard this message. Thank you so much for your business!

Warm regards,
{{senderName}}

—
Sent via RemindSwift`,
  },
  professional: {
    subject: "Invoice Reminder: {{invoiceNumber}}",
    body: `Dear {{clientName}},

This is a reminder regarding invoice {{invoiceNumber}} for {{currency}}{{amount}}, due on {{dueDate}}.

Please process the payment at your earliest convenience using the following link:
{{paymentLink}}

If you have any questions about this invoice, please don't hesitate to reach out.

Best regards,
{{senderName}}

—
Sent via RemindSwift`,
  },
  firm: {
    subject: "Action Required: Invoice {{invoiceNumber}} Overdue",
    body: `Dear {{clientName}},

Invoice {{invoiceNumber}} for {{currency}}{{amount}} was due on {{dueDate}} and requires immediate attention.

Please complete the payment today using the link below:
{{paymentLink}}

If there are any issues preventing payment, please contact us immediately to discuss.

Regards,
{{senderName}}

—
Sent via RemindSwift`,
  },
};

function substituteVariables(template: string, variables: TemplateVariables): string {
  return template
    .replace(/\{\{clientName\}\}/g, variables.clientName)
    .replace(/\{\{invoiceNumber\}\}/g, variables.invoiceNumber)
    .replace(/\{\{amount\}\}/g, variables.amount)
    .replace(/\{\{currency\}\}/g, variables.currency)
    .replace(/\{\{dueDate\}\}/g, variables.dueDate)
    .replace(/\{\{paymentLink\}\}/g, variables.paymentLink)
    .replace(/\{\{senderName\}\}/g, variables.senderName);
}

function getEmailTemplate(tone: TemplateTone, variables: TemplateVariables): EmailTemplate {
  const template = emailTemplates[tone] || emailTemplates.polite;
  return {
    subject: substituteVariables(template.subject, variables),
    body: substituteVariables(template.body, variables),
  };
}

function convertToHtml(text: string, paymentLink: string, variables: TemplateVariables): string {
  const lines = text.split('\n');
  const formattedLines = lines.map(line => {
    if (line.trim() === '') return '<br>';
    if (line.includes(paymentLink)) return ''; // Remove payment link from body (we have CTA)
    const escapedLine = line
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
    return `<p style="margin: 0 0 14px 0; color: #374151;">${escapedLine}</p>`;
  }).join('');
  
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Invoice Reminder - RemindSwift</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #1f2937; background-color: #f8fafc; margin: 0; padding: 0;">
  <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
    
    <!-- Logo Header -->
    <div style="text-align: center; margin-bottom: 24px;">
      <div style="display: inline-block;">
        <table cellpadding="0" cellspacing="0" border="0">
          <tr>
            <td style="background: linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%); width: 44px; height: 44px; border-radius: 12px; text-align: center; vertical-align: middle;">
              <span style="font-size: 22px; line-height: 44px;">🔔</span>
            </td>
            <td style="padding-left: 12px;">
              <span style="font-size: 24px; font-weight: 700; color: #1f2937; letter-spacing: -0.5px;">Remind</span><span style="font-size: 24px; font-weight: 700; color: #4F46E5; letter-spacing: -0.5px;">Swift</span>
            </td>
          </tr>
        </table>
      </div>
    </div>
    
    <!-- Main Card -->
    <div style="background: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1);">
      
      <!-- Header Banner -->
      <div style="background: linear-gradient(135deg, #4F46E5 0%, #6366F1 50%, #7C3AED 100%); padding: 32px 24px; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 24px; font-weight: 600;">Payment Reminder</h1>
        <p style="color: rgba(255,255,255,0.85); margin: 8px 0 0 0; font-size: 14px;">A friendly nudge about your invoice</p>
      </div>
      
      <!-- Invoice Details Card -->
      <div style="padding: 28px 24px;">
        <div style="background: linear-gradient(135deg, #F5F3FF 0%, #EEF2FF 100%); border-radius: 16px; padding: 24px; margin-bottom: 24px; border: 1px solid #E0E7FF;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 0 0 16px 0;">
                <span style="color: #6b7280; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">Invoice Number</span><br>
                <span style="color: #1f2937; font-size: 18px; font-weight: 600;">${variables.invoiceNumber}</span>
              </td>
              <td style="padding: 0 0 16px 0; text-align: right;">
                <span style="color: #6b7280; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">Amount Due</span><br>
                <span style="color: #4F46E5; font-size: 26px; font-weight: 700;">${variables.currency}${variables.amount}</span>
              </td>
            </tr>
            <tr>
              <td colspan="2" style="padding: 16px 0 0 0; border-top: 1px dashed #C7D2FE;">
                <span style="color: #6b7280; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">Due Date</span><br>
                <span style="color: #1f2937; font-size: 16px; font-weight: 500;">📅 ${variables.dueDate}</span>
              </td>
            </tr>
          </table>
        </div>
        
        <!-- Message Content -->
        <div style="font-size: 15px; line-height: 1.8; margin-bottom: 28px;">
          ${formattedLines}
        </div>
        
        <!-- CTA Button -->
        <div style="text-align: center; margin: 32px 0;">
          <a href="${paymentLink}" style="display: inline-block; background: linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%); color: white; text-decoration: none; padding: 18px 48px; border-radius: 12px; font-size: 16px; font-weight: 600; box-shadow: 0 10px 25px -5px rgba(79, 70, 229, 0.5); letter-spacing: 0.3px;">
            Pay Now →
          </a>
        </div>
        
        <p style="text-align: center; color: #9ca3af; font-size: 12px; margin: 0;">
          🔒 Secure payment via your preferred provider
        </p>
      </div>
      
      <!-- Footer -->
      <div style="background: #f9fafb; padding: 24px; border-top: 1px solid #e5e7eb;">
        <table style="width: 100%;">
          <tr>
            <td style="text-align: center;">
              <p style="color: #6b7280; font-size: 14px; margin: 0 0 4px 0;">
                Sent on behalf of
              </p>
              <p style="color: #1f2937; font-size: 16px; font-weight: 600; margin: 0;">
                ${variables.senderName}
              </p>
            </td>
          </tr>
        </table>
      </div>
    </div>
    
    <!-- Bottom Branding -->
    <div style="text-align: center; padding: 28px 20px;">
      <p style="color: #9ca3af; font-size: 12px; margin: 0 0 8px 0;">
        Automated reminder powered by
      </p>
      <a href="https://remindswift.com" style="color: #4F46E5; text-decoration: none; font-weight: 600; font-size: 13px;">
        RemindSwift
      </a>
      <p style="color: #d1d5db; font-size: 11px; margin: 16px 0 0 0;">
        If you've already paid, please disregard this message.
      </p>
    </div>
    
  </div>
</body>
</html>`;
}

interface SendReminderRequest {
  reminderId: string;
  invoiceId: string;
  recipientEmail: string;
  clientName: string;
  invoiceNumber: string;
  amount: number;
  currency: string;
  dueDate: string;
  paymentLink: string;
  senderName: string;
  tone: TemplateTone;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get authorization header
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("No authorization header");
    }

    // Create Supabase client with user's auth
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    // Verify user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      throw new Error("Unauthorized");
    }

    const payload: SendReminderRequest = await req.json();
    const {
      reminderId,
      invoiceId,
      recipientEmail,
      clientName,
      invoiceNumber,
      amount,
      currency,
      dueDate,
      paymentLink,
      senderName,
      tone,
    } = payload;

    // Validate required fields
    if (!recipientEmail || !invoiceNumber) {
      throw new Error("Missing required fields: recipientEmail and invoiceNumber");
    }

    // Generate tracking ID for email opens
    const trackingId = crypto.randomUUID();

    // Get email template
    const variables: TemplateVariables = {
      clientName: clientName || "Valued Customer",
      invoiceNumber,
      amount: amount?.toLocaleString() || "0",
      currency: currency || "₹",
      dueDate: dueDate || "N/A",
      paymentLink: paymentLink || "#",
      senderName: senderName || "Your Business",
    };

    const emailContent = getEmailTemplate(tone || "polite", variables);
    const htmlBody = convertToHtml(emailContent.body, paymentLink || "#", variables);

    console.log(`Sending reminder email to ${recipientEmail} for invoice ${invoiceNumber}`);

    // Send email via Resend
    const emailResponse = await sendEmailWithResend(
      [recipientEmail],
      emailContent.subject,
      htmlBody,
      trackingId
    );

    if (emailResponse.error) {
      console.error("Resend error:", emailResponse.error);
      
      // Update reminder status to failed
      if (reminderId) {
        await supabase
          .from("invoice_reminders")
          .update({
            status: "failed",
            failure_reason: emailResponse.error.message,
            updated_at: new Date().toISOString(),
          })
          .eq("id", reminderId);
      }

      // Log to email_logs
      await supabase.from("email_logs").insert({
        user_id: user.id,
        invoice_id: invoiceId,
        reminder_id: reminderId || null,
        recipient_email: recipientEmail,
        subject: emailContent.subject,
        template_type: "reminder",
        status: "failed",
        failed_at: new Date().toISOString(),
        failure_reason: emailResponse.error.message,
        tracking_id: trackingId,
      });

      throw new Error(`Failed to send email: ${emailResponse.error.message}`);
    }

    console.log("Email sent successfully:", emailResponse.data?.id);

    // Update reminder status to sent
    if (reminderId) {
      await supabase
        .from("invoice_reminders")
        .update({
          status: "sent",
          sent_at: new Date().toISOString(),
          tracking_id: trackingId,
          updated_at: new Date().toISOString(),
        })
        .eq("id", reminderId);
    }

    // Log to email_logs
    await supabase.from("email_logs").insert({
      user_id: user.id,
      invoice_id: invoiceId,
      reminder_id: reminderId || null,
      recipient_email: recipientEmail,
      subject: emailContent.subject,
      template_type: "reminder",
      status: "sent",
      sent_at: new Date().toISOString(),
      resend_message_id: emailResponse.data?.id,
      tracking_id: trackingId,
    });

    return new Response(
      JSON.stringify({
        success: true,
        messageId: emailResponse.data?.id,
        trackingId,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Error in send-reminder function:", errorMessage);
    
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        status: error instanceof Error && error.message === "Unauthorized" ? 401 : 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
