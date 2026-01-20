import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const CTASection = () => {
  return (
    <section className="py-16 md:py-24">
      <div className="container">
        <motion.div 
          className="relative rounded-3xl bg-gradient-to-br from-primary/10 via-accent/15 to-primary/5 border border-primary/10 p-8 md:p-12 lg:p-16 text-center overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {/* Subtle decorative blurs */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-accent/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-4 tracking-tight">
              Ready to get paid on time?
            </h2>
            <p className="text-muted-foreground max-w-md mx-auto mb-8 text-sm md:text-base">
              Join thousands of freelancers and agencies who've automated their payment reminders.
            </p>
            <Link to="/signup">
              <Button 
                size="lg" 
                className="min-h-[52px] px-8 md:px-10 text-base bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20"
              >
                Start free today
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;
