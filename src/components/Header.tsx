import { useState, useEffect, useCallback } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, BellRing } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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
      
      // If we're on the homepage, scroll to the section
      if (location.pathname === "/") {
        const element = document.getElementById(link.anchor);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
          window.history.pushState(null, "", `#${link.anchor}`);
        }
      } else {
        // Navigate to homepage then scroll
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
      <div className="container flex h-20 items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent-foreground flex items-center justify-center shadow-lg shadow-primary/20 group-hover:shadow-primary/30 transition-shadow">
            <BellRing className="w-5 h-5 text-white animate-[wiggle_1s_ease-in-out_infinite]" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
            RemindSwift
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1">
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
        <div className="md:hidden flex items-center gap-2">
          {/* Mobile Login Button - Always visible */}
          <Link to="/login">
            <Button size="sm" variant="ghost" className="text-foreground font-medium min-h-[40px]">
              Login
            </Button>
          </Link>
          
          {/* Mobile Menu Button */}
          <button
            className="p-2 rounded-lg hover:bg-muted/50 transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            className="md:hidden absolute top-full left-0 right-0 bg-background/95 backdrop-blur-xl border-b border-border/50 shadow-lg"
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
