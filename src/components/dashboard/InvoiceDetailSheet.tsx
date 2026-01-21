import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Send, 
  CheckCircle2, 
  Edit, 
  Clock,
  AlertCircle,
  Bell,
  Mail,
  MessageSquare
} from "lucide-react";
import { InvoiceActivityPanel } from "./InvoiceActivityPanel";
import { ReminderScheduleEditor } from "./ReminderScheduleEditor";
import { useInvoiceActivityLogs } from "@/hooks/useInvoiceActivityLogs";
import { useInvoiceReminders } from "@/hooks/useInvoiceReminders";
import type { InvoiceWithClient } from "@/hooks/useInvoices";
import type { ReminderFormItem } from "@/types/invoiceReminders";
import { getReminderTimingLabel, getChannelLabel, getToneLabel } from "@/types/invoiceReminders";

interface InvoiceDetailSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  invoice: InvoiceWithClient | null;
  currencySymbol: string;
  onEdit: () => void;
  onMarkPaid: () => void;
  onSendReminder: () => void;
}

export function InvoiceDetailSheet({
  open,
  onOpenChange,
  invoice,
  currencySymbol,
  onEdit,
  onMarkPaid,
  onSendReminder,
}: InvoiceDetailSheetProps) {
  const { activities, isLoading: activitiesLoading } = useInvoiceActivityLogs(invoice?.id);
  const { reminders: dbReminders, isLoading: remindersLoading } = useInvoiceReminders(invoice?.id);

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
      case "sent":
      case "viewed":
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

  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case "email":
        return <Mail className="w-3 h-3" />;
      case "sms":
        return <MessageSquare className="w-3 h-3" />;
      case "both":
        return (
          <div className="flex gap-0.5">
            <Mail className="w-3 h-3" />
            <MessageSquare className="w-3 h-3" />
          </div>
        );
      default:
        return <Bell className="w-3 h-3" />;
    }
  };

  const getReminderStatusBadge = (status: string) => {
    switch (status) {
      case "sent":
        return <Badge variant="default" className="text-xs">Sent</Badge>;
      case "scheduled":
        return <Badge variant="outline" className="text-xs">Scheduled</Badge>;
      case "cancelled":
        return <Badge variant="secondary" className="text-xs">Cancelled</Badge>;
      case "failed":
        return <Badge variant="destructive" className="text-xs">Failed</Badge>;
      default:
        return null;
    }
  };

  if (!invoice) return null;

  // Transform DB reminders to display format
  const scheduledReminders = dbReminders?.map((r) => ({
    id: r.id,
    timing_type: r.timing_type as "before" | "on_due" | "after",
    timing_days: r.timing_days,
    channel: r.channel as "email" | "sms" | "both",
    tone: r.tone as "polite" | "professional" | "firm",
    status: r.status,
    scheduled_for: r.scheduled_for,
    sent_at: r.sent_at,
  })) || [];

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-lg w-full flex flex-col p-0">
        <SheetHeader className="px-4 sm:px-6 pt-4 sm:pt-6 pb-4 border-b">
          <SheetTitle className="flex items-center justify-between">
            <span>Invoice {invoice.invoice_number}</span>
            {getStatusBadge(invoice.status)}
          </SheetTitle>
          <SheetDescription>
            {invoice.client_name} • {currencySymbol}{Number(invoice.amount).toLocaleString()}
          </SheetDescription>
        </SheetHeader>
        
        <Tabs defaultValue="details" className="flex-1 flex flex-col min-h-0">
          <TabsList className="mx-4 sm:mx-6 mt-4 w-auto">
            <TabsTrigger value="details" className="flex-1">Details</TabsTrigger>
            <TabsTrigger value="reminders" className="flex-1">Reminders</TabsTrigger>
            <TabsTrigger value="activity" className="flex-1">Activity</TabsTrigger>
          </TabsList>
          
          <ScrollArea className="flex-1 min-h-0">
            {/* Details Tab */}
            <TabsContent value="details" className="mt-0 px-4 sm:px-6 py-4">
              <div className="space-y-4">
                {/* Invoice Summary */}
                <div className="p-4 rounded-lg bg-muted/30 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Client</span>
                    <span className="font-medium">{invoice.client_name}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Email</span>
                    <span className="text-sm truncate max-w-[200px]">{invoice.client_email}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Amount</span>
                    <span className="font-semibold text-lg">
                      {currencySymbol}{Number(invoice.amount).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Due Date</span>
                    <span>{new Date(invoice.due_date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Status</span>
                    {getStatusBadge(invoice.status)}
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-lg bg-muted/30 text-center">
                    <p className="text-2xl font-bold">{invoice.reminders_count}</p>
                    <p className="text-xs text-muted-foreground">Reminders Sent</p>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/30 text-center">
                    <p className="text-2xl font-bold">{invoice.reminders_opened}</p>
                    <p className="text-xs text-muted-foreground">Emails Opened</p>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Reminders Tab */}
            <TabsContent value="reminders" className="mt-0 px-4 sm:px-6 py-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium flex items-center gap-2">
                    <Bell className="w-4 h-4 text-primary" />
                    Scheduled Reminders
                  </h4>
                  <Button variant="ghost" size="sm" onClick={onEdit}>
                    <Edit className="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                </div>

                {remindersLoading ? (
                  <div className="space-y-2">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="h-16 bg-muted/30 rounded-lg animate-pulse" />
                    ))}
                  </div>
                ) : scheduledReminders.length === 0 ? (
                  <div className="text-center py-6 text-muted-foreground border rounded-lg border-dashed">
                    <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No reminders scheduled</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {scheduledReminders.map((reminder, index) => (
                      <div
                        key={reminder.id}
                        className="flex items-center gap-3 p-3 rounded-lg bg-muted/30"
                      >
                        <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-semibold flex items-center justify-center">
                          {index + 1}
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium">
                            {getReminderTimingLabel(reminder.timing_type, reminder.timing_days)}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              {getChannelIcon(reminder.channel)}
                              <span>{getChannelLabel(reminder.channel)}</span>
                            </div>
                            <span className="text-muted-foreground">•</span>
                            <span className="text-xs text-muted-foreground">
                              {getToneLabel(reminder.tone)}
                            </span>
                          </div>
                        </div>
                        {getReminderStatusBadge(reminder.status)}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>

            {/* Activity Tab */}
            <TabsContent value="activity" className="mt-0 px-4 sm:px-6 py-4">
              <div className="space-y-4">
                <h4 className="text-sm font-medium">Activity Timeline</h4>
                <InvoiceActivityPanel 
                  activities={activities} 
                  isLoading={activitiesLoading} 
                />
              </div>
            </TabsContent>
          </ScrollArea>
        </Tabs>

        {/* Actions */}
        {invoice.status !== "paid" && (
          <div className="shrink-0 border-t bg-background p-4 sm:p-6 space-y-2">
            <Button className="w-full" onClick={onSendReminder}>
              <Send className="w-4 h-4 mr-2" />
              Send Reminder Now
            </Button>
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1" onClick={onEdit}>
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Button>
              <Button variant="outline" className="flex-1" onClick={onMarkPaid}>
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Mark Paid
              </Button>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}

export default InvoiceDetailSheet;
