import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Zap, Mail, Users, Shield, Globe, Sparkles, CheckCircle, Clock, Lock, Server } from "lucide-react";

const About = () => {
  const whyChooseUs = [
    { 
      icon: Sparkles, 
      title: "Simple and Easy-to-Use", 
      description: "Clean interface designed for quick setup and daily use without complexity." 
    },
    { 
      icon: Shield, 
      title: "Reliable and Secure", 
      description: "Enterprise-grade email delivery with end-to-end security for your data." 
    },
    { 
      icon: Clock, 
      title: "Automated Follow-Ups", 
      description: "Set it once and let RemindSwift handle your invoice reminders automatically." 
    },
    { 
      icon: Users, 
      title: "Built for Your Business", 
      description: "Perfect for freelancers, small businesses, and agencies of all sizes." 
    },
    { 
      icon: Lock, 
      title: "Privacy-Focused", 
      description: "GDPR-friendly practices with transparent data handling policies." 
    },
    { 
      icon: Zap, 
      title: "No Technical Setup", 
      description: "Get started in minutes without any coding or technical knowledge." 
    },
  ];

  const trustSignals = [
    { icon: Server, text: "Secure email infrastructure" },
    { icon: CheckCircle, text: "Domain-verified email sending" },
    { icon: Shield, text: "Industry-standard security practices" },
    { icon: Lock, text: "GDPR-friendly data handling" },
    { icon: Globe, text: "Reliable uptime and delivery" },
  ];

  return (
    <>
      <Helmet>
        <title>About RemindSwift | Smart Reminder & Follow-Up Platform</title>
        <meta 
          name="description" 
          content="RemindSwift helps individuals and businesses send automated reminders, invoice follow-ups, and notifications with reliable email delivery." 
        />
      </Helmet>
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1">
          {/* Hero Section */}
          <section className="container py-16 md:py-24">
            <div className="max-w-3xl mx-auto text-center">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent-foreground flex items-center justify-center shadow-lg shadow-primary/20 mx-auto mb-6">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
                About RemindSwift
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed">
                RemindSwift is a smart reminder software and notification platform designed to help individuals and businesses send automated email reminders, invoice follow-ups, and payment reminders without manual effort.
              </p>
            </div>
          </section>

          {/* Our Story Section */}
          <section className="bg-muted/30 py-16">
            <div className="container">
              <div className="max-w-3xl mx-auto">
                <h2 className="text-3xl font-bold text-foreground mb-6 text-center">Our Story</h2>
                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  <p>
                    RemindSwift was born from a simple frustration: the stress of managing follow-ups manually. Too many invoices were going unpaid, important deadlines were being missed, and valuable time was being spent on repetitive reminder tasks.
                  </p>
                  <p>
                    We set out to build a solution that would handle automated notifications reliably and professionally. Our goal was to create a platform that anyone could use—without technical expertise—to send timely payment reminders and invoice follow-ups.
                  </p>
                  <p>
                    Today, RemindSwift is built on modern, secure, and scalable technology. We've designed every feature with simplicity and reliability in mind, ensuring that your reminders reach the right people at the right time, every time.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Mission Section */}
          <section className="container py-16">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold text-foreground mb-6">Our Mission</h2>
              <p className="text-muted-foreground leading-relaxed">
                Our mission is to make reminder software fast, effortless, and dependable for everyone. We focus on simplicity, speed, and deliverability so you can focus on growing your business while we handle your email reminders and payment follow-ups.
              </p>
            </div>
          </section>

          {/* Why Choose RemindSwift Section */}
          <section className="bg-muted/30 py-16">
            <div className="container">
              <div className="max-w-4xl mx-auto">
                <h2 className="text-3xl font-bold text-foreground mb-4 text-center">
                  Why Choose RemindSwift
                </h2>
                <p className="text-muted-foreground text-center mb-10 max-w-2xl mx-auto">
                  Discover why businesses trust RemindSwift for their automated notifications and invoice reminder needs.
                </p>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {whyChooseUs.map((item, index) => (
                    <div 
                      key={index} 
                      className="p-6 rounded-xl bg-background border border-border hover:border-primary/30 hover:shadow-lg transition-all"
                    >
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                        <item.icon className="w-6 h-6 text-primary" />
                      </div>
                      <h3 className="text-lg font-semibold text-foreground mb-2">{item.title}</h3>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Who It's For Section */}
          <section className="container py-16">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold text-foreground mb-6">Who It's For</h2>
              <p className="text-muted-foreground leading-relaxed mb-8">
                RemindSwift is built for anyone who needs reliable automated reminders and payment follow-ups:
              </p>
              <div className="grid sm:grid-cols-2 gap-4 text-left">
                {[
                  "Freelancers and solopreneurs",
                  "Small businesses",
                  "Agencies and service providers",
                  "Consultants and coaches",
                  "Creative professionals",
                  "Anyone who wants hassle-free reminders"
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                    <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                    <span className="text-muted-foreground">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Trust Signals Section */}
          <section className="bg-muted/30 py-16">
            <div className="container">
              <div className="max-w-3xl mx-auto">
                <h2 className="text-3xl font-bold text-foreground mb-4 text-center">
                  Built on Trust
                </h2>
                <p className="text-muted-foreground text-center mb-10">
                  Your data security and email deliverability are our top priorities.
                </p>
                <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {trustSignals.map((item, index) => (
                    <div 
                      key={index} 
                      className="flex items-center gap-3 p-4 rounded-xl bg-background border border-border"
                    >
                      <item.icon className="w-5 h-5 text-primary flex-shrink-0" />
                      <span className="text-sm text-foreground font-medium">{item.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Commitment Section */}
          <section className="container py-16">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold text-foreground mb-6">Our Commitment</h2>
              <p className="text-muted-foreground leading-relaxed">
                We are committed to protecting user data, ensuring reliable email delivery, and continuously improving the platform based on real user needs. Your trust is our foundation.
              </p>
            </div>
          </section>

          {/* Contact Section */}
          <section className="bg-muted/30 py-16">
            <div className="container">
              <div className="max-w-3xl mx-auto text-center">
                <h2 className="text-3xl font-bold text-foreground mb-6">Get in Touch</h2>
                <p className="text-muted-foreground mb-4">Have questions or feedback about our reminder software?</p>
                <p className="text-muted-foreground">
                  Email us at:{" "}
                  <a href="mailto:support@remindswift.com" className="text-primary hover:underline font-medium">
                    support@remindswift.com
                  </a>
                </p>
                <p className="text-muted-foreground mt-8">Thank you for trusting RemindSwift.</p>
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default About;
