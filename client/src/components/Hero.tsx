import { motion } from 'framer-motion';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/hooks/useTheme';
import TypeWriter from '@/components/TypeWriter';
import ParticlesEffect from '@/components/three/ParticlesEffect';
import ThreeDModel from '@/components/three/ThreeDModel';
import { ArrowDown, ExternalLink, Github } from 'lucide-react';

const Hero = () => {
  const { theme } = useTheme();
  const titleAnimation = useScrollAnimation({ threshold: 0.1 });
  const subtitleAnimation = useScrollAnimation({ threshold: 0.1, delay: 200 });
  const descAnimation = useScrollAnimation({ threshold: 0.1, delay: 400 });
  const btnAnimation = useScrollAnimation({ threshold: 0.1, delay: 600 });
  const modelAnimation = useScrollAnimation({ threshold: 0.1, delay: 300 });

  return (
    <section id="home" className="relative min-h-screen flex items-center pt-16 overflow-hidden">
      {/* Background particles */}
      <ParticlesEffect />
      
      {/* Content */}
      <div className="container mx-auto px-4 md:px-6 py-20 grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-10">
        {/* Left Column - Text */}
        <div className="flex flex-col justify-center">
          {/* Greeting */}
          <motion.div
            ref={titleAnimation.ref}
            initial={{ opacity: 0, y: 20 }}
            animate={titleAnimation.isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="mb-2"
          >
            <span className="text-lg md:text-xl font-medium text-primary">
              Hello, I'm a
            </span>
          </motion.div>
          
          {/* Title with gradient text */}
          <motion.h1
            ref={subtitleAnimation.ref}
            initial={{ opacity: 0, y: 20 }}
            animate={subtitleAnimation.isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4"
          >
            <span className="gradient-text">MERN Stack</span>{" "}
            <span className="block mt-1">Developer</span>
          </motion.h1>
          
          {/* TypeWriter with roles */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={subtitleAnimation.isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-6"
          >
            <TypeWriter
              texts={[
                "Frontend Developer",
                "Backend Engineer",
                "UI/UX Designer",
                "React Specialist",
                "Node.js Expert"
              ]}
              className="text-xl md:text-2xl font-medium text-muted-foreground"
            />
          </motion.div>
          
          {/* Description */}
          <motion.p
            ref={descAnimation.ref}
            initial={{ opacity: 0, y: 20 }}
            animate={descAnimation.isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="text-muted-foreground text-base md:text-lg max-w-xl mb-8"
          >
            I craft high-performance, visually stunning web applications using the latest technologies.
            Specializing in creating exceptional user experiences with React, Node.js, and modern design principles.
          </motion.p>
          
          {/* CTA Buttons */}
          <motion.div
            ref={btnAnimation.ref}
            initial={{ opacity: 0, y: 20 }}
            animate={btnAnimation.isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="flex flex-wrap gap-4"
          >
            <Button size="lg" className="rounded-full">
              View Projects <ExternalLink className="ml-2 h-4 w-4" />
            </Button>
            <Button size="lg" variant="outline" className="rounded-full">
              GitHub <Github className="ml-2 h-4 w-4" />
            </Button>
          </motion.div>
          
          {/* Scroll down indicator */}
          <motion.div
            initial={{ opacity: 0, y: 0 }}
            animate={{ opacity: 1, y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatType: "loop" }}
            className="hidden md:flex absolute bottom-10 left-1/2 -translate-x-1/2 items-center flex-col"
          >
            <span className="text-sm mb-2 text-muted-foreground">Scroll Down</span>
            <ArrowDown className="h-6 w-6 text-primary" />
          </motion.div>
        </div>
        
        {/* Right Column - 3D Model */}
        <motion.div
          ref={modelAnimation.ref}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={modelAnimation.isVisible ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
          className="hidden lg:flex items-center justify-center h-[500px]"
        >
          <ThreeDModel />
        </motion.div>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-primary/20 rounded-full filter blur-3xl"></div>
      <div className="absolute -top-10 -left-10 w-64 h-64 bg-secondary/20 rounded-full filter blur-3xl"></div>
    </section>
  );
};

export default Hero;