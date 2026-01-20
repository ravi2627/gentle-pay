import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface Invoice {
  id: string;
  user_id: string;
  client_id: string | null;
  invoice_number: string;
  amount: number;
  currency: string;
  due_date: string;
  status: "pending" | "sent" | "viewed" | "paid" | "overdue";
  description: string | null;
  created_at: string;
  updated_at: string;
}

export interface InvoiceWithClient extends Invoice {
  client_name: string | null;
  client_email: string | null;
  reminders_count: number;
  reminders_opened: number;
}

export interface CreateInvoiceData {
  client_id?: string;
  client_name?: string;
  invoice_number: string;
  amount: number;
  currency?: string;
  due_date: string;
  status?: Invoice["status"];
  description?: string;
  // Reminder schedule fields
  client_email?: string;
  payment_link_id?: string;
  reminder_enabled?: boolean;
  reminder_tone?: string;
  email_3_days_before?: boolean;
  email_on_due_date?: boolean;
  email_3_days_after?: boolean;
  email_7_days_after?: boolean;
  sms_enabled?: boolean;
  sms_days_after_due?: number;
}

export interface UpdateInvoiceData extends Partial<CreateInvoiceData> {
  id: string;
}

export const useInvoices = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Fetch all invoices with client info and reminder stats
  const {
    data: invoices = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["invoices"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // Fetch invoices
      const { data: invoicesData, error: invoicesError } = await supabase
        .from("invoices")
        .select("*")
        .order("created_at", { ascending: false });

      if (invoicesError) throw invoicesError;

      // Fetch clients for names
      const { data: clientsData } = await supabase
        .from("clients")
        .select("id, name, email");

      // Fetch reminders for stats
      const { data: remindersData } = await supabase
        .from("reminders")
        .select("invoice_id, status");

      // Map invoices with client info and reminder stats
      const enrichedInvoices = (invoicesData as Invoice[]).map((invoice) => {
        const client = clientsData?.find((c) => c.id === invoice.client_id);
        const invoiceReminders = remindersData?.filter((r) => r.invoice_id === invoice.id) || [];
        
        return {
          ...invoice,
          client_name: client?.name || null,
          client_email: client?.email || null,
          reminders_count: invoiceReminders.length,
          reminders_opened: invoiceReminders.filter((r) => r.status === "opened").length,
        };
      });

      return enrichedInvoices as InvoiceWithClient[];
    },
  });

  // Create invoice
  const createInvoice = useMutation({
    mutationFn: async (invoiceData: CreateInvoiceData) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      let clientId = invoiceData.client_id;

      // If client name provided but no ID, create/find client
      if (invoiceData.client_name && !clientId) {
        // Check if client exists
        const { data: existingClient } = await supabase
          .from("clients")
          .select("id")
          .eq("user_id", user.id)
          .eq("name", invoiceData.client_name)
          .maybeSingle();

        if (existingClient) {
          clientId = existingClient.id;
          // Update client email if provided
          if (invoiceData.client_email) {
            await supabase
              .from("clients")
              .update({ email: invoiceData.client_email })
              .eq("id", existingClient.id);
          }
        } else {
          // Create new client
          const { data: newClient, error: clientError } = await supabase
            .from("clients")
            .insert({
              user_id: user.id,
              name: invoiceData.client_name,
              email: invoiceData.client_email || null,
            })
            .select()
            .single();

          if (clientError) throw clientError;
          clientId = newClient.id;
        }
      }

      const { data, error } = await supabase
        .from("invoices")
        .insert({
          user_id: user.id,
          client_id: clientId || null,
          invoice_number: invoiceData.invoice_number,
          amount: invoiceData.amount,
          currency: invoiceData.currency || "INR",
          due_date: invoiceData.due_date,
          status: invoiceData.status || "pending",
          description: invoiceData.description || null,
          client_email: invoiceData.client_email || null,
          payment_link_id: invoiceData.payment_link_id || null,
          reminder_enabled: invoiceData.reminder_enabled ?? true,
          reminder_tone: invoiceData.reminder_tone || "polite",
          email_3_days_before: invoiceData.email_3_days_before ?? true,
          email_on_due_date: invoiceData.email_on_due_date ?? true,
          email_3_days_after: invoiceData.email_3_days_after ?? true,
          email_7_days_after: invoiceData.email_7_days_after ?? false,
          sms_enabled: invoiceData.sms_enabled ?? false,
          sms_days_after_due: invoiceData.sms_days_after_due ?? 3,
        })
        .select()
        .single();

      if (error) throw error;
      return data as Invoice;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
      queryClient.invalidateQueries({ queryKey: ["clients"] });
      toast({
        title: "Invoice created!",
        description: `Invoice ${data.invoice_number} has been created.`,
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create invoice",
        variant: "destructive",
      });
    },
  });

  // Update invoice
  const updateInvoice = useMutation({
    mutationFn: async ({ id, ...updates }: UpdateInvoiceData) => {
      const { data, error } = await supabase
        .from("invoices")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data as Invoice;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
      toast({
        title: "Invoice updated!",
        description: `Invoice ${data.invoice_number} has been updated.`,
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update invoice",
        variant: "destructive",
      });
    },
  });

  // Delete invoice
  const deleteInvoice = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("invoices").delete().eq("id", id);
      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
      toast({
        title: "Invoice deleted",
        description: "The invoice has been removed.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete invoice",
        variant: "destructive",
      });
    },
  });

  // Mark as paid
  const markAsPaid = useMutation({
    mutationFn: async (id: string) => {
      const { data, error } = await supabase
        .from("invoices")
        .update({ status: "paid" })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data as Invoice;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
      toast({
        title: "Invoice marked as paid!",
        description: `Invoice ${data.invoice_number} has been updated.`,
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update invoice",
        variant: "destructive",
      });
    },
  });

  // Calculate stats
  const stats = {
    totalInvoices: invoices.length,
    paidInvoices: invoices.filter((inv) => inv.status === "paid").length,
    pendingInvoices: invoices.filter((inv) => inv.status === "pending" || inv.status === "sent").length,
    overdueInvoices: invoices.filter((inv) => inv.status === "overdue").length,
    totalAmount: invoices.reduce((sum, inv) => sum + Number(inv.amount), 0),
    paidAmount: invoices
      .filter((inv) => inv.status === "paid")
      .reduce((sum, inv) => sum + Number(inv.amount), 0),
    pendingAmount: invoices
      .filter((inv) => inv.status !== "paid")
      .reduce((sum, inv) => sum + Number(inv.amount), 0),
  };

  return {
    invoices,
    stats,
    isLoading,
    error,
    refetch,
    createInvoice,
    updateInvoice,
    deleteInvoice,
    markAsPaid,
  };
};
