import { Link, Mail, Smartphone, Calendar, BarChart3, Shield, LucideIcon } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  {
    icon: Link,
    title: "Your payment link, every time",
    description:
      "Use your own Stripe, PayPal, or any payment link. We include it automatically in every reminder.",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    icon: Mail,
    title: "Email reminders",
    description:
      "Professional, friendly emails that don't feel pushy. Customizable templates to match your tone.",
    gradient: "from-violet-500 to-purple-500",
  },
  {
    icon: Smartphone,
    title: "SMS notifications",
    description:
      "Reach clients instantly on their phone. Perfect for urgent reminders or time-sensitive payments.",
    gradient: "from-rose-500 to-pink-500",
  },
  {
    icon: Calendar,
    title: "Flexible scheduling",
    description:
      "Set reminders before, on, and after the due date. Escalate automatically if needed.",
    gradient: "from-amber-500 to-orange-500",
  },
  {
    icon: BarChart3,
    title: "Payment tracking",
    description:
      "See which invoices are pending, reminded, or paid at a glance. Know exactly where you stand.",
    gradient: "from-emerald-500 to-teal-500",
  },
  {
    icon: Shield,
    title: "Client-friendly approach",
    description:
      "Reminders are polite and professional. Maintain good relationships while getting paid.",
    gradient: "from-indigo-500 to-blue-500",
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as const } },
};

const FeatureSection = () => {
  return (
    <section className="py-24 lg:py-32 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-background via-muted/20 to-background" />
      
      <div className="container">
        <motion.div 
          className="text-center mb-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block px-4 py-2 rounded-full bg-success/10 text-success text-sm font-medium mb-6">
            Features
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 tracking-tight">
            Everything you need to
            <br />
            <span className="bg-gradient-to-r from-primary via-accent-foreground to-primary bg-clip-text text-transparent">
              get paid on time
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            PayPing is not another invoicing tool. It's a focused reminder system
            that works with your existing payment setup.
          </p>
        </motion.div>

        <motion.div 
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={item}
              className="group relative"
            >
              <div className="relative bg-card/60 backdrop-blur-sm border border-border/50 rounded-2xl p-8 h-full hover:border-primary/30 transition-all duration-300 hover:shadow-lg overflow-hidden">
                {/* Gradient overlay on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
                
                <div className="relative">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-foreground">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default FeatureSection;
