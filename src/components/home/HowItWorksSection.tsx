import { FileText, Bell, DollarSign } from "lucide-react";
import { motion } from "framer-motion";

const steps = [
  {
    icon: FileText,
    step: "1",
    title: "Add invoice",
    description: "Import or create invoices in seconds.",
  },
  {
    icon: Bell,
    step: "2",
    title: "Automate reminders",
    description: "Set up email & SMS reminders on your schedule.",
  },
  {
    icon: DollarSign,
    step: "3",
    title: "Get paid faster",
    description: "Clients pay on time without you lifting a finger.",
  },
];

const HowItWorksSection = () => {
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
            Three simple steps
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 md:gap-10 lg:gap-12 max-w-4xl mx-auto relative">
          {/* Connection line for desktop */}
          <div className="hidden md:block absolute top-12 left-[20%] right-[20%] h-px bg-gradient-to-r from-border via-primary/30 to-border" />

          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className="relative text-center"
            >
              {/* Step icon with number badge */}
              <div className="relative inline-flex mb-5">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <step.icon className="w-7 h-7 text-primary" />
                </div>
                <span className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-primary text-primary-foreground text-sm font-bold flex items-center justify-center shadow-md">
                  {step.step}
                </span>
              </div>

              <h3 className="text-lg font-semibold text-foreground mb-2">
                {step.title}
              </h3>
              <p className="text-muted-foreground text-sm max-w-[240px] mx-auto">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
