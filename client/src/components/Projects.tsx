import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type ProjectCategory = 'all' | 'website' | 'webapp' | 'ecommerce';

interface Project {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  category: Exclude<ProjectCategory, 'all'>;
  technologies: string[];
}

const projects: Project[] = [
  {
    id: 1,
    title: "Analytics Dashboard",
    description: "Interactive analytics dashboard with real-time data visualization.",
    imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=500&fit=crop",
    category: "webapp",
    technologies: ["React", "Node.js", "Socket.io"]
  },
  {
    id: 2,
    title: "Gourmet Restaurant",
    description: "Modern website with online reservations and menu management.",
    imageUrl: "https://images.unsplash.com/photo-1600267185393-e158a98703de?w=800&h=500&fit=crop",
    category: "website",
    technologies: ["React", "MongoDB", "Express"]
  },
  {
    id: 3,
    title: "Luxury Fashion Store",
    description: "Complete e-commerce solution with payment processing and inventory management.",
    imageUrl: "https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=800&h=500&fit=crop",
    category: "ecommerce",
    technologies: ["React", "Node.js", "Stripe"]
  },
  {
    id: 4,
    title: "Team Collaboration Platform",
    description: "Real-time collaboration tool with task management and chat features.",
    imageUrl: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&h=500&fit=crop",
    category: "webapp",
    technologies: ["React", "Firebase", "WebRTC"]
  },
  {
    id: 5,
    title: "Elite Fitness Studio",
    description: "Responsive website with class booking system and member portal.",
    imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=500&fit=crop",
    category: "website",
    technologies: ["React", "Express", "MongoDB"]
  },
  {
    id: 6,
    title: "Digital Products Marketplace",
    description: "Platform for selling digital products with secure download delivery.",
    imageUrl: "https://images.unsplash.com/photo-1607082349566-187342175e2f?w=800&h=500&fit=crop",
    category: "ecommerce",
    technologies: ["React", "Node.js", "AWS S3"]
  }
];

const Projects = () => {
  const [activeFilter, setActiveFilter] = useState<ProjectCategory>('all');

  const filteredProjects = activeFilter === 'all' 
    ? projects 
    : projects.filter(project => project.category === activeFilter);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { 
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <section id="projects" className="py-20 relative">
      <div className="container mx-auto px-6">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold font-['Poppins'] mb-4">Featured <span className="gradient-text">Projects</span></h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Check out some of my recent work that showcases my expertise.
          </p>
        </motion.div>
        
        <motion.div 
          className="flex gap-4 mb-10 justify-center overflow-x-auto py-2"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <button 
            className={`px-4 py-2 rounded-full font-medium transition-colors ${
              activeFilter === 'all' 
                ? 'bg-primary/10 text-primary dark:bg-primary/30 dark:text-primary/90' 
                : 'hover:bg-primary/10 hover:text-primary dark:hover:bg-primary/30 dark:hover:text-primary/90'
            }`}
            onClick={() => setActiveFilter('all')}
          >
            All
          </button>
          <button 
            className={`px-4 py-2 rounded-full font-medium transition-colors ${
              activeFilter === 'website' 
                ? 'bg-primary/10 text-primary dark:bg-primary/30 dark:text-primary/90' 
                : 'hover:bg-primary/10 hover:text-primary dark:hover:bg-primary/30 dark:hover:text-primary/90'
            }`}
            onClick={() => setActiveFilter('website')}
          >
            Websites
          </button>
          <button 
            className={`px-4 py-2 rounded-full font-medium transition-colors ${
              activeFilter === 'webapp' 
                ? 'bg-primary/10 text-primary dark:bg-primary/30 dark:text-primary/90' 
                : 'hover:bg-primary/10 hover:text-primary dark:hover:bg-primary/30 dark:hover:text-primary/90'
            }`}
            onClick={() => setActiveFilter('webapp')}
          >
            Web Apps
          </button>
          <button 
            className={`px-4 py-2 rounded-full font-medium transition-colors ${
              activeFilter === 'ecommerce' 
                ? 'bg-primary/10 text-primary dark:bg-primary/30 dark:text-primary/90' 
                : 'hover:bg-primary/10 hover:text-primary dark:hover:bg-primary/30 dark:hover:text-primary/90'
            }`}
            onClick={() => setActiveFilter('ecommerce')}
          >
            E-commerce
          </button>
        </motion.div>
        
        <AnimatePresence mode="wait">
          <motion.div 
            key={activeFilter}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            exit={{ opacity: 0 }}
          >
            {filteredProjects.map((project) => (
              <motion.div 
                key={project.id}
                variants={item}
                className="glass rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl group relative"
                whileHover={{ y: -10 }}
              >
                <img 
                  src={project.imageUrl} 
                  alt={project.title} 
                  className="w-full h-60 object-cover object-top transition-transform duration-500 group-hover:scale-110" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent opacity-0 group-hover:opacity-70 transition-opacity duration-300 flex items-end">
                  <div className="p-6 w-full">
                    <h3 className="text-xl font-bold text-white mb-2">{project.title}</h3>
                    <p className="text-slate-200 mb-4">{project.description}</p>
                    <div className="flex gap-2 flex-wrap">
                      {project.technologies.map((tech, index) => (
                        <span key={index} className="text-xs bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};

export default Projects;
