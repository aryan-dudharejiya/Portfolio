import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { useIsMobile } from '@/hooks/use-mobile';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, Star, Quote } from 'lucide-react';

interface Testimonial {
  id: number;
  content: string;
  name: string;
  position: string;
  image: string;
  rating?: number;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    content:
      "Working with this developer was an absolute game-changer for our company. They delivered a sophisticated e-commerce platform with seamless payment integration that increased our conversion rates by 45%. Their technical skills and ability to solve complex problems are exceptional.",
    name: "Sarah Johnson",
    position: "CEO, TechVision",
    image: "https://randomuser.me/api/portraits/women/1.jpg",
    rating: 5
  },
  {
    id: 2,
    content:
      "We hired this developer to rebuild our outdated website, and the results exceeded our expectations. The new site is not only visually stunning but also performs incredibly well on all devices. The attention to detail and commitment to delivering high-quality work made all the difference.",
    name: "Michael Chen",
    position: "Marketing Director, InnovateX",
    image: "https://randomuser.me/api/portraits/men/1.jpg",
    rating: 5
  },
  {
    id: 3,
    content:
      "I've worked with many developers over the years, but few have impressed me as much as this one. They have a remarkable ability to translate business needs into functional, beautiful digital solutions. Our web application has received praise from both users and industry experts.",
    name: "Emily Rodriguez",
    position: "Product Manager, StartupLaunch",
    image: "https://randomuser.me/api/portraits/women/2.jpg",
    rating: 5
  },
  {
    id: 4,
    content:
      "This developer built a custom CRM for our sales team that has transformed our operations. Their technical expertise, combined with a deep understanding of our business processes, resulted in a solution that has increased our team's efficiency by 60%. Truly remarkable work!",
    name: "David Harper",
    position: "Sales Director, GrowthForce",
    image: "https://randomuser.me/api/portraits/men/2.jpg",
    rating: 5
  },
  {
    id: 5,
    content:
      "The portfolio website created by this developer has significantly increased my client inquiries. The unique design and smooth animations make my work stand out in a competitive industry. I appreciate their dedication to creating a site that truly represents my brand.",
    name: "Jessica Williams",
    position: "Independent Photographer",
    image: "https://randomuser.me/api/portraits/women/3.jpg",
    rating: 5
  }
];

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const isMobile = useIsMobile();
  const carouselRef = useRef<HTMLDivElement>(null);
  
  const titleAnimation = useScrollAnimation({ threshold: 0.1 });
  const subtitleAnimation = useScrollAnimation({ threshold: 0.1, delay: 200 });
  
  // Auto-rotate testimonials
  useEffect(() => {
    if (isPaused) return;
    
    const interval = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
    }, 8000); // Change testimonial every 8 seconds
    
    return () => clearInterval(interval);
  }, [isPaused]);
  
  const handlePrev = () => {
    setDirection(-1);
    setCurrentIndex((prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length);
  };
  
  const handleNext = () => {
    setDirection(1);
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
  };
  
  // Pause auto-rotation when hovering over testimonial
  const handleMouseEnter = () => {
    setIsPaused(true);
  };
  
  const handleMouseLeave = () => {
    setIsPaused(false);
  };
  
  // Card animation variants
  const cardVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? '100%' : '-100%',
      opacity: 0,
      scale: 0.9
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        type: 'spring',
        stiffness: 300,
        damping: 30
      }
    },
    exit: (direction: number) => ({
      x: direction < 0 ? '100%' : '-100%',
      opacity: 0,
      scale: 0.9,
      transition: {
        duration: 0.3
      }
    })
  };
  
  // Render stars based on rating
  const renderStars = (rating: number = 5) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        size={16}
        className={i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
      />
    ));
  };
  
  return (
    <section id="testimonials" className="py-20 md:py-28 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      <div className="absolute top-0 left-0 w-48 h-48 rounded-full bg-primary/10 -translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-72 h-72 rounded-full bg-secondary/10 translate-x-1/3 translate-y-1/3 blur-3xl"></div>
      
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
            Client <span className="gradient-text">Testimonials</span>
          </motion.h2>
          
          <motion.p
            ref={subtitleAnimation.ref}
            initial={{ opacity: 0, y: 20 }}
            animate={subtitleAnimation.isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="text-muted-foreground max-w-2xl mx-auto"
          >
            Don't just take my word for it. Here's what clients have to say about working with me.
          </motion.p>
        </div>
        
        {/* Testimonial carousel */}
        <div 
          ref={carouselRef}
          className="max-w-4xl mx-auto relative"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {/* Quote icon decoration */}
          <div className="absolute -top-10 -left-10 text-primary/10">
            <Quote size={isMobile ? 60 : 100} strokeWidth={1} />
          </div>
          
          {/* Testimonial cards */}
          <div className="relative h-[360px] md:h-[320px] overflow-hidden">
            <AnimatePresence initial={false} custom={direction} mode="wait">
              <motion.div
                key={testimonials[currentIndex].id}
                custom={direction}
                variants={cardVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="absolute inset-0 p-6 md:p-10 bg-card border rounded-xl shadow-lg flex flex-col"
              >
                <div className="flex items-center space-x-2 mb-4">
                  {renderStars(testimonials[currentIndex].rating)}
                </div>
                
                <p className="text-card-foreground flex-grow italic mb-6">
                  "{testimonials[currentIndex].content}"
                </p>
                
                <div className="flex items-center">
                  <Avatar className="h-12 w-12 mr-4 border-2 border-primary">
                    <AvatarImage src={testimonials[currentIndex].image} alt={testimonials[currentIndex].name} />
                    <AvatarFallback>{testimonials[currentIndex].name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  
                  <div>
                    <h4 className="font-semibold">{testimonials[currentIndex].name}</h4>
                    <p className="text-sm text-muted-foreground">{testimonials[currentIndex].position}</p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
          
          {/* Navigation controls */}
          <div className="flex justify-center mt-8 space-x-4">
            <Button variant="outline" size="icon" onClick={handlePrev}>
              <ArrowLeft size={20} />
              <span className="sr-only">Previous testimonial</span>
            </Button>
            
            <div className="flex items-center space-x-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    i === currentIndex
                      ? 'w-8 bg-primary'
                      : 'w-2 bg-primary/30 hover:bg-primary/50'
                  }`}
                  onClick={() => {
                    setDirection(i > currentIndex ? 1 : -1);
                    setCurrentIndex(i);
                  }}
                  aria-label={`Go to testimonial ${i + 1}`}
                />
              ))}
            </div>
            
            <Button variant="outline" size="icon" onClick={handleNext}>
              <ArrowRight size={20} />
              <span className="sr-only">Next testimonial</span>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;