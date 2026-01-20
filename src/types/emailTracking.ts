// Email Tracking Types for PayPing

export type ReminderType = "email" | "sms";
export type ReminderTone = "polite" | "professional" | "firm";
export type DeliveryStatus = "sent" | "failed" | "pending";

export interface ReminderLog {
  id: string;
  invoiceId: string;
  clientId: string;
  userId: string;
  reminderType: ReminderType;
  reminderTone: ReminderTone;
  sentAt: Date;
  deliveryStatus: DeliveryStatus;
  openedAt: Date | null;
  openCount: number;
  createdAt: Date;
  trackingId: string;
}

export interface EmailTrackingStats {
  emailsSentToday: number;
  emailsOpenedToday: number;
  openRate: number;
  totalEmailsSent: number;
  totalEmailsOpened: number;
}

export interface InvoiceEmailStatus {
  lastEmailSent: Date | null;
  lastEmailOpened: Date | null;
  emailStatus: "not_sent" | "sent" | "opened" | "failed";
  totalEmailsSent: number;
  totalOpens: number;
}

// Helper to generate a unique tracking ID
export function generateTrackingId(): string {
  return `trk_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
}

// Get email status display info
export function getEmailStatusInfo(status: InvoiceEmailStatus["emailStatus"]): {
  icon: "not_sent" | "sent" | "opened" | "failed";
  label: string;
  color: string;
} {
  switch (status) {
    case "opened":
      return { icon: "opened", label: "Email Opened", color: "text-success" };
    case "sent":
      return { icon: "sent", label: "Email Sent", color: "text-primary" };
    case "failed":
      return { icon: "failed", label: "Email Failed", color: "text-destructive" };
    default:
      return { icon: "not_sent", label: "Not sent yet", color: "text-muted-foreground" };
  }
}
