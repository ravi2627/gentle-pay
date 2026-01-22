import { SEOHead } from "@/components/SEOHead";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Cancellation = () => {
  const currentDate = new Date().toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  return (
    <>
      <SEOHead
        title="Cancellation Policy"
        description="Understand how to cancel your RemindSwift subscription and what happens after cancellation."
        path="/cancellation"
      />
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 container py-16 md:py-24">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl font-bold text-foreground mb-4">Cancellation Policy</h1>
            <p className="text-muted-foreground mb-12">Last updated: {currentDate}</p>

            <div className="prose prose-neutral dark:prose-invert max-w-none space-y-8">
              <p className="text-muted-foreground leading-relaxed">
                You may cancel your subscription at any time from your account dashboard.
              </p>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">Cancellation Effects</h2>
                <ul className="list-disc list-inside text-muted-foreground space-y-2">
                  <li>Your subscription will remain active until the end of the billing period</li>
                  <li>No further charges will be applied after cancellation</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">No Partial Refunds</h2>
                <p className="text-muted-foreground leading-relaxed">
                  We do not offer partial refunds for unused time.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">Need Help?</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Contact us at{" "}
                  <a href="mailto:support@remindswift.com" className="text-primary hover:underline">
                    support@remindswift.com
                  </a>
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

export default Cancellation;
