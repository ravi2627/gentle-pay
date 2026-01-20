import { Mail, Eye, MessageSquare, CheckCircle2, Clock, Send } from "lucide-react";
import { format } from "date-fns";
import type { ReminderLog } from "@/types/emailTracking";

interface ActivityEvent {
  id: string;
  type: "email_sent" | "email_opened" | "sms_sent" | "invoice_paid" | "invoice_created";
  timestamp: Date;
  description: string;
  details?: string;
}

interface InvoiceActivityTimelineProps {
  activities: ActivityEvent[];
}

export function InvoiceActivityTimeline({ activities }: InvoiceActivityTimelineProps) {
  const getEventIcon = (type: ActivityEvent["type"]) => {
    switch (type) {
      case "email_sent":
        return <Send className="w-4 h-4 text-primary" />;
      case "email_opened":
        return <Eye className="w-4 h-4 text-success" />;
      case "sms_sent":
        return <MessageSquare className="w-4 h-4 text-warning" />;
      case "invoice_paid":
        return <CheckCircle2 className="w-4 h-4 text-success" />;
      case "invoice_created":
        return <Clock className="w-4 h-4 text-muted-foreground" />;
      default:
        return <Mail className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getEventColor = (type: ActivityEvent["type"]) => {
    switch (type) {
      case "email_sent":
        return "border-primary/30 bg-primary/5";
      case "email_opened":
        return "border-success/30 bg-success/5";
      case "sms_sent":
        return "border-warning/30 bg-warning/5";
      case "invoice_paid":
        return "border-success/30 bg-success/5";
      default:
        return "border-muted bg-muted/5";
    }
  };

  if (activities.length === 0) {
    return (
      <div className="text-center py-6 text-muted-foreground">
        <Mail className="w-8 h-8 mx-auto mb-2 opacity-50" />
        <p className="text-sm">No activity yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {activities.map((activity, index) => (
        <div key={activity.id} className="flex gap-3">
          {/* Timeline line */}
          <div className="flex flex-col items-center">
            <div className={`p-2 rounded-full border-2 ${getEventColor(activity.type)}`}>
              {getEventIcon(activity.type)}
            </div>
            {index < activities.length - 1 && (
              <div className="w-0.5 h-full bg-border flex-1 min-h-4 mt-1" />
            )}
          </div>

          {/* Event content */}
          <div className="flex-1 pb-4">
            <p className="text-sm font-medium">{activity.description}</p>
            <p className="text-xs text-muted-foreground">
              {format(activity.timestamp, "MMM d, yyyy 'at' h:mm a")}
            </p>
            {activity.details && (
              <p className="text-xs text-muted-foreground mt-1">
                {activity.details}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

// Helper to convert reminder logs to activity events
export function reminderLogsToActivities(logs: ReminderLog[]): ActivityEvent[] {
  const events: ActivityEvent[] = [];

  logs.forEach((log) => {
    // Add sent event
    events.push({
      id: `${log.id}_sent`,
      type: log.reminderType === "email" ? "email_sent" : "sms_sent",
      timestamp: log.sentAt,
      description: log.reminderType === "email" ? "Email reminder sent" : "SMS reminder sent",
      details: `Tone: ${log.reminderTone}`,
    });

    // Add opened event if applicable
    if (log.openedAt && log.reminderType === "email") {
      events.push({
        id: `${log.id}_opened`,
        type: "email_opened",
        timestamp: log.openedAt,
        description: "Email opened by client",
        details: log.openCount > 1 ? `Opened ${log.openCount} times` : undefined,
      });
    }
  });

  // Sort by timestamp descending
  return events.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
}
