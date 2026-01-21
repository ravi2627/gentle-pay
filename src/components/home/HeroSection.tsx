import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Check, Bell, Clock, CreditCard, ArrowRight, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

const HeroSection = () => {
  return (
    <section id="hero" className="relative overflow-hidden py-16 md:py-20 lg:py-28 scroll-mt-20">
      {/* Subtle background gradients */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-gradient-to-br from-primary/15 via-accent/20 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-gradient-to-tr from-accent/15 via-primary/10 to-transparent rounded-full blur-3xl" />
      </div>

      <div className="container relative">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <motion.div 
            className="text-center lg:text-left"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Trust Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="mb-6"
            >
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary/10 to-accent/30 border border-primary/20 text-sm font-medium text-foreground">
                <Sparkles className="w-4 h-4 text-primary" />
                Trusted by 2,000+ freelancers worldwide
              </span>
            </motion.div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1]">
              <span className="text-foreground">Get paid </span>
              <span className="bg-gradient-to-r from-primary via-accent-foreground to-primary bg-clip-text text-transparent">on time</span>
              <br />
              <span className="text-foreground">without the chase</span>
            </h1>
            
            <p className="mt-6 text-lg text-muted-foreground max-w-lg mx-auto lg:mx-0 leading-relaxed">
              Automate your invoice reminders. Add your invoice, set a schedule, 
              and let RemindSwift handle the rest while you focus on your work.
            </p>

            {/* CTAs */}
            <div className="mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start">
              <Link to="/signup" className="w-full sm:w-auto">
                <Button 
                  size="lg" 
                  className="w-full sm:w-auto min-h-[52px] px-8 text-base bg-gradient-to-r from-primary to-accent-foreground hover:opacity-90 text-primary-foreground shadow-lg shadow-primary/25"
                >
                  Start Free Today
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
              <Link to="/pricing" className="w-full sm:w-auto">
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="w-full sm:w-auto min-h-[52px] px-8 text-base border-2 hover:bg-accent/50"
                >
                  View Pricing
                </Button>
              </Link>
            </div>

            {/* Social Proof */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="mt-8 flex flex-col sm:flex-row items-center gap-4 sm:gap-6 justify-center lg:justify-start"
            >
              <div className="flex items-center gap-3">
                <div className="flex -space-x-2">
                  {['J', 'S', 'M', 'A'].map((letter, i) => (
                    <div 
                      key={i} 
                      className="w-9 h-9 rounded-full border-2 border-background bg-gradient-to-br from-primary/30 to-accent/50 flex items-center justify-center text-xs font-semibold text-foreground"
                    >
                      {letter}
                    </div>
                  ))}
                </div>
                <div className="text-sm">
                  <span className="font-semibold text-foreground">2,000+</span>
                  <span className="text-muted-foreground ml-1">happy users</span>
                </div>
              </div>
              <div className="hidden sm:block h-6 w-px bg-border" />
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <svg key={i} className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                  </svg>
                ))}
                <span className="ml-1.5 text-sm font-medium text-foreground">4.9/5</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Right - Dashboard Mockup */}
          <motion.div 
            className="relative mt-4 lg:mt-0"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.7 }}
          >
            {/* Floating notification - Payment received */}
            <motion.div
              className="absolute -top-3 -left-2 sm:-left-4 z-20 bg-card/95 backdrop-blur-sm border border-border/50 rounded-xl p-3 shadow-xl"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.5 }}
            >
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-success/15 flex items-center justify-center">
                  <Check className="w-4 h-4 text-success" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">Payment received</p>
                  <p className="text-xs text-muted-foreground">$2,400 from Acme Corp</p>
                </div>
              </div>
            </motion.div>

            {/* Main Dashboard Card */}
            <div className="relative bg-card/90 backdrop-blur-sm border border-border/50 rounded-2xl shadow-2xl overflow-hidden">
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 rounded-2xl pointer-events-none" />
              
              {/* Browser Chrome */}
              <div className="relative bg-muted/40 px-4 py-3 border-b border-border/50 flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-destructive/70" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/70" />
                  <div className="w-2.5 h-2.5 rounded-full bg-success/70" />
                </div>
                <div className="flex-1 mx-4">
                  <div className="bg-background/70 rounded-md px-3 py-1 text-xs text-muted-foreground text-center max-w-[180px] mx-auto font-mono">
                    app.remindswift.com
                  </div>
                </div>
              </div>

              {/* Dashboard Content */}
              <div className="relative p-4 sm:p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-foreground">Active Reminders</h3>
                  <Button size="sm" className="bg-primary/90 hover:bg-primary text-xs h-8 px-3">
                    + New Invoice
                  </Button>
                </div>

                {/* Invoice List */}
                <div className="space-y-2.5">
                  <InvoiceItem 
                    client="Acme Corp" 
                    amount="$2,400" 
                    status="Reminder sent" 
                    statusColor="text-primary" 
                    bgColor="bg-primary/10" 
                  />
                  <InvoiceItem 
                    client="Smith Design Co" 
                    amount="$850" 
                    status="Due in 3 days" 
                    statusColor="text-yellow-600" 
                    bgColor="bg-yellow-500/10" 
                  />
                  <InvoiceItem 
                    client="Johnson LLC" 
                    amount="$1,200" 
                    status="Paid" 
                    statusColor="text-success" 
                    bgColor="bg-success/10" 
                  />
                </div>

                {/* Stats Row */}
                <div className="grid grid-cols-3 gap-3 mt-5 pt-4 border-t border-border/50">
                  <div className="text-center p-2.5 rounded-xl bg-gradient-to-br from-primary/10 to-transparent">
                    <p className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-primary to-accent-foreground bg-clip-text text-transparent">$4,450</p>
                    <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5">Outstanding</p>
                  </div>
                  <div className="text-center p-2.5 rounded-xl bg-gradient-to-br from-success/10 to-transparent">
                    <p className="text-xl sm:text-2xl font-bold text-success">$12,300</p>
                    <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5">Collected</p>
                  </div>
                  <div className="text-center p-2.5 rounded-xl bg-gradient-to-br from-accent/20 to-transparent">
                    <p className="text-xl sm:text-2xl font-bold text-foreground">8</p>
                    <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5">Reminders</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating notification - Reminder sent */}
            <motion.div
              className="absolute -bottom-3 -right-2 sm:-right-4 z-20 bg-card/95 backdrop-blur-sm border border-border/50 rounded-xl p-3 shadow-xl"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.5 }}
            >
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-primary/15 flex items-center justify-center">
                  <Bell className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">Reminder sent</p>
                  <p className="text-xs text-muted-foreground">Invoice #1234 • Just now</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const InvoiceItem = ({ 
  client, 
  amount, 
  status, 
  statusColor, 
  bgColor 
}: { 
  client: string; 
  amount: string; 
  status: string; 
  statusColor: string; 
  bgColor: string; 
}) => (
  <div className="flex items-center justify-between p-3 bg-background/60 rounded-xl border border-border/30 hover:border-border/50 transition-all">
    <div className="flex items-center gap-3">
      <div className={`w-9 h-9 ${bgColor} rounded-lg flex items-center justify-center`}>
        <CreditCard className="w-4 h-4 text-primary" />
      </div>
      <div>
        <p className="font-medium text-sm text-foreground">{client}</p>
        <p className="text-xs text-muted-foreground">{amount}</p>
      </div>
    </div>
    <span className={`text-xs font-medium ${statusColor}`}>{status}</span>
  </div>
);

export default HeroSection;
