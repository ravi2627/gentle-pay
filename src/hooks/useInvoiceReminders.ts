import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type {
  InvoiceReminder,
  CreateInvoiceReminderData,
  ReminderFormItem,
} from "@/types/invoiceReminders";

export const useInvoiceReminders = (invoiceId?: string) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Fetch reminders for a specific invoice
  const {
    data: reminders = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["invoice-reminders", invoiceId],
    queryFn: async () => {
      if (!invoiceId) return [];

      const { data, error } = await supabase
        .from("invoice_reminders")
        .select("*")
        .eq("invoice_id", invoiceId)
        .order("sort_order", { ascending: true });

      if (error) throw error;
      return data as InvoiceReminder[];
    },
    enabled: !!invoiceId,
  });

  // Create multiple reminders for an invoice (batch)
  const createReminders = useMutation({
    mutationFn: async ({
      invoiceId,
      reminders,
    }: {
      invoiceId: string;
      reminders: ReminderFormItem[];
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const reminderInserts: CreateInvoiceReminderData[] = reminders.map(
        (reminder, index) => ({
          invoice_id: invoiceId,
          timing_type: reminder.timing_type,
          timing_days: reminder.timing_days,
          channel: reminder.channel,
          tone: reminder.tone,
          sort_order: index,
        })
      );

      // Use type assertion for the insert since types.ts hasn't been updated yet
      const { data, error } = await supabase
        .from("invoice_reminders")
        .insert(
          reminderInserts.map((r) => ({
            ...r,
            user_id: user.id,
          }))
        )
        .select();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invoice-reminders"] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create reminders",
        variant: "destructive",
      });
    },
  });

  // Update a single reminder
  const updateReminder = useMutation({
    mutationFn: async ({
      id,
      updates,
    }: {
      id: string;
      updates: Partial<InvoiceReminder>;
    }) => {
      const { data, error } = await supabase
        .from("invoice_reminders")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data as InvoiceReminder;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invoice-reminders"] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update reminder",
        variant: "destructive",
      });
    },
  });

  // Delete a reminder
  const deleteReminder = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("invoice_reminders")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invoice-reminders"] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete reminder",
        variant: "destructive",
      });
    },
  });

  // Cancel all scheduled reminders for an invoice (e.g., when marked as paid)
  const cancelAllReminders = useMutation({
    mutationFn: async (invoiceId: string) => {
      const { error } = await supabase
        .from("invoice_reminders")
        .update({ status: "cancelled" })
        .eq("invoice_id", invoiceId)
        .eq("status", "scheduled");

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invoice-reminders"] });
      toast({
        title: "Reminders cancelled",
        description: "All scheduled reminders have been cancelled.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to cancel reminders",
        variant: "destructive",
      });
    },
  });

  // Replace all reminders for an invoice
  const replaceReminders = useMutation({
    mutationFn: async ({
      invoiceId,
      reminders,
    }: {
      invoiceId: string;
      reminders: ReminderFormItem[];
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // Delete existing reminders
      await supabase
        .from("invoice_reminders")
        .delete()
        .eq("invoice_id", invoiceId);

      // Insert new reminders
      if (reminders.length > 0) {
        const reminderInserts = reminders.map((reminder, index) => ({
          invoice_id: invoiceId,
          user_id: user.id,
          timing_type: reminder.timing_type,
          timing_days: reminder.timing_days,
          channel: reminder.channel,
          tone: reminder.tone,
          sort_order: index,
        }));

        const { data, error } = await supabase
          .from("invoice_reminders")
          .insert(reminderInserts)
          .select();

        if (error) throw error;
        return data;
      }

      return [];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invoice-reminders"] });
      toast({
        title: "Reminders updated",
        description: "Reminder schedule has been updated.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update reminders",
        variant: "destructive",
      });
    },
  });

  return {
    reminders,
    isLoading,
    error,
    refetch,
    createReminders,
    updateReminder,
    deleteReminder,
    cancelAllReminders,
    replaceReminders,
  };
};
