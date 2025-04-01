import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../hooks/useTheme";

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Check if page is scrolled for navbar styles
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-50 py-4 px-6 glass`}
    >
      <div className="container mx-auto">
        <div className="flex justify-between items-center">
          <a href="#home" className="font-['Space_Grotesk'] font-bold text-2xl gradient-text">
            Alex<span className="text-primary">.</span>dev
          </a>
          
          <div className="hidden md:flex items-center space-x-8">
            <a href="#home" className="font-medium hover:text-primary transition-colors">Home</a>
            <a href="#services" className="font-medium hover:text-primary transition-colors">Services</a>
            <a href="#projects" className="font-medium hover:text-primary transition-colors">Projects</a>
            <a href="#testimonials" className="font-medium hover:text-primary transition-colors">Testimonials</a>
            <a href="#contact" className="font-medium hover:text-primary transition-colors">Contact</a>
          </div>
          
          <div className="flex items-center space-x-4">
            <button 
              onClick={toggleTheme}
              aria-label="Toggle Theme" 
              className="w-10 h-10 rounded-full flex items-center justify-center bg-slate-200 dark:bg-slate-800"
            >
              <i className="bx bx-sun text-xl hidden dark:inline"></i>
              <i className="bx bx-moon text-xl dark:hidden"></i>
            </button>
            
            <button 
              onClick={toggleMobileMenu}
              className="md:hidden w-10 h-10 flex items-center justify-center" 
              aria-label="Toggle Mobile Menu"
            >
              <i className={`bx ${mobileMenuOpen ? 'bx-x' : 'bx-menu'} text-2xl`}></i>
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden mt-4 glass rounded-lg p-4"
          >
            <div className="flex flex-col space-y-4">
              <a 
                href="#home" 
                className="font-medium hover:text-primary transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </a>
              <a 
                href="#services" 
                className="font-medium hover:text-primary transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Services
              </a>
              <a 
                href="#projects" 
                className="font-medium hover:text-primary transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Projects
              </a>
              <a 
                href="#testimonials" 
                className="font-medium hover:text-primary transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Testimonials
              </a>
              <a 
                href="#contact" 
                className="font-medium hover:text-primary transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Contact
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
