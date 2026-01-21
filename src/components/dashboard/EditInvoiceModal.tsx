import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { 
  CalendarIcon, 
  Loader2, 
  Save, 
  AlertTriangle,
  Link as LinkIcon,
  Plus,
  Eye
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { ReminderScheduleEditor } from "./ReminderScheduleEditor";
import { InvoicePreviewModal } from "./InvoicePreviewModal";
import type { ReminderFormItem } from "@/types/invoiceReminders";
import type { InvoiceWithClient } from "@/hooks/useInvoices";

interface PaymentLinkOption {
  id: string;
  label: string;
  url: string;
  isDefault: boolean;
}

interface ClientInfo {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
}

interface EditInvoiceModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  invoice: InvoiceWithClient | null;
  paymentLinks: PaymentLinkOption[];
  clients: ClientInfo[];
  reminders: ReminderFormItem[];
  currency: string;
  currencySymbol: string;
  senderName: string;
  isSubmitting: boolean;
  onSave: (data: EditInvoiceData) => void;
  onCancel: () => void;
}

export interface EditInvoiceData {
  id: string;
  clientName: string;
  clientEmail: string;
  amount: number;
  dueDate: string;
  status: "pending" | "paid" | "overdue";
  paymentLinkId: string | null;
  reminders: ReminderFormItem[];
}

