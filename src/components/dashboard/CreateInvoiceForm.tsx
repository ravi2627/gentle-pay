import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { ReminderScheduleEditor } from "./ReminderScheduleEditor";
import type { ReminderFormItem } from "@/types/invoiceReminders";
import { DEFAULT_REMINDERS } from "@/types/invoiceReminders";

export interface CreateInvoiceFormData {
  clientName: string;
  clientEmail: string;
  amount: string;
  dueDate: Date | undefined;
  paymentLinkId: string;
  reminders: ReminderFormItem[];
}

interface PaymentLinkOption {
  id: string;
  label: string;
  url: string;
  isDefault: boolean;
}

interface ClientOption {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
}

interface CreateInvoiceFormProps {
  paymentLinks: PaymentLinkOption[];
  clients: ClientOption[];
  currency: string;
  isSubmitting: boolean;
  onSubmit: (data: CreateInvoiceFormData) => void;
  onCancel: () => void;
}

export function CreateInvoiceForm({
  paymentLinks,
  clients,
  currency,
  isSubmitting,
  onSubmit,
  onCancel,
}: CreateInvoiceFormProps) {
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [amount, setAmount] = useState("");
  const [dueDate, setDueDate] = useState<Date | undefined>();
  const [paymentLinkId, setPaymentLinkId] = useState("");
  const [reminders, setReminders] = useState<ReminderFormItem[]>([...DEFAULT_REMINDERS]);

  // Set default payment link on mount
  useEffect(() => {
    const defaultLink = paymentLinks.find((link) => link.isDefault);
    if (defaultLink && !paymentLinkId) {
      setPaymentLinkId(defaultLink.id);
    }
  }, [paymentLinks, paymentLinkId]);

  // Auto-fill email when selecting existing client
  const handleClientSelect = (name: string) => {
    setClientName(name);
    const existingClient = clients.find(
      (c) => c.name.toLowerCase() === name.toLowerCase()
    );
    if (existingClient?.email) {
      setClientEmail(existingClient.email);
    }
  };

  // Check if selected client has phone
  const selectedClient = clients.find(
    (c) => c.name.toLowerCase() === clientName.toLowerCase()
  );
  const clientHasPhone = !!selectedClient?.phone;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      clientName,
      clientEmail,
      amount,
      dueDate,
      paymentLinkId,
      reminders,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Client Name */}
      <div className="space-y-2">
        <Label htmlFor="clientName">Client Name *</Label>
        <Input
          id="clientName"
          placeholder="Enter client name"
          value={clientName}
          onChange={(e) => handleClientSelect(e.target.value)}
          list="client-names"
          required
        />
        <datalist id="client-names">
          {clients.map((client) => (
            <option key={client.id} value={client.name} />
          ))}
        </datalist>
      </div>

      {/* Client Email */}
      <div className="space-y-2">
        <Label htmlFor="clientEmail">Client Email *</Label>
        <Input
          id="clientEmail"
          type="email"
          placeholder="client@example.com"
          value={clientEmail}
          onChange={(e) => setClientEmail(e.target.value)}
          required
        />
      </div>

      {/* Amount */}
      <div className="space-y-2">
        <Label htmlFor="amount">Amount ({currency}) *</Label>
        <Input
          id="amount"
          type="number"
          step="0.01"
          min="0"
          placeholder="0.00"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
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
              disabled={(date) => date < new Date()}
            />
          </PopoverContent>
        </Popover>
      </div>

      {/* Payment Link */}
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
      </div>

      {/* Flexible Reminder Schedule */}
      <div className="border rounded-lg p-4 bg-muted/30">
        <ReminderScheduleEditor
          reminders={reminders}
          onChange={setReminders}
          clientHasPhone={clientHasPhone}
        />
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="w-full sm:w-auto"
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          className="w-full sm:w-auto flex-1"
          disabled={isSubmitting || !clientName || !clientEmail || !amount || !dueDate}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating...
            </>
          ) : (
            "Create Invoice"
          )}
        </Button>
      </div>
    </form>
  );
}
