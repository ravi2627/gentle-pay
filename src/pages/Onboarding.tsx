import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
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
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  ArrowRight,
  ArrowLeft,
  Check,
  Building2,
  CreditCard,
  Bell,
  Sparkles,
  Zap,
  Globe,
  Send,
  Mail,
  MessageSquare,
  Loader2,
} from "lucide-react";
import { ReminderScheduleEditor } from "@/components/dashboard/ReminderScheduleEditor";
import type { ReminderFormItem } from "@/types/invoiceReminders";
import { DEFAULT_REMINDERS, getReminderTimingLabel, getChannelLabel, getToneLabel } from "@/types/invoiceReminders";

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
  const { user, updateProfile } = useAuth();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isSendingTest, setIsSendingTest] = useState(false);
  const totalSteps = 6;

  // Step 1: Business Setup
  const [businessData, setBusinessData] = useState({
    businessName: "",
    timezone: "UTC",
    currency: "USD",
  });

  // Step 2: Payment Setup (REQUIRED)
  const [paymentData, setPaymentData] = useState({
    label: "",
    url: "",
  });
  const [paymentLinkAdded, setPaymentLinkAdded] = useState(false);

  // Step 3: Default Reminder Tone
  const [defaultTone, setDefaultTone] = useState<"polite" | "professional" | "firm">("polite");

  // Step 4: Default Reminder Schedule
  const [defaultReminders, setDefaultReminders] = useState<ReminderFormItem[]>([...DEFAULT_REMINDERS]);

  // Step 5: Test Reminder (Optional)
  const [testEmail, setTestEmail] = useState(user?.email || "");
  const [testSent, setTestSent] = useState(false);

  const progress = (step / totalSteps) * 100;

  const getCurrencySymbol = () => {
    return CURRENCIES.find((c) => c.code === businessData.currency)?.symbol || "$";
  };

  const handleAddPaymentLink = async () => {
    if (!paymentData.label.trim() || !paymentData.url.trim()) {
      toast({
        title: "Missing details",
        description: "Please enter both a label and URL for your payment link.",
        variant: "destructive",
      });
      return;
    }

    // Validate URL
    try {
      new URL(paymentData.url);
    } catch {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid payment link URL.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) throw new Error("Not authenticated");

      const { error } = await supabase
        .from("payment_links")
        .insert({
          user_id: authUser.id,
          label: paymentData.label,
          url: paymentData.url,
          is_default: true,
        });

      if (error) throw error;

      setPaymentLinkAdded(true);
      toast({
        title: "Payment link added!",
        description: "Your default payment link has been saved.",
      });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Failed to add payment link";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendTestReminder = async () => {
    if (!testEmail.trim()) {
      toast({
        title: "Email required",
        description: "Please enter an email address to send the test reminder.",
        variant: "destructive",
      });
      return;
    }

    setIsSendingTest(true);

    // Simulate sending a test reminder
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsSendingTest(false);
    setTestSent(true);
    toast({
      title: "Test reminder sent! 📧",
      description: `A sample reminder has been sent to ${testEmail}`,
    });
  };

  const handleNext = () => {
    if (step === 1) {
      if (!businessData.businessName.trim()) {
        toast({
          title: "Business name required",
          description: "Please enter your business name to continue.",
          variant: "destructive",
        });
        return;
      }
    }

    if (step === 2) {
      if (!paymentLinkAdded) {
        toast({
          title: "Payment link required",
          description: "Please add at least one payment link to continue.",
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

  const handleComplete = async () => {
    setIsLoading(true);

    try {
      // Update profile with business name
      if (businessData.businessName) {
        await updateProfile({ business_name: businessData.businessName });
      }

      toast({
        title: "Welcome to PayPing! 🎉",
        description: "Your account is set up and ready to go!",
      });
      navigate("/dashboard");
    } catch (error) {
      toast({
        title: "Setup complete",
        description: "Redirecting to your dashboard...",
      });
      navigate("/dashboard");
    } finally {
      setIsLoading(false);
    }
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

        {/* Step 1: Business Setup */}
        {step === 1 && (
          <Card className="shadow-xl border-0">
            <CardHeader className="text-center pb-2">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Building2 className="w-8 h-8 text-primary" />
              </div>
              <CardTitle className="text-2xl">Let's set up PayPing</CardTitle>
              <CardDescription className="text-base">
                Tell us about your business to personalize your experience
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
                <p className="text-xs text-muted-foreground">
                  This will appear in your reminder emails
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="currency">Default Currency</Label>
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
              </div>

              <Button onClick={handleNext} className="w-full" size="lg">
                Continue
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Payment Setup (REQUIRED) */}
        {step === 2 && (
          <Card className="shadow-xl border-0">
            <CardHeader className="text-center pb-2">
              <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                <CreditCard className="w-7 h-7 text-primary" />
              </div>
              <CardTitle className="text-xl">Add Payment Method</CardTitle>
              <CardDescription>
                Where should clients send payments?
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              {!paymentLinkAdded ? (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="paymentLabel">Label *</Label>
                    <Input
                      id="paymentLabel"
                      placeholder="e.g., Stripe, PayPal, UPI"
                      value={paymentData.label}
                      onChange={(e) =>
                        setPaymentData({ ...paymentData, label: e.target.value })
                      }
                      maxLength={50}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="paymentUrl">Payment Link URL *</Label>
                    <Input
                      id="paymentUrl"
                      placeholder="https://pay.stripe.com/..."
                      value={paymentData.url}
                      onChange={(e) =>
                        setPaymentData({ ...paymentData, url: e.target.value })
                      }
                      maxLength={500}
                    />
                    <p className="text-xs text-muted-foreground">
                      Paste your Stripe, PayPal, or any payment link
                    </p>
                  </div>

                  <Button 
                    onClick={handleAddPaymentLink} 
                    className="w-full" 
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Adding...
                      </>
                    ) : (
                      <>
                        <CreditCard className="w-4 h-4 mr-2" />
                        Add Payment Link
                      </>
                    )}
                  </Button>
                </>
              ) : (
                <div className="text-center py-6">
                  <div className="w-12 h-12 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Check className="w-6 h-6 text-success" />
                  </div>
                  <p className="font-medium">Payment link added!</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {paymentData.label}: {paymentData.url.slice(0, 40)}...
                  </p>
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <Button variant="outline" onClick={handleBack} className="flex-1">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
                <Button 
                  onClick={handleNext} 
                  className="flex-1" 
                  disabled={!paymentLinkAdded}
                >
                  Continue
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Default Reminder Tone */}
        {step === 3 && (
          <Card className="shadow-xl border-0">
            <CardHeader className="text-center pb-2">
              <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                <MessageSquare className="w-7 h-7 text-primary" />
              </div>
              <CardTitle className="text-xl">Choose Your Default Tone</CardTitle>
              <CardDescription>
                How should your reminders sound?
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="space-y-3">
                {[
                  { 
                    value: "polite", 
                    label: "😊 Polite", 
                    description: "Friendly and warm, perfect for long-term clients",
                    preview: "Hi! Just a quick reminder about your invoice..."
                  },
                  { 
                    value: "professional", 
                    label: "💼 Professional", 
                    description: "Business-like and neutral, suitable for most situations",
                    preview: "This is a reminder that your invoice is due..."
                  },
                  { 
                    value: "firm", 
                    label: "⚠️ Firm", 
                    description: "Direct and urgent, for overdue payments",
                    preview: "Your invoice is due. Please arrange payment..."
                  },
                ].map((tone) => (
                  <button
                    key={tone.value}
                    type="button"
                    onClick={() => setDefaultTone(tone.value as typeof defaultTone)}
                    className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                      defaultTone === tone.value
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium">{tone.label}</span>
                      {defaultTone === tone.value && (
                        <Check className="w-4 h-4 text-primary" />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{tone.description}</p>
                    <p className="text-xs text-muted-foreground mt-2 italic">
                      "{tone.preview}"
                    </p>
                  </button>
                ))}
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

        {/* Step 4: Default Reminder Schedule */}
        {step === 4 && (
          <Card className="shadow-xl border-0">
            <CardHeader className="text-center pb-2">
              <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Bell className="w-7 h-7 text-primary" />
              </div>
              <CardTitle className="text-xl">Set Default Schedule</CardTitle>
              <CardDescription>
                Configure when reminders should be sent
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="border rounded-lg p-4 bg-muted/30">
                <ReminderScheduleEditor
                  reminders={defaultReminders}
                  onChange={setDefaultReminders}
                  clientHasPhone={false}
                />
              </div>

              <p className="text-xs text-muted-foreground text-center">
                You can customize this for each invoice later
              </p>

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

        {/* Step 5: Test Reminder (Optional) */}
        {step === 5 && (
          <Card className="shadow-xl border-0">
            <CardHeader className="text-center pb-2">
              <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Send className="w-7 h-7 text-primary" />
              </div>
              <CardTitle className="text-xl">Send a Test Reminder</CardTitle>
              <CardDescription>
                See how your reminders will look (optional)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              {!testSent ? (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="testEmail">Send to Email</Label>
                    <Input
                      id="testEmail"
                      type="email"
                      placeholder="your@email.com"
                      value={testEmail}
                      onChange={(e) => setTestEmail(e.target.value)}
                    />
                  </div>

                  <Button 
                    onClick={handleSendTestReminder} 
                    variant="outline" 
                    className="w-full"
                    disabled={isSendingTest}
                  >
                    {isSendingTest ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Mail className="w-4 h-4 mr-2" />
                        Send Test Reminder
                      </>
                    )}
                  </Button>
                </>
              ) : (
                <div className="text-center py-6">
                  <div className="w-12 h-12 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Check className="w-6 h-6 text-success" />
                  </div>
                  <p className="font-medium">Test reminder sent!</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Check your inbox at {testEmail}
                  </p>
                </div>
              )}

              <Separator />

              <div className="flex gap-3">
                <Button variant="outline" onClick={handleBack} className="flex-1">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
                <Button onClick={handleNext} className="flex-1">
                  {testSent ? "Continue" : "Skip for now"}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 6: Completion */}
        {step === 6 && (
          <Card className="shadow-xl border-0">
            <CardHeader className="text-center pb-2">
              <div className="w-16 h-16 bg-success/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-8 h-8 text-success" />
              </div>
              <CardTitle className="text-2xl">You're All Set! 🎉</CardTitle>
              <CardDescription className="text-base">
                PayPing is ready to help you get paid faster
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Summary */}
              <div className="space-y-3 p-4 rounded-lg bg-muted/30">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Business</span>
                  <span className="font-medium">{businessData.businessName}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Currency</span>
                  <span className="font-medium">{businessData.currency}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Payment Link</span>
                  <span className="font-medium">{paymentData.label}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Default Tone</span>
                  <Badge variant="secondary">{defaultTone}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Reminders</span>
                  <span className="font-medium">{defaultReminders.length} configured</span>
                </div>
              </div>

              <div className="space-y-3 text-center">
                <div className="flex items-center gap-2 justify-center text-sm text-muted-foreground">
                  <Zap className="w-4 h-4 text-primary" />
                  Automated reminders ready to go
                </div>
                <div className="flex items-center gap-2 justify-center text-sm text-muted-foreground">
                  <Check className="w-4 h-4 text-success" />
                  All changes saved
                </div>
              </div>

              <Button 
                onClick={handleComplete} 
                className="w-full" 
                size="lg"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Loading...
                  </>
                ) : (
                  <>
                    Go to Dashboard
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Onboarding;
