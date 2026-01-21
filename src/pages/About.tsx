import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Zap, Mail, Users, Shield, Globe, Sparkles } from "lucide-react";

const About = () => {
  const offerings = [
    "Automated email reminders",
    "Invoice and payment follow-ups",
    "Reliable email delivery using modern infrastructure",
    "Simple dashboard for managing reminders",
    "Secure and privacy-focused platform",
  ];

  const audiences = [
    "Freelancers and solopreneurs",
    "Small businesses",
    "Agencies and service providers",
    "Anyone who wants hassle-free reminders",
  ];

  const whyUs = [
    { icon: Sparkles, text: "Clean and easy-to-use interface" },
    { icon: Globe, text: "Global-ready email delivery" },
    { icon: Zap, text: "No complex setup" },
    { icon: Shield, text: "Built with modern, secure technologies" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="container py-16 md:py-24">
          <div className="max-w-3xl mx-auto text-center">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent-foreground flex items-center justify-center shadow-lg shadow-primary/20 mx-auto mb-6">
              <Zap className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">About RemindSwift</h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              RemindSwift is a simple and reliable reminder and notification platform designed to help individuals and businesses never miss important follow-ups, invoices, or deadlines.
            </p>
          </div>
        </section>

        {/* Understanding Section */}
        <section className="container pb-16">
          <div className="max-w-3xl mx-auto">
            <p className="text-muted-foreground leading-relaxed text-center">
              We understand that timely communication matters. Whether it's sending invoice reminders, payment follow-ups, or important notifications, RemindSwift helps you stay organized and professional without manual effort.
            </p>
          </div>
        </section>

        {/* Mission Section */}
        <section className="bg-muted/30 py-16">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold text-foreground mb-6">Our Mission</h2>
              <p className="text-muted-foreground leading-relaxed">
                Our mission is to make reminders fast, effortless, and dependable for everyone. We focus on simplicity, speed, and deliverability so you can focus on growing your work while we handle the reminders.
              </p>
            </div>
          </div>
        </section>

        {/* What We Offer Section */}
        <section className="container py-16">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-foreground mb-8 text-center">What We Offer</h2>
            <ul className="space-y-4">
              {offerings.map((item, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Mail className="w-3 h-3 text-primary" />
                  </div>
                  <span className="text-muted-foreground">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Who It's For Section */}
        <section className="bg-muted/30 py-16">
          <div className="container">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold text-foreground mb-8 text-center">Who It's For</h2>
              <p className="text-muted-foreground mb-6 text-center">RemindSwift is built for:</p>
              <ul className="space-y-4">
                {audiences.map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Users className="w-3 h-3 text-primary" />
                    </div>
                    <span className="text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Why RemindSwift Section */}
        <section className="container py-16">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-foreground mb-8 text-center">Why RemindSwift</h2>
            <div className="grid sm:grid-cols-2 gap-6">
              {whyUs.map((item, index) => (
                <div key={index} className="flex items-center gap-4 p-4 rounded-xl bg-muted/50 border border-border">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <item.icon className="w-5 h-5 text-primary" />
                  </div>
                  <span className="text-foreground font-medium">{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Commitment Section */}
        <section className="bg-muted/30 py-16">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold text-foreground mb-6">Our Commitment</h2>
              <p className="text-muted-foreground leading-relaxed">
                We are committed to protecting user data, ensuring reliable delivery, and continuously improving the platform based on real user needs.
              </p>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="container py-16">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-foreground mb-6">Get in Touch</h2>
            <p className="text-muted-foreground mb-4">Have questions or feedback?</p>
            <p className="text-muted-foreground">
              Email us at:{" "}
              <a href="mailto:support@remindswift.com" className="text-primary hover:underline font-medium">
                support@remindswift.com
              </a>
            </p>
            <p className="text-muted-foreground mt-8">Thank you for trusting RemindSwift.</p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default About;
