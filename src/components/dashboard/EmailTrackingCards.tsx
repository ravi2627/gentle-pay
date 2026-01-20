import { Card, CardContent } from "@/components/ui/card";
import { Mail, Eye, TrendingUp, BarChart3 } from "lucide-react";
import type { EmailTrackingStats } from "@/types/emailTracking";

interface EmailTrackingCardsProps {
  stats: EmailTrackingStats;
}

export function EmailTrackingCards({ stats }: EmailTrackingCardsProps) {
  const cards = [
    {
      title: "Emails Sent Today",
      value: stats.emailsSentToday,
      icon: Mail,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      title: "Emails Opened Today",
      value: stats.emailsOpenedToday,
      icon: Eye,
      color: "text-success",
      bgColor: "bg-success/10",
    },
    {
      title: "Open Rate",
      value: `${stats.openRate.toFixed(1)}%`,
      icon: TrendingUp,
      color: stats.openRate >= 50 ? "text-success" : stats.openRate >= 25 ? "text-warning" : "text-muted-foreground",
      bgColor: stats.openRate >= 50 ? "bg-success/10" : stats.openRate >= 25 ? "bg-warning/10" : "bg-muted/10",
      subtitle: stats.openRate >= 50 ? "Excellent" : stats.openRate >= 25 ? "Good" : "Needs improvement",
    },
    {
      title: "Total Tracked",
      value: stats.totalEmailsSent,
      icon: BarChart3,
      color: "text-muted-foreground",
      bgColor: "bg-muted/10",
      subtitle: `${stats.totalEmailsOpened} opened`,
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
      {cards.map((card) => (
        <Card key={card.title} className="border-border/50">
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground font-medium">
                  {card.title}
                </p>
                <p className="text-xl md:text-2xl font-bold">{card.value}</p>
                {card.subtitle && (
                  <p className={`text-xs ${card.color}`}>{card.subtitle}</p>
                )}
              </div>
              <div className={`p-2 rounded-lg ${card.bgColor}`}>
                <card.icon className={`w-4 h-4 md:w-5 md:h-5 ${card.color}`} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
