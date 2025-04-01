import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { useIsMobile } from '@/hooks/use-mobile';
import { 
  Code, ArrowRight, Building2, Store, 
  Calendar, MessageCircle, BookTemplate 
} from 'lucide-react';
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
    icon: <Building2 size={28} />,
    title: "Business Websites",
    description: "High-converting websites for startups, business owners, coaches, restaurants, gyms, and more.",
    color: "from-blue-500 to-violet-500",
    features: [
      "Mobile responsive design",
      "SEO optimization",
      "Fast loading speed",
      "Brand-aligned aesthetics",
      "Contact forms & CTA"
    ]
  },
  {
    icon: <Store size={28} />,
    title: "Landing Pages",
    description: "Conversion-focused landing pages designed for marketing campaigns, lead generation, and sales.",
    color: "from-indigo-500 to-purple-500",
    features: [
      "High-converting layouts",
      "A/B testing ready",
      "Call-to-action optimization",
      "Lead capture forms",
      "Analytics integration"
    ]
  },
  {
    icon: <Code size={28} />,
    title: "Web Applications",
    description: "Custom web applications and software solutions tailored to your specific business needs.",
    color: "from-green-500 to-emerald-500",
    features: [
      "Custom functionality",
      "User authentication",
      "Database integration",
      "API development",
      "Scalable architecture"
    ]
  },
  {
    icon: <BookTemplate size={28} />,
    title: "Website Templates",
    description: "Ready-to-use multipurpose business website templates that can be quickly customized for your brand.",
    color: "from-cyan-500 to-blue-500",
    features: [
      "Pre-designed sections",
      "Easy customization",
      "Modern aesthetics",
      "Responsive layouts",
      "Quick deployment"
    ]
  },
  {
    icon: <Calendar size={28} />,
    title: "Membership & Booking",
    description: "Complete systems for membership management and class/appointment booking for service businesses.",
    color: "from-purple-500 to-pink-500",
    features: [
      "User accounts",
      "Payment processing",
      "Calendar integration",
      "Automated reminders",
      "Admin dashboard"
    ]
  },
  {
    icon: <MessageCircle size={28} />,
    title: "Chatbot Development",
    description: "Smart business assistant bots for websites, WhatsApp, Instagram, and Facebook Messenger.",
    color: "from-amber-500 to-red-500",
    features: [
      "24/7 customer support",
      "Lead qualification",
      "FAQ automation",
      "Appointment scheduling",
      "CRM integration"
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