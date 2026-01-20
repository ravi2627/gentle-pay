import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRef } from "react";
import {
  LineChart,
  Line,
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

interface DashboardChartsProps {
  currencySymbol: string;
}

// Simulated data for charts
const outstandingData = [
  { date: "Jan 1", amount: 8500 },
  { date: "Jan 5", amount: 9200 },
  { date: "Jan 10", amount: 7800 },
  { date: "Jan 15", amount: 11000 },
  { date: "Jan 18", amount: 9100 },
  { date: "Jan 20", amount: 8400 },
];

const paymentsReceivedData = [
  { month: "Aug", amount: 8200 },
  { month: "Sep", amount: 9500 },
  { month: "Oct", amount: 11200 },
  { month: "Nov", amount: 10800 },
  { month: "Dec", amount: 12400 },
  { month: "Jan", amount: 14200 },
];

const invoiceStatusData = [
  { name: "Paid", value: 45, color: "hsl(142, 76%, 36%)" },
  { name: "Pending", value: 35, color: "hsl(243, 75%, 58%)" },
  { name: "Overdue", value: 20, color: "hsl(0, 84%, 60%)" },
];

const reminderEffectivenessData = [
  { name: "Week 1", emails: 24, paid: 12 },
  { name: "Week 2", emails: 18, paid: 15 },
  { name: "Week 3", emails: 32, paid: 22 },
  { name: "Week 4", emails: 28, paid: 18 },
];

export const DashboardCharts = ({ currencySymbol }: DashboardChartsProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const charts = [
    {
      title: "Outstanding Payments",
      subtitle: "Last 30 days",
      content: (
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={outstandingData}>
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
      ),
    },
    {
      title: "Revenue Collected",
      subtitle: "Monthly trend",
      content: (
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={paymentsReceivedData}>
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
      ),
    },
    {
      title: "Invoice Status",
      subtitle: "Current breakdown",
      content: (
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={invoiceStatusData}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={85}
              paddingAngle={3}
              dataKey="value"
              strokeWidth={0}
            >
              {invoiceStatusData.map((entry, index) => (
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
      ),
    },
    {
      title: "Reminder Performance",
      subtitle: "Emails sent vs payments received",
      content: (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={reminderEffectivenessData} barGap={8}>
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
