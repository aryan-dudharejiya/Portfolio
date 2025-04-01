import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { useIsMobile } from '@/hooks/use-mobile';
import { Code, Layout, Database, Smartphone, Server, Paintbrush, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Service {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
  features: string[];
}

const services: Service[] = [
  {
    icon: <Layout size={28} />,
    title: "UI/UX Design",
    description: "Creating intuitive, user-centered interfaces with a focus on accessibility and engaging user experiences.",
    color: "from-blue-500 to-violet-500",
    features: [
      "Wireframing & prototyping",
      "User journey mapping",
      "Interactive designs",
      "Accessibility compliance",
      "Usability testing"
    ]
  },
  {
    icon: <Code size={28} />,
    title: "Frontend Development",
    description: "Building responsive, dynamic interfaces with React.js, optimized for performance and modern browsers.",
    color: "from-indigo-500 to-purple-500",
    features: [
      "React.js applications",
      "Next.js websites",
      "Performance optimization",
      "State management",
      "Modern animations"
    ]
  },
  {
    icon: <Server size={28} />,
    title: "Backend Development",
    description: "Developing robust server-side applications with Node.js, Express, and secure RESTful APIs.",
    color: "from-green-500 to-emerald-500",
    features: [
      "Node.js & Express",
      "API development",
      "Authentication systems",
      "Cloud deployments",
      "Performance scaling"
    ]
  },
  {
    icon: <Database size={28} />,
    title: "Database Design",
    description: "Architecting efficient MongoDB schemas and optimizing queries for scalable data management.",
    color: "from-cyan-500 to-blue-500",
    features: [
      "MongoDB schema design",
      "SQL & NoSQL solutions",
      "Data modeling",
      "Query optimization",
      "Database migrations"
    ]
  },
  {
    icon: <Smartphone size={28} />,
    title: "Mobile-First Development",
    description: "Creating seamless experiences across all devices with responsive design and progressive enhancement.",
    color: "from-purple-500 to-pink-500",
    features: [
      "Responsive web apps",
      "Progressive web apps",
      "Touch-friendly interfaces",
      "Cross-device testing",
      "Mobile optimization"
    ]
  },
  {
    icon: <Paintbrush size={28} />,
    title: "Creative Solutions",
    description: "Delivering innovative, custom solutions tailored to unique business requirements and challenges.",
    color: "from-amber-500 to-red-500",
    features: [
      "Custom web applications",
      "E-commerce solutions",
      "Interactive experiences",
      "Process automation",
      "System integration"
    ]
  }
];

const Services = () => {
  const isMobile = useIsMobile();
  const titleAnimation = useScrollAnimation({ threshold: 0.1 });
  const subtitleAnimation = useScrollAnimation({ threshold: 0.1, delay: 200 });
  
  // Calculate stagger delay for cards based on index
  const getCardDelay = (index: number) => {
    return isMobile ? 0 : 0.1 * index;
  };
  
  return (
    <section id="services" className="py-20 md:py-28 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      <div className="absolute top-40 right-0 w-64 h-64 rounded-full bg-primary/5 blur-3xl"></div>
      <div className="absolute bottom-20 left-0 w-72 h-72 rounded-full bg-secondary/5 blur-3xl"></div>
      
      <div className="container mx-auto px-4 md:px-6 relative">
        {/* Section header */}
        <div className="text-center mb-16">
          <motion.h2
            ref={titleAnimation.ref}
            initial={{ opacity: 0, y: 20 }}
            animate={titleAnimation.isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-4xl font-bold mb-4"
          >
            My <span className="gradient-text">Services</span>
          </motion.h2>
          
          <motion.p
            ref={subtitleAnimation.ref}
            initial={{ opacity: 0, y: 20 }}
            animate={subtitleAnimation.isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="text-muted-foreground max-w-2xl mx-auto"
          >
            Specialized expertise in full-stack development, delivering comprehensive solutions
            from concept to deployment.
          </motion.p>
        </div>
        
        {/* Services grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {services.map((service, index) => (
            <ServiceCard
              key={index}
              service={service}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

interface ServiceCardProps {
  service: Service;
  index: number;
}

const ServiceCard = ({ service, index }: ServiceCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const cardAnimation = useScrollAnimation({ 
    threshold: 0.1,
    delay: index * 100 // Stagger effect
  });
  
  return (
    <motion.div
      ref={cardAnimation.ref}
      initial={{ opacity: 0, y: 20 }}
      animate={cardAnimation.isVisible ? { opacity: 1, y: 0 } : {}}
      transition={{ 
        duration: 0.5,
        type: "spring",
        stiffness: 100,
        damping: 20
      }}
      whileHover={{ 
        y: -5,
        transition: { duration: 0.2 }
      }}
      className="bg-card border rounded-lg p-6 shadow-sm hover:shadow-lg transition-all duration-300 relative overflow-hidden h-full flex flex-col"
    >
      {/* Card Header */}
      <div className="flex items-start justify-between mb-4">
        {/* Service Icon with gradient background */}
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center bg-gradient-to-br ${service.color} text-white shadow-lg`}>
          {service.icon}
        </div>
        
        {/* Expand button */}
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          aria-label={isExpanded ? `Collapse ${service.title} details` : `Expand ${service.title} details`}
          className={`h-8 w-8 rounded-full border bg-card/70 backdrop-blur-sm flex items-center justify-center transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
        >
          <ArrowRight className="h-4 w-4 text-foreground" />
        </button>
      </div>
      
      {/* Service Title & Description */}
      <div>
        <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
        <p className="text-muted-foreground mb-4">{service.description}</p>
      </div>
      
      {/* Features List - Animated */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-2 overflow-hidden"
          >
            <ul className="space-y-2 mt-3 mb-4">
              {service.features.map((feature, i) => (
                <motion.li 
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-start gap-2 text-sm"
                >
                  <span className={`inline-block w-2 h-2 rounded-full bg-gradient-to-br ${service.color} mt-1.5 flex-shrink-0`}></span>
                  <span>{feature}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Call to Action Button - Only appears when expanded */}
      <div className="mt-auto pt-4">
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
            >
              <Button 
                className={`w-full bg-gradient-to-r ${service.color} hover:opacity-90 text-white group`}
                size="sm"
              >
                <span>Learn More</span>
                <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {/* Decorative Background Elements */}
      <div className={`absolute -bottom-8 -right-8 w-32 h-32 rounded-full bg-gradient-to-br ${service.color} opacity-5`}></div>
      <div className={`absolute -top-10 -left-10 w-24 h-24 rounded-full bg-gradient-to-br ${service.color} opacity-5`}></div>
    </motion.div>
  );
};

export default Services;