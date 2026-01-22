import { SEOHead } from "@/components/SEOHead";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Privacy = () => {
  const currentDate = new Date().toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  return (
    <>
      <SEOHead
        title="Privacy Policy"
        description="Learn how RemindSwift collects, uses, and protects your data. We prioritize your privacy and security."
        path="/privacy"
      />
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 container py-16 md:py-24">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl font-bold text-foreground mb-4">Privacy Policy</h1>
            <p className="text-muted-foreground mb-12">Last updated: {currentDate}</p>

            <div className="prose prose-neutral dark:prose-invert max-w-none space-y-8">
              <p className="text-muted-foreground leading-relaxed">
                Welcome to RemindSwift ("we", "our", "us"). Your privacy is important to us. This Privacy Policy explains how we collect, use, and protect your information when you use our website and services at https://remindswift.com.
              </p>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">Information We Collect</h2>
                <p className="text-muted-foreground mb-3">We may collect the following information:</p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2">
                  <li>Name and email address</li>
                  <li>Account and login information</li>
                  <li>Usage data (pages visited, features used)</li>
                  <li>Email interaction data (delivery, opens, clicks)</li>
                  <li>Device and browser information</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">How We Use Your Information</h2>
                <p className="text-muted-foreground mb-3">We use your information to:</p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2">
                  <li>Provide and operate our services</li>
                  <li>Send reminders, notifications, and service emails</li>
                  <li>Improve product performance and user experience</li>
                  <li>Ensure security and prevent abuse</li>
                  <li>Comply with legal obligations</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">Email Tracking</h2>
                <p className="text-muted-foreground leading-relaxed">
                  We may track email delivery, opens, and clicks to improve reminder reliability and analytics. This data is used only for service functionality.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">Data Sharing</h2>
                <p className="text-muted-foreground mb-3">
                  We do not sell your personal data. We may share data with trusted third-party services such as:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2">
                  <li>Email delivery providers (e.g. Resend)</li>
                  <li>Analytics and infrastructure providers</li>
                  <li>Authentication and database services</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">Data Security</h2>
                <p className="text-muted-foreground leading-relaxed">
                  We implement industry-standard security measures to protect your data. However, no method of transmission over the internet is 100% secure.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">Cookies</h2>
                <p className="text-muted-foreground leading-relaxed">
                  We may use cookies and similar technologies to enhance user experience and analyze usage.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">Your Rights</h2>
                <p className="text-muted-foreground mb-3">Depending on your location, you may have the right to:</p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2">
                  <li>Access your data</li>
                  <li>Request correction or deletion</li>
                  <li>Withdraw consent</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">Children's Privacy</h2>
                <p className="text-muted-foreground leading-relaxed">
                  RemindSwift is not intended for children under 13 years of age.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">Changes to This Policy</h2>
                <p className="text-muted-foreground leading-relaxed">
                  We may update this Privacy Policy from time to time. Updates will be posted on this page.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">Contact Us</h2>
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

export default Privacy;
