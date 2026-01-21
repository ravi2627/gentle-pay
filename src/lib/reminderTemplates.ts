/**
 * Reminder Template System
 * Tone-based email and SMS templates with variable substitution
 */

export type TemplateTone = "polite" | "professional" | "firm";

export interface TemplateVariables {
  clientName: string;
  invoiceNumber: string;
  amount: string;
  currency: string;
  dueDate: string;
  paymentLink: string;
  senderName: string;
}

export interface EmailTemplate {
  subject: string;
  body: string;
}

// Email templates by tone
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

// SMS templates by tone
const smsTemplates: Record<TemplateTone, string> = {
  polite: `Hi {{clientName}}! Quick reminder about invoice {{invoiceNumber}} ({{currency}}{{amount}}) due {{dueDate}}. Pay here: {{paymentLink}} — {{senderName}} via RemindSwift`,
  professional: `Invoice reminder: {{invoiceNumber}} for {{currency}}{{amount}} is due {{dueDate}}. Pay now: {{paymentLink}} — {{senderName}} via RemindSwift`,
  firm: `URGENT: Invoice {{invoiceNumber}} ({{currency}}{{amount}}) is overdue. Pay immediately: {{paymentLink}} — {{senderName}} via RemindSwift`,
};

/**
 * Substitute template variables with actual values
 */
export function substituteVariables(
  template: string,
  variables: TemplateVariables
): string {
  return template
    .replace(/\{\{clientName\}\}/g, variables.clientName)
    .replace(/\{\{invoiceNumber\}\}/g, variables.invoiceNumber)
    .replace(/\{\{amount\}\}/g, variables.amount)
    .replace(/\{\{currency\}\}/g, variables.currency)
    .replace(/\{\{dueDate\}\}/g, variables.dueDate)
    .replace(/\{\{paymentLink\}\}/g, variables.paymentLink)
    .replace(/\{\{senderName\}\}/g, variables.senderName);
}

/**
 * Get email template with substituted variables
 */
export function getEmailPreview(
  tone: TemplateTone,
  variables: TemplateVariables
): EmailTemplate {
  const template = emailTemplates[tone];
  return {
    subject: substituteVariables(template.subject, variables),
    body: substituteVariables(template.body, variables),
  };
}

/**
 * Get SMS template with substituted variables
 */
export function getSmsPreview(
  tone: TemplateTone,
  variables: TemplateVariables
): string {
  const template = smsTemplates[tone];
  return substituteVariables(template, variables);
}

/**
 * Get human-readable timing description
 */
export function getTimingDescription(
  timingType: "before" | "on_due" | "after",
  timingDays: number
): string {
  if (timingType === "on_due") {
    return "On due date";
  }
  
  const dayWord = timingDays === 1 ? "day" : "days";
  
  if (timingType === "before") {
    return `${timingDays} ${dayWord} before due date`;
  }
  
  return `${timingDays} ${dayWord} after due date`;
}

/**
 * Get human-readable channel description
 */
export function getChannelDescription(channel: "email" | "sms" | "both"): string {
  switch (channel) {
    case "email":
      return "Email";
    case "sms":
      return "SMS";
    case "both":
      return "Email + SMS";
  }
}

/**
 * Get tone label with emoji
 */
export function getToneLabel(tone: TemplateTone): string {
  switch (tone) {
    case "polite":
      return "Polite 😊";
    case "professional":
      return "Professional 💼";
    case "firm":
      return "Firm ⚡";
  }
}
