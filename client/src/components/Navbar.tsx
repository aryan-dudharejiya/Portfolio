import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/hooks/useTheme";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { Sun, Moon, Menu, X } from "lucide-react";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const isMobile = useIsMobile();

  // Navigation links
  const navLinks = [
    { href: "#home", label: "Home" },
    { href: "#services", label: "Services" },
    { href: "#skills", label: "Skills" },
    { href: "#projects", label: "Projects" },
    { href: "#testimonials", label: "Testimonials" },
    { href: "#contact", label: "Contact" },
  ];

  // Track scroll position for navbar styling
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }

      // Update active section based on scroll position
      const sections = navLinks.map((link) => link.href.substring(1));
      const scrollPosition = window.scrollY + 100; // Offset to trigger earlier

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = document.getElementById(sections[i]);
        if (section && section.offsetTop <= scrollPosition) {
          setActiveSection(sections[i]);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [navLinks]);

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Close mobile menu when a link is clicked
  const handleNavLinkClick = () => {
    if (isMobileMenuOpen) {
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-background/80 backdrop-blur-lg shadow-sm border-b"
            : "bg-transparent"
        }`}
      >
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <a href="#home" className="text-xl md:text-2xl font-bold">
              <span>Aryan</span>
              <span className="gradient-text">Dudharejiya</span>
            </a>

            {/* Desktop navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              {navLinks.map(({ href, label }) => (
                <a
                  key={href}
                  href={href}
                  className={`nav-link transition-colors duration-300 ${
                    activeSection === href.substring(1)
                      ? "text-primary font-medium"
                      : "text-foreground/80 hover:text-primary"
                  }`}
                >
                  {label}
                </a>
              ))}
            </nav>

            {/* Theme toggle & mobile menu button */}
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
                className="mr-2"
              >
                {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
              </Button>

              <Button
                variant="outline"
                size="sm"
                className="hidden md:flex"
                onClick={() =>
                  document
                    .getElementById("contact")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
              >
                Get in Touch
              </Button>

              <Button
                variant="ghost"
                size="icon"
                onClick={toggleMobileMenu}
                aria-label="Toggle menu"
                className="md:hidden"
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile navigation overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-background/95 backdrop-blur-md md:hidden"
          >
            <div className="flex flex-col h-full pt-20 pb-6 px-6">
              <nav className="flex flex-col space-y-6 items-center justify-center flex-1">
                {navLinks.map(({ href, label }) => (
                  <motion.a
                    key={href}
                    href={href}
                    className={`text-xl ${
                      activeSection === href.substring(1)
                        ? "text-primary font-medium"
                        : "text-foreground/80"
                    }`}
                    onClick={handleNavLinkClick}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      delay:
                        0.1 * navLinks.findIndex((link) => link.href === href),
                    }}
                  >
                    {label}
                  </motion.a>
                ))}
              </nav>

              <div className="mt-auto">
                <Button
                  className="w-full"
                  onClick={() => {
                    document
                      .getElementById("contact")
                      ?.scrollIntoView({ behavior: "smooth" });
                    handleNavLinkClick();
                  }}
                >
                  Get in Touch
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
