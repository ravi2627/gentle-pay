import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, MailOpen, MessageSquare, TrendingUp, DollarSign, Percent } from "lucide-react";

export interface ReminderAnalyticsData {
  totalEmailsSent: number;
  totalEmailsOpened: number;
  emailOpenRate: number;
  totalSmsSent: number;
  paymentsAfterReminder: number;
  revenueFromReminders: number;
  currency: string;
}

interface ReminderAnalyticsProps {
  data: ReminderAnalyticsData;
}

export function ReminderAnalytics({ data }: ReminderAnalyticsProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: data.currency || "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const cards = [
    {
      title: "Emails Sent",
      value: data.totalEmailsSent.toLocaleString(),
      icon: Mail,
      color: "text-blue-500",
      bgColor: "bg-blue-100 dark:bg-blue-900/30",
    },
    {
      title: "Emails Opened",
      value: data.totalEmailsOpened.toLocaleString(),
      icon: MailOpen,
      color: "text-green-500",
      bgColor: "bg-green-100 dark:bg-green-900/30",
    },
    {
      title: "Open Rate",
      value: `${data.emailOpenRate}%`,
      icon: Percent,
      color: data.emailOpenRate >= 50 ? "text-green-500" : data.emailOpenRate >= 30 ? "text-amber-500" : "text-red-500",
      bgColor: data.emailOpenRate >= 50 ? "bg-green-100 dark:bg-green-900/30" : data.emailOpenRate >= 30 ? "bg-amber-100 dark:bg-amber-900/30" : "bg-red-100 dark:bg-red-900/30",
    },
    {
      title: "SMS Sent",
      value: data.totalSmsSent.toLocaleString(),
      icon: MessageSquare,
      color: "text-purple-500",
      bgColor: "bg-purple-100 dark:bg-purple-900/30",
    },
    {
      title: "Payments After Reminder",
      value: data.paymentsAfterReminder.toLocaleString(),
      icon: TrendingUp,
      color: "text-emerald-500",
      bgColor: "bg-emerald-100 dark:bg-emerald-900/30",
    },
    {
      title: "Revenue from Reminders",
      value: formatCurrency(data.revenueFromReminders),
      icon: DollarSign,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
  ];

  return (
    <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
      {cards.map((card) => (
        <Card key={card.title}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground">
              {card.title}
            </CardTitle>
            <div className={`p-1.5 rounded-md ${card.bgColor}`}>
              <card.icon className={`h-4 w-4 ${card.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">{card.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
