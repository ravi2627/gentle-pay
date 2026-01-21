import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Disclaimer = () => {
  const currentDate = new Date().toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 container py-16 md:py-24">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold text-foreground mb-4">Disclaimer</h1>
          <p className="text-muted-foreground mb-12">Last updated: {currentDate}</p>

          <div className="prose prose-neutral dark:prose-invert max-w-none space-y-8">
            <p className="text-muted-foreground leading-relaxed">
              RemindSwift provides reminder and notification tools "as is" and "as available".
            </p>

            <p className="text-muted-foreground leading-relaxed">
              We do not guarantee that reminders will always be delivered or acted upon. Users are responsible for verifying critical deadlines independently.
            </p>

            <p className="text-muted-foreground leading-relaxed">
              RemindSwift is not responsible for losses caused by missed reminders or email delivery issues.
            </p>

            <p className="text-muted-foreground leading-relaxed">
              Use the service at your own discretion.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Disclaimer;
