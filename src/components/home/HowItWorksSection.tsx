import { FileText, Send, DollarSign } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: FileText,
    title: "Add your invoice details",
    description:
      "Enter client info, invoice amount, due date, and your payment link. That's all we need to get started.",
  },
  {
    number: "02",
    icon: Send,
    title: "Automated reminders go out",
    description:
      "PayPing sends friendly, professional reminders via email or SMS on the schedule you choose. Your payment link is included in every message.",
  },
  {
    number: "03",
    icon: DollarSign,
    title: "Get paid faster",
    description:
      "Clients receive timely nudges with a direct link to pay. No more chasing, no more awkward conversations.",
  },
];

const HowItWorksSection = () => {
  return (
    <section className="py-20">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            How PayPing works
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Three simple steps to never chase a payment again
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-16 left-1/2 w-full h-0.5 bg-border" />
              )}

              <div className="relative bg-background text-center">
                {/* Step Number */}
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary text-primary-foreground text-xl font-bold mb-6">
                  {step.number}
                </div>

                <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
