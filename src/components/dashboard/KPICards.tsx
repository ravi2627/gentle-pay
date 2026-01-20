import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, TrendingUp, AlertTriangle, Users } from "lucide-react";
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

  const pendingCount = invoices.filter((inv) => inv.status === "pending").length;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
      {/* Total Outstanding */}
      <Card className="touch-target">
        <CardHeader className="flex flex-row items-center justify-between pb-1 md:pb-2 space-y-0">
          <CardTitle className="text-xs md:text-sm font-medium text-muted-foreground">
            Outstanding
          </CardTitle>
          <DollarSign className="w-4 h-4 text-muted-foreground hidden sm:block" />
        </CardHeader>
        <CardContent className="pt-0">
          <div className="text-xl md:text-2xl font-bold truncate">
            {currencySymbol}{totalOutstanding.toLocaleString()}
          </div>
          <p className="text-[10px] md:text-xs text-muted-foreground">
            {pendingCount + overdueCount} unpaid
          </p>
        </CardContent>
      </Card>

      {/* Overdue Invoices */}
      <Card className={`touch-target ${overdueCount > 0 ? "border-destructive/50" : ""}`}>
        <CardHeader className="flex flex-row items-center justify-between pb-1 md:pb-2 space-y-0">
          <CardTitle className="text-xs md:text-sm font-medium text-muted-foreground">
            Overdue
          </CardTitle>
          <AlertTriangle className={`w-4 h-4 hidden sm:block ${overdueCount > 0 ? "text-destructive" : "text-muted-foreground"}`} />
        </CardHeader>
        <CardContent className="pt-0">
          <div className={`text-xl md:text-2xl font-bold ${overdueCount > 0 ? "text-destructive" : ""}`}>
            {overdueCount}
          </div>
          <p className="text-[10px] md:text-xs text-muted-foreground truncate">
            {currencySymbol}{overdueAmount.toLocaleString()}
          </p>
        </CardContent>
      </Card>

      {/* Paid This Month */}
      <Card className="touch-target">
        <CardHeader className="flex flex-row items-center justify-between pb-1 md:pb-2 space-y-0">
          <CardTitle className="text-xs md:text-sm font-medium text-muted-foreground">
            Collected
          </CardTitle>
          <TrendingUp className="w-4 h-4 text-success hidden sm:block" />
        </CardHeader>
        <CardContent className="pt-0">
          <div className="text-xl md:text-2xl font-bold text-success truncate">
            {currencySymbol}{paidThisMonth.toLocaleString()}
          </div>
          <p className="text-[10px] md:text-xs text-success">
            +23% vs last month
          </p>
        </CardContent>
      </Card>

      {/* Active Clients */}
      <Card 
        className="touch-target cursor-pointer hover:bg-muted/30 active:scale-[0.98] transition-all" 
        onClick={() => navigate("/clients")}
      >
        <CardHeader className="flex flex-row items-center justify-between pb-1 md:pb-2 space-y-0">
          <CardTitle className="text-xs md:text-sm font-medium text-muted-foreground">
            Clients
          </CardTitle>
          <Users className="w-4 h-4 text-muted-foreground hidden sm:block" />
        </CardHeader>
        <CardContent className="pt-0">
          <div className="text-xl md:text-2xl font-bold">{activeClients}</div>
          <p className="text-[10px] md:text-xs text-muted-foreground">
            {clientsWithPending} pending
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
