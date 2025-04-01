import { motion } from 'framer-motion';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="py-8 border-t border-slate-200 dark:border-slate-800">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <motion.div 
            className="mb-4 md:mb-0"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <a href="#home" className="font-['Space_Grotesk'] font-bold text-2xl gradient-text">
              Alex<span className="text-primary">.</span>dev
            </a>
          </motion.div>
          
          <motion.div 
            className="text-slate-600 dark:text-slate-400 text-sm text-center md:text-right"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <p>&copy; {currentYear} Alex Morgan. All rights reserved.</p>
            <p>MERN Stack Developer</p>
          </motion.div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
