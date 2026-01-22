import { SEOHead } from "@/components/SEOHead";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const faqCategories = [
  {
    title: "Getting Started",
    faqs: [
      {
        question: "What is RemindSwift?",
        answer:
          "RemindSwift is an automated invoice reminder tool for freelancers and small agencies. It sends polite reminders to your clients about outstanding invoices, including your payment link in every message. It's not an invoicing tool—it works with whatever payment method you already use.",
      },
      {
        question: "How do I get started?",
        answer:
          "Sign up for a free account, add your first invoice with client details and your payment link, set a reminder schedule, and you're done. RemindSwift will handle the follow-ups automatically.",
      },
      {
        question: "Do I need to create invoices in RemindSwift?",
        answer:
          "No. RemindSwift focuses only on reminders. You create invoices using your existing tools (accounting software, Word docs, etc.) and just enter the basic details into RemindSwift along with your payment link.",
      },
    ],
  },
  {
    title: "Payments & Integration",
    faqs: [
      {
        question: "What payment methods does RemindSwift support?",
        answer:
          "RemindSwift works with any payment method. Just paste your payment link (Stripe, PayPal, bank transfer page, or any URL) and we include it in every reminder. You keep full control of your payment setup.",
      },
      {
        question: "Can I use RemindSwift with my existing invoicing software?",
        answer:
          "Absolutely. RemindSwift is designed to complement your existing tools, not replace them. Just enter the invoice details and payment link—we handle the follow-ups.",
      },
      {
        question: "Does RemindSwift process payments?",
        answer:
          "No. RemindSwift never touches your money. Clients pay directly through your payment link, and you receive funds through your existing payment provider.",
      },
    ],
  },
  {
    title: "Reminders & Automation",
    faqs: [
      {
        question: "How do automated reminders work?",
        answer:
          "You set a schedule (e.g., 3 days before due, on due date, 3 days after). RemindSwift automatically sends polite reminder emails or SMS to your clients at those times, including your payment link.",
      },
      {
        question: "Can I customize the reminder messages?",
        answer:
          "Yes! You can edit the email templates to match your brand and tone. Our default templates are polite and professional, designed to maintain good client relationships.",
      },
      {
        question: "What if my client has already paid?",
        answer:
          "You can mark invoices as paid anytime, which stops all future reminders. We also provide a link in each reminder for clients to confirm payment, helping you track who has paid.",
      },
      {
        question: "Can I send reminders manually?",
        answer:
          "Yes. On the Free plan, you manually trigger each reminder. On Pro and Agency plans, you can use automation or send manual reminders anytime.",
      },
    ],
  },
  {
    title: "Pricing & Plans",
    faqs: [
      {
        question: "Is there a free plan?",
        answer:
          "Yes! The Free plan includes up to 5 active invoices with manual (non-automated) email reminders. It's free forever with no credit card required.",
      },
      {
        question: "What's included in the Pro plan?",
        answer:
          "Pro ($19/month) includes unlimited invoices, automated reminders, email + 150 SMS per month, custom reminder schedules, and full payment tracking.",
      },
      {
        question: "Is there a contract or commitment?",
        answer:
          "No contracts. You can cancel anytime. Paid plans are billed monthly with no long-term commitment required.",
      },
      {
        question: "How many SMS reminders are included?",
        answer:
          "The Pro plan includes 150 SMS per month, and the Agency plan includes 500. Additional SMS can be purchased in top-up packs if needed.",
      },
    ],
  },
  {
    title: "Security & Privacy",
    faqs: [
      {
        question: "Is my data secure?",
        answer:
          "Yes. We use industry-standard encryption and security practices. We never store payment information or process transactions directly. Your client contact information is handled securely.",
      },
      {
        question: "Do you share my client data?",
        answer:
          "Never. Your client information is used only for sending reminders and is never shared with third parties for marketing or any other purpose.",
      },
    ],
  },
];

const FAQ = () => {
  return (
    <>
      <SEOHead
        title="FAQ"
        description="Find answers to common questions about RemindSwift invoice reminders, payments, pricing, and security."
        path="/faq"
      />
      <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero */}
        <section className="py-20 bg-muted/30">
          <div className="container text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Frequently asked questions
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Everything you need to know about RemindSwift. Can't find the answer you're looking for? Reach out to our support team.
            </p>
          </div>
        </section>

        {/* FAQ Categories */}
        <section className="py-20">
          <div className="container">
            <div className="max-w-3xl mx-auto space-y-12">
              {faqCategories.map((category, categoryIndex) => (
                <div key={categoryIndex}>
                  <h2 className="text-2xl font-semibold mb-6">
                    {category.title}
                  </h2>
                  <Accordion type="single" collapsible className="space-y-4">
                    {category.faqs.map((faq, faqIndex) => (
                      <AccordionItem
                        key={faqIndex}
                        value={`${categoryIndex}-${faqIndex}`}
                        className="bg-background border border-border rounded-lg px-6"
                      >
                        <AccordionTrigger className="text-left font-medium hover:no-underline">
                          {faq.question}
                        </AccordionTrigger>
                        <AccordionContent className="text-muted-foreground">
                          {faq.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 bg-muted/30">
          <div className="container text-center">
            <h2 className="text-3xl font-bold mb-4">
              Still have questions?
            </h2>
            <p className="text-muted-foreground mb-8">
              Start free and explore, or reach out to our support team.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/signup">
                <Button size="lg">Start Free</Button>
              </Link>
              <Button size="lg" variant="outline">
                Contact Support
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      </div>
    </>
  );
};

export default FAQ;
