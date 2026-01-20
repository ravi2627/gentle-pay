import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";
import {
  ArrowRight,
  ArrowLeft,
  Check,
  Building2,
  User,
  FileText,
  MessageSquare,
  Sparkles,
  Zap,
  Globe,
  CreditCard,
} from "lucide-react";

const CURRENCIES = [
  { code: "USD", symbol: "$", name: "US Dollar" },
  { code: "EUR", symbol: "€", name: "Euro" },
  { code: "GBP", symbol: "£", name: "British Pound" },
  { code: "INR", symbol: "₹", name: "Indian Rupee" },
  { code: "AUD", symbol: "$", name: "Australian Dollar" },
  { code: "CAD", symbol: "$", name: "Canadian Dollar" },
];

const TIMEZONES = [
  { value: "UTC", label: "UTC (GMT+0)" },
  { value: "America/New_York", label: "Eastern Time (ET)" },
  { value: "America/Chicago", label: "Central Time (CT)" },
  { value: "America/Denver", label: "Mountain Time (MT)" },
  { value: "America/Los_Angeles", label: "Pacific Time (PT)" },
  { value: "Europe/London", label: "London (GMT)" },
  { value: "Europe/Paris", label: "Paris (CET)" },
  { value: "Asia/Tokyo", label: "Tokyo (JST)" },
  { value: "Asia/Kolkata", label: "India (IST)" },
  { value: "Australia/Sydney", label: "Sydney (AEST)" },
];

