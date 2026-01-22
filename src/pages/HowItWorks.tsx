import { SEOHead } from "@/components/SEOHead";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { FileText, Send, DollarSign, Bell, Clock, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const steps = [
  {
    number: "01",
    icon: FileText,
    title: "Add your invoice",
    description:
      "Enter the client's name, email, invoice amount, and due date. Then paste your payment link—whether it's Stripe, PayPal, or a simple bank transfer page.",
    details: [
      "No need to create invoices in RemindSwift",
      "Works with any payment method you already use",
      "Takes less than 2 minutes to set up",
    ],
  },
  {
    number: "02",
    icon: Clock,
    title: "Set your reminder schedule",
    description:
      "Choose when and how often to remind your client. We recommend starting with gentle reminders before the due date and escalating if needed.",
    details: [
      "Reminders before, on, and after due date",
      "Email and SMS options",
      "Customize timing to your preferences",
    ],
  },
  {
    number: "03",
    icon: Send,
    title: "Automated reminders go out",
    description:
      "RemindSwift sends polite, professional reminders to your client at the times you specified. Each reminder includes your payment link for easy payment.",
    details: [
      "Professional templates that maintain relationships",
      "Your payment link in every message",
      "Track when reminders are opened",
    ],
  },
  {
    number: "04",
    icon: DollarSign,
    title: "Get paid faster",
    description:
      "Clients receive timely nudges and can pay instantly through your link. Mark invoices as paid to stop reminders, or let clients confirm payment directly.",
    details: [
      "Average 40% faster payment times",
      "Client payment confirmation",
      "Full visibility in your dashboard",
    ],
  },
];

const HowItWorks = () => {
  return (
    <>
      <SEOHead
        title="How It Works"
        description="Learn how RemindSwift automates your invoice reminders in 4 simple steps. Add invoices, set schedules, and get paid faster."
        path="/how-it-works"
      />
      <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero */}
        <section className="py-20 bg-muted/30">
          <div className="container text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              How RemindSwift works
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Four simple steps to automate your invoice reminders and get paid faster.
            </p>
          </div>
        </section>

        {/* Steps */}
        <section className="py-20">
          <div className="container">
            <div className="max-w-3xl mx-auto space-y-16">
              {steps.map((step, index) => (
                <div key={index} className="relative">
                  {/* Connector */}
                  {index < steps.length - 1 && (
                    <div className="absolute left-8 top-20 bottom-0 w-0.5 bg-border -mb-16 hidden md:block" />
                  )}

                  <div className="flex gap-6">
                    {/* Number */}
                    <div className="flex-shrink-0">
                      <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold">
                        {step.number}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <step.icon className="w-5 h-5 text-primary" />
                        <h2 className="text-2xl font-semibold">{step.title}</h2>
                      </div>
                      <p className="text-muted-foreground mb-4">
                        {step.description}
                      </p>
                      <ul className="space-y-2">
                        {step.details.map((detail, detailIndex) => (
                          <li
                            key={detailIndex}
                            className="flex items-center gap-2 text-sm"
                          >
                            <CheckCircle className="w-4 h-4 text-success flex-shrink-0" />
                            {detail}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* What You Need */}
        <section className="py-20 bg-muted/30">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-8">
                What you need to get started
              </h2>
              <div className="grid md:grid-cols-3 gap-8">
                <div className="bg-background border border-border rounded-xl p-6">
                  <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center mx-auto mb-4">
                    <FileText className="w-6 h-6 text-accent-foreground" />
                  </div>
                  <h3 className="font-semibold mb-2">Invoice details</h3>
                  <p className="text-sm text-muted-foreground">
                    Client name, email, amount, and due date
                  </p>
                </div>
                <div className="bg-background border border-border rounded-xl p-6">
                  <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center mx-auto mb-4">
                    <DollarSign className="w-6 h-6 text-accent-foreground" />
                  </div>
                  <h3 className="font-semibold mb-2">Payment link</h3>
                  <p className="text-sm text-muted-foreground">
                    Stripe, PayPal, or any payment page URL
                  </p>
                </div>
                <div className="bg-background border border-border rounded-xl p-6">
                  <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Bell className="w-6 h-6 text-accent-foreground" />
                  </div>
                  <h3 className="font-semibold mb-2">Reminder schedule</h3>
                  <p className="text-sm text-muted-foreground">
                    When and how often to remind
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20">
          <div className="container text-center">
            <h2 className="text-3xl font-bold mb-4">
              Ready to automate your reminders?
            </h2>
            <p className="text-muted-foreground mb-8">
              Start free — no credit card required.
            </p>
            <Link to="/signup">
              <Button size="lg">Start Free</Button>
            </Link>
          </div>
        </section>
      </main>
      <Footer />
      </div>
    </>
  );
};

export default HowItWorks;
