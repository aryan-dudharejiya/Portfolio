import { motion } from 'framer-motion';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { 
  Code2, 
  Smartphone, 
  PaintBucket, 
  Rocket, 
  ShieldCheck, 
  LineChart
} from 'lucide-react';

interface Service {
  icon: string;
  title: string;
  description: string;
}

const servicesData: Service[] = [
  {
    icon: 'code',
    title: 'Web Development',
    description: 'Building responsive, fast and scalable web applications using the MERN stack.'
  },
  {
    icon: 'mobile',
    title: 'Mobile Development',
    description: 'Creating cross-platform mobile apps with React Native for iOS and Android.'
  },
  {
    icon: 'design',
    title: 'UI/UX Design',
    description: 'Designing beautiful, intuitive interfaces that enhance user experience.'
  },
  {
    icon: 'performance',
    title: 'Performance Optimization',
    description: 'Improving application speed and efficiency for better user experience.'
  },
  {
    icon: 'security',
    title: 'Security Implementation',
    description: 'Implementing robust security measures to protect data and applications.'
  },
  {
    icon: 'analytics',
    title: 'Analytics Integration',
    description: 'Setting up data analytics to track user behavior and application performance.'
  }
];

const Services = () => {
  const titleAnimation = useScrollAnimation({ threshold: 0.1 });
  const subtitleAnimation = useScrollAnimation({ threshold: 0.1, delay: 200 });

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'code':
        return <Code2 className="h-10 w-10 text-primary" />;
      case 'mobile':
        return <Smartphone className="h-10 w-10 text-primary" />;
      case 'design':
        return <PaintBucket className="h-10 w-10 text-primary" />;
      case 'performance':
        return <Rocket className="h-10 w-10 text-primary" />;
      case 'security':
        return <ShieldCheck className="h-10 w-10 text-primary" />;
      case 'analytics':
        return <LineChart className="h-10 w-10 text-primary" />;
      default:
        return <Code2 className="h-10 w-10 text-primary" />;
    }
  };

  return (
    <section id="services" className="py-20 md:py-28 bg-muted/20">
      {/* Decorative blobs */}
      <div className="absolute left-0 top-1/3 w-64 h-64 bg-primary/10 rounded-full filter blur-3xl opacity-60"></div>
      <div className="absolute right-0 bottom-1/3 w-64 h-64 bg-secondary/10 rounded-full filter blur-3xl opacity-60"></div>
      
      <div className="container mx-auto px-4 md:px-6">
        {/* Section Header */}
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
            High-quality development services to help your business grow and succeed in the digital world.
          </motion.p>
        </div>
        
        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {servicesData.map((service, index) => {
            const cardAnimation = useScrollAnimation({ 
              threshold: 0.1, 
              delay: 100 * index 
            });
            
            return (
              <motion.div
                key={index}
                ref={cardAnimation.ref}
                initial={{ opacity: 0, y: 20 }}
                animate={cardAnimation.isVisible ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5 }}
                className="bg-card p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow group hover:border-primary/50 border border-border"
              >
                <div className="p-3 mb-4 inline-block bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                  {getIcon(service.icon)}
                </div>
                
                <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">
                  {service.title}
                </h3>
                
                <p className="text-muted-foreground">
                  {service.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Services;