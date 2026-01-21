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

      // TESTING MODE: Resend only allows sending to the account owner's email
      // without a verified domain. Using the authenticated user's email.
      const testingEmail = user.email;
      if (!testingEmail) {
        throw new Error("No email found for authenticated user");
      }

      console.log(`Testing mode: Sending to ${testingEmail} (original: ${invoice.client_email})`);
      const recipientEmail = testingEmail;

      const response = await supabase.functions.invoke("send-reminder", {
        body: {
          reminderId: reminderId || null,
          invoiceId: invoice.id,
          recipientEmail, // Use authenticated user's email for testing
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
