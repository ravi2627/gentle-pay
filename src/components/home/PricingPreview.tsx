import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

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
    <section className="py-20">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Simple, transparent pricing
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Start free, upgrade when you're ready. No credit card required.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative rounded-xl p-6 ${
                plan.highlighted
                  ? "bg-primary text-primary-foreground border-2 border-primary shadow-xl scale-105"
                  : "bg-background border border-border"
              }`}
            >
              {plan.highlighted && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-accent text-accent-foreground text-xs font-semibold px-3 py-1 rounded-full">
                  Most Popular
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-2">{plan.name}</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span
                    className={
                      plan.highlighted
                        ? "text-primary-foreground/70"
                        : "text-muted-foreground"
                    }
                  >
                    {plan.period}
                  </span>
                </div>
                <p
                  className={`text-sm mt-2 ${
                    plan.highlighted
                      ? "text-primary-foreground/80"
                      : "text-muted-foreground"
                  }`}
                >
                  {plan.description}
                </p>
              </div>

              <ul className="space-y-3 mb-6">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center gap-2 text-sm">
                    <Check
                      className={`w-4 h-4 flex-shrink-0 ${
                        plan.highlighted ? "text-primary-foreground" : "text-primary"
                      }`}
                    />
                    {feature}
                  </li>
                ))}
              </ul>

              <Link to="/signup">
                <Button
                  className="w-full"
                  variant={plan.highlighted ? "secondary" : "default"}
                >
                  {plan.cta}
                </Button>
              </Link>
            </div>
          ))}
        </div>

        <div className="text-center mt-8">
          <Link
            to="/pricing"
            className="text-sm text-primary hover:underline font-medium"
          >
            See full pricing comparison →
          </Link>
        </div>
      </div>
    </section>
  );
};

export default PricingPreview;
