import { useAuth } from "@/contexts/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import {
  ArrowLeft,
  Bell,
  Calendar,
  Clock,
  Mail,
  MessageSquare,
  Save,
  User,
} from "lucide-react";

const Settings = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [isSaving, setIsSaving] = useState(false);

  // Profile settings
  const [profile, setProfile] = useState({
    name: user?.name || "",
    email: user?.email || "",
    company: "",
    timezone: "UTC",
  });

  // Notification preferences
  const [notifications, setNotifications] = useState({
    emailReminders: true,
    paymentReceived: true,
    weeklyReport: true,
    productUpdates: false,
  });

  // Reminder schedule
  const [reminderSchedule, setReminderSchedule] = useState({
    firstReminder: "3",
    secondReminder: "7",
    thirdReminder: "14",
    sendTime: "09:00",
    includePaymentLink: true,
    enableSMS: false,
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

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

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16 gap-4">
            <Button variant="ghost" size="icon" asChild>
              <Link to="/dashboard">
                <ArrowLeft className="w-5 h-5" />
              </Link>
            </Button>
            <div>
              <h1 className="text-lg font-semibold">Settings</h1>
              <p className="text-xs text-muted-foreground">
                Manage your account and preferences
              </p>
            </div>
            <Badge variant="secondary" className="ml-auto text-xs">
              Demo Mode
            </Badge>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
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
                <Input
                  id="company"
                  value={profile.company}
                  onChange={(e) =>
                    setProfile({ ...profile, company: e.target.value })
                  }
                  placeholder="Your company name"
                  maxLength={100}
                />
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
                    <SelectValue placeholder="Select timezone" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="UTC">UTC (GMT+0)</SelectItem>
                    <SelectItem value="America/New_York">Eastern Time (ET)</SelectItem>
                    <SelectItem value="America/Chicago">Central Time (CT)</SelectItem>
                    <SelectItem value="America/Denver">Mountain Time (MT)</SelectItem>
                    <SelectItem value="America/Los_Angeles">Pacific Time (PT)</SelectItem>
                    <SelectItem value="Europe/London">London (GMT)</SelectItem>
                    <SelectItem value="Europe/Paris">Paris (CET)</SelectItem>
                    <SelectItem value="Asia/Tokyo">Tokyo (JST)</SelectItem>
                    <SelectItem value="Australia/Sydney">Sydney (AEST)</SelectItem>
                  </SelectContent>
                </Select>
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

        {/* Demo Notice */}
        <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
          <p className="text-sm text-center text-muted-foreground">
            🎉 <strong>Demo Mode:</strong> Settings changes are not persisted.
            Connect a backend to save your preferences.
          </p>
        </div>
      </main>
    </div>
  );
};

export default Settings;
