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
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

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
  { name: "Pending", value: 35, color: "hsl(38, 92%, 50%)" },
  { name: "Overdue", value: 20, color: "hsl(0, 84%, 60%)" },
];

const reminderEffectivenessData = [
  { name: "W1", emails: 24, sms: 5, paidAfter: 12 },
  { name: "W2", emails: 18, sms: 8, paidAfter: 15 },
  { name: "W3", emails: 32, sms: 12, paidAfter: 22 },
  { name: "W4", emails: 28, sms: 10, paidAfter: 18 },
];

export const DashboardCharts = ({ currencySymbol }: DashboardChartsProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollTo = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = scrollRef.current.offsetWidth * 0.8;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const charts = [
    {
      title: "Outstanding Over Time",
      content: (
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={outstandingData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis 
              dataKey="date" 
              tick={{ fontSize: 11 }} 
              stroke="hsl(var(--muted-foreground))"
            />
            <YAxis 
              tick={{ fontSize: 11 }} 
              stroke="hsl(var(--muted-foreground))"
              tickFormatter={(value) => `${currencySymbol}${(value / 1000).toFixed(0)}k`}
              width={50}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--background))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
                fontSize: "12px",
              }}
              formatter={(value: number) => [`${currencySymbol}${value.toLocaleString()}`, "Outstanding"]}
            />
            <Line
              type="monotone"
              dataKey="amount"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              dot={{ fill: "hsl(var(--primary))", strokeWidth: 2, r: 3 }}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      ),
    },
    {
      title: "Payments Received",
      content: (
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={paymentsReceivedData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis 
              dataKey="month" 
              tick={{ fontSize: 11 }} 
              stroke="hsl(var(--muted-foreground))"
            />
            <YAxis 
              tick={{ fontSize: 11 }} 
              stroke="hsl(var(--muted-foreground))"
              tickFormatter={(value) => `${currencySymbol}${(value / 1000).toFixed(0)}k`}
              width={50}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--background))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
                fontSize: "12px",
              }}
              formatter={(value: number) => [`${currencySymbol}${value.toLocaleString()}`, "Received"]}
            />
            <defs>
              <linearGradient id="colorPayments" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(142, 76%, 36%)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(142, 76%, 36%)" stopOpacity={0} />
              </linearGradient>
            </defs>
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
      content: (
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={invoiceStatusData}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={80}
              paddingAngle={2}
              dataKey="value"
            >
              {invoiceStatusData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--background))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
                fontSize: "12px",
              }}
              formatter={(value: number) => [`${value}%`, ""]}
            />
            <Legend 
              verticalAlign="bottom" 
              height={36}
              formatter={(value) => <span className="text-xs">{value}</span>}
            />
          </PieChart>
        </ResponsiveContainer>
      ),
    },
    {
      title: "Reminder Impact",
      content: (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={reminderEffectivenessData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis 
              dataKey="name" 
              tick={{ fontSize: 11 }} 
              stroke="hsl(var(--muted-foreground))"
            />
            <YAxis 
              tick={{ fontSize: 11 }} 
              stroke="hsl(var(--muted-foreground))"
              width={30}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--background))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
                fontSize: "12px",
              }}
            />
            <Legend 
              verticalAlign="bottom" 
              height={36}
              formatter={(value) => <span className="text-xs">{value}</span>}
            />
            <Bar 
              dataKey="emails" 
              name="Emails" 
              fill="hsl(var(--primary))" 
              radius={[4, 4, 0, 0]}
            />
            <Bar 
              dataKey="paidAfter" 
              name="Paid After" 
              fill="hsl(142, 76%, 36%)" 
              radius={[4, 4, 0, 0]}
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
              className="flex-shrink-0 w-[85vw] max-w-sm scroll-snap-start"
            >
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">{chart.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-52">{chart.content}</div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {/* Scroll indicators */}
        <div className="flex justify-center gap-1 mt-3">
          {charts.map((_, index) => (
            <div
              key={index}
              className="w-2 h-2 rounded-full bg-muted-foreground/30"
            />
          ))}
        </div>
      </div>

      {/* Desktop: Grid Layout */}
      <div className="hidden md:grid grid-cols-1 lg:grid-cols-2 gap-6">
        {charts.map((chart, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle className="text-base">{chart.title}</CardTitle>
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
