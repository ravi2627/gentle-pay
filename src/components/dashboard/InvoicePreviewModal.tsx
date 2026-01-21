import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Mail, 
  MessageSquare, 
  Calendar, 
  DollarSign, 
  User, 
  Link as LinkIcon,
  Clock,
  CheckCircle2,
  Edit,
  Loader2
} from "lucide-react";
import { format } from "date-fns";
import type { ReminderFormItem, ReminderTone } from "@/types/invoiceReminders";
import { 
  getEmailPreview, 
  getSmsPreview, 
  getTimingDescription, 
  getChannelDescription,
  getToneLabel,
  type TemplateVariables 
} from "@/lib/reminderTemplates";

interface PaymentLinkOption {
  id: string;
  label: string;
  url: string;
}

interface InvoicePreviewData {
  clientName: string;
  clientEmail: string;
  amount: string;
  currency: string;
  currencySymbol: string;
  dueDate: Date;
  paymentLink: PaymentLinkOption | null;
  reminders: ReminderFormItem[];
  senderName: string;
}

interface InvoicePreviewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data: InvoicePreviewData;
  onConfirm: () => void;
  onEdit: () => void;
  isSubmitting: boolean;
}

export function InvoicePreviewModal({
  open,
  onOpenChange,
  data,
  onConfirm,
  onEdit,
  isSubmitting,
}: InvoicePreviewModalProps) {
  // Generate template variables
  const templateVariables: TemplateVariables = {
    clientName: data.clientName || "Client",
    invoiceNumber: `INV-${Date.now().toString().slice(-6)}`, // Preview number
    amount: parseFloat(data.amount || "0").toLocaleString(),
    currency: data.currencySymbol,
    dueDate: data.dueDate ? format(data.dueDate, "MMMM d, yyyy") : "Due date",
    paymentLink: data.paymentLink?.url || "https://pay.example.com/invoice",
    senderName: data.senderName || "Your Business",
  };

  // Get first reminder for preview
  const firstReminder = data.reminders[0];
  const emailPreview = firstReminder 
    ? getEmailPreview(firstReminder.tone as ReminderTone, templateVariables)
    : null;
  
  // Find first SMS-enabled reminder
  const smsReminder = data.reminders.find(r => r.channel === "sms" || r.channel === "both");
  const smsPreview = smsReminder 
    ? getSmsPreview(smsReminder.tone as ReminderTone, templateVariables)
    : null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col p-0">
        <DialogHeader className="px-6 pt-6 pb-4">
          <DialogTitle className="text-xl">Review Invoice Before Saving</DialogTitle>
          <DialogDescription>
            Please review your invoice details and reminder schedule before confirming.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="flex-1 px-6">
          <div className="space-y-6 pb-6">
            {/* Invoice Summary */}
            <Card className="bg-muted/30 border-0">
              <CardContent className="p-4">
                <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-4">
                  Invoice Summary
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                      <User className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Client</p>
                      <p className="font-medium">{data.clientName}</p>
                      <p className="text-xs text-muted-foreground">{data.clientEmail}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-success/10 flex items-center justify-center">
                      <DollarSign className="w-4 h-4 text-success" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Amount</p>
                      <p className="font-medium text-lg">
                        {data.currencySymbol}{parseFloat(data.amount || "0").toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
                      <Calendar className="w-4 h-4 text-amber-600" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Due Date</p>
                      <p className="font-medium">
                        {data.dueDate ? format(data.dueDate, "MMMM d, yyyy") : "Not set"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-violet-500/10 flex items-center justify-center">
                      <LinkIcon className="w-4 h-4 text-violet-600" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Payment Link</p>
                      <p className="font-medium">
                        {data.paymentLink?.label || "No link selected"}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Reminder Schedule */}
            <div>
              <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-3 flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Scheduled Reminders ({data.reminders.length})
              </h3>
              <div className="space-y-2">
                {data.reminders.map((reminder, index) => (
                  <div 
                    key={index}
                    className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 text-sm"
                  >
                    <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-medium flex items-center justify-center">
                      {index + 1}
                    </span>
                    <span className="flex-1">
                      {getTimingDescription(reminder.timing_type, reminder.timing_days)}
                    </span>
                    <Badge variant="outline" className="font-normal">
                      {getChannelDescription(reminder.channel)}
                    </Badge>
                    <Badge variant="secondary" className="font-normal">
                      {getToneLabel(reminder.tone).split(" ")[0]}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Message Previews */}
            <div>
              <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-3">
                Message Previews
              </h3>
              <Tabs defaultValue="email" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="email" className="gap-2">
                    <Mail className="w-4 h-4" />
                    Email Preview
                  </TabsTrigger>
                  <TabsTrigger value="sms" className="gap-2" disabled={!smsPreview}>
                    <MessageSquare className="w-4 h-4" />
                    SMS Preview
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="email" className="mt-4">
                  {emailPreview ? (
                    <div className="border rounded-lg overflow-hidden">
                      <div className="bg-muted/50 px-4 py-2 border-b">
                        <p className="text-xs text-muted-foreground">Subject:</p>
                        <p className="font-medium text-sm">{emailPreview.subject}</p>
                      </div>
                      <div className="p-4">
                        <pre className="whitespace-pre-wrap font-sans text-sm text-foreground/90 leading-relaxed">
                          {emailPreview.body}
                        </pre>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground text-center py-8">
                      No email reminders scheduled
                    </p>
                  )}
                </TabsContent>
                <TabsContent value="sms" className="mt-4">
                  {smsPreview ? (
                    <div className="border rounded-lg p-4 bg-muted/30">
                      <div className="max-w-[280px] mx-auto">
                        <div className="bg-primary text-primary-foreground rounded-2xl rounded-br-sm px-4 py-3">
                          <p className="text-sm leading-relaxed">{smsPreview}</p>
                        </div>
                        <p className="text-xs text-muted-foreground mt-2 text-right">
                          {smsPreview.length} characters
                        </p>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground text-center py-8">
                      No SMS reminders enabled
                    </p>
                  )}
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </ScrollArea>

        <Separator />

        {/* Action Buttons */}
        <div className="flex flex-col-reverse sm:flex-row gap-3 p-6">
          <Button
            variant="outline"
            onClick={onEdit}
            disabled={isSubmitting}
            className="gap-2"
          >
            <Edit className="w-4 h-4" />
            Edit Invoice
          </Button>
          <Button
            onClick={onConfirm}
            disabled={isSubmitting}
            className="flex-1 gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                Looks Good – Save & Schedule Reminders
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
