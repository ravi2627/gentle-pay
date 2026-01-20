import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Mail, MessageSquare, Bell, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export interface ReminderSchedule {
  enabled: boolean;
  tone: "polite" | "professional" | "firm";
  email3DaysBefore: boolean;
  emailOnDueDate: boolean;
  email3DaysAfter: boolean;
  email7DaysAfter: boolean;
  smsEnabled: boolean;
  smsDaysAfterDue: number;
}

export interface CreateInvoiceFormData {
  clientName: string;
  clientEmail: string;
  amount: string;
  dueDate: Date | undefined;
  paymentLinkId: string;
  reminderSchedule: ReminderSchedule;
}

interface PaymentLinkOption {
  id: string;
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

const DEFAULT_REMINDER_SCHEDULE: ReminderSchedule = {
  enabled: true,
  tone: "polite",
  email3DaysBefore: true,
  emailOnDueDate: true,
  email3DaysAfter: true,
  email7DaysAfter: false,
  smsEnabled: false,
  smsDaysAfterDue: 3,
};

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
  const [reminderSchedule, setReminderSchedule] = useState<ReminderSchedule>(
    DEFAULT_REMINDER_SCHEDULE
  );

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      clientName,
      clientEmail,
      amount,
      dueDate,
      paymentLinkId,
      reminderSchedule,
    });
  };

  const updateReminderSchedule = (updates: Partial<ReminderSchedule>) => {
    setReminderSchedule((prev) => ({ ...prev, ...updates }));
  };

  // Check if at least one email reminder is selected (required for SMS)
  const hasEmailReminder =
    reminderSchedule.email3DaysBefore ||
    reminderSchedule.emailOnDueDate ||
    reminderSchedule.email3DaysAfter ||
    reminderSchedule.email7DaysAfter;

  // Check if selected client has phone
  const selectedClient = clients.find(
    (c) => c.name.toLowerCase() === clientName.toLowerCase()
  );
  const clientHasPhone = !!selectedClient?.phone;

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
                  {link.url.substring(0, 40)}...
                  {link.isDefault && " ⭐ Default"}
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>
      </div>

      {/* Reminder Settings Section */}
      <div className="border rounded-lg p-4 space-y-4 bg-muted/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-primary" />
            <Label htmlFor="reminder-toggle" className="font-semibold">
              Enable automatic reminders
            </Label>
          </div>
          <Switch
            id="reminder-toggle"
            checked={reminderSchedule.enabled}
            onCheckedChange={(checked) =>
              updateReminderSchedule({ enabled: checked })
            }
          />
        </div>

        {reminderSchedule.enabled && (
          <div className="space-y-4 pt-2">
            {/* Email Reminders */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Mail className="h-4 w-4" />
                Email Reminders
              </div>
              <div className="grid gap-2 pl-6">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="email-3-before"
                    checked={reminderSchedule.email3DaysBefore}
                    onCheckedChange={(checked) =>
                      updateReminderSchedule({ email3DaysBefore: !!checked })
                    }
                  />
                  <Label htmlFor="email-3-before" className="text-sm">
                    3 days before due date
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="email-on-due"
                    checked={reminderSchedule.emailOnDueDate}
                    onCheckedChange={(checked) =>
                      updateReminderSchedule({ emailOnDueDate: !!checked })
                    }
                  />
                  <Label htmlFor="email-on-due" className="text-sm">
                    On due date
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="email-3-after"
                    checked={reminderSchedule.email3DaysAfter}
                    onCheckedChange={(checked) =>
                      updateReminderSchedule({ email3DaysAfter: !!checked })
                    }
                  />
                  <Label htmlFor="email-3-after" className="text-sm">
                    3 days after due date
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="email-7-after"
                    checked={reminderSchedule.email7DaysAfter}
                    onCheckedChange={(checked) =>
                      updateReminderSchedule({ email7DaysAfter: !!checked })
                    }
                  />
                  <Label htmlFor="email-7-after" className="text-sm">
                    7 days after due date
                  </Label>
                </div>
              </div>
            </div>

            {/* SMS Reminder */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <MessageSquare className="h-4 w-4" />
                SMS Escalation
              </div>
              <div className="pl-6 space-y-3">
                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="sms-enabled"
                    checked={reminderSchedule.smsEnabled}
                    disabled={!hasEmailReminder || !clientHasPhone}
                    onCheckedChange={(checked) =>
                      updateReminderSchedule({ smsEnabled: !!checked })
                    }
                  />
                  <div className="grid gap-1.5 leading-none">
                    <Label
                      htmlFor="sms-enabled"
                      className={cn(
                        "text-sm",
                        (!hasEmailReminder || !clientHasPhone) &&
                          "text-muted-foreground"
                      )}
                    >
                      Send SMS if invoice is still unpaid after
                    </Label>
                    {!hasEmailReminder && (
                      <p className="text-xs text-amber-600">
                        At least one email reminder must be enabled
                      </p>
                    )}
                    {hasEmailReminder && !clientHasPhone && clientName && (
                      <p className="text-xs text-amber-600">
                        Client phone number required for SMS
                      </p>
                    )}
                  </div>
                </div>

                {reminderSchedule.smsEnabled && hasEmailReminder && clientHasPhone && (
                  <div className="flex items-center gap-2">
                    <Select
                      value={reminderSchedule.smsDaysAfterDue.toString()}
                      onValueChange={(value) =>
                        updateReminderSchedule({ smsDaysAfterDue: parseInt(value) })
                      }
                    >
                      <SelectTrigger className="w-24">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 day</SelectItem>
                        <SelectItem value="2">2 days</SelectItem>
                        <SelectItem value="3">3 days</SelectItem>
                        <SelectItem value="5">5 days</SelectItem>
                        <SelectItem value="7">7 days</SelectItem>
                      </SelectContent>
                    </Select>
                    <span className="text-sm text-muted-foreground">past due</span>
                  </div>
                )}
              </div>
            </div>

            {/* Reminder Tone */}
            <div className="space-y-3">
              <Label className="text-sm font-medium text-muted-foreground">
                Reminder Tone
              </Label>
              <RadioGroup
                value={reminderSchedule.tone}
                onValueChange={(value: "polite" | "professional" | "firm") =>
                  updateReminderSchedule({ tone: value })
                }
                className="flex gap-4 pl-6"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="polite" id="tone-polite" />
                  <Label htmlFor="tone-polite" className="text-sm">
                    Polite
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="professional" id="tone-professional" />
                  <Label htmlFor="tone-professional" className="text-sm">
                    Professional
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="firm" id="tone-firm" />
                  <Label htmlFor="tone-firm" className="text-sm">
                    Firm
                  </Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        )}
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
