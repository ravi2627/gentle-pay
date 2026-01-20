import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, TrendingUp, AlertTriangle, Users, Send, Clock } from "lucide-react";
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

  // Active clients = clients with activity in last 30 days (simulated)
  const uniqueClients = new Set(invoices.map((inv) => inv.client));
  const activeClients = uniqueClients.size;
  const clientsWithPending = new Set(
    invoices.filter((inv) => inv.status !== "paid").map((inv) => inv.client)
  ).size;

  const totalReminders = invoices.reduce((sum, inv) => sum + inv.reminders, 0);

  const pendingCount = invoices.filter((inv) => inv.status === "pending").length;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Total Outstanding */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Total Outstanding
          </CardTitle>
          <DollarSign className="w-4 h-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {currencySymbol}{totalOutstanding.toLocaleString()}
          </div>
          <p className="text-xs text-muted-foreground">
            {pendingCount + overdueCount} unpaid invoices
          </p>
        </CardContent>
      </Card>

      {/* Overdue Invoices */}
      <Card className={overdueCount > 0 ? "border-destructive/50" : ""}>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Overdue Invoices
          </CardTitle>
          <AlertTriangle className={`w-4 h-4 ${overdueCount > 0 ? "text-destructive" : "text-muted-foreground"}`} />
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${overdueCount > 0 ? "text-destructive" : ""}`}>
            {overdueCount}
          </div>
          <p className="text-xs text-muted-foreground">
            {currencySymbol}{overdueAmount.toLocaleString()} overdue
          </p>
        </CardContent>
      </Card>

      {/* Paid This Month */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Paid This Month
          </CardTitle>
          <TrendingUp className="w-4 h-4 text-success" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-success">
            {currencySymbol}{paidThisMonth.toLocaleString()}
          </div>
          <p className="text-xs text-success">+23% from last month</p>
        </CardContent>
      </Card>

      {/* Active Clients */}
      <Card 
        className="cursor-pointer hover:bg-muted/30 transition-colors" 
        onClick={() => navigate("/clients")}
      >
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Active Clients
          </CardTitle>
          <Users className="w-4 h-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{activeClients}</div>
          <p className="text-xs text-muted-foreground">
            {clientsWithPending} with pending invoices
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
