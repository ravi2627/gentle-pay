import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { 
  Mail, 
  MessageSquare, 
  Calendar, 
  DollarSign, 
  User, 
  Link as LinkIcon,
  CheckCircle2,
  Edit,
  Loader2,
  ChevronDown
} from "lucide-react";
import { format } from "date-fns";
import { useState } from "react";
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

interface ReminderPreviewCardProps {
  reminder: ReminderFormItem;
  index: number;
  templateVariables: TemplateVariables;
  defaultExpanded?: boolean;
}

function ReminderPreviewCard({ reminder, index, templateVariables, defaultExpanded = false }: ReminderPreviewCardProps) {
  const [isOpen, setIsOpen] = useState(defaultExpanded);
  
  const emailPreview = getEmailPreview(reminder.tone as ReminderTone, templateVariables);
  const showSms = reminder.channel === "sms" || reminder.channel === "both";
  const showEmail = reminder.channel === "email" || reminder.channel === "both";
  const smsPreview = showSms ? getSmsPreview(reminder.tone as ReminderTone, templateVariables) : null;

  const channelLabel = getChannelDescription(reminder.channel);
  const timingLabel = getTimingDescription(reminder.timing_type, reminder.timing_days);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <Card className="border bg-card">
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors py-3 px-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-full bg-primary text-primary-foreground text-sm font-semibold flex items-center justify-center shrink-0">
                  {index + 1}
                </span>
                <div className="text-left">
                  <CardTitle className="text-sm font-medium">
                    {timingLabel}
                  </CardTitle>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline" className="text-xs font-normal">
                      {channelLabel}
                    </Badge>
                    <Badge variant="secondary" className="text-xs font-normal">
                      {getToneLabel(reminder.tone)}
                    </Badge>
                  </div>
                </div>
              </div>
              <ChevronDown className={`w-5 h-5 text-muted-foreground transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
            </div>
          </CardHeader>
        </CollapsibleTrigger>
        
        <CollapsibleContent>
          <CardContent className="pt-0 px-4 pb-4 space-y-4">
            {/* Email Preview */}
            {showEmail && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <Mail className="w-4 h-4" />
                  Email Preview
                </div>
                <div className="border rounded-lg overflow-hidden bg-background">
                  <div className="bg-muted/50 px-3 py-2 border-b">
                    <p className="text-xs text-muted-foreground">Subject:</p>
                    <p className="font-medium text-sm">{emailPreview.subject}</p>
                  </div>
                  <div className="p-3">
                    <pre className="whitespace-pre-wrap font-sans text-sm text-foreground/90 leading-relaxed">
                      {emailPreview.body}
                    </pre>
                  </div>
                </div>
              </div>
            )}

            {/* SMS Preview */}
            {showSms && smsPreview && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <MessageSquare className="w-4 h-4" />
                  SMS Preview
                </div>
                <div className="border rounded-lg p-3 bg-muted/30">
                  <div className="max-w-[300px]">
                    <div className="bg-primary text-primary-foreground rounded-2xl rounded-br-sm px-4 py-3">
                      <p className="text-sm leading-relaxed">{smsPreview}</p>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2 text-right">
                      {smsPreview.length} characters
                    </p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}

export function InvoicePreviewModal({
  open,
  onOpenChange,
  data,
  onConfirm,
  onEdit,
  isSubmitting,
}: InvoicePreviewModalProps) {
  const templateVariables: TemplateVariables = {
    clientName: data.clientName || "Client",
    invoiceNumber: `INV-${Date.now().toString().slice(-6)}`,
    amount: parseFloat(data.amount || "0").toLocaleString(),
    currency: data.currencySymbol,
    dueDate: data.dueDate ? format(data.dueDate, "MMMM d, yyyy") : "Due date",
    paymentLink: data.paymentLink?.url || "https://pay.example.com/invoice",
    senderName: data.senderName || "Your Business",
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl h-[90vh] max-h-[90vh] flex flex-col p-0 gap-0">
        <DialogHeader className="px-4 sm:px-6 pt-4 sm:pt-6 pb-4 shrink-0 border-b">
          <DialogTitle className="text-lg sm:text-xl">Review Invoice Before Saving</DialogTitle>
          <DialogDescription className="text-sm">
            Please review your invoice details and reminder messages before confirming.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="flex-1 min-h-0">
          <div className="px-4 sm:px-6 py-4 sm:py-6 space-y-6">
            {/* Invoice Summary */}
            <Card className="bg-muted/30 border-0">
              <CardContent className="p-4">
                <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-4">
                  Invoice Summary
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <User className="w-4 h-4 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs text-muted-foreground">Client</p>
                      <p className="font-medium truncate">{data.clientName}</p>
                      <p className="text-xs text-muted-foreground truncate">{data.clientEmail}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0">
                      <DollarSign className="w-4 h-4 text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Amount</p>
                      <p className="font-medium text-lg">
                        {data.currencySymbol}{parseFloat(data.amount || "0").toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center shrink-0">
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
                    <div className="w-8 h-8 rounded-lg bg-violet-500/10 flex items-center justify-center shrink-0">
                      <LinkIcon className="w-4 h-4 text-violet-600" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs text-muted-foreground">Payment Link</p>
                      <p className="font-medium truncate">
                        {data.paymentLink?.label || "No link selected"}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Separator />

            {/* Reminder Previews */}
            <div>
              <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-4">
                Scheduled Reminders ({data.reminders.length})
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Tap each reminder to preview the exact message that will be sent.
              </p>
              <div className="space-y-3">
                {data.reminders.map((reminder, index) => (
                  <ReminderPreviewCard
                    key={reminder.id}
                    reminder={reminder}
                    index={index}
                    templateVariables={templateVariables}
                    defaultExpanded={index === 0}
                  />
                ))}
              </div>
            </div>
          </div>
        </ScrollArea>

        {/* Sticky Bottom CTA */}
        <div className="shrink-0 border-t bg-background p-4 sm:p-6">
          <div className="flex flex-col-reverse sm:flex-row gap-3">
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
        </div>
      </DialogContent>
    </Dialog>
  );
}
