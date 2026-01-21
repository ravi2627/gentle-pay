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
      from: "InvoiceNudge <onboarding@resend.dev>",
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
    subject: "Friendly Reminder: Invoice {{invoiceNumber}} Payment",
    body: `Hi {{clientName}},

I hope this message finds you well! Just a gentle reminder about invoice {{invoiceNumber}} for {{currency}}{{amount}}, which is due on {{dueDate}}.

When you have a moment, you can complete the payment using the link below:
{{paymentLink}}

If you've already sent the payment, please disregard this message. Thank you so much for your business!

Warm regards,
{{senderName}}`,
  },
  professional: {
    subject: "Payment Reminder: Invoice {{invoiceNumber}}",
    body: `Dear {{clientName}},

This is a reminder regarding invoice {{invoiceNumber}} for {{currency}}{{amount}}, due on {{dueDate}}.

Please process the payment at your earliest convenience using the following link:
{{paymentLink}}

If you have any questions about this invoice, please don't hesitate to reach out.

Best regards,
{{senderName}}`,
  },
  firm: {
    subject: "Action Required: Invoice {{invoiceNumber}} Payment Overdue",
    body: `Dear {{clientName}},

Invoice {{invoiceNumber}} for {{currency}}{{amount}} was due on {{dueDate}} and requires immediate attention.

Please complete the payment today using the link below:
{{paymentLink}}

If there are any issues preventing payment, please contact us immediately to discuss.

Regards,
{{senderName}}`,
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

function convertToHtml(text: string, paymentLink: string): string {
  const escapedText = text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
  
  const linkedText = escapedText.replace(
    paymentLink,
    `<a href="${paymentLink}" style="color: #4F46E5; text-decoration: underline;">Click here to pay</a>`
  );
  
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 12px 12px 0 0; text-align: center;">
    <h1 style="color: white; margin: 0; font-size: 24px;">Payment Reminder</h1>
  </div>
  <div style="background: #ffffff; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 12px 12px;">
    <pre style="font-family: inherit; white-space: pre-wrap; margin: 0;">${linkedText}</pre>
  </div>
  <div style="text-align: center; padding: 20px; color: #6b7280; font-size: 12px;">
    <p>This is an automated reminder. Please do not reply to this email.</p>
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
    const htmlBody = convertToHtml(emailContent.body, paymentLink || "#");

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
