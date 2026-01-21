import { useState, useEffect, useCallback } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import logo from "@/assets/logo.png";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "/", label: "Home", anchor: null },
    { href: "/#pricing", label: "Pricing", anchor: "pricing" },
    { href: "/#how-it-works", label: "How it Works", anchor: "how-it-works" },
    { href: "/about", label: "About", anchor: null },
    { href: "/contact", label: "Contact", anchor: null },
  ];

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/" && !location.hash;
    return location.hash === `#${path.split("#")[1]}`;
  };

  const handleNavClick = useCallback((e: React.MouseEvent<HTMLAnchorElement>, link: { href: string; anchor: string | null }) => {
    if (link.anchor) {
      e.preventDefault();
      
      if (location.pathname === "/") {
        const element = document.getElementById(link.anchor);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
          window.history.pushState(null, "", `#${link.anchor}`);
        }
      } else {
        navigate("/");
        setTimeout(() => {
          const element = document.getElementById(link.anchor!);
          if (element) {
            element.scrollIntoView({ behavior: "smooth" });
            window.history.pushState(null, "", `#${link.anchor}`);
          }
        }, 100);
      }
    }
    setIsMenuOpen(false);
  }, [location.pathname, navigate]);

  return (
    <motion.header 
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        isScrolled 
          ? "bg-background/80 backdrop-blur-xl border-b border-border/50 shadow-sm" 
          : "bg-transparent"
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container flex h-16 md:h-18 lg:h-20 items-center justify-between gap-4">
        {/* Logo - Responsive & Premium */}
        <Link 
          to="/" 
          className="flex items-center group flex-shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-md"
          aria-label="RemindSwift Home"
        >
          <img 
            src={logo} 
            alt="RemindSwift – Invoice Reminder SaaS" 
            className="h-9 sm:h-10 md:h-11 lg:h-12 w-auto object-contain transition-transform duration-200 group-hover:scale-[1.02]"
            loading="eager"
            decoding="async"
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center space-x-1">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => handleNavClick(e, link)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                isActive(link.href)
                  ? "text-primary bg-primary/10"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              }`}
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Desktop Auth Buttons */}
        <div className="hidden md:flex items-center space-x-3">
          <Link to="/login">
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
              Log in
            </Button>
          </Link>
          <Link to="/signup">
            <Button size="sm" className="bg-gradient-to-r from-primary to-accent-foreground hover:opacity-90 shadow-lg shadow-primary/20 px-6">
              Start Free
            </Button>
          </Link>
        </div>

        {/* Mobile Auth + Menu */}
        <div className="lg:hidden flex items-center gap-2">
          {/* Mobile Login Button - Always visible */}
          <Link to="/login" className="hidden sm:block">
            <Button size="sm" variant="ghost" className="text-foreground font-medium min-h-[44px] px-4">
              Login
            </Button>
          </Link>
          <Link to="/signup" className="sm:hidden">
            <Button size="sm" className="bg-primary hover:bg-primary/90 min-h-[44px] px-4 text-sm font-medium">
              Sign Up
            </Button>
          </Link>
          
          {/* Mobile Menu Button */}
          <button
            className="p-2.5 rounded-xl hover:bg-muted/50 active:bg-muted transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            className="lg:hidden absolute top-full left-0 right-0 bg-background/95 backdrop-blur-xl border-b border-border/50 shadow-lg"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <nav className="container py-6 flex flex-col space-y-2">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link)}
                  className={`px-4 py-3 rounded-lg text-sm font-medium transition-all min-h-[48px] flex items-center ${
                    isActive(link.href)
                      ? "text-primary bg-primary/10"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  }`}
                >
                  {link.label}
                </a>
              ))}
              <div className="flex flex-col space-y-2 pt-4 mt-4 border-t border-border/50">
                <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start min-h-[48px]">
                    Log in
                  </Button>
                </Link>
                <Link to="/signup" onClick={() => setIsMenuOpen(false)}>
                  <Button className="w-full bg-gradient-to-r from-primary to-accent-foreground min-h-[48px]">
                    Start Free
                  </Button>
                </Link>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Header;
