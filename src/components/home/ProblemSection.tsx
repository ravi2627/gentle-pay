import { Clock, MessageSquare, AlertCircle, LucideIcon } from "lucide-react";
import { motion } from "framer-motion";

const problems = [
  {
    icon: Clock,
    title: "Payments slip through the cracks",
    description:
      "Clients get busy. Invoices get buried. Without follow-ups, you're left waiting and wondering.",
    gradient: "from-blue-500/20 to-cyan-500/20",
    iconBg: "bg-blue-500/10",
    iconColor: "text-blue-500",
  },
  {
    icon: MessageSquare,
    title: "Awkward follow-up conversations",
    description:
      "Nobody enjoys chasing money. It's uncomfortable and can strain professional relationships.",
    gradient: "from-violet-500/20 to-purple-500/20",
    iconBg: "bg-violet-500/10",
    iconColor: "text-violet-500",
  },
  {
    icon: AlertCircle,
    title: "Time wasted on manual tracking",
    description:
      "Spreadsheets, calendar reminders, and mental notes take up valuable time you could spend on actual work.",
    gradient: "from-rose-500/20 to-orange-500/20",
    iconBg: "bg-rose-500/10",
    iconColor: "text-rose-500",
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] as const } },
};

const ProblemSection = () => {
  return (
    <section className="py-24 lg:py-32 relative overflow-hidden">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-background via-muted/20 to-background" />
      
      <div className="container">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block px-4 py-2 rounded-full bg-destructive/10 text-destructive text-sm font-medium mb-6">
            The Problem
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 tracking-tight">
            Sound familiar?
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Freelancers and agencies lose thousands every year to late payments
            and forgotten invoices.
          </p>
        </motion.div>

        <motion.div 
          className="grid md:grid-cols-3 gap-6 lg:gap-8"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
        >
          {problems.map((problem, index) => (
            <motion.div
              key={index}
              variants={item}
              className="group relative"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${problem.gradient} rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
              <div className="relative bg-card/80 backdrop-blur-sm border border-border/50 rounded-3xl p-8 h-full hover:border-border transition-all duration-300 hover:shadow-xl">
                <div className={`w-14 h-14 ${problem.iconBg} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <problem.icon className={`w-7 h-7 ${problem.iconColor}`} />
                </div>
                <h3 className="text-xl font-bold mb-3 text-foreground">{problem.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{problem.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default ProblemSection;
