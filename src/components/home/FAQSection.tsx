import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { motion } from "framer-motion";

const faqs = [
  {
    question: "How does PayPing work?",
    answer:
      "Add your invoices, set up automated reminder schedules, and PayPing sends professional email and SMS reminders to your clients until they pay.",
  },
  {
    question: "Can I customize the reminder messages?",
    answer:
      "Yes, you can customize email and SMS templates to match your brand voice and communication style.",
  },
  {
    question: "What payment methods do clients see?",
    answer:
      "Each reminder includes a payment link. You connect your preferred payment processor so clients can pay instantly.",
  },
  {
    question: "Is there a free plan?",
    answer:
      "Yes! Our free plan includes manual reminders and up to 5 invoices. No credit card required to start.",
  },
  {
    question: "How do I get started?",
    answer:
      "Sign up for free, add your first invoice, and set up your reminder schedule. It takes less than 5 minutes.",
  },
];

const FAQSection = () => {
  return (
    <section className="py-16 md:py-24 bg-muted/30">
      <div className="container max-w-3xl">
        <motion.div 
          className="text-center mb-10 md:mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground tracking-tight">
            Frequently asked questions
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Accordion type="single" collapsible className="space-y-3">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="bg-card border border-border/50 rounded-xl px-5 md:px-6 data-[state=open]:shadow-sm transition-shadow"
              >
                <AccordionTrigger className="text-left text-sm md:text-base font-medium text-foreground hover:no-underline py-4 md:py-5 min-h-[56px]">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-sm pb-4 md:pb-5 leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
};

export default FAQSection;
