import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Mail, MailOpen, MessageSquare, Clock, CheckCircle, XCircle } from "lucide-react";
import { format } from "date-fns";

export interface ReminderStatus {
  emailsSent: number;
  emailsOpened: number;
  smsSent: number;
  lastEmailSentAt: string | null;
  lastEmailOpenedAt: string | null;
  lastSmsSentAt: string | null;
}

interface ReminderStatusBadgesProps {
  status: ReminderStatus;
  compact?: boolean;
}

export function ReminderStatusBadges({ status, compact = false }: ReminderStatusBadgesProps) {
  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "N/A";
    return format(new Date(dateStr), "MMM d, h:mm a");
  };

  if (compact) {
    // Compact view for mobile/list
    return (
      <div className="flex items-center gap-1.5">
        {status.emailsSent > 0 && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Badge variant="outline" className="gap-1 px-1.5 py-0.5">
                  {status.emailsOpened > 0 ? (
                    <MailOpen className="h-3 w-3 text-green-500" />
                  ) : (
                    <Mail className="h-3 w-3 text-blue-500" />
                  )}
                  <span className="text-xs">{status.emailsSent}</span>
                </Badge>
              </TooltipTrigger>
              <TooltipContent>
                <div className="text-xs space-y-1">
                  <p>Emails sent: {status.emailsSent}</p>
                  <p>Emails opened: {status.emailsOpened}</p>
                  {status.lastEmailSentAt && (
                    <p>Last sent: {formatDate(status.lastEmailSentAt)}</p>
                  )}
                  {status.lastEmailOpenedAt && (
                    <p>Last opened: {formatDate(status.lastEmailOpenedAt)}</p>
                  )}
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}

        {status.smsSent > 0 && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Badge variant="outline" className="gap-1 px-1.5 py-0.5">
                  <MessageSquare className="h-3 w-3 text-purple-500" />
                  <span className="text-xs">{status.smsSent}</span>
                </Badge>
              </TooltipTrigger>
              <TooltipContent>
                <div className="text-xs space-y-1">
                  <p>SMS sent: {status.smsSent}</p>
                  {status.lastSmsSentAt && (
                    <p>Last sent: {formatDate(status.lastSmsSentAt)}</p>
                  )}
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}

        {status.emailsSent === 0 && status.smsSent === 0 && (
          <Badge variant="outline" className="text-muted-foreground gap-1 px-1.5 py-0.5">
            <Clock className="h-3 w-3" />
            <span className="text-xs">Pending</span>
          </Badge>
        )}
      </div>
    );
  }

  // Full view for invoice detail
  return (
    <div className="flex flex-wrap gap-2">
      {/* Email Status */}
      <div className="flex items-center gap-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Badge
                variant={status.emailsSent > 0 ? "default" : "outline"}
                className="gap-1.5"
              >
                <Mail className="h-3.5 w-3.5" />
                <span>
                  {status.emailsSent} Sent
                </span>
              </Badge>
            </TooltipTrigger>
            <TooltipContent>
              {status.lastEmailSentAt
                ? `Last email sent: ${formatDate(status.lastEmailSentAt)}`
                : "No emails sent yet"}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {status.emailsOpened > 0 && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Badge variant="secondary" className="gap-1.5 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                  <MailOpen className="h-3.5 w-3.5" />
                  <span>{status.emailsOpened} Opened</span>
                </Badge>
              </TooltipTrigger>
              <TooltipContent>
                {status.lastEmailOpenedAt
                  ? `Last opened: ${formatDate(status.lastEmailOpenedAt)}`
                  : ""}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>

      {/* SMS Status */}
      {status.smsSent > 0 && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Badge variant="secondary" className="gap-1.5 bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400">
                <MessageSquare className="h-3.5 w-3.5" />
                <span>{status.smsSent} SMS</span>
              </Badge>
            </TooltipTrigger>
            <TooltipContent>
              {status.lastSmsSentAt
                ? `Last SMS sent: ${formatDate(status.lastSmsSentAt)}`
                : ""}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </div>
  );
}

// Helper function to derive reminder status from reminders array
export function deriveReminderStatus(reminders: Array<{
  type: string;
  status: string;
  sent_at: string;
  opened_at: string | null;
}>): ReminderStatus {
  const emails = reminders.filter((r) => r.type === "email");
  const sms = reminders.filter((r) => r.type === "sms");

  const emailsSent = emails.length;
  const emailsOpened = emails.filter((r) => r.status === "opened" || r.opened_at).length;
  const smsSent = sms.length;

  const sortedEmails = [...emails].sort(
    (a, b) => new Date(b.sent_at).getTime() - new Date(a.sent_at).getTime()
  );
  const sortedSms = [...sms].sort(
    (a, b) => new Date(b.sent_at).getTime() - new Date(a.sent_at).getTime()
  );

  const openedEmails = emails.filter((e) => e.opened_at).sort(
    (a, b) => new Date(b.opened_at!).getTime() - new Date(a.opened_at!).getTime()
  );

  return {
    emailsSent,
    emailsOpened,
    smsSent,
    lastEmailSentAt: sortedEmails[0]?.sent_at || null,
    lastEmailOpenedAt: openedEmails[0]?.opened_at || null,
    lastSmsSentAt: sortedSms[0]?.sent_at || null,
  };
}
