import { FileText, Send, DollarSign, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const steps = [
  {
    number: "01",
    icon: FileText,
    title: "Add your invoice details",
    description:
      "Enter client info, invoice amount, due date, and your payment link. That's all we need to get started.",
    color: "from-blue-500 to-cyan-500",
  },
  {
    number: "02",
    icon: Send,
    title: "Automated reminders go out",
    description:
      "PayPing sends friendly, professional reminders via email or SMS on the schedule you choose.",
    color: "from-violet-500 to-purple-500",
  },
  {
    number: "03",
    icon: DollarSign,
    title: "Get paid faster",
    description:
      "Clients receive timely nudges with a direct link to pay. No more chasing, no awkward conversations.",
    color: "from-emerald-500 to-teal-500",
  },
];

const HowItWorksSection = () => {
  return (
    <section className="py-24 lg:py-32 relative overflow-hidden bg-gradient-to-b from-muted/30 via-background to-muted/30">
      {/* Background decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-primary/5 to-transparent rounded-full -z-10" />
      
      <div className="container">
        <motion.div 
          className="text-center mb-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            How It Works
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 tracking-tight">
            Three simple steps
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Never chase a payment again
          </p>
        </motion.div>

        <div className="relative max-w-5xl mx-auto">
          {/* Connection Line */}
          <div className="hidden lg:block absolute top-32 left-[calc(16.67%+2rem)] right-[calc(16.67%+2rem)] h-0.5 bg-gradient-to-r from-blue-500/30 via-violet-500/30 to-emerald-500/30" />
          
          <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                className="relative"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ delay: index * 0.2, duration: 0.6, ease: "easeOut" }}
              >
                <div className="text-center">
                  {/* Step Number with Icon */}
                  <div className="relative inline-flex mb-8">
                    <div className={`w-24 h-24 rounded-3xl bg-gradient-to-br ${step.color} flex items-center justify-center shadow-lg`}>
                      <step.icon className="w-10 h-10 text-white" />
                    </div>
                    <span className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-background border-2 border-border flex items-center justify-center text-sm font-bold text-foreground shadow-md">
                      {step.number}
                    </span>
                  </div>

                  <h3 className="text-2xl font-bold mb-4 text-foreground">{step.title}</h3>
                  <p className="text-muted-foreground leading-relaxed max-w-xs mx-auto">{step.description}</p>
                </div>

                {/* Arrow for larger screens */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:flex absolute top-32 -right-6 w-12 h-12 items-center justify-center text-muted-foreground">
                    <ArrowRight className="w-6 h-6" />
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
