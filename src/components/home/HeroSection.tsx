import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Check, Bell, Clock, CreditCard, ArrowRight, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden py-24 lg:py-36">
      {/* Animated Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-gradient-to-br from-primary/20 via-accent/30 to-transparent rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-gradient-to-tr from-accent/20 via-primary/10 to-transparent rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-primary/5 to-transparent rounded-full" />
      </div>

      <div className="container relative">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <motion.div 
            className="space-y-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary/10 to-accent/50 border border-primary/20 text-sm font-medium text-foreground backdrop-blur-sm">
                <Sparkles className="w-4 h-4 text-primary" />
                Trusted by 2,000+ freelancers worldwide
              </span>
            </motion.div>

            <div className="space-y-6">
              <motion.h1 
                className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1]"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.8 }}
              >
                <span className="text-foreground">Get paid </span>
                <span className="bg-gradient-to-r from-primary via-accent-foreground to-primary bg-clip-text text-transparent">
                  on time
                </span>
                <span className="block text-foreground mt-2">without the chase</span>
              </motion.h1>
              
              <motion.p 
                className="text-xl text-muted-foreground max-w-lg leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.8 }}
              >
                Automate your payment reminders. Add your invoice, set a schedule, 
                and let PayPing handle the rest while you focus on your work.
              </motion.p>
            </div>

            <motion.div 
              className="flex flex-col sm:flex-row gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              <Link to="/signup">
                <Button size="lg" className="group w-full sm:w-auto text-base px-8 py-6 bg-gradient-to-r from-primary to-accent-foreground hover:opacity-90 transition-all shadow-lg shadow-primary/25">
                  Start Free Today
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/pricing">
                <Button size="lg" variant="outline" className="w-full sm:w-auto text-base px-8 py-6 border-2 hover:bg-accent/50 transition-all">
                  View Pricing
                </Button>
              </Link>
            </motion.div>

            <motion.div
              className="flex items-center gap-6 pt-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.8 }}
            >
              <div className="flex items-center gap-2">
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div 
                      key={i} 
                      className="w-10 h-10 rounded-full border-2 border-background bg-gradient-to-br from-primary/30 to-accent/50 flex items-center justify-center text-xs font-semibold text-foreground"
                    >
                      {['J', 'S', 'M', 'A'][i - 1]}
                    </div>
                  ))}
                </div>
                <div className="text-sm">
                  <span className="font-semibold text-foreground">2,000+</span>
                  <span className="text-muted-foreground ml-1">happy users</span>
                </div>
              </div>
              <div className="h-8 w-px bg-border" />
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                  </svg>
                ))}
                <span className="ml-2 text-sm font-medium text-foreground">4.9/5</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Right - Dashboard Mockup */}
          <motion.div 
            className="relative"
            initial={{ opacity: 0, x: 50, rotateY: -10 }}
            animate={{ opacity: 1, x: 0, rotateY: 0 }}
            transition={{ delay: 0.4, duration: 1, ease: "easeOut" }}
          >
            {/* Floating Elements */}
            <motion.div
              className="absolute -top-6 -left-6 z-20 bg-card/90 backdrop-blur-xl border border-border/50 rounded-2xl p-4 shadow-2xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-success/20 flex items-center justify-center">
                  <Check className="w-5 h-5 text-success" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">Payment received</p>
                  <p className="text-xs text-muted-foreground">$2,400 from Acme Corp</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="absolute -bottom-4 -right-4 z-20 bg-card/90 backdrop-blur-xl border border-border/50 rounded-2xl p-4 shadow-2xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.6 }}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <Bell className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">Reminder sent</p>
                  <p className="text-xs text-muted-foreground">Invoice #1234 • Just now</p>
                </div>
              </div>
            </motion.div>

            {/* Main Card */}
            <div className="relative bg-card/80 backdrop-blur-xl border border-border/50 rounded-3xl shadow-2xl overflow-hidden">
              {/* Gradient Border Effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-accent/20 rounded-3xl" />
              
              {/* Browser Chrome */}
              <div className="relative bg-muted/50 px-5 py-4 border-b border-border/50 flex items-center gap-3">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-destructive/70" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400/70" />
                  <div className="w-3 h-3 rounded-full bg-success/70" />
                </div>
                <div className="flex-1 mx-8">
                  <div className="bg-background/80 rounded-lg px-4 py-1.5 text-xs text-muted-foreground text-center font-mono">
                    app.payping.io/dashboard
                  </div>
                </div>
              </div>

              {/* Dashboard Content */}
              <div className="relative p-6 bg-background/50">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-bold text-lg text-foreground">Active Reminders</h3>
                  <Button size="sm" className="bg-primary/90 hover:bg-primary text-xs">
                    + New Invoice
                  </Button>
                </div>

                {/* Invoice Items */}
                <div className="space-y-3">
                  <DashboardInvoiceItem
                    client="Acme Corp"
                    amount="$2,400"
                    status="Reminder sent"
                    statusColor="text-primary"
                    icon={Bell}
                    bgColor="bg-primary/10"
                  />
                  <DashboardInvoiceItem
                    client="Smith Design Co"
                    amount="$850"
                    status="Due in 3 days"
                    statusColor="text-yellow-600"
                    icon={Clock}
                    bgColor="bg-yellow-500/10"
                  />
                  <DashboardInvoiceItem
                    client="Johnson LLC"
                    amount="$1,200"
                    status="Paid"
                    statusColor="text-success"
                    icon={Check}
                    bgColor="bg-success/10"
                  />
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-border/50">
                  <div className="text-center p-3 rounded-xl bg-gradient-to-br from-primary/10 to-transparent">
                    <p className="text-2xl font-bold bg-gradient-to-r from-primary to-accent-foreground bg-clip-text text-transparent">$4,450</p>
                    <p className="text-xs text-muted-foreground mt-1">Outstanding</p>
                  </div>
                  <div className="text-center p-3 rounded-xl bg-gradient-to-br from-success/10 to-transparent">
                    <p className="text-2xl font-bold text-success">$12,300</p>
                    <p className="text-xs text-muted-foreground mt-1">Collected</p>
                  </div>
                  <div className="text-center p-3 rounded-xl bg-gradient-to-br from-accent/20 to-transparent">
                    <p className="text-2xl font-bold text-foreground">8</p>
                    <p className="text-xs text-muted-foreground mt-1">Reminders</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
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
  bgColor: string;
}

const DashboardInvoiceItem = ({
  client,
  amount,
  status,
  statusColor,
  icon: Icon,
  bgColor,
}: DashboardInvoiceItemProps) => (
  <div className="flex items-center justify-between p-4 bg-card/60 backdrop-blur-sm rounded-xl border border-border/30 hover:border-border/50 transition-all hover:shadow-md group">
    <div className="flex items-center gap-4">
      <div className={`w-10 h-10 ${bgColor} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
        <CreditCard className="w-5 h-5 text-primary" />
      </div>
      <div>
        <p className="font-semibold text-foreground">{client}</p>
        <p className="text-sm text-muted-foreground">{amount}</p>
      </div>
    </div>
    <div className={`flex items-center gap-2 text-sm font-medium ${statusColor}`}>
      <Icon className="w-4 h-4" />
      {status}
    </div>
  </div>
);

export default HeroSection;
