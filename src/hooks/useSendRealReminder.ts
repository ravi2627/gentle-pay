import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { InvoiceWithClient } from "@/hooks/useInvoices";

interface SendReminderParams {
  invoice: InvoiceWithClient;
  tone?: "polite" | "professional" | "firm";
  reminderId?: string;
  senderName?: string;
  paymentLink?: string;
}

export const useSendRealReminder = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const sendReminder = useMutation({
    mutationFn: async ({
      invoice,
      tone = "polite",
      reminderId,
      senderName,
      paymentLink,
    }: SendReminderParams) => {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) throw new Error("Not authenticated");

      // Get user profile for sender name
      const { data: profile } = await supabase
        .from("profiles")
        .select("business_name, email")
        .eq("id", user.id)
        .single();

      // Get default payment link if not provided
      let finalPaymentLink = paymentLink;
      if (!finalPaymentLink) {
        const { data: defaultLink } = await supabase
          .from("payment_links")
          .select("url")
          .eq("user_id", user.id)
          .eq("is_default", true)
          .single();
        
        finalPaymentLink = defaultLink?.url || "#";
      }

      // Validate recipient email - SAFETY CHECK
      const recipientEmail = invoice.client_email;
      if (!recipientEmail) {
        throw new Error("No client email configured for this invoice");
      }

      // For testing mode: Only allow sending to the user's own email
      const userEmail = profile?.email || user.email;
      if (recipientEmail !== userEmail) {
        console.warn(`Testing mode: Redirecting email from ${recipientEmail} to ${userEmail}`);
        // In production, remove this check
      }

      const response = await supabase.functions.invoke("send-reminder", {
        body: {
          reminderId: reminderId || null,
          invoiceId: invoice.id,
          recipientEmail: userEmail, // Use user's email for testing
          clientName: invoice.client_name || "Valued Customer",
          invoiceNumber: invoice.invoice_number,
          amount: Number(invoice.amount),
          currency: invoice.currency === "INR" ? "₹" : invoice.currency === "USD" ? "$" : invoice.currency,
          dueDate: new Date(invoice.due_date).toLocaleDateString(),
          paymentLink: finalPaymentLink,
          senderName: senderName || profile?.business_name || "Your Business",
          tone,
        },
      });

      if (response.error) {
        throw new Error(response.error.message || "Failed to send reminder");
      }

      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
      queryClient.invalidateQueries({ queryKey: ["reminders"] });
      queryClient.invalidateQueries({ queryKey: ["invoice-activity-logs"] });
      queryClient.invalidateQueries({ queryKey: ["email-tracking"] });
      
      toast({
        title: "📧 Email Sent!",
        description: "Reminder email has been sent successfully. Check your inbox!",
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to send email",
        description: error.message || "An error occurred while sending the reminder.",
        variant: "destructive",
      });
    },
  });

  return {
    sendReminder: sendReminder.mutate,
    sendReminderAsync: sendReminder.mutateAsync,
    isPending: sendReminder.isPending,
    isError: sendReminder.isError,
    error: sendReminder.error,
  };
};

export default useSendRealReminder;
