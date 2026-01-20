import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Check, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "For getting started",
    features: [
      "Manual reminders",
      "Up to 5 invoices",
      "Email support",
    ],
    cta: "Get started",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "$19",
    period: "/month",
    description: "For active freelancers",
    features: [
      "Automated reminders",
      "Unlimited invoices",
      "150 SMS/month",
      "Priority support",
    ],
    cta: "Start free trial",
    highlighted: true,
  },
  {
    name: "Agency",
    price: "$69",
    period: "/month",
    description: "For teams",
    features: [
      "Everything in Pro",
      "Team access",
      "500 SMS/month",
      "Dedicated support",
    ],
    cta: "Contact sales",
    highlighted: false,
  },
];

const PricingPreview = () => {
  return (
    <section className="py-16 md:py-24">
      <div className="container">
        <motion.div 
          className="text-center mb-12 md:mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground tracking-tight">
            Simple, transparent pricing
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-5 md:gap-6 lg:gap-8 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`relative rounded-2xl p-6 md:p-8 border transition-all ${
                plan.highlighted
                  ? "bg-primary text-primary-foreground border-primary shadow-xl shadow-primary/20 md:scale-105"
                  : "bg-card border-border/50 shadow-sm hover:shadow-md"
              }`}
            >
              {plan.highlighted && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 inline-flex items-center gap-1 px-3 py-1 bg-accent-foreground text-white text-xs font-medium rounded-full shadow-lg">
                  <Sparkles className="w-3 h-3" />
                  Most popular
                </span>
              )}

              <div className="mb-6">
                <h3 className={`text-lg font-semibold mb-1 ${plan.highlighted ? "text-primary-foreground" : "text-foreground"}`}>
                  {plan.name}
                </h3>
                <p className={`text-sm ${plan.highlighted ? "text-primary-foreground/80" : "text-muted-foreground"}`}>
                  {plan.description}
                </p>
              </div>

              <div className="mb-6">
                <span className={`text-4xl font-bold ${plan.highlighted ? "text-primary-foreground" : "text-foreground"}`}>
                  {plan.price}
                </span>
                <span className={`text-sm ${plan.highlighted ? "text-primary-foreground/80" : "text-muted-foreground"}`}>
                  {plan.period}
                </span>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2.5 text-sm">
                    <div className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 ${
                      plan.highlighted ? "bg-primary-foreground/20" : "bg-primary/10"
                    }`}>
                      <Check className={`w-2.5 h-2.5 ${plan.highlighted ? "text-primary-foreground" : "text-primary"}`} />
                    </div>
                    <span className={plan.highlighted ? "text-primary-foreground/90" : "text-muted-foreground"}>
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <Link to="/signup" className="block">
                <Button
                  className={`w-full min-h-[48px] font-medium ${
                    plan.highlighted
                      ? "bg-white text-primary hover:bg-white/90"
                      : "bg-primary text-primary-foreground hover:bg-primary/90"
                  }`}
                >
                  {plan.cta}
                </Button>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Trust line */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center mt-8 text-sm text-muted-foreground"
        >
          Cancel anytime. No long-term contracts.
        </motion.p>
      </div>
    </section>
  );
};

export default PricingPreview;
