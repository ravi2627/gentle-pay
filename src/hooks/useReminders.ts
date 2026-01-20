import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface Reminder {
  id: string;
  user_id: string;
  invoice_id: string;
  type: "email" | "sms";
  status: "pending" | "sent" | "delivered" | "opened" | "failed";
  sent_at: string;
  opened_at: string | null;
  recipient_email: string | null;
  recipient_phone: string | null;
  template_used: string | null;
  created_at: string;
}

export interface ReminderWithInvoice extends Reminder {
  invoice_number: string;
  client_name: string | null;
  amount: number;
}

export interface CreateReminderData {
  invoice_id: string;
  type?: "email" | "sms";
  recipient_email?: string;
  recipient_phone?: string;
  template_used?: string;
}

export const useReminders = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Fetch all reminders with invoice/client info
  const {
    data: reminders = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["reminders"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data: remindersData, error: remindersError } = await supabase
        .from("reminders")
        .select("*")
        .order("sent_at", { ascending: false });

      if (remindersError) throw remindersError;

      // Fetch invoices for details
      const { data: invoicesData } = await supabase
        .from("invoices")
        .select("id, invoice_number, amount, client_id");

      // Fetch clients for names
      const { data: clientsData } = await supabase
        .from("clients")
        .select("id, name");

      // Enrich reminders
      const enrichedReminders = (remindersData as Reminder[]).map((reminder) => {
        const invoice = invoicesData?.find((inv) => inv.id === reminder.invoice_id);
        const client = clientsData?.find((c) => c.id === invoice?.client_id);
        
        return {
          ...reminder,
          invoice_number: invoice?.invoice_number || "Unknown",
          client_name: client?.name || null,
          amount: invoice?.amount || 0,
        };
      });

      return enrichedReminders as ReminderWithInvoice[];
    },
  });

  // Get reminders for specific invoice
  const getInvoiceReminders = (invoiceId: string) => {
    return reminders.filter((r) => r.invoice_id === invoiceId);
  };

  // Send reminder (create)
  const sendReminder = useMutation({
    mutationFn: async (reminderData: CreateReminderData) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("reminders")
        .insert({
          user_id: user.id,
          invoice_id: reminderData.invoice_id,
          type: reminderData.type || "email",
          status: "sent",
          sent_at: new Date().toISOString(),
          recipient_email: reminderData.recipient_email || null,
          recipient_phone: reminderData.recipient_phone || null,
          template_used: reminderData.template_used || null,
        })
        .select()
        .single();

      if (error) throw error;
      return data as Reminder;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["reminders"] });
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
      toast({
        title: "Reminder sent!",
        description: `${data.type === "email" ? "Email" : "SMS"} reminder has been sent.`,
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to send reminder",
        variant: "destructive",
      });
    },
  });

  // Mark as opened
  const markAsOpened = useMutation({
    mutationFn: async (id: string) => {
      const { data, error } = await supabase
        .from("reminders")
        .update({
          status: "opened",
          opened_at: new Date().toISOString(),
        })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data as Reminder;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reminders"] });
    },
  });

  // Calculate stats
  const stats = {
    totalSent: reminders.length,
    emailsSent: reminders.filter((r) => r.type === "email").length,
    smsSent: reminders.filter((r) => r.type === "sms").length,
    opened: reminders.filter((r) => r.status === "opened").length,
    openRate: reminders.length > 0 
      ? Math.round((reminders.filter((r) => r.status === "opened").length / reminders.length) * 100) 
      : 0,
    sentToday: reminders.filter((r) => {
      const today = new Date().toDateString();
      return new Date(r.sent_at).toDateString() === today;
    }).length,
    openedToday: reminders.filter((r) => {
      const today = new Date().toDateString();
      return r.opened_at && new Date(r.opened_at).toDateString() === today;
    }).length,
  };

  return {
    reminders,
    stats,
    isLoading,
    error,
    refetch,
    getInvoiceReminders,
    sendReminder,
    markAsOpened,
  };
};
