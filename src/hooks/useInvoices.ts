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
  invoice_number: string;
  amount: number;
  currency?: string;
  due_date: string;
  status?: Invoice["status"];
  description?: string;
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

      const { data, error } = await supabase
        .from("invoices")
        .insert({
          user_id: user.id,
          client_id: invoiceData.client_id || null,
          invoice_number: invoiceData.invoice_number,
          amount: invoiceData.amount,
          currency: invoiceData.currency || "INR",
          due_date: invoiceData.due_date,
          status: invoiceData.status || "pending",
          description: invoiceData.description || null,
        })
        .select()
        .single();

      if (error) throw error;
      return data as Invoice;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
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
