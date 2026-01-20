import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Check, Bell, Clock, ArrowRight, TrendingUp, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden py-16 md:py-20 lg:py-28">
      {/* Clean subtle background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-bl from-primary/10 via-accent/5 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-to-tr from-accent/10 to-transparent rounded-full blur-3xl" />
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
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1] text-foreground">
              Get paid on time
              <br className="hidden sm:block" />
              <span className="text-primary"> without the chase</span>
            </h1>
            
            <p className="mt-6 text-lg text-muted-foreground max-w-lg mx-auto lg:mx-0 leading-relaxed">
              Automated payment reminders that help freelancers and agencies 
              collect faster — without awkward follow-ups.
            </p>

            {/* CTAs - Stack on mobile */}
            <div className="mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start">
              <Link to="/signup" className="w-full sm:w-auto">
                <Button 
                  size="lg" 
                  className="w-full sm:w-auto min-h-[52px] px-8 text-base bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20"
                >
                  Start free
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
              <Link to="/pricing" className="w-full sm:w-auto">
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="w-full sm:w-auto min-h-[52px] px-8 text-base border-border hover:bg-muted/50"
                >
                  View pricing
                </Button>
              </Link>
            </div>

            {/* Trust micro-line */}
            <p className="mt-6 text-sm text-muted-foreground">
              Set up in under 5 minutes · No credit card required
            </p>
          </motion.div>

          {/* Right - Dashboard Mockup */}
          <motion.div 
            className="relative mt-8 lg:mt-0"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.7 }}
          >
            {/* Main Dashboard Card */}
            <div className="relative bg-card border border-border/50 rounded-2xl shadow-xl overflow-hidden">
              {/* Browser Chrome */}
              <div className="bg-muted/40 px-4 py-3 border-b border-border/50 flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-destructive/60" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/60" />
                  <div className="w-2.5 h-2.5 rounded-full bg-success/60" />
                </div>
                <div className="flex-1 mx-4 hidden sm:block">
                  <div className="bg-background/60 rounded-md px-3 py-1 text-xs text-muted-foreground text-center max-w-[200px] mx-auto">
                    PayPing Dashboard
                  </div>
                </div>
              </div>

              {/* Dashboard Content */}
              <div className="p-4 sm:p-6 bg-background/50">
                {/* KPI Cards */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="bg-card rounded-xl p-3 sm:p-4 border border-border/50">
                    <div className="flex items-center gap-2 mb-1">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">Outstanding</span>
                    </div>
                    <p className="text-xl sm:text-2xl font-bold text-foreground">$4,200</p>
                  </div>
                  <div className="bg-card rounded-xl p-3 sm:p-4 border border-border/50">
                    <div className="flex items-center gap-2 mb-1">
                      <TrendingUp className="w-4 h-4 text-success" />
                      <span className="text-xs text-muted-foreground">Paid this month</span>
                    </div>
                    <p className="text-xl sm:text-2xl font-bold text-success">$12,300</p>
                  </div>
                </div>

                {/* Mini Chart */}
                <div className="bg-card rounded-xl p-3 sm:p-4 border border-border/50 mb-4">
                  <p className="text-xs text-muted-foreground mb-3">Payments received</p>
                  <div className="flex items-end gap-1.5 h-12 sm:h-14">
                    {[35, 55, 40, 70, 50, 65, 85].map((height, i) => (
                      <div
                        key={i}
                        className="flex-1 bg-gradient-to-t from-primary to-primary/50 rounded-sm"
                        style={{ height: `${height}%` }}
                      />
                    ))}
                  </div>
                </div>

                {/* Invoice with Overdue Badge */}
                <div className="bg-card rounded-xl p-3 sm:p-4 border border-border/50">
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">INV-1042</p>
                      <p className="text-xs text-muted-foreground">Acme Corp</p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-destructive/10 text-destructive">
                        <AlertCircle className="w-3 h-3" />
                        <span className="hidden sm:inline">Overdue</span>
                      </span>
                      <span className="text-sm font-semibold text-foreground">$1,850</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating notification - Payment received */}
            <motion.div
              className="absolute -top-3 -left-3 sm:-top-4 sm:-left-4 z-10 bg-card border border-border/50 rounded-xl p-3 shadow-lg"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-success/15 flex items-center justify-center">
                  <Check className="w-4 h-4 text-success" />
                </div>
                <div>
                  <p className="text-xs font-medium text-foreground">Payment received</p>
                  <p className="text-xs text-muted-foreground">$2,400</p>
                </div>
              </div>
            </motion.div>

            {/* Floating notification - Reminder sent */}
            <motion.div
              className="absolute -bottom-3 -right-3 sm:-bottom-4 sm:-right-4 z-10 bg-card border border-border/50 rounded-xl p-3 shadow-lg"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.5 }}
            >
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary/15 flex items-center justify-center">
                  <Bell className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-xs font-medium text-foreground">Reminder sent</p>
                  <p className="text-xs text-muted-foreground">Just now</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
