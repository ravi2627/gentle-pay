import { Link, Mail, Smartphone, Calendar, BarChart3, Shield } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  {
    icon: Link,
    title: "Your payment link, every time",
    description: "Use your Stripe, PayPal, or any payment link. We include it automatically in every reminder.",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    icon: Mail,
    title: "Email reminders",
    description: "Professional, friendly emails that don't feel pushy. Customizable templates to match your tone.",
    gradient: "from-violet-500 to-purple-500",
  },
  {
    icon: Smartphone,
    title: "SMS notifications",
    description: "Reach clients instantly on their phone. Perfect for urgent reminders or time-sensitive payments.",
    gradient: "from-rose-500 to-pink-500",
  },
  {
    icon: Calendar,
    title: "Flexible scheduling",
    description: "Set reminders before, on, and after the due date. Escalate automatically if needed.",
    gradient: "from-amber-500 to-orange-500",
  },
  {
    icon: BarChart3,
    title: "Payment tracking",
    description: "See which invoices are pending, reminded, or paid at a glance. Know exactly where you stand.",
    gradient: "from-emerald-500 to-teal-500",
  },
  {
    icon: Shield,
    title: "Client-friendly approach",
    description: "Reminders are polite and professional. Maintain good relationships while getting paid.",
    gradient: "from-indigo-500 to-blue-500",
  },
];

const FeatureSection = () => {
  return (
    <section id="features" className="py-20 md:py-28 relative overflow-hidden scroll-mt-20">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-background via-muted/30 to-background" />
      
      <div className="container">
        <motion.div 
          className="text-center mb-14 md:mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-success/10 text-success text-sm font-medium mb-5">
            Features
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4">
            <span className="text-foreground">Everything you need to</span>
            <br />
            <span className="bg-gradient-to-r from-primary via-accent-foreground to-primary bg-clip-text text-transparent">
              get paid on time
            </span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-base md:text-lg">
            PayPing is not another invoicing tool. It's a focused reminder system that works with your existing payment setup.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
              className="group relative"
            >
              <div className="relative bg-card/70 backdrop-blur-sm border border-border/50 rounded-2xl p-6 h-full hover:border-primary/30 transition-all duration-300 hover:shadow-lg overflow-hidden">
                {/* Gradient hover overlay */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
                
                <div className="relative">
                  <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                    <feature.icon className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-foreground mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureSection;
