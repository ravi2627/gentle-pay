import { SEOHead } from "@/components/SEOHead";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroSection from "@/components/home/HeroSection";
import ProblemSection from "@/components/home/ProblemSection";
import HowItWorksSection from "@/components/home/HowItWorksSection";
import FeatureSection from "@/components/home/FeatureSection";
import PricingPreview from "@/components/home/PricingPreview";
import FAQSection from "@/components/home/FAQSection";
import CTASection from "@/components/home/CTASection";

const Index = () => {
  return (
    <>
      <SEOHead
        title="RemindSwift – Smart Invoice Reminder Tool"
        description="Send polite invoice reminders automatically, track email opens, and get paid faster. Perfect for freelancers and small agencies."
        path="/"
      />
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">
          <HeroSection />
          <ProblemSection />
          <HowItWorksSection />
          <FeatureSection />
          <PricingPreview />
          <FAQSection />
          <CTASection />
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Index;
