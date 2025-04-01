import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

interface Testimonial {
  id: number;
  content: string;
  name: string;
  position: string;
  image: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    content: "Alex transformed our outdated website into a beautiful, high-converting platform. The attention to detail and user experience expertise is exceptional. Our sales have increased by 40% since the launch!",
    name: "Sarah Johnson",
    position: "CEO, EcoStyle Fashion",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=faces"
  },
  {
    id: 2,
    content: "Working with Alex on our custom dashboard application was a game-changer. The intuitive design and seamless functionality exceeded our expectations. Alex is responsive, professional, and truly cares about delivering quality work.",
    name: "Michael Roberts",
    position: "Founder, DataVision Analytics",
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&h=100&fit=crop&crop=faces"
  },
  {
    id: 3,
    content: "Alex created an e-commerce platform that perfectly captures our brand essence. The site is not only visually stunning but also converts like crazy. Our average order value has increased by 35% since launch!",
    name: "Jennifer Chen",
    position: "Marketing Director, Luxe Home Goods",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&h=100&fit=crop&crop=faces"
  }
];

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [slideWidth, setSlideWidth] = useState(100);
  const [slidesPerView, setSlidesPerView] = useState(1);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleResize = () => {
      const newSlidesPerView = window.innerWidth < 768 ? 1 : 2;
      setSlidesPerView(newSlidesPerView);
      setSlideWidth(100 / newSlidesPerView);
      
      // Reset to first slide when layout changes
      if (currentIndex > testimonials.length - newSlidesPerView) {
        setCurrentIndex(0);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [currentIndex]);

  const goToSlide = (index: number) => {
    if (index < 0) {
      index = testimonials.length - slidesPerView;
    } else if (index > testimonials.length - slidesPerView) {
      index = 0;
    }
    
    setCurrentIndex(index);
  };

  const goToPrev = () => goToSlide(currentIndex - 1);
  const goToNext = () => goToSlide(currentIndex + 1);

  return (
    <section id="testimonials" className="py-20 bg-slate-100 dark:bg-slate-800/50">
      <div className="container mx-auto px-6">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold font-['Poppins'] mb-4">Client <span className="gradient-text">Testimonials</span></h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Here's what my clients say about working with me.
          </p>
        </motion.div>
        
        <motion.div 
          className="relative"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="overflow-hidden">
            <div 
              ref={trackRef}
              className="flex transition-transform duration-500"
              style={{ transform: `translateX(-${currentIndex * slideWidth}%)` }}
            >
              {testimonials.map((testimonial) => (
                <div 
                  key={testimonial.id}
                  className="px-2"
                  style={{ minWidth: `${slideWidth}%` }}
                >
                  <div className="glass rounded-2xl p-8 h-full">
                    <div className="flex mb-6">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <i key={star} className="bx bxs-star text-yellow-500"></i>
                      ))}
                    </div>
                    <p className="text-slate-600 dark:text-slate-300 mb-6 italic">
                      "{testimonial.content}"
                    </p>
                    <div className="flex items-center">
                      <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
                        <img 
                          src={testimonial.image} 
                          alt={testimonial.name} 
                          className="w-full h-full object-cover" 
                        />
                      </div>
                      <div>
                        <h4 className="font-bold">{testimonial.name}</h4>
                        <p className="text-sm text-slate-500 dark:text-slate-400">{testimonial.position}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <button 
            onClick={goToPrev}
            className="absolute top-1/2 -left-4 transform -translate-y-1/2 w-12 h-12 rounded-full bg-white dark:bg-slate-700 shadow-lg flex items-center justify-center text-primary z-10"
            aria-label="Previous testimonial"
          >
            <i className="bx bx-chevron-left text-2xl"></i>
          </button>
          
          <button 
            onClick={goToNext}
            className="absolute top-1/2 -right-4 transform -translate-y-1/2 w-12 h-12 rounded-full bg-white dark:bg-slate-700 shadow-lg flex items-center justify-center text-primary z-10"
            aria-label="Next testimonial"
          >
            <i className="bx bx-chevron-right text-2xl"></i>
          </button>
          
          <div className="flex justify-center mt-8 space-x-2">
            {testimonials.slice(0, testimonials.length - slidesPerView + 1).map((_, index) => (
              <button 
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  currentIndex === index 
                    ? 'bg-primary/70' 
                    : 'bg-slate-300 dark:bg-slate-600'
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Testimonials;
