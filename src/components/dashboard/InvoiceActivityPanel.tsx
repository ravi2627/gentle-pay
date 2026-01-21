import { 
  FileText, 
  Edit, 
  CheckCircle2, 
  Mail, 
  MessageSquare, 
  Eye, 
  Clock,
  XCircle,
  Bell
} from "lucide-react";
import { format } from "date-fns";
import type { ActivityLogDisplay } from "@/hooks/useInvoiceActivityLogs";
import { Skeleton } from "@/components/ui/skeleton";

interface InvoiceActivityPanelProps {
  activities: ActivityLogDisplay[];
  isLoading?: boolean;
}

export function InvoiceActivityPanel({ activities, isLoading }: InvoiceActivityPanelProps) {
  const getEventIcon = (icon: ActivityLogDisplay["icon"]) => {
    switch (icon) {
      case "invoice":
        return <FileText className="w-4 h-4 text-primary" />;
      case "edit":
        return <Edit className="w-4 h-4 text-muted-foreground" />;
      case "paid":
        return <CheckCircle2 className="w-4 h-4 text-success" />;
      case "email":
        return <Mail className="w-4 h-4 text-primary" />;
      case "sms":
        return <MessageSquare className="w-4 h-4 text-warning" />;
      case "opened":
        return <Eye className="w-4 h-4 text-success" />;
      case "scheduled":
        return <Clock className="w-4 h-4 text-muted-foreground" />;
      case "cancelled":
        return <XCircle className="w-4 h-4 text-destructive" />;
      default:
        return <Bell className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getEventColor = (icon: ActivityLogDisplay["icon"]) => {
    switch (icon) {
      case "invoice":
        return "border-primary/30 bg-primary/5";
      case "edit":
        return "border-muted bg-muted/5";
      case "paid":
        return "border-success/30 bg-success/5";
      case "email":
        return "border-primary/30 bg-primary/5";
      case "sms":
        return "border-warning/30 bg-warning/5";
      case "opened":
        return "border-success/30 bg-success/5";
      case "scheduled":
        return "border-muted bg-muted/5";
      case "cancelled":
        return "border-destructive/30 bg-destructive/5";
      default:
        return "border-muted bg-muted/5";
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex gap-3">
            <Skeleton className="w-8 h-8 rounded-full shrink-0" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (activities.length === 0) {
    return (
      <div className="text-center py-6 text-muted-foreground">
        <FileText className="w-8 h-8 mx-auto mb-2 opacity-50" />
        <p className="text-sm">No activity yet</p>
        <p className="text-xs mt-1">Activity will appear here as you use this invoice</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {activities.map((activity, index) => (
        <div key={activity.id} className="flex gap-3">
          {/* Timeline line */}
          <div className="flex flex-col items-center">
            <div className={`p-2 rounded-full border-2 ${getEventColor(activity.icon)}`}>
              {getEventIcon(activity.icon)}
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
              <p className="text-xs text-muted-foreground mt-1 bg-muted/30 px-2 py-1 rounded inline-block">
                {activity.details}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default InvoiceActivityPanel;
