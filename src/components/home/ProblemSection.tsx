import { Clock, MessageSquare, AlertCircle } from "lucide-react";

const problems = [
  {
    icon: Clock,
    title: "Payments slip through the cracks",
    description:
      "Clients get busy. Invoices get buried. Without follow-ups, you're left waiting and wondering.",
  },
  {
    icon: MessageSquare,
    title: "Awkward follow-up conversations",
    description:
      "Nobody enjoys chasing money. It's uncomfortable and can strain professional relationships.",
  },
  {
    icon: AlertCircle,
    title: "Time wasted on manual tracking",
    description:
      "Spreadsheets, calendar reminders, and mental notes take up valuable time you could spend on actual work.",
  },
];

const ProblemSection = () => {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Sound familiar?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Freelancers and agencies lose thousands every year to late payments
            and forgotten invoices.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {problems.map((problem, index) => (
            <div
              key={index}
              className="bg-background border border-border rounded-xl p-6 hover:shadow-lg transition-shadow"
            >
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <problem.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{problem.title}</h3>
              <p className="text-muted-foreground">{problem.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProblemSection;
