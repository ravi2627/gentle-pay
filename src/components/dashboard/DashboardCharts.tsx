import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  { name: "Pending", value: 35, color: "hsl(38, 92%, 50%)" },
  { name: "Overdue", value: 20, color: "hsl(0, 84%, 60%)" },
];

const reminderEffectivenessData = [
  { name: "Week 1", emails: 24, sms: 5, paidAfter: 12 },
  { name: "Week 2", emails: 18, sms: 8, paidAfter: 15 },
  { name: "Week 3", emails: 32, sms: 12, paidAfter: 22 },
  { name: "Week 4", emails: 28, sms: 10, paidAfter: 18 },
];

export const DashboardCharts = ({ currencySymbol }: DashboardChartsProps) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Outstanding Payments Over Time (Line Chart) */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Outstanding Payments Over Time</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={outstandingData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 12 }} 
                  stroke="hsl(var(--muted-foreground))"
                />
                <YAxis 
                  tick={{ fontSize: 12 }} 
                  stroke="hsl(var(--muted-foreground))"
                  tickFormatter={(value) => `${currencySymbol}${(value / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--background))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                  formatter={(value: number) => [`${currencySymbol}${value.toLocaleString()}`, "Outstanding"]}
                />
                <Line
                  type="monotone"
                  dataKey="amount"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  dot={{ fill: "hsl(var(--primary))", strokeWidth: 2 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Payments Received Over Time (Area Chart) */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Payments Received Over Time</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={paymentsReceivedData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="month" 
                  tick={{ fontSize: 12 }} 
                  stroke="hsl(var(--muted-foreground))"
                />
                <YAxis 
                  tick={{ fontSize: 12 }} 
                  stroke="hsl(var(--muted-foreground))"
                  tickFormatter={(value) => `${currencySymbol}${(value / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--background))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
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
          </div>
        </CardContent>
      </Card>

      {/* Invoice Status Breakdown (Donut Chart) */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Invoice Status Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={invoiceStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
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
                  }}
                  formatter={(value: number) => [`${value}%`, ""]}
                />
                <Legend 
                  verticalAlign="middle" 
                  align="right"
                  layout="vertical"
                  wrapperStyle={{ paddingLeft: "20px" }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Reminder Effectiveness (Bar Chart) */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Reminder Effectiveness</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={reminderEffectivenessData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="name" 
                  tick={{ fontSize: 12 }} 
                  stroke="hsl(var(--muted-foreground))"
                />
                <YAxis 
                  tick={{ fontSize: 12 }} 
                  stroke="hsl(var(--muted-foreground))"
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--background))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Legend />
                <Bar 
                  dataKey="emails" 
                  name="Emails Sent" 
                  fill="hsl(var(--primary))" 
                  radius={[4, 4, 0, 0]}
                />
                <Bar 
                  dataKey="sms" 
                  name="SMS Sent" 
                  fill="hsl(220, 14%, 70%)" 
                  radius={[4, 4, 0, 0]}
                />
                <Bar 
                  dataKey="paidAfter" 
                  name="Paid After Reminder" 
                  fill="hsl(142, 76%, 36%)" 
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
