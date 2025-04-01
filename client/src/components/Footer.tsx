import { motion } from 'framer-motion';
import { Github, Linkedin, Twitter, Mail, ArrowUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <footer className="bg-muted/30 py-12 relative">
      <div className="container mx-auto px-4 md:px-6">
        {/* Back to top button */}
        <div className="absolute -top-5 left-1/2 -translate-x-1/2">
          <Button
            onClick={scrollToTop}
            size="icon"
            className="rounded-full h-10 w-10 shadow-lg"
          >
            <ArrowUp className="h-5 w-5" />
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* First column - Logo & Description */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold">
              <span className="gradient-text">Dev</span>Portfolio
            </h3>
            <p className="text-muted-foreground max-w-xs">
              Creating seamless, beautiful and functional web experiences. 
              Specializing in the MERN stack and modern web technologies.
            </p>
            
            {/* Social Links */}
            <div className="flex space-x-4 mt-6">
              <motion.a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ y: -5 }}
                className="bg-background p-2 rounded-full text-foreground hover:text-primary transition-colors"
              >
                <Github className="h-5 w-5" />
              </motion.a>
              <motion.a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ y: -5 }}
                className="bg-background p-2 rounded-full text-foreground hover:text-primary transition-colors"
              >
                <Linkedin className="h-5 w-5" />
              </motion.a>
              <motion.a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ y: -5 }}
                className="bg-background p-2 rounded-full text-foreground hover:text-primary transition-colors"
              >
                <Twitter className="h-5 w-5" />
              </motion.a>
              <motion.a
                href="mailto:example@email.com"
                whileHover={{ y: -5 }}
                className="bg-background p-2 rounded-full text-foreground hover:text-primary transition-colors"
              >
                <Mail className="h-5 w-5" />
              </motion.a>
            </div>
          </div>
          
          {/* Second column - Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Quick Links</h4>
            <div className="grid grid-cols-2 gap-2">
              <a href="#home" className="text-muted-foreground hover:text-primary transition-colors">Home</a>
              <a href="#services" className="text-muted-foreground hover:text-primary transition-colors">Services</a>
              <a href="#skills" className="text-muted-foreground hover:text-primary transition-colors">Skills</a>
              <a href="#projects" className="text-muted-foreground hover:text-primary transition-colors">Projects</a>
              <a href="#testimonials" className="text-muted-foreground hover:text-primary transition-colors">Testimonials</a>
              <a href="#contact" className="text-muted-foreground hover:text-primary transition-colors">Contact</a>
            </div>
          </div>
          
          {/* Third column - Contact Info */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Contact Info</h4>
            <div className="space-y-2">
              <p className="text-muted-foreground">Email: example@email.com</p>
              <p className="text-muted-foreground">Phone: +1 (555) 123-4567</p>
              <p className="text-muted-foreground">Location: San Francisco, CA</p>
            </div>
          </div>
        </div>
        
        {/* Copyright */}
        <div className="border-t border-border/40 mt-10 pt-6 text-center text-sm text-muted-foreground">
          <p>© {currentYear} DevPortfolio. All rights reserved.</p>
          <p className="mt-1">
            <span className="text-primary">Designed & Built</span> with passion
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;