import { SEOHead } from "@/components/SEOHead";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";
import { Link } from "react-router-dom";

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "For getting started with manual reminders",
    cta: "Start Free",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "$19",
    period: "/month",
    description: "For freelancers who want to automate",
    cta: "Start Free Trial",
    highlighted: true,
  },
  {
    name: "Agency",
    price: "$69",
    period: "/month",
    description: "For teams managing multiple clients",
    cta: "Start Free Trial",
    highlighted: false,
  },
];

const features = [
  { name: "Active invoices", free: "5", pro: "Unlimited", agency: "Unlimited" },
  { name: "Email reminders", free: true, pro: true, agency: true },
  { name: "Automated scheduling", free: false, pro: true, agency: true },
  { name: "SMS reminders", free: false, pro: "150/month", agency: "500/month" },
  { name: "Custom reminder templates", free: false, pro: true, agency: true },
  { name: "Payment tracking dashboard", free: "Basic", pro: "Full", agency: "Full" },
  { name: "Multiple reminder schedules", free: false, pro: true, agency: true },
  { name: "Team members", free: "1", pro: "1", agency: "Up to 5" },
  { name: "Client portal", free: false, pro: true, agency: true },
  { name: "API access", free: false, pro: false, agency: true },
  { name: "Priority support", free: false, pro: false, agency: true },
  { name: "Custom branding", free: false, pro: false, agency: true },
];

const FeatureValue = ({ value }: { value: boolean | string }) => {
  if (value === true) {
    return <Check className="w-5 h-5 text-success mx-auto" />;
  }
  if (value === false) {
    return <X className="w-5 h-5 text-muted-foreground/50 mx-auto" />;
  }
  return <span className="text-sm">{value}</span>;
};

const Pricing = () => {
  return (
    <>
      <SEOHead
        title="Pricing"
        description="Choose a plan that fits your needs. Free forever plan, Pro for automation, and Agency for teams. Start with a 14-day free trial."
        path="/pricing"
      />
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">
          {/* Hero */}
          <section className="py-20 bg-muted/30">
            <div className="container text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Simple, transparent pricing
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Start free, upgrade when you need more. No credit card required to get started.
              </p>
            </div>
          </section>

          {/* Pricing Cards */}
          <section className="py-12">
            <div className="container">
              <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                {plans.map((plan, index) => (
                  <div
                    key={index}
                    className={`relative rounded-xl p-6 ${
                      plan.highlighted
                        ? "bg-primary text-primary-foreground border-2 border-primary shadow-xl"
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
            </div>
          </section>

          {/* Feature Comparison Table */}
          <section className="py-12">
            <div className="container">
              <h2 className="text-2xl font-bold text-center mb-8">
                Compare all features
              </h2>

              <div className="max-w-4xl mx-auto overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-4 px-4 font-semibold">Feature</th>
                      <th className="text-center py-4 px-4 font-semibold">Free</th>
                      <th className="text-center py-4 px-4 font-semibold text-primary">
                        Pro
                      </th>
                      <th className="text-center py-4 px-4 font-semibold">Agency</th>
                    </tr>
                  </thead>
                  <tbody>
                    {features.map((feature, index) => (
                      <tr key={index} className="border-b border-border">
                        <td className="py-4 px-4 text-sm">{feature.name}</td>
                        <td className="py-4 px-4 text-center">
                          <FeatureValue value={feature.free} />
                        </td>
                        <td className="py-4 px-4 text-center bg-primary/5">
                          <FeatureValue value={feature.pro} />
                        </td>
                        <td className="py-4 px-4 text-center">
                          <FeatureValue value={feature.agency} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* SMS Top-up Note */}
          <section className="py-12 bg-muted/30">
            <div className="container">
              <div className="max-w-2xl mx-auto text-center">
                <h3 className="text-xl font-semibold mb-4">Need more SMS?</h3>
                <p className="text-muted-foreground mb-6">
                  Additional SMS credits can be purchased in top-up packs at any time.
                  Unused credits roll over month to month.
                </p>
                <div className="flex justify-center gap-8">
                  <div className="text-center">
                    <p className="text-2xl font-bold">100 SMS</p>
                    <p className="text-muted-foreground">$10</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold">500 SMS</p>
                    <p className="text-muted-foreground">$40</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold">1000 SMS</p>
                    <p className="text-muted-foreground">$70</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* CTA */}
          <section className="py-20">
            <div className="container text-center">
              <h2 className="text-3xl font-bold mb-4">
                Ready to get started?
              </h2>
              <p className="text-muted-foreground mb-8">
                Start with our free plan — no credit card required.
              </p>
              <Link to="/signup">
                <Button size="lg">Start Free</Button>
              </Link>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Pricing;
