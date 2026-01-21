import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Json } from "@/integrations/supabase/types";

export interface InvoiceActivityLog {
  id: string;
  invoice_id: string;
  user_id: string;
  event_type: string;
  event_data: Json;
  created_at: string;
}

export type ActivityEventType =
  | "invoice_created"
  | "invoice_edited"
  | "invoice_paid"
  | "status_changed"
  | "due_date_changed"
  | "reminder_scheduled"
  | "reminder_sent"
  | "email_sent"
  | "sms_sent"
  | "email_opened"
  | "reminder_cancelled"
  | "reminders_cancelled"
  | "payment_link_clicked";

export interface ActivityLogDisplay {
  id: string;
  type: ActivityEventType;
  timestamp: Date;
  description: string;
  details?: string;
  icon: "invoice" | "edit" | "paid" | "email" | "sms" | "opened" | "scheduled" | "cancelled";
}

export const useInvoiceActivityLogs = (invoiceId?: string) => {
  const queryClient = useQueryClient();

  // Fetch activity logs for an invoice
  const {
    data: logs = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["invoice-activity-logs", invoiceId],
    queryFn: async () => {
      if (!invoiceId) return [];

      const { data, error } = await supabase
        .from("invoice_activity_logs")
        .select("*")
        .eq("invoice_id", invoiceId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as InvoiceActivityLog[];
    },
    enabled: !!invoiceId,
  });

  // Transform logs to display format
  const activities: ActivityLogDisplay[] = logs.map((log) => {
    const eventData = (log.event_data || {}) as Record<string, Json>;
    
    return {
      id: log.id,
      type: log.event_type as ActivityEventType,
      timestamp: new Date(log.created_at),
      description: getEventDescription(log.event_type, eventData),
      details: getEventDetails(log.event_type, eventData),
      icon: getEventIcon(log.event_type),
    };
  });

  // Add a manual activity log entry
  const addActivityLog = useMutation({
    mutationFn: async ({
      invoiceId,
      eventType,
      eventData = {},
    }: {
      invoiceId: string;
      eventType: string;
      eventData?: Record<string, Json>;
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("invoice_activity_logs")
        .insert([{
          invoice_id: invoiceId,
          user_id: user.id,
          event_type: eventType,
          event_data: eventData,
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invoice-activity-logs"] });
    },
  });

  return {
    logs,
    activities,
    isLoading,
    error,
    refetch,
    addActivityLog,
  };
};

// Helper functions for display formatting
function getEventDescription(eventType: string, eventData: Record<string, Json>): string {
  switch (eventType) {
    case "invoice_created":
      return `Invoice ${eventData.invoice_number || ""} created`;
    case "invoice_edited":
      return "Invoice details updated";
    case "invoice_paid":
      return "Invoice marked as paid";
    case "status_changed":
      return `Status changed to ${eventData.new_status || "unknown"}`;
    case "due_date_changed":
      return "Due date updated";
    case "reminder_scheduled":
      return `${(eventData.channel as string)?.toUpperCase() || "Reminder"} reminder scheduled`;
    case "email_sent":
      return "Email reminder sent";
    case "sms_sent":
      return "SMS reminder sent";
    case "reminder_sent":
      return "Reminder sent";
    case "email_opened":
      return "Email opened by client";
    case "reminder_cancelled":
      return "Reminder cancelled";
    case "reminders_cancelled":
      return "All scheduled reminders cancelled";
    case "payment_link_clicked":
      return "Payment link clicked";
    default:
      return eventType.replace(/_/g, " ");
  }
}

function getEventDetails(eventType: string, eventData: Record<string, Json>): string | undefined {
  switch (eventType) {
    case "invoice_created":
      return eventData.amount ? `Amount: ${eventData.amount}` : undefined;
    case "invoice_edited":
      if (eventData.old_amount && eventData.new_amount) {
        return `Amount changed from ${eventData.old_amount} to ${eventData.new_amount}`;
      }
      return undefined;
    case "status_changed":
      return `From ${eventData.old_status} to ${eventData.new_status}`;
    case "due_date_changed":
      return `From ${eventData.old_due_date} to ${eventData.new_due_date}`;
    case "reminder_scheduled":
      const timing = eventData.timing_type === "on_due" 
        ? "On due date"
        : `${eventData.timing_days} days ${eventData.timing_type} due date`;
      return `${timing} • ${(eventData.tone as string)?.charAt(0).toUpperCase()}${(eventData.tone as string)?.slice(1) || ""} tone`;
    case "email_sent":
    case "sms_sent":
      return eventData.tone ? `Tone: ${eventData.tone}` : undefined;
    case "reminders_cancelled":
      return eventData.reason === "invoice_marked_paid" 
        ? "Reason: Invoice marked as paid" 
        : undefined;
    default:
      return undefined;
  }
}

function getEventIcon(eventType: string): ActivityLogDisplay["icon"] {
  switch (eventType) {
    case "invoice_created":
      return "invoice";
    case "invoice_edited":
    case "due_date_changed":
      return "edit";
    case "invoice_paid":
      return "paid";
    case "email_sent":
      return "email";
    case "sms_sent":
      return "sms";
    case "email_opened":
      return "opened";
    case "reminder_scheduled":
      return "scheduled";
    case "reminder_cancelled":
    case "reminders_cancelled":
      return "cancelled";
    default:
      return "invoice";
  }
}

export default useInvoiceActivityLogs;
