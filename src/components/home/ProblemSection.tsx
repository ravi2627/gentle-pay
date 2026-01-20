import { Clock, MessageSquare, TrendingDown } from "lucide-react";
import { motion } from "framer-motion";

const problems = [
  {
    icon: Clock,
    title: "Chasing invoices is exhausting",
    description: "Hours spent sending follow-ups instead of doing actual work.",
  },
  {
    icon: MessageSquare,
    title: "Awkward payment conversations",
    description: "Nobody enjoys asking clients for money over and over.",
  },
  {
    icon: TrendingDown,
    title: "Cash flow suffers",
    description: "Late payments create stress and uncertainty for your business.",
  },
];

const ProblemSection = () => {
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
            Sound familiar?
          </h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6 lg:gap-8">
          {problems.map((problem, index) => (
            <motion.div
              key={problem.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-card rounded-2xl p-6 md:p-8 border border-border/50 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                <problem.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {problem.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {problem.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProblemSection;
