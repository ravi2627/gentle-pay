// Types for the flexible invoice reminder system

export type ReminderTimingType = "before" | "on_due" | "after";
export type ReminderChannel = "email" | "sms" | "both";
export type ReminderTone = "polite" | "professional" | "firm";
export type ReminderStatus = "scheduled" | "sent" | "failed" | "cancelled";

export interface InvoiceReminder {
  id: string;
  invoice_id: string;
  user_id: string;
  timing_type: ReminderTimingType;
  timing_days: number;
  channel: ReminderChannel;
  tone: ReminderTone;
  sort_order: number;
  status: ReminderStatus;
  scheduled_for: string | null;
  sent_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateInvoiceReminderData {
  invoice_id: string;
  timing_type: ReminderTimingType;
  timing_days: number;
  channel: ReminderChannel;
  tone: ReminderTone;
  sort_order: number;
}

export interface ReminderFormItem {
  id: string; // Temporary ID for form state
  timing_type: ReminderTimingType;
  timing_days: number;
  channel: ReminderChannel;
  tone: ReminderTone;
}

// Default reminder presets
export const DEFAULT_REMINDERS: ReminderFormItem[] = [
  {
    id: "default-1",
    timing_type: "before",
    timing_days: 3,
    channel: "email",
    tone: "polite",
  },
  {
    id: "default-2",
    timing_type: "on_due",
    timing_days: 0,
    channel: "email",
    tone: "professional",
  },
  {
    id: "default-3",
    timing_type: "after",
    timing_days: 1,
    channel: "both",
    tone: "firm",
  },
];

export const MAX_REMINDERS = 5;

// Helper to get human-readable timing description
export function getReminderTimingLabel(
  timingType: ReminderTimingType,
  timingDays: number
): string {
  if (timingType === "on_due") {
    return "On due date";
  }
  const dayText = timingDays === 1 ? "day" : "days";
  if (timingType === "before") {
    return `${timingDays} ${dayText} before due date`;
  }
  return `${timingDays} ${dayText} after due date`;
}

// Helper to get channel label
export function getChannelLabel(channel: ReminderChannel): string {
  switch (channel) {
    case "email":
      return "Email";
    case "sms":
      return "SMS";
    case "both":
      return "Email + SMS";
  }
}

// Helper to get tone label with emoji
export function getToneLabel(tone: ReminderTone): string {
  switch (tone) {
    case "polite":
      return "Polite";
    case "professional":
      return "Professional";
    case "firm":
      return "Firm";
  }
}

// Timing options for dropdown
export const TIMING_OPTIONS = [
  { type: "before" as const, days: 7, label: "7 days before" },
  { type: "before" as const, days: 5, label: "5 days before" },
  { type: "before" as const, days: 3, label: "3 days before" },
  { type: "before" as const, days: 2, label: "2 days before" },
  { type: "before" as const, days: 1, label: "1 day before" },
  { type: "on_due" as const, days: 0, label: "On due date" },
  { type: "after" as const, days: 1, label: "1 day after" },
  { type: "after" as const, days: 2, label: "2 days after" },
  { type: "after" as const, days: 3, label: "3 days after" },
  { type: "after" as const, days: 5, label: "5 days after" },
  { type: "after" as const, days: 7, label: "7 days after" },
];