const Onboarding = () => {
  const navigate = useNavigate();
  const { user, login } = useAuth();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const totalSteps = 6;

  // Step 2: Business Setup
  const [businessData, setBusinessData] = useState({
    businessName: "",
    defaultPaymentLink: "",
    timezone: "UTC",
    currency: "USD",
  });

  // Step 3: First Client
  const [clientData, setClientData] = useState({
    name: "",
    email: "",
    phone: "",
  });

  // Step 4: First Invoice
  const [invoiceData, setInvoiceData] = useState({
    amount: "",
    dueDate: "",
    paymentLink: "",
    remindersEnabled: true,
  });

  // Step 5: Reminder Tone
  const [reminderTone, setReminderTone] = useState<"polite" | "professional" | "firm">("polite");

  const progress = (step / totalSteps) * 100;

  const getCurrencySymbol = () => {
    return CURRENCIES.find((c) => c.code === businessData.currency)?.symbol || "$";
  };

  const getReminderPreview = () => {
    const clientName = clientData.name || "Client Name";
    const amount = invoiceData.amount || "500";
    const dueDate = invoiceData.dueDate
      ? new Date(invoiceData.dueDate).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })
      : "Jan 25, 2026";
    const symbol = getCurrencySymbol();

    switch (reminderTone) {
      case "polite":
        return `Hi ${clientName},\n\nJust a quick reminder about your invoice for ${symbol}${amount} due on ${dueDate}.\n\nPay here: [payment link]\n\nThank you!`;
      case "professional":
        return `Hello ${clientName},\n\nThis is a reminder that your invoice for ${symbol}${amount} is due on ${dueDate}.\n\nPayment link: [payment link]\n\nBest regards`;
      case "firm":
        return `Dear ${clientName},\n\nYour invoice for ${symbol}${amount} is due on ${dueDate}. Please arrange payment promptly.\n\nPayment link: [payment link]`;
      default:
        return "";
    }
  };

  const handleNext = () => {
    if (step === 2) {
      if (!businessData.businessName.trim()) {
        toast({
          title: "Business name required",
          description: "Please enter your business name to continue.",
          variant: "destructive",
        });
        return;
      }
    }

    if (step === 3) {
      if (!clientData.name.trim() || !clientData.email.trim()) {
        toast({
          title: "Client details required",
          description: "Please enter at least client name and email.",
          variant: "destructive",
        });
        return;
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(clientData.email)) {
        toast({
          title: "Invalid email",
          description: "Please enter a valid email address.",
          variant: "destructive",
        });
        return;
      }
    }

    if (step === 4) {
      if (!invoiceData.amount || !invoiceData.dueDate) {
        toast({
          title: "Invoice details required",
          description: "Please enter amount and due date.",
          variant: "destructive",
        });
        return;
      }
    }

    if (step < totalSteps) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleComplete = () => {
    // Simulate saving onboarding data
    toast({
      title: "Welcome to PayPing! 🎉",
      description: "Your first reminder is scheduled. Let's get you paid!",
    });
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/10 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Progress */}
        <div className="mb-6">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-muted-foreground">Step {step} of {totalSteps}</span>
            <span className="font-medium">{Math.round(progress)}% complete</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Step 1: Welcome */}
        {step === 1 && (
          <Card className="shadow-xl border-0">
            <CardHeader className="text-center pb-2">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-8 h-8 text-primary" />
              </div>
              <CardTitle className="text-2xl">Welcome to PayPing</CardTitle>
              <CardDescription className="text-base">
                PayPing helps you get paid — automatically.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                  <Zap className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium text-sm">Automated Reminders</p>
                    <p className="text-sm text-muted-foreground">
                      Polite follow-ups sent automatically
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                  <Check className="w-5 h-5 text-success mt-0.5" />
                  <div>
                    <p className="font-medium text-sm">Get Paid Faster</p>
                    <p className="text-sm text-muted-foreground">
                      Clients pay 2x faster with gentle pings
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                  <MessageSquare className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium text-sm">No Awkward Conversations</p>
                    <p className="text-sm text-muted-foreground">
                      Let PayPing handle the follow-ups for you
                    </p>
                  </div>
                </div>
              </div>
              <Button onClick={handleNext} className="w-full" size="lg">
                Get Started
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Business Setup */}
        {step === 2 && (
          <Card className="shadow-xl border-0">
            <CardHeader className="text-center pb-2">
              <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Building2 className="w-7 h-7 text-primary" />
              </div>
              <CardTitle className="text-xl">Business Setup</CardTitle>
              <CardDescription>
                Tell us about your business
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="businessName">Business Name *</Label>
                <Input
                  id="businessName"
                  placeholder="Your Company Name"
                  value={businessData.businessName}
                  onChange={(e) =>
                    setBusinessData({ ...businessData, businessName: e.target.value })
                  }
                  maxLength={100}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="paymentLink">Default Payment Link</Label>
                <div className="relative">
                  <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="paymentLink"
                    placeholder="https://pay.stripe.com/..."
                    value={businessData.defaultPaymentLink}
                    onChange={(e) =>
                      setBusinessData({ ...businessData, defaultPaymentLink: e.target.value })
                    }
                    className="pl-9"
                    maxLength={500}
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Stripe, PayPal, or any payment link you use
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select
                    value={businessData.timezone}
                    onValueChange={(value) =>
                      setBusinessData({ ...businessData, timezone: value })
                    }
                  >
                    <SelectTrigger id="timezone">
                      <Globe className="w-4 h-4 mr-2 text-muted-foreground" />
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      {TIMEZONES.map((tz) => (
                        <SelectItem key={tz.value} value={tz.value}>
                          {tz.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="currency">Currency</Label>
                  <Select
                    value={businessData.currency}
                    onValueChange={(value) =>
                      setBusinessData({ ...businessData, currency: value })
                    }
                  >
                    <SelectTrigger id="currency">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      {CURRENCIES.map((cur) => (
                        <SelectItem key={cur.code} value={cur.code}>
                          {cur.symbol} {cur.code}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <Button variant="outline" onClick={handleBack} className="flex-1">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
                <Button onClick={handleNext} className="flex-1">
                  Continue
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: First Client */}
        {step === 3 && (
          <Card className="shadow-xl border-0">
            <CardHeader className="text-center pb-2">
              <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                <User className="w-7 h-7 text-primary" />
              </div>
              <CardTitle className="text-xl">Add Your First Client</CardTitle>
              <CardDescription>
                Who would you like to send reminders to?
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="clientName">Client Name *</Label>
                <Input
                  id="clientName"
                  placeholder="John Smith or Acme Corp"
                  value={clientData.name}
                  onChange={(e) =>
                    setClientData({ ...clientData, name: e.target.value })
                  }
                  maxLength={100}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="clientEmail">Email *</Label>
                <Input
                  id="clientEmail"
                  type="email"
                  placeholder="client@company.com"
                  value={clientData.email}
                  onChange={(e) =>
                    setClientData({ ...clientData, email: e.target.value })
                  }
                  maxLength={255}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="clientPhone">Phone (optional)</Label>
                <Input
                  id="clientPhone"
                  type="tel"
                  placeholder="+1 555-0123"
                  value={clientData.phone}
                  onChange={(e) =>
                    setClientData({ ...clientData, phone: e.target.value })
                  }
                  maxLength={20}
                />
                <p className="text-xs text-muted-foreground">
                  For SMS reminders (Pro plan)
                </p>
              </div>

              <div className="flex gap-3 pt-2">
                <Button variant="outline" onClick={handleBack} className="flex-1">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
                <Button onClick={handleNext} className="flex-1">
                  Continue
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 4: First Invoice */}
        {step === 4 && (
          <Card className="shadow-xl border-0">
            <CardHeader className="text-center pb-2">
              <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                <FileText className="w-7 h-7 text-primary" />
              </div>
              <CardTitle className="text-xl">Create First Invoice</CardTitle>
              <CardDescription>
                Add the invoice you want to track
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="invoiceAmount">Amount ({getCurrencySymbol()}) *</Label>
                <Input
                  id="invoiceAmount"
                  type="number"
                  placeholder="500.00"
                  min="0.01"
                  step="0.01"
                  value={invoiceData.amount}
                  onChange={(e) =>
                    setInvoiceData({ ...invoiceData, amount: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="invoiceDueDate">Due Date *</Label>
                <Input
                  id="invoiceDueDate"
                  type="date"
                  value={invoiceData.dueDate}
                  onChange={(e) =>
                    setInvoiceData({ ...invoiceData, dueDate: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="invoicePaymentLink">Payment Link</Label>
                <Input
                  id="invoicePaymentLink"
                  placeholder={businessData.defaultPaymentLink || "https://..."}
                  value={invoiceData.paymentLink || businessData.defaultPaymentLink}
                  onChange={(e) =>
                    setInvoiceData({ ...invoiceData, paymentLink: e.target.value })
                  }
                  maxLength={500}
                />
                <p className="text-xs text-muted-foreground">
                  Auto-filled from your default payment link
                </p>
              </div>

              <div className="p-3 bg-success/10 border border-success/20 rounded-lg">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-success" />
                  <span className="text-sm font-medium">Reminders enabled by default</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1 ml-6">
                  We'll send polite reminders before and after the due date
                </p>
              </div>

              <div className="flex gap-3 pt-2">
                <Button variant="outline" onClick={handleBack} className="flex-1">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
                <Button onClick={handleNext} className="flex-1">
                  Continue
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 5: Reminder Tone */}
        {step === 5 && (
          <Card className="shadow-xl border-0">
            <CardHeader className="text-center pb-2">
              <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                <MessageSquare className="w-7 h-7 text-primary" />
              </div>
              <CardTitle className="text-xl">Choose Your Tone</CardTitle>
              <CardDescription>
                How would you like your reminders to sound?
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="space-y-3">
                <button
                  type="button"
                  onClick={() => setReminderTone("polite")}
                  className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                    reminderTone === "polite"
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">😊 Polite</p>
                      <p className="text-sm text-muted-foreground">
                        Friendly and casual reminders
                      </p>
                    </div>
                    {reminderTone === "polite" && (
                      <Check className="w-5 h-5 text-primary" />
                    )}
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setReminderTone("professional")}
                  className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                    reminderTone === "professional"
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">💼 Professional</p>
                      <p className="text-sm text-muted-foreground">
                        Business-appropriate tone
                      </p>
                    </div>
                    {reminderTone === "professional" && (
                      <Check className="w-5 h-5 text-primary" />
                    )}
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setReminderTone("firm")}
                  className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                    reminderTone === "firm"
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">📋 Firm</p>
                      <p className="text-sm text-muted-foreground">
                        Direct and to the point
                      </p>
                    </div>
                    {reminderTone === "firm" && (
                      <Check className="w-5 h-5 text-primary" />
                    )}
                  </div>
                </button>
              </div>

              <div className="flex gap-3 pt-2">
                <Button variant="outline" onClick={handleBack} className="flex-1">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
                <Button onClick={handleNext} className="flex-1">
                  Continue
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 6: Confirmation */}
        {step === 6 && (
          <Card className="shadow-xl border-0">
            <CardHeader className="text-center pb-2">
              <div className="w-16 h-16 bg-success/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-success" />
              </div>
              <CardTitle className="text-2xl">You're All Set!</CardTitle>
              <CardDescription className="text-base">
                Your first PayPing reminder is scheduled
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Summary */}
              <div className="space-y-3 p-4 bg-muted/50 rounded-lg">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Client</span>
                  <span className="font-medium">{clientData.name}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Amount</span>
                  <span className="font-medium">
                    {getCurrencySymbol()}{invoiceData.amount}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Due Date</span>
                  <span className="font-medium">
                    {invoiceData.dueDate
                      ? new Date(invoiceData.dueDate).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })
                      : "-"}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tone</span>
                  <span className="font-medium capitalize">{reminderTone}</span>
                </div>
              </div>

              {/* Preview */}
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">REMINDER PREVIEW</Label>
                <div className="p-4 bg-background border border-border rounded-lg">
                  <pre className="text-sm whitespace-pre-wrap font-sans">
                    {getReminderPreview()}
                  </pre>
                </div>
              </div>

              <Button onClick={handleComplete} className="w-full" size="lg">
                Go to Dashboard
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>

              <Button variant="ghost" onClick={handleBack} className="w-full">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to edit
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Onboarding;
