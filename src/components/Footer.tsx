import { Link } from "react-router-dom";
import logo from "@/assets/logo.png";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    product: [
      { label: "Pricing", href: "/pricing" },
      { label: "How it Works", href: "/how-it-works" },
      { label: "FAQ", href: "/faq" },
      { label: "About", href: "/about" },
      { label: "Contact", href: "/contact" },
    ],
    legal: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
      { label: "Refund Policy", href: "/refund" },
      { label: "Cancellation Policy", href: "/cancellation" },
      { label: "Disclaimer", href: "/disclaimer" },
    ],
  };

  return (
    <footer className="border-t border-border/50 bg-gradient-to-b from-background to-muted/30">
      <div className="container py-16">
        <div className="grid md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link to="/" className="inline-block mb-4">
              <img 
                src={logo} 
                alt="RemindSwift Logo" 
                className="h-10 w-auto"
              />
            </Link>
            <p className="text-muted-foreground max-w-sm leading-relaxed">
              Polite reminders. Faster payments. Automated invoice reminders for freelancers and small agencies.
            </p>
          </div>

          {/* Product Links */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Product</h4>
            <ul className="space-y-3">
              {footerLinks.product.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Legal</h4>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-border/50 mt-12 pt-8 text-center">
          <p className="text-sm text-muted-foreground">
            © {currentYear} RemindSwift. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
