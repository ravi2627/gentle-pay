import { Clock, MessageSquare, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";

const problems = [
  {
    icon: Clock,
    title: "Payments slip through the cracks",
    description: "Clients get busy. Invoices get buried. Without follow-ups, you're left waiting and wondering.",
    gradient: "from-blue-500 to-cyan-500",
    iconBg: "bg-blue-500/10",
  },
  {
    icon: MessageSquare,
    title: "Awkward follow-up conversations",
    description: "Nobody enjoys chasing money. It's uncomfortable and can strain professional relationships.",
    gradient: "from-violet-500 to-purple-500",
    iconBg: "bg-violet-500/10",
  },
  {
    icon: AlertCircle,
    title: "Time wasted on manual tracking",
    description: "Spreadsheets, calendar reminders, and mental notes take up valuable time you could spend on actual work.",
    gradient: "from-rose-500 to-orange-500",
    iconBg: "bg-rose-500/10",
  },
];

const ProblemSection = () => {
  return (
    <section id="problem" className="py-20 md:py-28 relative overflow-hidden scroll-mt-20">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-background via-muted/30 to-background" />
      
      <div className="container">
        <motion.div 
          className="text-center mb-14 md:mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-destructive/10 text-destructive text-sm font-medium mb-5">
            The Problem
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground tracking-tight mb-4">
            Sound familiar?
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-base md:text-lg">
            Freelancers and agencies lose thousands every year to late payments and forgotten invoices.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6 lg:gap-8">
          {problems.map((problem, index) => (
            <motion.div
              key={problem.title}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative"
            >
              {/* Hover glow effect */}
              <div className={`absolute inset-0 bg-gradient-to-br ${problem.gradient} rounded-2xl blur-xl opacity-0 group-hover:opacity-20 transition-opacity duration-500`} />
              
              <div className="relative bg-card/80 backdrop-blur-sm border border-border/50 rounded-2xl p-6 md:p-8 h-full hover:border-border transition-all duration-300 hover:shadow-lg">
                <div className={`w-12 h-12 ${problem.iconBg} rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}>
                  <problem.icon className={`w-6 h-6 bg-gradient-to-br ${problem.gradient} bg-clip-text`} style={{ color: problem.gradient.includes('blue') ? '#3b82f6' : problem.gradient.includes('violet') ? '#8b5cf6' : '#f43f5e' }} />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">
                  {problem.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {problem.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProblemSection;
