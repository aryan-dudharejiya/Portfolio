import { motion } from 'framer-motion';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { useIsMobile } from '@/hooks/use-mobile';
import { Code, Layout, Database, Smartphone, Server, Paintbrush } from 'lucide-react';

interface Service {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
}

const services: Service[] = [
  {
    icon: <Layout size={28} />,
    title: "UI/UX Design",
    description: "Creating intuitive, user-centered interfaces with a focus on accessibility and engaging user experiences.",
    color: "from-blue-500 to-violet-500"
  },
  {
    icon: <Code size={28} />,
    title: "Frontend Development",
    description: "Building responsive, dynamic interfaces with React.js, optimized for performance and modern browsers.",
    color: "from-indigo-500 to-purple-500"
  },
  {
    icon: <Server size={28} />,
    title: "Backend Development",
    description: "Developing robust server-side applications with Node.js, Express, and secure RESTful APIs.",
    color: "from-green-500 to-emerald-500"
  },
  {
    icon: <Database size={28} />,
    title: "Database Design",
    description: "Architecting efficient MongoDB schemas and optimizing queries for scalable data management.",
    color: "from-cyan-500 to-blue-500"
  },
  {
    icon: <Smartphone size={28} />,
    title: "Mobile-First Development",
    description: "Creating seamless experiences across all devices with responsive design and progressive enhancement.",
    color: "from-purple-500 to-pink-500"
  },
  {
    icon: <Paintbrush size={28} />,
    title: "Creative Solutions",
    description: "Delivering innovative, custom solutions tailored to unique business requirements and challenges.",
    color: "from-amber-500 to-red-500"
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
        y: -10,
        transition: { duration: 0.2 }
      }}
      className="bg-card border rounded-lg p-6 shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden"
    >
      {/* Service Icon with gradient background */}
      <div className={`w-12 h-12 rounded-lg mb-4 flex items-center justify-center bg-gradient-to-br ${service.color} text-white`}>
        {service.icon}
      </div>
      
      <h3 className="text-xl font-semibold mb-3">{service.title}</h3>
      <p className="text-muted-foreground">{service.description}</p>
      
      {/* Decorative corner gradient */}
      <div className={`absolute -bottom-8 -right-8 w-16 h-16 rounded-full bg-gradient-to-br ${service.color} opacity-10`}></div>
    </motion.div>
  );
};

export default Services;