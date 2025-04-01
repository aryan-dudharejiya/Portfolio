import { motion } from 'framer-motion';
import { Github, Linkedin, Twitter, Mail, ArrowUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };
  
  return (
    <footer className="bg-card border-t">
      <div className="container mx-auto px-4 md:px-6 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          {/* Brand */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold">
              <span>John</span>
              <span className="gradient-text">Doe</span>
            </h3>
            <p className="text-muted-foreground max-w-xs">
              Creating exceptional digital experiences with cutting-edge web technologies.
            </p>
            
            {/* Social links */}
            <div className="flex space-x-4 mt-6">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Github size={20} />
                <span className="sr-only">GitHub</span>
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Linkedin size={20} />
                <span className="sr-only">LinkedIn</span>
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Twitter size={20} />
                <span className="sr-only">Twitter</span>
              </a>
              <a href="mailto:contact@johndoe.com" className="text-muted-foreground hover:text-primary transition-colors">
                <Mail size={20} />
                <span className="sr-only">Email</span>
              </a>
            </div>
          </div>
          
          {/* Navigation */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Navigation</h4>
            <nav className="space-y-2">
              <a href="#home" className="block text-muted-foreground hover:text-primary transition-colors">Home</a>
              <a href="#services" className="block text-muted-foreground hover:text-primary transition-colors">Services</a>
              <a href="#skills" className="block text-muted-foreground hover:text-primary transition-colors">Skills</a>
              <a href="#projects" className="block text-muted-foreground hover:text-primary transition-colors">Projects</a>
              <a href="#testimonials" className="block text-muted-foreground hover:text-primary transition-colors">Testimonials</a>
              <a href="#contact" className="block text-muted-foreground hover:text-primary transition-colors">Contact</a>
            </nav>
          </div>
          
          {/* Services */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Services</h4>
            <ul className="space-y-2">
              <li className="text-muted-foreground">UI/UX Design</li>
              <li className="text-muted-foreground">Frontend Development</li>
              <li className="text-muted-foreground">Backend Development</li>
              <li className="text-muted-foreground">Mobile-First Development</li>
              <li className="text-muted-foreground">Database Design</li>
            </ul>
          </div>
          
          {/* Contact */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact</h4>
            <ul className="space-y-2">
              <li className="text-muted-foreground">San Francisco, CA, USA</li>
              <li className="text-muted-foreground">+1 (234) 567-890</li>
              <li className="text-muted-foreground">contact@johndoe.com</li>
            </ul>
            
            {/* Scroll to top button */}
            <Button 
              variant="outline" 
              size="icon" 
              className="mt-6"
              onClick={scrollToTop}
              aria-label="Scroll to top"
            >
              <ArrowUp size={18} />
            </Button>
          </div>
        </div>
        
        {/* Bottom bar */}
        <div className="mt-16 pt-8 border-t">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <p className="text-muted-foreground text-sm">
              © {currentYear} John Doe. All rights reserved.
            </p>
            
            <div className="mt-4 sm:mt-0 flex space-x-4 text-sm text-muted-foreground">
              <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
              <span className="select-none">•</span>
              <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;