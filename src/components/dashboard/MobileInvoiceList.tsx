import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  CheckCircle2,
  Clock,
  AlertCircle,
  MoreHorizontal,
  Mail,
  Check,
} from "lucide-react";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EmailStatusIndicator } from "./EmailStatusIndicator";
import type { InvoiceEmailStatus } from "@/types/emailTracking";

interface Invoice {
  id: string;
  client: string;
  amount: number;
  status: "paid" | "pending" | "overdue";
  dueDate: string;
  reminders: number;
}

interface MobileInvoiceCardProps {
  invoice: Invoice;
  currencySymbol: string;
  emailStatus?: InvoiceEmailStatus;
  onEdit: (invoice: Invoice) => void;
  onDelete: (invoice: Invoice) => void;
  onMarkPaid: (invoiceId: string) => void;
  onSendReminder: (invoiceId: string) => void;
}

export function MobileInvoiceCard({
  invoice,
  currencySymbol,
  emailStatus,
  onEdit,
  onDelete,
  onMarkPaid,
  onSendReminder,
}: MobileInvoiceCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return (
          <Badge className="bg-success/10 text-success border-success/20">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            Paid
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-warning/10 text-warning border-warning/20">
            <Clock className="w-3 h-3 mr-1" />
            Pending
          </Badge>
        );
      case "overdue":
        return (
          <Badge className="bg-destructive/10 text-destructive border-destructive/20">
            <AlertCircle className="w-3 h-3 mr-1" />
            Overdue
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <Card
      className={`p-4 transition-all active:scale-[0.98] ${
        isExpanded ? "ring-2 ring-primary/20" : ""
      }`}
      onClick={() => setIsExpanded(!isExpanded)}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold truncate">{invoice.client}</h3>
            {getStatusBadge(invoice.status)}
          </div>
          <p className="text-2xl font-bold">
            {currencySymbol}{invoice.amount.toLocaleString()}
          </p>
          <div className="flex items-center gap-3 mt-2 text-sm text-muted-foreground">
            <span>{invoice.id}</span>
            <span>•</span>
            <span>Due {invoice.dueDate}</span>
          </div>
          <div className="flex flex-wrap items-center gap-2 mt-2">
            {emailStatus && (
              <EmailStatusIndicator emailStatus={emailStatus} size="sm" />
            )}
            {emailStatus && emailStatus.totalEmailsSent > 0 && (
              <Badge variant="outline" className="text-xs">
                <Mail className="w-3 h-3 mr-1" />
                {emailStatus.totalEmailsSent} sent
              </Badge>
            )}
            {!emailStatus && invoice.reminders > 0 && (
              <span className="text-xs text-muted-foreground">
                {invoice.reminders} reminder{invoice.reminders !== 1 ? "s" : ""} sent
              </span>
            )}
          </div>
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
            <Button variant="ghost" size="icon" className="h-9 w-9 flex-shrink-0">
              <MoreHorizontal className="w-5 h-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {invoice.status !== "paid" && (
              <>
                <DropdownMenuItem onClick={() => onMarkPaid(invoice.id)}>
                  <Check className="w-4 h-4 mr-2" />
                  Mark as Paid
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onSendReminder(invoice.id)}>
                  <Mail className="w-4 h-4 mr-2" />
                  Send Reminder
                </DropdownMenuItem>
              </>
            )}
            <DropdownMenuItem onClick={() => onEdit(invoice)}>
              Edit Invoice
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-destructive"
              onClick={() => onDelete(invoice)}
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Quick Actions - visible when expanded on mobile */}
      {isExpanded && invoice.status !== "paid" && (
        <div className="flex gap-2 mt-4 pt-4 border-t border-border animate-fade-in">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 h-11"
            onClick={(e) => {
              e.stopPropagation();
              onMarkPaid(invoice.id);
            }}
          >
            <Check className="w-4 h-4 mr-2" />
            Mark Paid
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex-1 h-11"
            onClick={(e) => {
              e.stopPropagation();
              onSendReminder(invoice.id);
            }}
          >
            <Mail className="w-4 h-4 mr-2" />
            Remind
          </Button>
        </div>
      )}
    </Card>
  );
}

interface MobileInvoiceListProps {
  invoices: Invoice[];
  currencySymbol: string;
  getEmailStatus?: (invoiceId: string) => InvoiceEmailStatus;
  onEdit: (invoice: Invoice) => void;
  onDelete: (invoice: Invoice) => void;
  onMarkPaid: (invoiceId: string) => void;
  onSendReminder: (invoiceId: string) => void;
}

export function MobileInvoiceList({
  invoices,
  currencySymbol,
  getEmailStatus,
  onEdit,
  onDelete,
  onMarkPaid,
  onSendReminder,
}: MobileInvoiceListProps) {
  if (invoices.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No invoices yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {invoices.map((invoice) => (
        <MobileInvoiceCard
          key={invoice.id}
          invoice={invoice}
          currencySymbol={currencySymbol}
          emailStatus={getEmailStatus?.(invoice.id)}
          onEdit={onEdit}
          onDelete={onDelete}
          onMarkPaid={onMarkPaid}
          onSendReminder={onSendReminder}
        />
      ))}
    </div>
  );
}
