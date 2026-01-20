import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
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
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { DashboardLayout } from "@/components/DashboardLayout";
import {
  Bell,
  Calendar,
  Clock,
  CreditCard,
  DollarSign,
  Globe,
  Mail,
  MessageSquare,
  Save,
  Trash2,
  User,
  Building2,
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

const Settings = () => {
  const { user, logout } = useAuth();
  const { toast } = useToast();

  const [isSaving, setIsSaving] = useState(false);

  // Profile settings
  const [profile, setProfile] = useState({
    name: user?.name || "",
    email: user?.email || "",
    company: "",
    timezone: "UTC",
    currency: "USD",
    emailSenderName: "",
  });

  // Notification preferences
  const [notifications, setNotifications] = useState({
    emailReminders: true,
    paymentReceived: true,
    weeklyReport: true,
    productUpdates: false,
    lowSMSBalance: true,
  });

  // Reminder schedule
  const [reminderSchedule, setReminderSchedule] = useState({
    firstReminder: "3",
    secondReminder: "7",
    thirdReminder: "14",
    sendTime: "09:00",
    includePaymentLink: true,
    enableSMS: false,
    businessHoursOnly: true,
    autoStopOnPayment: true,
  });

  // Reminder tone
  const [reminderTone, setReminderTone] = useState<"polite" | "professional" | "firm">("polite");

  useEffect(() => {
    if (user) {
      setProfile((prev) => ({
        ...prev,
        name: user.name || "",
        email: user.email || "",
      }));
    }
  }, [user]);

  const handleSaveProfile = () => {
    const name = profile.name.trim();
    const company = profile.company.trim();
    const senderName = profile.emailSenderName.trim();

    if (!name || name.length > 100) {
      toast({
        title: "Invalid name",
        description: "Please enter a valid name (max 100 characters).",
        variant: "destructive",
      });
      return;
    }

    if (company.length > 100) {
      toast({
        title: "Invalid company name",
        description: "Company name must be less than 100 characters.",
        variant: "destructive",
      });
      return;
    }

    if (senderName.length > 50) {
      toast({
        title: "Invalid sender name",
        description: "Email sender name must be less than 50 characters.",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toast({
        title: "Profile updated",
        description: "Your profile settings have been saved.",
      });
    }, 500);
  };

  const handleSaveNotifications = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toast({
        title: "Notifications updated",
        description: "Your notification preferences have been saved.",
      });
    }, 500);
  };

  const handleSaveSchedule = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toast({
        title: "Schedule updated",
        description: "Your reminder schedule has been saved.",
      });
    }, 500);
  };

  const handleDeleteAccount = () => {
    toast({
      title: "Account deletion requested",
      description: "We'll send you a confirmation email to complete the deletion process.",
    });
  };

  const currencySymbol = CURRENCIES.find((c) => c.code === profile.currency)?.symbol || "$";

  return (
    <DashboardLayout title="Settings" description="Manage your account and preferences">
      <div className="max-w-4xl space-y-6">
        {/* Profile Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Profile
            </CardTitle>
            <CardDescription>
              Your personal information and account details
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={profile.name}
                  onChange={(e) =>
                    setProfile({ ...profile, name: e.target.value })
                  }
                  placeholder="Your name"
                  maxLength={100}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={profile.email}
                  disabled
                  className="bg-muted"
                />
                <p className="text-xs text-muted-foreground">
                  Email cannot be changed
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="company">Company (optional)</Label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="company"
                    value={profile.company}
                    onChange={(e) =>
                      setProfile({ ...profile, company: e.target.value })
                    }
                    placeholder="Your company name"
                    className="pl-9"
                    maxLength={100}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="senderName">Email Sender Name</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="senderName"
                    value={profile.emailSenderName}
                    onChange={(e) =>
                      setProfile({ ...profile, emailSenderName: e.target.value })
                    }
                    placeholder="e.g., John from Acme"
                    className="pl-9"
                    maxLength={50}
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  How your name appears in reminder emails
                </p>
              </div>
            </div>
            <div className="flex justify-end pt-2">
              <Button onClick={handleSaveProfile} disabled={isSaving}>
                <Save className="w-4 h-4 mr-2" />
                Save Profile
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Currency & Timezone */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="w-5 h-5" />
              Regional Settings
            </CardTitle>
            <CardDescription>
              Currency and timezone preferences
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="currency">Currency</Label>
                <Select
                  value={profile.currency}
                  onValueChange={(value) =>
                    setProfile({ ...profile, currency: value })
                  }
                >
                  <SelectTrigger id="currency">
                    <DollarSign className="w-4 h-4 mr-2 text-muted-foreground" />
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    {CURRENCIES.map((cur) => (
                      <SelectItem key={cur.code} value={cur.code}>
                        {cur.symbol} {cur.code} - {cur.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Used for displaying amounts in invoices and dashboards
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="timezone">Timezone</Label>
                <Select
                  value={profile.timezone}
                  onValueChange={(value) =>
                    setProfile({ ...profile, timezone: value })
                  }
                >
                  <SelectTrigger id="timezone">
                    <Clock className="w-4 h-4 mr-2 text-muted-foreground" />
                    <SelectValue placeholder="Select timezone" />
                  </SelectTrigger>
                  <SelectContent>
                    {TIMEZONES.map((tz) => (
                      <SelectItem key={tz.value} value={tz.value}>
                        {tz.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Reminders will be sent based on this timezone
                </p>
              </div>
            </div>
            <div className="flex justify-end pt-2">
              <Button onClick={handleSaveProfile} disabled={isSaving}>
                <Save className="w-4 h-4 mr-2" />
                Save Settings
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Notification Preferences */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5" />
              Notification Preferences
            </CardTitle>
            <CardDescription>
              Choose what notifications you want to receive
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Email Reminders</Label>
                  <p className="text-sm text-muted-foreground">
                    Get notified when reminders are sent to clients
                  </p>
                </div>
                <Switch
                  checked={notifications.emailReminders}
                  onCheckedChange={(checked) =>
                    setNotifications({ ...notifications, emailReminders: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Payment Received</Label>
                  <p className="text-sm text-muted-foreground">
                    Get notified when a client marks payment as complete
                  </p>
                </div>
                <Switch
                  checked={notifications.paymentReceived}
                  onCheckedChange={(checked) =>
                    setNotifications({ ...notifications, paymentReceived: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Weekly Report</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive a weekly summary of your invoices and payments
                  </p>
                </div>
                <Switch
                  checked={notifications.weeklyReport}
                  onCheckedChange={(checked) =>
                    setNotifications({ ...notifications, weeklyReport: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Low SMS Balance</Label>
                  <p className="text-sm text-muted-foreground">
                    Get alerted when your SMS credits are running low
                  </p>
                </div>
                <Switch
                  checked={notifications.lowSMSBalance}
                  onCheckedChange={(checked) =>
                    setNotifications({ ...notifications, lowSMSBalance: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Product Updates</Label>
                  <p className="text-sm text-muted-foreground">
                    Stay informed about new features and improvements
                  </p>
                </div>
                <Switch
                  checked={notifications.productUpdates}
                  onCheckedChange={(checked) =>
                    setNotifications({ ...notifications, productUpdates: checked })
                  }
                />
              </div>
            </div>
            <div className="flex justify-end pt-2">
              <Button onClick={handleSaveNotifications} disabled={isSaving}>
                <Save className="w-4 h-4 mr-2" />
                Save Notifications
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Reminder Schedule */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Reminder Schedule
            </CardTitle>
            <CardDescription>
              Configure when and how payment reminders are sent
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Reminder Tone */}
            <div className="space-y-3">
              <Label className="text-base">Reminder Tone</Label>
              <div className="grid grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setReminderTone("polite")}
                  className={`p-3 text-center rounded-lg border-2 transition-all ${
                    reminderTone === "polite"
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <span className="text-lg">😊</span>
                  <p className="text-sm font-medium mt-1">Polite</p>
                </button>
                <button
                  type="button"
                  onClick={() => setReminderTone("professional")}
                  className={`p-3 text-center rounded-lg border-2 transition-all ${
                    reminderTone === "professional"
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <span className="text-lg">💼</span>
                  <p className="text-sm font-medium mt-1">Professional</p>
                </button>
                <button
                  type="button"
                  onClick={() => setReminderTone("firm")}
                  className={`p-3 text-center rounded-lg border-2 transition-all ${
                    reminderTone === "firm"
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <span className="text-lg">📋</span>
                  <p className="text-sm font-medium mt-1">Firm</p>
                </button>
              </div>
            </div>

            {/* Reminder Intervals */}
            <div className="space-y-4">
              <Label className="text-base">Reminder Intervals</Label>
              <p className="text-sm text-muted-foreground">
                Set when reminders are sent after the invoice due date
              </p>
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="firstReminder" className="text-sm">
                    First Reminder
                  </Label>
                  <Select
                    value={reminderSchedule.firstReminder}
                    onValueChange={(value) =>
                      setReminderSchedule({ ...reminderSchedule, firstReminder: value })
                    }
                  >
                    <SelectTrigger id="firstReminder">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 day after</SelectItem>
                      <SelectItem value="3">3 days after</SelectItem>
                      <SelectItem value="5">5 days after</SelectItem>
                      <SelectItem value="7">7 days after</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="secondReminder" className="text-sm">
                    Second Reminder
                  </Label>
                  <Select
                    value={reminderSchedule.secondReminder}
                    onValueChange={(value) =>
                      setReminderSchedule({ ...reminderSchedule, secondReminder: value })
                    }
                  >
                    <SelectTrigger id="secondReminder">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="7">7 days after</SelectItem>
                      <SelectItem value="10">10 days after</SelectItem>
                      <SelectItem value="14">14 days after</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="thirdReminder" className="text-sm">
                    Third Reminder
                  </Label>
                  <Select
                    value={reminderSchedule.thirdReminder}
                    onValueChange={(value) =>
                      setReminderSchedule({ ...reminderSchedule, thirdReminder: value })
                    }
                  >
                    <SelectTrigger id="thirdReminder">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="14">14 days after</SelectItem>
                      <SelectItem value="21">21 days after</SelectItem>
                      <SelectItem value="30">30 days after</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Send Time */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <Label htmlFor="sendTime">Daily Send Time</Label>
              </div>
              <p className="text-sm text-muted-foreground">
                Reminders will be sent at this time in your timezone
              </p>
              <Select
                value={reminderSchedule.sendTime}
                onValueChange={(value) =>
                  setReminderSchedule({ ...reminderSchedule, sendTime: value })
                }
              >
                <SelectTrigger id="sendTime" className="w-full sm:w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="08:00">8:00 AM</SelectItem>
                  <SelectItem value="09:00">9:00 AM</SelectItem>
                  <SelectItem value="10:00">10:00 AM</SelectItem>
                  <SelectItem value="11:00">11:00 AM</SelectItem>
                  <SelectItem value="12:00">12:00 PM</SelectItem>
                  <SelectItem value="14:00">2:00 PM</SelectItem>
                  <SelectItem value="16:00">4:00 PM</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Additional Options */}
            <div className="space-y-4 pt-2">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <Label className="text-base">Include Payment Link</Label>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Automatically include your payment link in reminders
                  </p>
                </div>
                <Switch
                  checked={reminderSchedule.includePaymentLink}
                  onCheckedChange={(checked) =>
                    setReminderSchedule({
                      ...reminderSchedule,
                      includePaymentLink: checked,
                    })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Business Hours Only</Label>
                  <p className="text-sm text-muted-foreground">
                    Only send reminders during business hours (9 AM - 6 PM)
                  </p>
                </div>
                <Switch
                  checked={reminderSchedule.businessHoursOnly}
                  onCheckedChange={(checked) =>
                    setReminderSchedule({
                      ...reminderSchedule,
                      businessHoursOnly: checked,
                    })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Auto-Stop on Payment</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically stop reminders when invoice is marked as paid
                  </p>
                </div>
                <Switch
                  checked={reminderSchedule.autoStopOnPayment}
                  onCheckedChange={(checked) =>
                    setReminderSchedule({
                      ...reminderSchedule,
                      autoStopOnPayment: checked,
                    })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-muted-foreground" />
                    <Label className="text-base">SMS Reminders</Label>
                    <Badge variant="secondary" className="text-xs">
                      Pro
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Send SMS reminders in addition to email
                  </p>
                </div>
                <Switch
                  checked={reminderSchedule.enableSMS}
                  onCheckedChange={(checked) =>
                    setReminderSchedule({ ...reminderSchedule, enableSMS: checked })
                  }
                  disabled
                />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <Button onClick={handleSaveSchedule} disabled={isSaving}>
                <Save className="w-4 h-4 mr-2" />
                Save Schedule
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Subscription / Billing */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              Subscription & Billing
            </CardTitle>
            <CardDescription>
              Manage your subscription and payment details
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between p-4 bg-primary/5 border border-primary/20 rounded-lg">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold">Pro Plan</h3>
                  <Badge>Active</Badge>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  $19/month • Renews on Feb 1, 2026
                </p>
              </div>
              <Button variant="outline">Manage Subscription</Button>
            </div>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="border-destructive/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <Trash2 className="w-5 h-5" />
              Danger Zone
            </CardTitle>
            <CardDescription>
              Irreversible actions that affect your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Delete Account</p>
                <p className="text-sm text-muted-foreground">
                  Permanently delete your account and all associated data
                </p>
              </div>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive">Delete Account</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete your
                      account, all your clients, invoices, and remove your data from
                      our servers.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDeleteAccount}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      Yes, delete my account
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </CardContent>
        </Card>

        {/* Demo Notice */}
        <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
          <p className="text-sm text-center text-muted-foreground">
            🎉 <strong>Demo Mode:</strong> Settings changes are not persisted.
            Connect a backend to save your preferences.
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Settings;
