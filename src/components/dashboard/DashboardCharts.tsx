import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRef, useMemo } from "react";
import {
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { useInvoices } from "@/hooks/useInvoices";
import { useReminders } from "@/hooks/useReminders";
import { BarChart3, PieChart as PieChartIcon, TrendingUp, Activity } from "lucide-react";

interface DashboardChartsProps {
  currencySymbol: string;
}

export const DashboardCharts = ({ currencySymbol }: DashboardChartsProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { invoices, stats } = useInvoices();
  const { reminders } = useReminders();

  // Calculate real data from database
  const chartData = useMemo(() => {
    if (!invoices || invoices.length === 0) {
      return {
        outstandingData: [],
        paymentsReceivedData: [],
        invoiceStatusData: [],
        reminderEffectivenessData: [],
        hasData: false,
      };
    }

    // Group invoices by date for outstanding payments trend
    const now = new Date();
    const last30Days = Array.from({ length: 6 }, (_, i) => {
      const date = new Date(now);
      date.setDate(date.getDate() - (25 - i * 5));
      return date;
    });

    const outstandingData = last30Days.map((date) => {
      const dateStr = date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
      const outstandingAmount = invoices
        .filter((inv) => {
          const invDate = new Date(inv.due_date);
          return inv.status !== "paid" && invDate <= date;
        })
        .reduce((sum, inv) => sum + Number(inv.amount), 0);
      return { date: dateStr, amount: outstandingAmount };
    });

    // Monthly payments received
    const last6Months = Array.from({ length: 6 }, (_, i) => {
      const date = new Date(now);
      date.setMonth(date.getMonth() - (5 - i));
      return date;
    });

    const paymentsReceivedData = last6Months.map((date) => {
      const monthStr = date.toLocaleDateString("en-US", { month: "short" });
      const monthPayments = invoices
        .filter((inv) => {
          const invDate = new Date(inv.created_at);
          return (
            inv.status === "paid" &&
            invDate.getMonth() === date.getMonth() &&
            invDate.getFullYear() === date.getFullYear()
          );
        })
        .reduce((sum, inv) => sum + Number(inv.amount), 0);
      return { month: monthStr, amount: monthPayments };
    });

    // Invoice status breakdown
    const paidCount = invoices.filter((inv) => inv.status === "paid").length;
    const pendingCount = invoices.filter((inv) => inv.status === "pending" || inv.status === "sent" || inv.status === "viewed").length;
    const overdueCount = invoices.filter((inv) => inv.status === "overdue").length;
    const total = paidCount + pendingCount + overdueCount;

    const invoiceStatusData = total > 0 ? [
      { name: "Paid", value: Math.round((paidCount / total) * 100), color: "hsl(142, 76%, 36%)" },
      { name: "Pending", value: Math.round((pendingCount / total) * 100), color: "hsl(243, 75%, 58%)" },
      { name: "Overdue", value: Math.round((overdueCount / total) * 100), color: "hsl(0, 84%, 60%)" },
    ] : [];

    // Reminder effectiveness (last 4 weeks)
    const reminderEffectivenessData = Array.from({ length: 4 }, (_, i) => {
      const weekStart = new Date(now);
      weekStart.setDate(weekStart.getDate() - (3 - i) * 7 - 7);
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekEnd.getDate() + 7);

      const weekReminders = (reminders || []).filter((r) => {
        const sentDate = new Date(r.sent_at);
        return sentDate >= weekStart && sentDate < weekEnd;
      }).length;

      const weekPaid = invoices.filter((inv) => {
        if (inv.status !== "paid") return false;
        const updateDate = new Date(inv.updated_at);
        return updateDate >= weekStart && updateDate < weekEnd;
      }).length;

      return {
        name: `Week ${i + 1}`,
        emails: weekReminders,
        paid: weekPaid,
      };
    });

    return {
      outstandingData,
      paymentsReceivedData,
      invoiceStatusData,
      reminderEffectivenessData,
      hasData: true,
    };
  }, [invoices, reminders]);

  // Empty state component
  const EmptyChartState = ({ title, icon: Icon }: { title: string; icon: React.ComponentType<{ className?: string }> }) => (
    <div className="h-full flex flex-col items-center justify-center text-center p-4">
      <Icon className="w-10 h-10 text-muted-foreground/40 mb-3" />
      <p className="text-sm text-muted-foreground">No data yet</p>
      <p className="text-xs text-muted-foreground/60 mt-1">
        Create invoices to see {title.toLowerCase()}
      </p>
    </div>
  );

  const charts = [
    {
      title: "Outstanding Payments",
      subtitle: "Last 30 days",
      icon: TrendingUp,
      content: chartData.outstandingData.length > 0 ? (
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData.outstandingData}>
            <defs>
              <linearGradient id="colorOutstanding" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(243, 75%, 58%)" stopOpacity={0.2} />
                <stop offset="95%" stopColor="hsl(243, 75%, 58%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
            <XAxis 
              dataKey="date" 
              tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} 
              axisLine={false}
              tickLine={false}
            />
            <YAxis 
              tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} 
              tickFormatter={(value) => `${currencySymbol}${(value / 1000).toFixed(0)}k`}
              width={55}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "12px",
                fontSize: "12px",
                boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
              }}
              formatter={(value: number) => [`${currencySymbol}${value.toLocaleString()}`, "Outstanding"]}
            />
            <Area
              type="monotone"
              dataKey="amount"
              stroke="hsl(243, 75%, 58%)"
              strokeWidth={2}
              fill="url(#colorOutstanding)"
            />
          </AreaChart>
        </ResponsiveContainer>
      ) : (
        <EmptyChartState title="Outstanding Payments" icon={TrendingUp} />
      ),
    },
    {
      title: "Revenue Collected",
      subtitle: "Monthly trend",
      icon: BarChart3,
      content: chartData.paymentsReceivedData.some(d => d.amount > 0) ? (
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData.paymentsReceivedData}>
            <defs>
              <linearGradient id="colorPayments" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(142, 76%, 36%)" stopOpacity={0.2} />
                <stop offset="95%" stopColor="hsl(142, 76%, 36%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
            <XAxis 
              dataKey="month" 
              tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} 
              axisLine={false}
              tickLine={false}
            />
            <YAxis 
              tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} 
              tickFormatter={(value) => `${currencySymbol}${(value / 1000).toFixed(0)}k`}
              width={55}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "12px",
                fontSize: "12px",
                boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
              }}
              formatter={(value: number) => [`${currencySymbol}${value.toLocaleString()}`, "Collected"]}
            />
            <Area
              type="monotone"
              dataKey="amount"
              stroke="hsl(142, 76%, 36%)"
              strokeWidth={2}
              fill="url(#colorPayments)"
            />
          </AreaChart>
        </ResponsiveContainer>
      ) : (
        <EmptyChartState title="Revenue Collected" icon={BarChart3} />
      ),
    },
    {
      title: "Invoice Status",
      subtitle: "Current breakdown",
      icon: PieChartIcon,
      content: chartData.invoiceStatusData.length > 0 ? (
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData.invoiceStatusData}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={85}
              paddingAngle={3}
              dataKey="value"
              strokeWidth={0}
            >
              {chartData.invoiceStatusData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "12px",
                fontSize: "12px",
                boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
              }}
              formatter={(value: number) => [`${value}%`, ""]}
            />
            <Legend 
              verticalAlign="bottom" 
              height={36}
              formatter={(value) => <span className="text-xs text-muted-foreground">{value}</span>}
            />
          </PieChart>
        </ResponsiveContainer>
      ) : (
        <EmptyChartState title="Invoice Status" icon={PieChartIcon} />
      ),
    },
    {
      title: "Reminder Performance",
      subtitle: "Emails sent vs payments received",
      icon: Activity,
      content: chartData.reminderEffectivenessData.some(d => d.emails > 0 || d.paid > 0) ? (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData.reminderEffectivenessData} barGap={8}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
            <XAxis 
              dataKey="name" 
              tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} 
              axisLine={false}
              tickLine={false}
            />
            <YAxis 
              tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} 
              width={35}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "12px",
                fontSize: "12px",
                boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
              }}
            />
            <Legend 
              verticalAlign="bottom" 
              height={36}
              formatter={(value) => <span className="text-xs text-muted-foreground">{value === 'emails' ? 'Emails Sent' : 'Payments'}</span>}
            />
            <Bar 
              dataKey="emails" 
              name="emails" 
              fill="hsl(243, 75%, 58%)" 
              radius={[6, 6, 0, 0]}
              maxBarSize={40}
            />
            <Bar 
              dataKey="paid" 
              name="paid" 
              fill="hsl(142, 76%, 36%)" 
              radius={[6, 6, 0, 0]}
              maxBarSize={40}
            />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <EmptyChartState title="Reminder Performance" icon={Activity} />
      ),
    },
  ];

  return (
    <>
      {/* Mobile: Swipeable Carousel */}
      <div className="md:hidden relative">
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth-x pb-2 -mx-4 px-4"
        >
          {charts.map((chart, index) => (
            <Card
              key={index}
              className="flex-shrink-0 w-[85vw] max-w-sm scroll-snap-start border-0 shadow-sm"
            >
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold">{chart.title}</CardTitle>
                <p className="text-xs text-muted-foreground">{chart.subtitle}</p>
              </CardHeader>
              <CardContent>
                <div className="h-52">{chart.content}</div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {/* Scroll indicators */}
        <div className="flex justify-center gap-1.5 mt-4">
          {charts.map((_, index) => (
            <div
              key={index}
              className="w-1.5 h-1.5 rounded-full bg-primary/30"
            />
          ))}
        </div>
      </div>

      {/* Desktop: Grid Layout */}
      <div className="hidden md:grid grid-cols-1 lg:grid-cols-2 gap-5">
        {charts.map((chart, index) => (
          <Card key={index} className="border-0 shadow-sm">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base font-semibold">{chart.title}</CardTitle>
                  <p className="text-xs text-muted-foreground mt-0.5">{chart.subtitle}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-64">{chart.content}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
};
