import { useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { useIsMobile } from '@/hooks/use-mobile';
import { useTheme } from '@/hooks/useTheme';
import TypeWriter from '@/components/TypeWriter';
import ThreeDModel from '@/components/three/ThreeDModel';
import { Button } from '@/components/ui/button';
import { ArrowDownCircle, Github, Linkedin, Twitter } from 'lucide-react';

const Hero = () => {
  const isMobile = useIsMobile();
  const { theme } = useTheme();
  const heroRef = useRef<HTMLDivElement>(null);
  const modelContainerRef = useRef<HTMLDivElement>(null);
  
  // Framer Motion scroll animations
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });
  
  // Smooth scroll progress with spring physics
  const smoothScrollYProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });
  
  // Transform values based on scroll position
  const contentOpacity = useTransform(smoothScrollYProgress, [0, 0.5], [1, 0]);
  const contentY = useTransform(smoothScrollYProgress, [0, 0.5], [0, 100]);
  const modelScale = useTransform(smoothScrollYProgress, [0, 0.5], [1, 0.8]);
  const modelY = useTransform(smoothScrollYProgress, [0, 0.5], [0, -50]);
  const modelRotateY = useTransform(smoothScrollYProgress, [0, 0.5], [0, Math.PI / 4]);
  
  // Parallax background layers
  const bgLayer1Y = useTransform(smoothScrollYProgress, [0, 1], [0, 150]);
  const bgLayer2Y = useTransform(smoothScrollYProgress, [0, 1], [0, 100]);
  const bgLayer3Y = useTransform(smoothScrollYProgress, [0, 1], [0, 50]);
  
  // Handle scroll down button click
  const handleScrollDown = () => {
    const aboutSection = document.getElementById('services');
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: 'smooth' });
    }
  };
  
  // Update 3D model rotation based on scroll
  useEffect(() => {
    if (!modelContainerRef.current) return;
    
    const updateRotation = () => {
      if (modelContainerRef.current) {
        const model = modelContainerRef.current;
        const rect = model.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        // Calculate distance from center of screen
        const viewportCenterX = window.innerWidth / 2;
        const viewportCenterY = window.innerHeight / 2;
        
        // Create subtle rotation effect based on viewport position
        const rotateX = (centerY - viewportCenterY) * 0.0005;
        const rotateY = (centerX - viewportCenterX) * 0.0005;
        
        model.style.transform = `perspective(1000px) rotateX(${rotateX}rad) rotateY(${rotateY}rad)`;
      }
    };
    
    window.addEventListener('scroll', updateRotation);
    updateRotation(); // Initialize
    
    return () => {
      window.removeEventListener('scroll', updateRotation);
    };
  }, []);
  
  return (
    <motion.section 
      ref={heroRef} 
      id="home" 
      className="min-h-screen flex items-center relative overflow-hidden py-20"
    >
      {/* Parallax background layers */}
      <motion.div 
        className="absolute inset-0 bg-grid-pattern opacity-[0.03]"
        style={{ y: bgLayer1Y }}
      />
      
      <motion.div 
        className="absolute -top-64 -right-64 w-[500px] h-[500px] rounded-full bg-primary/5 blur-3xl"
        style={{ y: bgLayer2Y }}
      />
      
      <motion.div 
        className="absolute -bottom-32 -left-32 w-[300px] h-[300px] rounded-full bg-secondary/5 blur-3xl"
        style={{ y: bgLayer3Y }}
      />
      
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Text content */}
          <motion.div 
            className="text-center lg:text-left"
            style={{ 
              opacity: contentOpacity,
              y: contentY
            }}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
                <span>Hello, I'm </span>
                <span className="gradient-text">John Doe</span>
              </h1>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="text-xl md:text-2xl font-medium mb-6 h-12 flex justify-center lg:justify-start items-center"
            >
              <TypeWriter 
                texts={[
                  "MERN Stack Developer",
                  "Frontend Specialist",
                  "React.js Expert",
                  "UI/UX Enthusiast",
                  "Freelance Developer"
                ]}
                speed={80}
                delay={2000}
              />
            </motion.div>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="text-muted-foreground max-w-xl mx-auto lg:mx-0 mb-8"
            >
              Crafting exceptional digital experiences with cutting-edge web technologies.
              Specialized in building high-performance, responsive applications with React.js,
              Node.js, and modern frameworks.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <Button size="lg" className="font-medium gap-2">
                View My Projects
              </Button>
              
              <Button variant="outline" size="lg" className="font-medium gap-2" onClick={handleScrollDown}>
                <ArrowDownCircle size={18} />
                Explore More
              </Button>
            </motion.div>
            
            {/* Social links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1 }}
              className="flex items-center gap-4 mt-8 justify-center lg:justify-start"
            >
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Github size={24} />
                <span className="sr-only">GitHub</span>
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Linkedin size={24} />
                <span className="sr-only">LinkedIn</span>
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Twitter size={24} />
                <span className="sr-only">Twitter</span>
              </a>
            </motion.div>
          </motion.div>
          
          {/* 3D Model */}
          <motion.div 
            ref={modelContainerRef}
            className="h-[400px] md:h-[500px] w-full relative flex items-center justify-center"
            style={{ 
              scale: modelScale,
              y: modelY,
              rotateY: modelRotateY
            }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ 
              duration: 0.8, 
              delay: 0.4, 
              type: "spring",
              stiffness: 100
            }}
          >
            {/* Glow effect behind the model */}
            <div className="absolute w-3/4 h-3/4 rounded-full bg-primary/20 blur-3xl" />
            
            {/* 3D Model */}
            <div className="w-full h-full relative z-10">
              <ThreeDModel scrollTrigger={true} />
            </div>
            
            {/* Floating badges */}
            <FloatingBadge
              text="React"
              position={{ top: '10%', right: '15%' }}
              delay={1.2}
            />
            <FloatingBadge
              text="Node.js"
              position={{ bottom: '20%', left: '10%' }}
              delay={1.5}
            />
            <FloatingBadge
              text="MongoDB"
              position={{ top: '25%', left: '5%' }}
              delay={1.8}
            />
          </motion.div>
        </div>
      </div>
      
      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center"
        animate={{
          y: [0, 10, 0],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          repeatType: "loop",
        }}
      >
        <span className="text-sm text-muted-foreground mb-2">Scroll Down</span>
        <ArrowDownCircle size={24} className="text-primary animate-pulse" />
      </motion.div>
    </motion.section>
  );
};

// Floating badge component for skills
interface FloatingBadgeProps {
  text: string;
  position: {
    top?: string;
    bottom?: string;
    left?: string;
    right?: string;
  };
  delay: number;
}

const FloatingBadge = ({ text, position, delay }: FloatingBadgeProps) => {
  return (
    <motion.div
      className="absolute bg-card border rounded-full py-1 px-3 text-sm font-medium shadow-md"
      style={position}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ 
        opacity: 1, 
        scale: 1,
        y: [0, -10, 0],
      }}
      transition={{
        scale: { duration: 0.5, delay },
        opacity: { duration: 0.5, delay },
        y: {
          delay,
          duration: 3,
          repeat: Infinity,
          repeatType: "reverse",
        },
      }}
    >
      {text}
    </motion.div>
  );
};

export default Hero;