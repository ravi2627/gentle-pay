import { Send, Eye, XCircle, Clock } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { InvoiceEmailStatus } from "@/types/emailTracking";
import { format } from "date-fns";

interface EmailStatusIndicatorProps {
  emailStatus: InvoiceEmailStatus;
  size?: "sm" | "md";
}

export function EmailStatusIndicator({ emailStatus, size = "md" }: EmailStatusIndicatorProps) {
  const iconSize = size === "sm" ? "w-3.5 h-3.5" : "w-4 h-4";
  
  const getStatusDisplay = () => {
    switch (emailStatus.emailStatus) {
      case "opened":
        return {
          icon: <Eye className={`${iconSize} text-success`} />,
          label: "Email Opened",
          tooltip: emailStatus.lastEmailOpened 
            ? `Opened on ${format(emailStatus.lastEmailOpened, "MMM d, yyyy 'at' h:mm a")}`
            : "Email was opened",
          bgColor: "bg-success/10",
          borderColor: "border-success/20",
        };
      case "sent":
        return {
          icon: <Send className={`${iconSize} text-primary`} />,
          label: "Email Sent",
          tooltip: emailStatus.lastEmailSent
            ? `Sent on ${format(emailStatus.lastEmailSent, "MMM d, yyyy 'at' h:mm a")}`
            : "Email was sent",
          bgColor: "bg-primary/10",
          borderColor: "border-primary/20",
        };
      case "failed":
        return {
          icon: <XCircle className={`${iconSize} text-destructive`} />,
          label: "Failed",
          tooltip: "Email delivery failed",
          bgColor: "bg-destructive/10",
          borderColor: "border-destructive/20",
        };
      default:
        return {
          icon: <Clock className={`${iconSize} text-muted-foreground`} />,
          label: "Not sent",
          tooltip: "No email sent yet",
          bgColor: "bg-muted/50",
          borderColor: "border-muted",
        };
    }
  };

  const { icon, label, tooltip, bgColor, borderColor } = getStatusDisplay();

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div 
            className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium ${bgColor} border ${borderColor} cursor-help transition-colors`}
          >
            {icon}
            <span className="hidden sm:inline">{label}</span>
          </div>
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-xs">
          <p>{tooltip}</p>
          {emailStatus.totalEmailsSent > 0 && (
            <p className="text-xs text-muted-foreground mt-1">
              {emailStatus.totalEmailsSent} email(s) sent • {emailStatus.totalOpens} open(s)
            </p>
          )}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
