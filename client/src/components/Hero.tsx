import { motion } from "framer-motion";

const Hero = () => {
  return (
    <section id="home" className="min-h-screen flex items-center pt-20 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-20 right-10 w-64 h-64 bg-primary rounded-full opacity-10 filter blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-20 left-10 w-72 h-72 bg-secondary rounded-full opacity-10 filter blur-3xl animate-pulse-slow" style={{ animationDelay: "2s" }}></div>
      </div>
      
      <div className="container mx-auto px-6 py-12 relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-12">
          <motion.div 
            className="w-full md:w-1/2 space-y-6"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="space-y-2">
              <p className="text-primary font-medium font-['Space_Grotesk']">Hello, I'm</p>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-['Poppins'] leading-tight">
                Alex Morgan
                <span className="block gradient-text">MERN Stack Developer</span>
              </h1>
            </div>
            
            <motion.p 
              className="text-lg md:text-xl text-slate-600 dark:text-slate-300"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              I create exceptional <span className="font-medium text-primary">web experiences</span> 
              that convert visitors into clients. Specialized in React, Node.js, and modern web technologies.
            </motion.p>
            
            <motion.div 
              className="flex flex-wrap gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <a 
                href="#contact" 
                className="px-8 py-3 rounded-full bg-primary hover:bg-primary/90 text-white font-medium transition-all transform hover:-translate-y-1 shadow-lg shadow-primary/20"
              >
                Hire Me
              </a>
              <a 
                href="#projects" 
                className="px-8 py-3 rounded-full bg-transparent border-2 border-primary text-primary dark:text-primary/90 font-medium hover:bg-primary/10 transition-all transform hover:-translate-y-1"
              >
                View Projects
              </a>
            </motion.div>
            
            <motion.div 
              className="flex items-center gap-6 pt-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
            >
              <a href="#" className="text-slate-600 hover:text-primary dark:text-slate-400 dark:hover:text-primary/90 transition-colors">
                <i className="bx bxl-github text-2xl"></i>
              </a>
              <a href="#" className="text-slate-600 hover:text-primary dark:text-slate-400 dark:hover:text-primary/90 transition-colors">
                <i className="bx bxl-linkedin text-2xl"></i>
              </a>
              <a href="#" className="text-slate-600 hover:text-primary dark:text-slate-400 dark:hover:text-primary/90 transition-colors">
                <i className="bx bxl-twitter text-2xl"></i>
              </a>
              <a href="#" className="text-slate-600 hover:text-primary dark:text-slate-400 dark:hover:text-primary/90 transition-colors">
                <i className="bx bxl-dribbble text-2xl"></i>
              </a>
            </motion.div>
          </motion.div>
          
          <motion.div 
            className="w-full md:w-1/2 flex justify-center"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div className="relative">
              <div className="w-64 h-64 md:w-80 md:h-80 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 absolute -top-6 -left-6"></div>
              <div className="w-64 h-64 md:w-80 md:h-80 glass rounded-2xl overflow-hidden relative animate-float">
                <img 
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&h=500&fit=crop&crop=faces" 
                  alt="Alex Morgan" 
                  className="w-full h-full object-cover" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent"></div>
                
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div className="flex flex-wrap gap-2">
                    <span className="text-xs bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">React</span>
                    <span className="text-xs bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">Node.js</span>
                    <span className="text-xs bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">MongoDB</span>
                    <span className="text-xs bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">Express</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
