import { SEOHead } from "@/components/SEOHead";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Refund = () => {
  const currentDate = new Date().toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  return (
    <>
      <SEOHead
        title="Refund Policy"
        description="Learn about RemindSwift's refund policy for subscription services and when exceptions may apply."
        path="/refund"
      />
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 container py-16 md:py-24">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl font-bold text-foreground mb-4">Refund Policy</h1>
            <p className="text-muted-foreground mb-12">Last updated: {currentDate}</p>

            <div className="prose prose-neutral dark:prose-invert max-w-none space-y-8">
              <p className="text-muted-foreground leading-relaxed">
                Thank you for using RemindSwift.
              </p>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">Digital Service</h2>
                <p className="text-muted-foreground leading-relaxed">
                  RemindSwift provides digital subscription-based services. Once a subscription is activated, refunds are generally not provided.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">Exceptions</h2>
                <p className="text-muted-foreground mb-3">Refunds may be considered in cases of:</p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2">
                  <li>Duplicate payments</li>
                  <li>Technical issues that prevent service usage and cannot be resolved</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">Requesting a Refund</h2>
                <p className="text-muted-foreground leading-relaxed">
                  To request a refund, contact us within 7 days of payment at:{" "}
                  <a href="mailto:support@remindswift.com" className="text-primary hover:underline">
                    support@remindswift.com
                  </a>
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">Decision</h2>
                <p className="text-muted-foreground leading-relaxed">
                  All refund decisions are at the sole discretion of RemindSwift.
                </p>
              </section>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Refund;