export function EditInvoiceModal({
  open,
  onOpenChange,
  invoice,
  paymentLinks,
  clients,
  reminders: initialReminders,
  currency,
  currencySymbol,
  senderName,
  isSubmitting,
  onSave,
  onCancel,
}: EditInvoiceModalProps) {
  // Form state
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [amount, setAmount] = useState("");
  const [dueDate, setDueDate] = useState<Date | undefined>();
  const [status, setStatus] = useState<"pending" | "paid" | "overdue">("pending");
  const [paymentLinkId, setPaymentLinkId] = useState<string>("");
  const [reminders, setReminders] = useState<ReminderFormItem[]>([]);
  
  // UI state
  const [showPaidWarning, setShowPaidWarning] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [previousStatus, setPreviousStatus] = useState<string>("");

  // Initialize form when invoice changes
  useEffect(() => {
    if (invoice) {
      setClientName(invoice.client_name || "");
      setClientEmail(invoice.client_email || "");
      setAmount(String(invoice.amount));
      setDueDate(new Date(invoice.due_date));
      setStatus(invoice.status === "sent" || invoice.status === "viewed" ? "pending" : invoice.status as "pending" | "paid" | "overdue");
      setPreviousStatus(invoice.status);
      // Payment link would need to be fetched from invoice
      setPaymentLinkId("");
      setReminders(initialReminders);
    }
  }, [invoice, initialReminders]);

  // Check if selected client has phone
  const selectedClient = clients.find(
    (c) => c.name.toLowerCase() === clientName.toLowerCase()
  );
  const clientHasPhone = !!selectedClient?.phone;

  // Get selected payment link details
  const selectedPaymentLink = paymentLinks.find(link => link.id === paymentLinkId);

  const isFormValid = clientName && clientEmail && amount && dueDate;

  const handleStatusChange = (newStatus: "pending" | "paid" | "overdue") => {
    if (newStatus === "paid" && status !== "paid") {
      setShowPaidWarning(true);
      setPreviousStatus(status);
    }
    setStatus(newStatus);
  };

  const confirmPaidStatus = () => {
    setShowPaidWarning(false);
    // Status already set to paid
  };

  const cancelPaidStatus = () => {
    setShowPaidWarning(false);
    setStatus(previousStatus as "pending" | "paid" | "overdue");
  };

  const handlePreviewClick = () => {
    if (isFormValid) {
      setShowPreview(true);
    }
  };

  const handleConfirmSave = () => {
    if (!invoice) return;
    
    onSave({
      id: invoice.id,
      clientName,
      clientEmail,
      amount: parseFloat(amount),
      dueDate: dueDate!.toISOString().split("T")[0],
      status,
      paymentLinkId: paymentLinkId || null,
      reminders,
    });
    setShowPreview(false);
  };

  if (!invoice) return null;

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl h-[90vh] max-h-[90vh] flex flex-col p-0 gap-0">
          <DialogHeader className="px-4 sm:px-6 pt-4 sm:pt-6 pb-4 shrink-0 border-b">
            <DialogTitle className="text-lg sm:text-xl">Edit Invoice</DialogTitle>
            <DialogDescription className="text-sm">
              Update invoice {invoice.invoice_number} details, payment method, and reminder schedule.
            </DialogDescription>
          </DialogHeader>

          <ScrollArea className="flex-1 min-h-0">
            <div className="px-4 sm:px-6 py-4 sm:py-6 space-y-6">
              {/* Section A: Invoice Details */}
              <div className="space-y-4">
                <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                  Invoice Details
                </h3>
                
                <div className="grid gap-4 sm:grid-cols-2">
                  {/* Client Name */}
                  <div className="space-y-2">
                    <Label htmlFor="editClientName">Client Name *</Label>
                    <Input
                      id="editClientName"
                      placeholder="Enter client name"
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      list="edit-client-names"
                    />
                    <datalist id="edit-client-names">
                      {clients.map((client) => (
                        <option key={client.id} value={client.name} />
                      ))}
                    </datalist>
                  </div>

                  {/* Client Email */}
                  <div className="space-y-2">
                    <Label htmlFor="editClientEmail">Client Email *</Label>
                    <Input
                      id="editClientEmail"
                      type="email"
                      placeholder="client@example.com"
                      value={clientEmail}
                      onChange={(e) => setClientEmail(e.target.value)}
                    />
                  </div>

                  {/* Amount */}
                  <div className="space-y-2">
                    <Label htmlFor="editAmount">Amount ({currency}) *</Label>
                    <Input
                      id="editAmount"
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="0.00"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                    />
                  </div>

                  {/* Due Date */}
                  <div className="space-y-2">
                    <Label>Due Date *</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          type="button"
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !dueDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {dueDate ? format(dueDate, "PPP") : "Select due date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={dueDate}
                          onSelect={setDueDate}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <p className="text-xs text-muted-foreground">
                      Changing due date will auto-adjust all reminder schedules
                    </p>
                  </div>

                  {/* Status */}
                  <div className="space-y-2 sm:col-span-2">
                    <Label>Status</Label>
                    <Select value={status} onValueChange={handleStatusChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="paid">Paid</SelectItem>
                        <SelectItem value="overdue">Overdue</SelectItem>
                      </SelectContent>
                    </Select>
                    {status === "paid" && (
                      <div className="flex items-center gap-2 text-sm text-amber-600 bg-amber-50 dark:bg-amber-950/20 p-2 rounded-md">
                        <AlertTriangle className="w-4 h-4 shrink-0" />
                        <span>Marking as paid will cancel all scheduled reminders</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <Separator />

              {/* Section B: Payment Method */}
              <div className="space-y-4">
                <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide flex items-center gap-2">
                  <LinkIcon className="w-4 h-4" />
                  Payment Method
                </h3>

                <div className="space-y-2">
                  <Label>Payment Link</Label>
                  <Select value={paymentLinkId} onValueChange={setPaymentLinkId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select payment link" />
                    </SelectTrigger>
                    <SelectContent>
                      {paymentLinks.length === 0 ? (
                        <SelectItem value="none" disabled>
                          No payment links available
                        </SelectItem>
                      ) : (
                        paymentLinks.map((link) => (
                          <SelectItem key={link.id} value={link.id}>
                            {link.label}
                            {link.isDefault && " ⭐ Default"}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  {selectedPaymentLink && (
                    <p className="text-xs text-muted-foreground truncate">
                      URL: {selectedPaymentLink.url}
                    </p>
                  )}
                </div>
              </div>

              <Separator />

              {/* Section C: Reminder Schedule */}
              <div className="space-y-4">
                <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                  Reminder Schedule
                </h3>
                
                {status === "paid" ? (
                  <div className="text-center py-6 text-muted-foreground border rounded-lg border-dashed bg-muted/30">
                    <AlertTriangle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Reminders disabled for paid invoices</p>
                    <p className="text-xs mt-1">All scheduled reminders will be cancelled</p>
                  </div>
                ) : (
                  <div className="border rounded-lg p-4 bg-muted/30">
                    <ReminderScheduleEditor
                      reminders={reminders}
                      onChange={setReminders}
                      clientHasPhone={clientHasPhone}
                    />
                  </div>
                )}
              </div>
            </div>
          </ScrollArea>

          {/* Sticky Bottom CTA */}
          <div className="shrink-0 border-t bg-background p-4 sm:p-6">
            <div className="flex flex-col-reverse sm:flex-row gap-3">
              <Button
                variant="outline"
                onClick={onCancel}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                onClick={handlePreviewClick}
                disabled={!isFormValid || isSubmitting}
                className="flex-1 gap-2"
              >
                <Eye className="w-4 h-4" />
                Preview Changes
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Paid Status Warning */}
      <AlertDialog open={showPaidWarning} onOpenChange={setShowPaidWarning}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              Mark Invoice as Paid?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Marking this invoice as paid will automatically cancel all scheduled reminders. 
              This action ensures your client won't receive any further payment reminders for this invoice.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={cancelPaidStatus}>
              Keep Current Status
            </AlertDialogCancel>
            <AlertDialogAction onClick={confirmPaidStatus}>
              Yes, Mark as Paid
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Preview Modal */}
      <InvoicePreviewModal
        open={showPreview}
        onOpenChange={setShowPreview}
        data={{
          clientName,
          clientEmail,
          amount,
          currency,
          currencySymbol,
          dueDate: dueDate!,
          paymentLink: selectedPaymentLink ? {
            id: selectedPaymentLink.id,
            label: selectedPaymentLink.label,
            url: selectedPaymentLink.url,
          } : null,
          reminders: status === "paid" ? [] : reminders,
          senderName,
        }}
        onConfirm={handleConfirmSave}
        onEdit={() => setShowPreview(false)}
        isSubmitting={isSubmitting}
      />
    </>
  );
}
