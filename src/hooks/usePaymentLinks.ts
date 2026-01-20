import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface PaymentLink {
  id: string;
  user_id: string;
  label: string;
  url: string;
  is_active: boolean;
  is_default: boolean;
  created_at: string;
}

export interface PaymentLinkWithStats extends PaymentLink {
  invoice_count: number;
}

export interface CreatePaymentLinkData {
  label: string;
  url: string;
  is_default?: boolean;
}

// URL validation for common payment providers
const isValidPaymentUrl = (url: string): boolean => {
  try {
    const parsed = new URL(url);
    return parsed.protocol === "https:" || parsed.protocol === "http:";
  } catch {
    return false;
  }
};

export const usePaymentLinks = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Fetch all payment links with invoice count
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

      // Fetch invoices to count usage per payment link
      const { data: invoicesData } = await supabase
        .from("invoices")
        .select("id, payment_link_id");

      // Enrich payment links with invoice count
      const enrichedLinks = (linksData as PaymentLink[]).map((link) => {
        const invoiceCount = invoicesData?.filter(
          (inv) => inv.payment_link_id === link.id
        ).length || 0;

        return {
          ...link,
          invoice_count: invoiceCount,
        };
      });

      return enrichedLinks as PaymentLinkWithStats[];
    },
  });

  // Get default payment link
  const defaultPaymentLink = paymentLinks.find((link) => link.is_default);

  // Create payment link
  const createPaymentLink = useMutation({
    mutationFn: async (linkData: CreatePaymentLinkData) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // Validate URL
      if (!linkData.url.trim()) {
        throw new Error("Payment URL is required");
      }

      if (!isValidPaymentUrl(linkData.url.trim())) {
        throw new Error("Please enter a valid payment URL (must start with http:// or https://)");
      }

      // Validate label
      const label = linkData.label.trim() || "Payment Link";

      // If this is the first link, make it default
      const isFirstLink = paymentLinks.length === 0;

      const { data, error } = await supabase
        .from("payment_links")
        .insert({
          user_id: user.id,
          label,
          url: linkData.url.trim(),
          is_default: linkData.is_default ?? isFirstLink,
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

  // Set as default
  const setDefault = useMutation({
    mutationFn: async (id: string) => {
      const { data, error } = await supabase
        .from("payment_links")
        .update({ is_default: true })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data as PaymentLink;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payment-links"] });
      toast({
        title: "Default link updated",
        description: "This link will now auto-fill in new invoices.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to set default link",
        variant: "destructive",
      });
    },
  });

  return {
    paymentLinks,
    defaultPaymentLink,
    isLoading,
    error,
    refetch,
    createPaymentLink,
    deletePaymentLink,
    toggleActive,
    setDefault,
  };
};
