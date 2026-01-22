import { useState, useCallback, useMemo } from "react";
import type { 
  ReminderLog, 
  EmailTrackingStats, 
  InvoiceEmailStatus,
  ReminderTone,
  ReminderType 
} from "@/types/emailTracking";
import { generateTrackingId } from "@/types/emailTracking";

export function useEmailTracking() {
  // Start with empty logs - no demo data
  const [reminderLogs, setReminderLogs] = useState<ReminderLog[]>([]);

  // Calculate stats from real data only
  const stats = useMemo<EmailTrackingStats>(() => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    const todayLogs = reminderLogs.filter(
      (log) => log.reminderType === "email" && log.sentAt >= today
    );
    
    const emailLogs = reminderLogs.filter((log) => log.reminderType === "email");
    const sentEmails = emailLogs.filter((log) => log.deliveryStatus === "sent");
    const openedEmails = sentEmails.filter((log) => log.openedAt !== null);
    
    const todaySent = todayLogs.filter((log) => log.deliveryStatus === "sent");
    const todayOpened = todaySent.filter((log) => log.openedAt !== null);

    return {
      emailsSentToday: todaySent.length,
      emailsOpenedToday: todayOpened.length,
      openRate: sentEmails.length > 0 
        ? (openedEmails.length / sentEmails.length) * 100 
        : 0,
      totalEmailsSent: sentEmails.length,
      totalEmailsOpened: openedEmails.length,
    };
  }, [reminderLogs]);

  // Get email status for a specific invoice
  const getInvoiceEmailStatus = useCallback((invoiceId: string): InvoiceEmailStatus => {
    const invoiceLogs = reminderLogs
      .filter((log) => log.invoiceId === invoiceId && log.reminderType === "email")
      .sort((a, b) => b.sentAt.getTime() - a.sentAt.getTime());

    if (invoiceLogs.length === 0) {
      return {
        lastEmailSent: null,
        lastEmailOpened: null,
        emailStatus: "not_sent",
        totalEmailsSent: 0,
        totalOpens: 0,
      };
    }

    const latestLog = invoiceLogs[0];
    const totalOpens = invoiceLogs.reduce((sum, log) => sum + log.openCount, 0);
    const hasOpened = invoiceLogs.some((log) => log.openedAt !== null);
    const lastOpened = invoiceLogs
      .filter((log) => log.openedAt)
      .sort((a, b) => (b.openedAt?.getTime() || 0) - (a.openedAt?.getTime() || 0))[0];

    let emailStatus: InvoiceEmailStatus["emailStatus"] = "not_sent";
    if (latestLog.deliveryStatus === "failed") {
      emailStatus = "failed";
    } else if (hasOpened) {
      emailStatus = "opened";
    } else if (latestLog.deliveryStatus === "sent") {
      emailStatus = "sent";
    }

    return {
      lastEmailSent: latestLog.sentAt,
      lastEmailOpened: lastOpened?.openedAt || null,
      emailStatus,
      totalEmailsSent: invoiceLogs.filter((l) => l.deliveryStatus === "sent").length,
      totalOpens,
    };
  }, [reminderLogs]);

  // Get reminder logs for a specific invoice
  const getInvoiceLogs = useCallback((invoiceId: string): ReminderLog[] => {
    return reminderLogs
      .filter((log) => log.invoiceId === invoiceId)
      .sort((a, b) => b.sentAt.getTime() - a.sentAt.getTime());
  }, [reminderLogs]);

  // Send a reminder
  const sendReminder = useCallback((
    invoiceId: string,
    clientId: string,
    type: ReminderType = "email",
    tone: ReminderTone = "polite"
  ): ReminderLog => {
    const trackingId = generateTrackingId();
    const now = new Date();
    
    // Simulate 90% success rate
    const isSuccess = Math.random() > 0.1;
    
    const newLog: ReminderLog = {
      id: `rl-${Date.now()}`,
      invoiceId,
      clientId,
      userId: "user-001",
      reminderType: type,
      reminderTone: tone,
      sentAt: now,
      deliveryStatus: isSuccess ? "sent" : "failed",
      openedAt: null,
      openCount: 0,
      createdAt: now,
      trackingId,
    };

    setReminderLogs((prev) => [newLog, ...prev]);

    // Simulate email open after some time
    if (isSuccess && type === "email") {
      const openDelay = Math.random() * 10000 + 5000; // 5-15 seconds
      setTimeout(() => {
        setReminderLogs((prev) =>
          prev.map((log) =>
            log.id === newLog.id
              ? { ...log, openedAt: new Date(), openCount: 1 }
              : log
          )
        );
      }, openDelay);
    }

    return newLog;
  }, []);

  // Check if escalation to SMS is recommended
  const shouldEscalateToSMS = useCallback((invoiceId: string): boolean => {
    const status = getInvoiceEmailStatus(invoiceId);
    // Recommend SMS if email was opened but not paid, or if 2+ emails sent without open
    return (
      (status.emailStatus === "opened" && status.totalEmailsSent >= 1) ||
      (status.emailStatus === "sent" && status.totalEmailsSent >= 2)
    );
  }, [getInvoiceEmailStatus]);

  return {
    reminderLogs,
    stats,
    getInvoiceEmailStatus,
    getInvoiceLogs,
    sendReminder,
    shouldEscalateToSMS,
  };
}
