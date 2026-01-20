import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Check, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "For getting started with manual reminders",
    features: [
      "Up to 5 active invoices",
      "Manual reminder triggers",
      "Email reminders",
      "Basic dashboard",
    ],
    cta: "Start Free",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "$19",
    period: "/month",
    description: "For freelancers who want to automate",
    features: [
      "Unlimited invoices",
      "Automated reminders",
      "Email + SMS (150/mo)",
      "Custom reminder schedules",
      "Payment tracking",
    ],
    cta: "Start Free Trial",
    highlighted: true,
  },
  {
    name: "Agency",
    price: "$69",
    period: "/month",
    description: "For teams managing multiple clients",
    features: [
      "Everything in Pro",
      "Team access (up to 5 users)",
      "500 SMS/month",
      "Priority support",
      "API access",
    ],
    cta: "Start Free Trial",
    highlighted: false,
  },
];

const PricingPreview = () => {
  return (
    <section className="py-20 md:py-28 relative overflow-hidden bg-gradient-to-b from-muted/20 via-background to-background">
      <div className="container">
        <motion.div 
          className="text-center mb-12 md:mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-accent text-accent-foreground text-sm font-medium mb-5">
            Pricing
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground tracking-tight mb-4">
            Simple, transparent pricing
          </h2>
          <p className="text-muted-foreground text-base md:text-lg max-w-xl mx-auto">
            Start free, upgrade when you're ready. No credit card required.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-5 md:gap-6 lg:gap-8 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className={`relative ${plan.highlighted ? "md:-mt-4 md:mb-4" : ""}`}
            >
              {plan.highlighted && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                  <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-gradient-to-r from-primary to-accent-foreground text-primary-foreground text-sm font-semibold shadow-lg">
                    <Sparkles className="w-3.5 h-3.5" />
                    Most Popular
                  </span>
                </div>
              )}
              
              <div
                className={`relative h-full rounded-2xl p-6 md:p-8 transition-all duration-300 ${
                  plan.highlighted
                    ? "bg-gradient-to-br from-primary/95 to-accent-foreground/95 text-primary-foreground shadow-2xl shadow-primary/25 scale-[1.02]"
                    : "bg-card/80 backdrop-blur-sm border border-border/50 hover:border-border hover:shadow-lg"
                }`}
              >
                <div className="mb-6">
                  <h3 className={`text-xl font-bold mb-1 ${plan.highlighted ? "text-primary-foreground" : "text-foreground"}`}>
                    {plan.name}
                  </h3>
                  <div className="flex items-baseline gap-1 mb-2">
                    <span className={`text-4xl md:text-5xl font-bold ${plan.highlighted ? "text-primary-foreground" : "text-foreground"}`}>
                      {plan.price}
                    </span>
                    <span className={`text-sm ${plan.highlighted ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                      {plan.period}
                    </span>
                  </div>
                  <p className={`text-sm ${plan.highlighted ? "text-primary-foreground/80" : "text-muted-foreground"}`}>
                    {plan.description}
                  </p>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center gap-2.5">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
                        plan.highlighted ? "bg-primary-foreground/20" : "bg-primary/10"
                      }`}>
                        <Check className={`w-3 h-3 ${plan.highlighted ? "text-primary-foreground" : "text-primary"}`} />
                      </div>
                      <span className={`text-sm ${plan.highlighted ? "text-primary-foreground/90" : "text-foreground"}`}>
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                <Link to="/signup" className="block">
                  <Button
                    className={`w-full min-h-[48px] font-semibold transition-all ${
                      plan.highlighted
                        ? "bg-white text-primary hover:bg-white/90 shadow-lg"
                        : "bg-primary text-primary-foreground hover:bg-primary/90"
                    }`}
                  >
                    {plan.cta}
                  </Button>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Trust line + link */}
        <motion.div 
          className="text-center mt-10"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <p className="text-sm text-muted-foreground mb-4">
            Cancel anytime. No long-term contracts.
          </p>
          <Link
            to="/pricing"
            className="inline-flex items-center gap-1.5 text-primary hover:text-primary/80 font-medium text-sm transition-colors"
          >
            See full pricing comparison
            <span>→</span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default PricingPreview;
