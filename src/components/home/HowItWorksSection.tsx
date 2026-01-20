import { FileText, Send, DollarSign, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const steps = [
  {
    number: "01",
    icon: FileText,
    title: "Add your invoice details",
    description: "Enter client info, invoice amount, due date, and your payment link. That's all we need.",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    number: "02",
    icon: Send,
    title: "Automated reminders go out",
    description: "PayPing sends friendly reminders via email or SMS on the schedule you choose.",
    gradient: "from-violet-500 to-purple-500",
  },
  {
    number: "03",
    icon: DollarSign,
    title: "Get paid faster",
    description: "Clients receive timely nudges with a direct link to pay. No more chasing.",
    gradient: "from-emerald-500 to-teal-500",
  },
];

const HowItWorksSection = () => {
  return (
    <section id="how-it-works" className="py-20 md:py-28 relative overflow-hidden bg-gradient-to-b from-muted/20 via-background to-muted/20 scroll-mt-20">
      <div className="container">
        <motion.div 
          className="text-center mb-14 md:mb-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-5">
            How It Works
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground tracking-tight mb-4">
            Three simple steps
          </h2>
          <p className="text-muted-foreground text-base md:text-lg">
            Never chase a payment again
          </p>
        </motion.div>

        <div className="relative max-w-5xl mx-auto">
          {/* Connection Line */}
          <div className="hidden lg:block absolute top-[72px] left-[calc(16.67%+3rem)] right-[calc(16.67%+3rem)] h-0.5 bg-gradient-to-r from-blue-500/30 via-violet-500/30 to-emerald-500/30" />
          
          <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
            {steps.map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15, duration: 0.5 }}
                className="relative text-center"
              >
                {/* Step Icon */}
                <div className="relative inline-flex mb-6">
                  <div className={`w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-gradient-to-br ${step.gradient} flex items-center justify-center shadow-lg`}>
                    <step.icon className="w-9 h-9 md:w-10 md:h-10 text-white" />
                  </div>
                  <span className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-background border-2 border-border flex items-center justify-center text-xs font-bold text-foreground shadow-md">
                    {step.number}
                  </span>
                </div>

                <h3 className="text-lg md:text-xl font-bold text-foreground mb-3">
                  {step.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed max-w-xs mx-auto">
                  {step.description}
                </p>

                {/* Arrow for desktop */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:flex absolute top-[72px] -right-6 w-12 h-12 items-center justify-center text-muted-foreground">
                    <ArrowRight className="w-5 h-5" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
