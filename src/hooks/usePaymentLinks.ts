import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface PaymentLink {
  id: string;
  user_id: string;
  invoice_id: string;
  url: string;
  short_code: string | null;
  is_active: boolean;
  expires_at: string | null;
  created_at: string;
}

export interface PaymentLinkWithInvoice extends PaymentLink {
  invoice_number: string;
  client_name: string | null;
  amount: number;
}

export interface CreatePaymentLinkData {
  invoice_id: string;
  url: string;
  short_code?: string;
  expires_at?: string;
}

export const usePaymentLinks = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Fetch all payment links with invoice info
  const {
    data: paymentLinks = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["payment-links"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data: linksData, error: linksError } = await supabase
        .from("payment_links")
        .select("*")
        .order("created_at", { ascending: false });

      if (linksError) throw linksError;

      // Fetch invoices for details
      const { data: invoicesData } = await supabase
        .from("invoices")
        .select("id, invoice_number, amount, client_id");

      // Fetch clients for names
      const { data: clientsData } = await supabase
        .from("clients")
        .select("id, name");

      // Enrich payment links
      const enrichedLinks = (linksData as PaymentLink[]).map((link) => {
        const invoice = invoicesData?.find((inv) => inv.id === link.invoice_id);
        const client = clientsData?.find((c) => c.id === invoice?.client_id);
        
        return {
          ...link,
          invoice_number: invoice?.invoice_number || "Unknown",
          client_name: client?.name || null,
          amount: invoice?.amount || 0,
        };
      });

      return enrichedLinks as PaymentLinkWithInvoice[];
    },
  });

  // Create payment link
  const createPaymentLink = useMutation({
    mutationFn: async (linkData: CreatePaymentLinkData) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("payment_links")
        .insert({
          user_id: user.id,
          invoice_id: linkData.invoice_id,
          url: linkData.url,
          short_code: linkData.short_code || null,
          expires_at: linkData.expires_at || null,
        })
        .select()
        .single();

      if (error) throw error;
      return data as PaymentLink;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payment-links"] });
      toast({
        title: "Payment link created!",
        description: "The payment link has been saved.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create payment link",
        variant: "destructive",
      });
    },
  });

  // Delete payment link
  const deletePaymentLink = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("payment_links").delete().eq("id", id);
      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payment-links"] });
      toast({
        title: "Payment link deleted",
        description: "The payment link has been removed.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete payment link",
        variant: "destructive",
      });
    },
  });

  // Toggle active status
  const toggleActive = useMutation({
    mutationFn: async ({ id, is_active }: { id: string; is_active: boolean }) => {
      const { data, error } = await supabase
        .from("payment_links")
        .update({ is_active })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data as PaymentLink;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["payment-links"] });
      toast({
        title: data.is_active ? "Payment link activated" : "Payment link deactivated",
        description: `The payment link is now ${data.is_active ? "active" : "inactive"}.`,
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update payment link",
        variant: "destructive",
      });
    },
  });

  return {
    paymentLinks,
    isLoading,
    error,
    refetch,
    createPaymentLink,
    deletePaymentLink,
    toggleActive,
  };
};
