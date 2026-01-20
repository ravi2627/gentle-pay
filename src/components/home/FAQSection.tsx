import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { motion } from "framer-motion";

const faqs = [
  {
    question: "What payment methods does PayPing support?",
    answer:
      "PayPing doesn't process payments directly. Instead, you provide your own payment link (Stripe, PayPal, bank transfer, etc.) and we include it in every reminder. This means you keep full control of your payment setup.",
  },
  {
    question: "How do automated reminders work?",
    answer:
      "You set a schedule (e.g., 3 days before due, on due date, 3 days after). PayPing automatically sends friendly reminder emails or SMS to your clients at those times, including your payment link.",
  },
  {
    question: "Can I customize the reminder messages?",
    answer:
      "Yes! You can edit the email templates to match your brand and tone. Our default templates are friendly and professional, designed to maintain good client relationships.",
  },
  {
    question: "What if my client has already paid?",
    answer:
      "You can mark invoices as paid anytime, which stops all future reminders. We also provide a link in each reminder for clients to confirm payment, helping you track who has paid.",
  },
  {
    question: "Is there a contract or commitment?",
    answer:
      "No contracts. You can cancel anytime. The Free plan is free forever, and paid plans are billed monthly with no long-term commitment required.",
  },
  {
    question: "How many SMS reminders are included?",
    answer:
      "The Pro plan includes 150 SMS per month, and the Agency plan includes 500. Additional SMS can be purchased in top-up packs if needed.",
  },
  {
    question: "Can I use PayPing with my existing invoicing software?",
    answer:
      "Absolutely. PayPing is designed to complement your existing tools, not replace them. Just enter the invoice details and payment link—we handle the follow-ups.",
  },
  {
    question: "Is my data secure?",
    answer:
      "Yes. We use industry-standard encryption and security practices. We never store payment information or process transactions directly. Your client contact information is handled securely.",
  },
];

const FAQSection = () => {
  return (
    <section className="py-24 lg:py-32 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-background via-muted/20 to-background" />
      
      <div className="container">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block px-4 py-2 rounded-full bg-muted text-muted-foreground text-sm font-medium mb-6">
            FAQ
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 tracking-tight">
            Frequently asked questions
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Everything you need to know about PayPing
          </p>
        </motion.div>

        <motion.div 
          className="max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="bg-card/60 backdrop-blur-sm border border-border/50 rounded-2xl px-6 overflow-hidden hover:border-border transition-colors"
              >
                <AccordionTrigger className="text-left font-semibold hover:no-underline py-6 text-foreground">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-6 leading-relaxed">
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
