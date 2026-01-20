import { Link, Mail, Smartphone, Calendar, BarChart3, Shield } from "lucide-react";

const features = [
  {
    icon: Link,
    title: "Your payment link, every time",
    description:
      "Use your own Stripe, PayPal, or any payment link. We include it automatically in every reminder.",
  },
  {
    icon: Mail,
    title: "Email reminders",
    description:
      "Professional, friendly emails that don't feel pushy. Customizable templates to match your tone.",
  },
  {
    icon: Smartphone,
    title: "SMS notifications",
    description:
      "Reach clients instantly on their phone. Perfect for urgent reminders or time-sensitive payments.",
  },
  {
    icon: Calendar,
    title: "Flexible scheduling",
    description:
      "Set reminders before, on, and after the due date. Escalate automatically if needed.",
  },
  {
    icon: BarChart3,
    title: "Payment tracking",
    description:
      "See which invoices are pending, reminded, or paid at a glance. Know exactly where you stand.",
  },
  {
    icon: Shield,
    title: "Client-friendly approach",
    description:
      "Reminders are polite and professional. Maintain good relationships while getting paid.",
  },
];

const FeatureSection = () => {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Everything you need to get paid on time
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            PayPing is not another invoicing tool. It's a focused reminder system
            that works with your existing payment setup.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-background border border-border rounded-xl p-6 hover:border-primary/50 transition-colors"
            >
              <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center mb-4">
                <feature.icon className="w-5 h-5 text-accent-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureSection;
