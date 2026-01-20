import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Check, Bell, Clock, CreditCard } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden py-20 lg:py-32">
      <div className="container">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-balance">
                Get paid on time, without the awkward follow-ups
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-lg">
                Automate your payment reminders. Add your invoice, set a schedule, 
                and let PayPing handle the rest while you focus on your work.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/signup">
                <Button size="lg" className="w-full sm:w-auto">
                  Start Free
                </Button>
              </Link>
              <Link to="/pricing">
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  View Pricing
                </Button>
              </Link>
            </div>

            <p className="text-sm text-muted-foreground">
              Trusted by 2,000+ freelancers worldwide • No credit card required
            </p>
          </div>

          {/* Right - Dashboard Mockup */}
          <div className="relative">
            <div className="bg-card border border-border rounded-xl shadow-2xl overflow-hidden">
              {/* Browser Chrome */}
              <div className="bg-muted px-4 py-3 border-b border-border flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                </div>
                <div className="flex-1 mx-4">
                  <div className="bg-background rounded-md px-3 py-1 text-xs text-muted-foreground text-center">
                    app.payping.io
                  </div>
                </div>
              </div>

              {/* Dashboard Content */}
              <div className="p-6 bg-background">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-semibold">Active Reminders</h3>
                  <Button size="sm" variant="outline">+ New Invoice</Button>
                </div>

                {/* Invoice Items */}
                <div className="space-y-3">
                  <DashboardInvoiceItem
                    client="Acme Corp"
                    amount="$2,400"
                    status="Reminder sent"
                    statusColor="text-primary"
                    icon={Bell}
                  />
                  <DashboardInvoiceItem
                    client="Smith Design Co"
                    amount="$850"
                    status="Due in 3 days"
                    statusColor="text-yellow-600"
                    icon={Clock}
                  />
                  <DashboardInvoiceItem
                    client="Johnson LLC"
                    amount="$1,200"
                    status="Paid"
                    statusColor="text-success"
                    icon={Check}
                  />
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-border">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-primary">$4,450</p>
                    <p className="text-xs text-muted-foreground">Outstanding</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-success">$12,300</p>
                    <p className="text-xs text-muted-foreground">Collected</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold">8</p>
                    <p className="text-xs text-muted-foreground">Reminders</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute -z-10 -top-10 -right-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl" />
            <div className="absolute -z-10 -bottom-10 -left-10 w-40 h-40 bg-accent rounded-full blur-3xl" />
          </div>
        </div>
      </div>
    </section>
  );
};

interface DashboardInvoiceItemProps {
  client: string;
  amount: string;
  status: string;
  statusColor: string;
  icon: React.ElementType;
}

const DashboardInvoiceItem = ({
  client,
  amount,
  status,
  statusColor,
  icon: Icon,
}: DashboardInvoiceItemProps) => (
  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
    <div className="flex items-center gap-3">
      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
        <CreditCard className="w-4 h-4 text-primary" />
      </div>
      <div>
        <p className="font-medium text-sm">{client}</p>
        <p className="text-xs text-muted-foreground">{amount}</p>
      </div>
    </div>
    <div className={`flex items-center gap-1.5 text-xs font-medium ${statusColor}`}>
      <Icon className="w-3.5 h-3.5" />
      {status}
    </div>
  </div>
);

export default HeroSection;
