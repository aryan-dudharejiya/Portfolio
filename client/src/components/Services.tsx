import { motion, AnimatePresence, useInView } from "framer-motion";
import { useState, useRef, useEffect, useMemo } from "react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Code,
  ArrowRight,
  Building2,
  Store,
  Calendar,
  MessageCircle,
  BookTemplate,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import ThreeDModel from "@/components/three/ThreeDModel";
import { useTheme } from "@/hooks/useTheme";

interface Service {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
  features: string[];
  image?: string;
}

const services: Service[] = [
  {
    icon: <Building2 size={28} />,
    title: "Business Websites",
    description:
      "High-converting websites for startups, business owners, coaches, restaurants, gyms, and more.",
    color: "from-blue-500 to-violet-500",
    features: [
      "Mobile responsive design",
      "SEO optimization",
      "Fast loading speed",
      "Brand-aligned aesthetics",
      "Contact forms & CTA",
    ],
  },
  {
    icon: <Store size={28} />,
    title: "Landing Pages",
    description:
      "Conversion-focused landing pages designed for marketing campaigns, lead generation, and sales.",
    color: "from-indigo-500 to-purple-500",
    features: [
      "High-converting layouts",
      "A/B testing ready",
      "Call-to-action optimization",
      "Lead capture forms",
      "Analytics integration",
    ],
  },
  {
    icon: <Code size={28} />,
    title: "Web Applications",
    description:
      "Custom web applications and software solutions tailored to your specific business needs.",
    color: "from-green-500 to-emerald-500",
    features: [
      "Custom functionality",
      "User authentication",
      "Database integration",
      "API development",
      "Scalable architecture",
    ],
  },
  {
    icon: <BookTemplate size={28} />,
    title: "Website Templates",
    description:
      "Ready-to-use multipurpose business website templates that can be quickly customized for your brand.",
    color: "from-cyan-500 to-blue-500",
    features: [
      "Pre-designed sections",
      "Easy customization",
      "Modern aesthetics",
      "Responsive layouts",
      "Quick deployment",
    ],
  },
  {
    icon: <Calendar size={28} />,
    title: "Membership & Booking",
    description:
      "Complete systems for membership management and class/appointment booking for service businesses.",
    color: "from-purple-500 to-pink-500",
    features: [
      "User accounts",
      "Payment processing",
      "Calendar integration",
      "Automated reminders",
      "Admin dashboard",
    ],
  },
  {
    icon: <MessageCircle size={28} />,
    title: "Chatbot Development",
    description:
      "Smart business assistant bots for websites, WhatsApp, Instagram, and Facebook Messenger.",
    color: "from-amber-500 to-red-500",
    features: [
      "24/7 customer support",
      "Lead qualification",
      "FAQ automation",
      "Appointment scheduling",
      "CRM integration",
    ],
  },
];

// Optimize Particle component for better performance
const Particle = ({
  color,
  x,
  y,
  size,
  delay,
}: {
  color: string;
  x: number;
  y: number;
  size: number;
  delay: number;
}) => {
  return (
    <motion.div
      className={`absolute rounded-full ${color}`}
      style={{
        width: size,
        height: size,
        x,
        y,
        filter: `blur(${size / 4}px)`,
        willChange: "transform, opacity",
      }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{
        opacity: [0, 0.4, 0.2],
        scale: [0, 1, 0.8],
        y: y - Math.random() * 20,
      }}
      transition={{
        duration: 5,
        delay: delay,
        repeat: Infinity,
        repeatType: "reverse",
      }}
    />
  );
};

// Optimize ParticleField - reduce particle count
const ParticleField = ({ count = 8 }: { count?: number }) => {
  const particles = [];
  const colors = [
    "bg-blue-400/30",
    "bg-violet-400/30",
    "bg-cyan-400/30",
    "bg-indigo-400/30",
    "bg-purple-400/30",
    "bg-green-400/30",
  ];

  for (let i = 0; i < count; i++) {
    const size = Math.random() * 6 + 3;
    particles.push(
      <Particle
        key={i}
        color={colors[Math.floor(Math.random() * colors.length)]}
        x={Math.random() * 80 - 40}
        y={Math.random() * 80 - 40}
        size={size}
        delay={Math.random() * 1}
      />
    );
  }

  return <>{particles}</>;
};

