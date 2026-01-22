import { SEOHead } from "@/components/SEOHead";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Terms = () => {
  const currentDate = new Date().toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  return (
    <>
      <SEOHead
        title="Terms and Conditions"
        description="Read the terms and conditions for using RemindSwift services. By using our service, you agree to these terms."
        path="/terms"
      />
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 container py-16 md:py-24">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl font-bold text-foreground mb-4">Terms and Conditions</h1>
            <p className="text-muted-foreground mb-12">Last updated: {currentDate}</p>

            <div className="prose prose-neutral dark:prose-invert max-w-none space-y-8">
              <p className="text-muted-foreground leading-relaxed">
                By accessing or using RemindSwift, you agree to be bound by these Terms and Conditions.
              </p>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">Use of Service</h2>
                <p className="text-muted-foreground leading-relaxed">
                  You must be at least 18 years old to use our services. You agree to use RemindSwift only for lawful purposes.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">Account Responsibility</h2>
                <p className="text-muted-foreground leading-relaxed">
                  You are responsible for maintaining the confidentiality of your account and all activities under it.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">Email Usage</h2>
                <p className="text-muted-foreground leading-relaxed">
                  You agree to send reminders and emails only to recipients you have permission to contact. Abuse, spam, or illegal use is strictly prohibited.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">Service Availability</h2>
                <p className="text-muted-foreground leading-relaxed">
                  We strive to provide uninterrupted service but do not guarantee that the service will always be available or error-free.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">Limitation of Liability</h2>
                <p className="text-muted-foreground leading-relaxed">
                  RemindSwift shall not be liable for any indirect, incidental, or consequential damages arising from the use of our services.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">Termination</h2>
                <p className="text-muted-foreground leading-relaxed">
                  We reserve the right to suspend or terminate accounts that violate these terms.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">Changes to Terms</h2>
                <p className="text-muted-foreground leading-relaxed">
                  We may update these Terms at any time. Continued use of the service means you accept the updated terms.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">Governing Law</h2>
                <p className="text-muted-foreground leading-relaxed">
                  These Terms are governed by applicable international laws.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">Contact</h2>
                <p className="text-muted-foreground leading-relaxed">
                  If you have any questions, contact us at:{" "}
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

export default Terms;
