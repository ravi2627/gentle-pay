import { Card, CardContent } from "@/components/ui/card";
import { DollarSign, TrendingUp, AlertTriangle, Users, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Invoice {
  id: string;
  client: string;
  amount: number;
  status: "paid" | "pending" | "overdue";
  dueDate: string;
  reminders: number;
}

interface KPICardsProps {
  invoices: Invoice[];
  currency: string;
  currencySymbol: string;
}

export const KPICards = ({ invoices, currency, currencySymbol }: KPICardsProps) => {
  const navigate = useNavigate();

  // Calculate KPIs
  const totalOutstanding = invoices
    .filter((inv) => inv.status !== "paid")
    .reduce((sum, inv) => sum + inv.amount, 0);

  const overdueInvoices = invoices.filter((inv) => inv.status === "overdue");
  const overdueCount = overdueInvoices.length;
  const overdueAmount = overdueInvoices.reduce((sum, inv) => sum + inv.amount, 0);

  const paidThisMonth = invoices
    .filter((inv) => inv.status === "paid")
    .reduce((sum, inv) => sum + inv.amount, 0);

  const uniqueClients = new Set(invoices.map((inv) => inv.client));
  const activeClients = uniqueClients.size;
  const clientsWithPending = new Set(
    invoices.filter((inv) => inv.status !== "paid").map((inv) => inv.client)
  ).size;

  const pendingCount = invoices.filter((inv) => inv.status === "pending").length;

  const kpis = [
    {
      title: "Total Outstanding",
      value: `${currencySymbol}${totalOutstanding.toLocaleString()}`,
      subtext: `${pendingCount + overdueCount} unpaid invoices`,
      icon: DollarSign,
      iconBg: "bg-blue-500/10",
      iconColor: "text-blue-500",
      trend: null,
    },
    {
      title: "Overdue Amount",
      value: overdueCount > 0 ? `${currencySymbol}${overdueAmount.toLocaleString()}` : `${currencySymbol}0`,
      subtext: `${overdueCount} overdue invoice${overdueCount !== 1 ? 's' : ''}`,
      icon: AlertTriangle,
      iconBg: overdueCount > 0 ? "bg-destructive/10" : "bg-muted",
      iconColor: overdueCount > 0 ? "text-destructive" : "text-muted-foreground",
      trend: overdueCount > 0 ? { value: "Needs attention", negative: true } : null,
    },
    {
      title: "Collected This Month",
      value: `${currencySymbol}${paidThisMonth.toLocaleString()}`,
      subtext: "Revenue collected",
      icon: TrendingUp,
      iconBg: "bg-success/10",
      iconColor: "text-success",
      trend: { value: "+23%", negative: false },
    },
    {
      title: "Active Clients",
      value: activeClients.toString(),
      subtext: `${clientsWithPending} with pending`,
      icon: Users,
      iconBg: "bg-violet-500/10",
      iconColor: "text-violet-500",
      onClick: () => navigate("/clients"),
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {kpis.map((kpi, index) => (
        <Card 
          key={index} 
          className={`border-0 shadow-sm bg-card hover:shadow-md transition-shadow ${kpi.onClick ? 'cursor-pointer' : ''}`}
          onClick={kpi.onClick}
        >
          <CardContent className="p-5">
            <div className="flex items-start justify-between mb-3">
              <div className={`w-10 h-10 rounded-xl ${kpi.iconBg} flex items-center justify-center`}>
                <kpi.icon className={`w-5 h-5 ${kpi.iconColor}`} />
              </div>
              {kpi.trend && (
                <div className={`flex items-center gap-1 text-xs font-medium ${kpi.trend.negative ? 'text-destructive' : 'text-success'}`}>
                  {kpi.trend.negative ? (
                    <ArrowDownRight className="w-3 h-3" />
                  ) : (
                    <ArrowUpRight className="w-3 h-3" />
                  )}
                  {kpi.trend.value}
                </div>
              )}
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{kpi.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{kpi.subtext}</p>
            </div>
            <p className="text-xs font-medium text-muted-foreground mt-3 uppercase tracking-wide">
              {kpi.title}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
