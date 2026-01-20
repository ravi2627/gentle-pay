import { 
  Mail, 
  MessageSquare, 
  BarChart3, 
  CreditCard, 
  Clock, 
  Users 
} from "lucide-react";
import { motion } from "framer-motion";

const features = [
  {
    icon: Mail,
    title: "Email reminders",
    description: "Automated, professional emails that get results.",
  },
  {
    icon: MessageSquare,
    title: "SMS notifications",
    description: "Text reminders for urgent follow-ups.",
  },
  {
    icon: BarChart3,
    title: "Payment analytics",
    description: "Track what's paid, pending, and overdue.",
  },
  {
    icon: CreditCard,
    title: "Payment links",
    description: "One-click payment links in every reminder.",
  },
  {
    icon: Clock,
    title: "Custom schedules",
    description: "Set reminder timing that works for you.",
  },
  {
    icon: Users,
    title: "Client management",
    description: "Organize clients and track payment history.",
  },
];

const FeatureSection = () => {
  return (
    <section className="py-16 md:py-24 bg-muted/30">
      <div className="container">
        <motion.div 
          className="text-center mb-12 md:mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground tracking-tight">
            Everything you need
          </h2>
          <p className="mt-4 text-muted-foreground max-w-md mx-auto">
            Simple tools to automate collections and get paid faster.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 max-w-5xl mx-auto">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
              className="bg-card rounded-2xl p-5 md:p-6 border border-border/50 shadow-sm hover:shadow-md hover:border-primary/20 transition-all group"
            >
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/15 transition-colors">
                <feature.icon className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-base font-semibold text-foreground mb-1">
                {feature.title}
              </h3>
              <p className="text-muted-foreground text-sm">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureSection;