// Optimize ServiceShowcase component
const ServiceShowcase = () => {
  const { theme } = useTheme();
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, {
    once: false,
    margin: "-100px 0px",
  });
  const isMobile = useIsMobile();

  // State for interactive elements
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Effect for parallax movement
  useEffect(() => {
    if (!containerRef.current || isMobile) return;

    // Check if we're in a browser environment before using window
    if (typeof window !== "undefined") {
      const moveElements = (e: MouseEvent) => {
        if (!containerRef.current) return;

        const { clientX, clientY } = e;
        const rect = containerRef.current.getBoundingClientRect();
        const x = clientX - rect.left;
        const y = clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        setMousePosition({
          x: (x - centerX) / centerX, // -1 to 1
          y: (y - centerY) / centerY, // -1 to 1
        });
      };

      window.addEventListener("mousemove", moveElements);
      return () => window.removeEventListener("mousemove", moveElements);
    }

    return undefined;
  }, [isMobile]);

  // Tech stack with staggered animation
  const techStack = [
    "React",
    "Node.js",
    "TypeScript",
    "ThreeJS",
    "MongoDB",
    "Tailwind",
  ];

  return (
    <motion.div
      ref={containerRef}
      className="w-full min-h-[400px] mb-20 rounded-xl border shadow-lg backdrop-blur-sm relative p-1 lg:p-0 overflow-hidden"
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, type: "spring" }}
    >
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-card to-secondary/5 opacity-70"></div>
      <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>

      {/* Interactive floating particles */}
      <div className="absolute inset-0 overflow-hidden">
        <ParticleField />
      </div>

      {/* Glowing orbs */}
      <div className="absolute top-10 left-[10%] w-40 h-40 rounded-full bg-blue-500/20 blur-3xl"></div>
      <div className="absolute bottom-20 right-[5%] w-60 h-60 rounded-full bg-purple-500/10 blur-3xl"></div>

      {/* Content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-5 h-full relative z-10">
        {/* Text content */}
        <div className="lg:col-span-2 p-8 flex flex-col justify-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <motion.div
              className="mb-2 relative w-fit"
              initial={{ scale: 0.9 }}
              animate={isInView ? { scale: 1 } : {}}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                <Sparkles size={12} className="mr-1" /> PREMIUM SERVICES
              </span>
            </motion.div>

            <motion.h3
              className="text-2xl md:text-3xl font-bold mb-4 relative"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              Elevate Your Digital Presence with
              <span className="block gradient-text mt-1">
                Cutting-Edge Development
              </span>
              <motion.div
                className="absolute -bottom-2 left-0 h-[3px] bg-primary/80 rounded-full"
                initial={{ width: 0 }}
                animate={isInView ? { width: "40%" } : { width: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              />
            </motion.h3>

            <motion.p
              className="text-muted-foreground mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              From responsive websites to complex web applications, we deliver
              solutions that drive results and enhance your brand's digital
              footprint.
            </motion.p>

            <motion.div
              className="flex flex-wrap gap-3 mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              {techStack.map((tech, i) => (
                <motion.span
                  key={i}
                  className="bg-primary/10 text-primary px-3 py-1.5 rounded-full text-sm font-medium inline-flex items-center"
                  initial={{ opacity: 0, scale: 0.8, x: -10 }}
                  animate={isInView ? { opacity: 1, scale: 1, x: 0 } : {}}
                  transition={{
                    duration: 0.4,
                    delay: 0.6 + i * 0.1,
                    type: "spring",
                    stiffness: 200,
                  }}
                  whileHover={{
                    scale: 1.05,
                    backgroundColor: "var(--primary)",
                    color: "white",
                  }}
                >
                  {tech}
                </motion.span>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              <Button
                className="bg-primary hover:bg-primary/90 text-white group relative overflow-hidden shadow-lg"
                size="lg"
              >
                <span className="relative z-10 flex items-center">
                  Explore Services
                  <ArrowRight
                    className="ml-2 group-hover:translate-x-1 transition-transform"
                    size={16}
                  />
                </span>
                <span className="absolute bottom-0 left-0 w-full h-0 bg-gradient-to-r from-blue-600 to-violet-600 group-hover:h-full transition-all duration-300 ease-in-out z-0"></span>
              </Button>
            </motion.div>
          </motion.div>
        </div>

        {/* 3D Model */}
        <div className="lg:col-span-3 relative h-[300px] md:h-[400px] flex items-center justify-center">
          <motion.div
            className="w-full h-full absolute inset-0 flex items-center justify-center"
            style={{
              transform: !isMobile
                ? `perspective(1000px) 
                  rotateY(${mousePosition.x * 5}deg) 
                  rotateX(${-mousePosition.y * 5}deg)`
                : undefined,
            }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
          >
            <ThreeDModel modelType="codeScene" />
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

// Main Services Component
const Services = () => {
  const isMobile = useIsMobile();
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px 0px" });

  const titleAnimation = useScrollAnimation({ threshold: 0.1, once: true });
  const subtitleAnimation = useScrollAnimation({
    threshold: 0.1,
    delay: 100,
    once: true,
  });

  // State for tracking hovered service
  const [hoveredService, setHoveredService] = useState<number | null>(null);

  return (
    <section
      id="services"
      ref={sectionRef}
      className="py-12 md:py-16 lg:py-20 relative overflow-hidden"
    >
      {/* Simplified background - fewer elements */}
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.03]"></div>

      {/* Simplified gradient blobs - static instead of animated */}
      <div className="absolute top-40 right-0 w-[500px] h-[500px] rounded-full bg-primary/5 blur-3xl opacity-60"></div>

      <div className="section-container relative">
        {/* 1. MAIN SECTION HEADER - shown first */}
        <div className="text-center mb-10 max-w-3xl mx-auto">
          <motion.h2
            ref={titleAnimation.ref}
            initial={{ opacity: 0, y: 10 }}
            animate={titleAnimation.isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.4 }}
            className="text-3xl md:text-4xl font-bold mb-3"
          >
            Professional <span className="gradient-text">Services</span>
          </motion.h2>

          <motion.p
            ref={subtitleAnimation.ref}
            initial={{ opacity: 0, y: 5 }}
            animate={subtitleAnimation.isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.4 }}
            className="text-muted-foreground md:text-lg"
          >
            High-quality web development services tailored to your business
            needs
          </motion.p>
        </div>

        {/* 2. 3D SHOWCASE - shown second and only on non-mobile */}
        {!isMobile && <ServiceShowcase />}

        {/* 3. SERVICES GRID - shown third */}
        <div className="mb-10">
          <h3 className="text-2xl font-bold mb-6 text-center md:text-left">
            What I <span className="text-primary">Offer</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <ServiceCard
                key={service.title}
                service={service}
                index={index}
                isHovered={hoveredService === index}
                onHover={() => setHoveredService(index)}
                onLeave={() => setHoveredService(null)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

interface ServiceCardProps {
  service: Service;
  index: number;
  isHovered: boolean;
  onHover: () => void;
  onLeave: () => void;
}

// Optimized ServiceCard component
const ServiceCard = ({
  service,
  index,
  isHovered,
  onHover,
  onLeave,
}: ServiceCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, { once: true, amount: 0.1 });

  // Simplified entrance animation with reduced delay
  const entranceDelay = Math.min(index * 0.1, 0.3);

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{
        duration: 0.4,
        delay: entranceDelay,
        ease: "easeOut",
      }}
      style={{ willChange: "transform, opacity" }}
      className="group relative rounded-xl overflow-hidden h-full flex flex-col transform hover:-translate-y-1 transition-transform duration-300"
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
    >
      {/* Card glass morphism effect - simplified */}
      <div className="absolute inset-0 bg-card/90 border rounded-xl shadow-sm group-hover:border-primary/50 group-hover:shadow-md transition-shadow duration-300"></div>

      {/* Simplified gradient background - using CSS transition */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-0 group-hover:opacity-[0.03] transition-opacity duration-300`}
      ></div>

      {/* Card Content */}
      <div className="relative z-10 p-6 h-full flex flex-col">
        {/* Card Header with simplified interactive elements */}
        <div className="flex items-start justify-between mb-5">
          {/* Service Icon with simplified design */}
          <div
            className={`w-14 h-14 rounded-xl flex items-center justify-center bg-gradient-to-br ${service.color} text-white shadow-md transform transition-transform duration-300 group-hover:scale-105`}
          >
            {service.icon}
          </div>

          {/* Simplified expand button */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            aria-label={
              isExpanded
                ? `Collapse ${service.title} details`
                : `Expand ${service.title} details`
            }
            className="h-9 w-9 rounded-full border bg-card flex items-center justify-center shadow-sm transform transition-all duration-300 hover:scale-110"
          >
            <div
              className={`transform transition-transform duration-300 ${
                isExpanded ? "rotate-90" : "rotate-0"
              }`}
            >
              <ArrowRight className="h-4 w-4 text-foreground" />
            </div>
          </button>
        </div>

        {/* Service Title with simplified hover effect */}
        <h3 className="text-xl font-semibold mb-2.5 relative inline-block">
          {service.title}

          {/* Simplified underline using CSS transition */}
          <div
            className={`absolute -bottom-1 left-0 h-[2px] w-0 group-hover:w-full bg-gradient-to-r ${service.color} rounded-full transition-all duration-300`}
          ></div>
        </h3>

        {/* Service Description - no animation */}
        <p className="text-muted-foreground mb-5">{service.description}</p>

        {/* Features List with simplified animations */}
        <AnimatePresence initial={false}>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              style={{ willChange: "height, opacity" }}
              className="mt-1 mb-5 overflow-hidden"
            >
              <ul className="space-y-2">
                {service.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm">
                    {/* Simplified bullet point */}
                    <span
                      className={`mt-1 inline-block w-2 h-2 rounded-full bg-gradient-to-br ${service.color} flex-shrink-0`}
                    ></span>
                    <span className="text-foreground/90">{feature}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Call to Action Button with simplified design */}
        <div className="mt-auto pt-2">
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              style={{ willChange: "transform, opacity" }}
            >
              <Button
                className={`w-full group relative overflow-hidden`}
                size="default"
              >
                <span
                  className={`absolute inset-0 bg-gradient-to-r ${service.color} opacity-90 z-0`}
                ></span>
                <span className="relative z-10 flex items-center justify-center text-white font-medium">
                  Learn More
                  <ArrowRight className="h-4 w-4 ml-2 transition-transform duration-300 ease-out group-hover:translate-x-1" />
                </span>
              </Button>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default Services;
