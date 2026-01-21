import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Mail, Globe } from "lucide-react";

const Contact = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 container py-16 md:py-24">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold text-foreground mb-4">Contact Us</h1>
          <p className="text-xl text-muted-foreground mb-12">We're here to help 👋</p>

          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Mail className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <a 
                  href="mailto:support@remindswift.com" 
                  className="text-lg font-medium text-foreground hover:text-primary transition-colors"
                >
                  support@remindswift.com
                </a>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Globe className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Website</p>
                <a 
                  href="https://remindswift.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-lg font-medium text-foreground hover:text-primary transition-colors"
                >
                  remindswift.com
                </a>
              </div>
            </div>
          </div>

          <div className="mt-12 p-6 rounded-2xl bg-muted/50 border border-border">
            <p className="text-muted-foreground leading-relaxed">
              For support, billing questions, or feedback, please email us and we'll get back to you as soon as possible.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Contact;
