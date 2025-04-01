import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { useIsMobile } from '@/hooks/use-mobile';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChevronRight, Github, ExternalLink, ArrowRight } from 'lucide-react';
import { Link } from 'wouter';

type ProjectCategory = 'all' | 'website' | 'webapp' | 'ecommerce';

interface Project {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  category: Exclude<ProjectCategory, 'all'>;
  technologies: string[];
  githubUrl?: string;
  liveUrl?: string;
}

const projects: Project[] = [
  {
    id: 1,
    title: "E-Commerce Platform",
    description: "A full-featured e-commerce platform with product catalog, shopping cart, payment integration, and admin dashboard.",
    imageUrl: "https://images.unsplash.com/photo-1556742031-c6961e8560b0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
    category: "ecommerce",
    technologies: ["React", "Node.js", "MongoDB", "Express", "Stripe"],
    githubUrl: "#",
    liveUrl: "#"
  },
  {
    id: 2,
    title: "Portfolio Website",
    description: "A modern personal portfolio website with smooth animations, 3D elements, and responsive design.",
    imageUrl: "https://images.unsplash.com/photo-1545235617-9465d2a55698?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
    category: "website",
    technologies: ["React", "Three.js", "Framer Motion", "Tailwind CSS"],
    githubUrl: "#",
    liveUrl: "#"
  },
  {
    id: 3,
    title: "Task Management App",
    description: "A collaborative task management application with real-time updates, task assignments, and project tracking.",
    imageUrl: "https://images.unsplash.com/photo-1611224885990-ab7363d7f2a9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
    category: "webapp",
    technologies: ["React", "Firebase", "Redux", "Material UI"],
    githubUrl: "#",
    liveUrl: "#"
  },
  {
    id: 4,
    title: "Real Estate Website",
    description: "A property listing website with advanced search, filtering options, and virtual tour features.",
    imageUrl: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
    category: "website",
    technologies: ["Next.js", "Tailwind CSS", "MongoDB", "Mapbox"],
    githubUrl: "#",
    liveUrl: "#"
  },
  {
    id: 5,
    title: "Food Delivery App",
    description: "A food delivery platform with restaurant listings, order tracking, and payment processing.",
    imageUrl: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
    category: "ecommerce",
    technologies: ["React Native", "Node.js", "Express", "MongoDB", "Stripe"],
    githubUrl: "#",
    liveUrl: "#"
  },
  {
    id: 6,
    title: "Social Media Dashboard",
    description: "A comprehensive analytics dashboard for social media management and performance tracking.",
    imageUrl: "https://images.unsplash.com/photo-1518186285589-2f7649de83e0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
    category: "webapp",
    technologies: ["React", "Chart.js", "Node.js", "Express", "PostgreSQL"],
    githubUrl: "#",
    liveUrl: "#"
  }
];

const allCategories: ProjectCategory[] = ['all', 'website', 'webapp', 'ecommerce'];

const Projects = () => {
  const [activeCategory, setActiveCategory] = useState<ProjectCategory>('all');
  const [hoveredProject, setHoveredProject] = useState<number | null>(null);
  const isMobile = useIsMobile();
  
  const titleAnimation = useScrollAnimation({ threshold: 0.1 });
  const subtitleAnimation = useScrollAnimation({ threshold: 0.1, delay: 200 });
  const filtersAnimation = useScrollAnimation({ threshold: 0.1, delay: 300 });
  
  // Filter projects based on active category
  const filteredProjects = activeCategory === 'all' 
    ? projects 
    : projects.filter(project => project.category === activeCategory);
  
  return (
    <section id="projects" className="py-20 md:py-28 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      <div className="absolute top-40 left-0 w-64 h-64 rounded-full bg-primary/5 blur-3xl"></div>
      <div className="absolute bottom-20 right-0 w-72 h-72 rounded-full bg-secondary/5 blur-3xl"></div>
      
      <div className="container mx-auto px-4 md:px-6 relative">
        {/* Section header */}
        <div className="text-center mb-12">
          <motion.h2
            ref={titleAnimation.ref}
            initial={{ opacity: 0, y: 20 }}
            animate={titleAnimation.isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-4xl font-bold mb-4"
          >
            Featured <span className="gradient-text">Projects</span>
          </motion.h2>
          
          <motion.p
            ref={subtitleAnimation.ref}
            initial={{ opacity: 0, y: 20 }}
            animate={subtitleAnimation.isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="text-muted-foreground max-w-2xl mx-auto"
          >
            Explore my portfolio of web applications, websites, and digital experiences.
            Each project represents a unique challenge and solution.
          </motion.p>
        </div>
        
        {/* Category filters */}
        <motion.div
          ref={filtersAnimation.ref}
          initial={{ opacity: 0, y: 20 }}
          animate={filtersAnimation.isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="flex flex-wrap justify-center gap-3 mb-12"
        >
          {allCategories.map((category) => (
            <Button
              key={category}
              variant={activeCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveCategory(category)}
              className="capitalize focus:ring-2 focus:ring-primary focus:ring-offset-2"
              aria-pressed={activeCategory === category}
              aria-label={`Filter projects by ${category} category`}
            >
              {category}
            </Button>
          ))}
        </motion.div>
        
        {/* Projects grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
          >
            {filteredProjects.map((project, index) => (
              <ProjectCard
                key={project.id}
                project={project}
                index={index}
                isHovered={hoveredProject === project.id}
                onHover={() => setHoveredProject(project.id)}
                onLeave={() => setHoveredProject(null)}
              />
            ))}
          </motion.div>
        </AnimatePresence>
        
        {/* More projects button */}
        <div className="mt-12 text-center">
          <Button 
            size="lg" 
            variant="outline" 
            className="gap-2 group hover:border-primary hover:bg-primary/5 transition-all focus:ring-2 focus:ring-primary focus:ring-offset-2"
            onClick={() => setActiveCategory('all')}
            aria-label="View all projects in every category"
            aria-pressed={activeCategory === 'all'}
          >
            View All Projects 
            <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" aria-hidden="true" />
          </Button>
        </div>
      </div>
    </section>
  );
};

interface ProjectCardProps {
  project: Project;
  index: number;
  isHovered: boolean;
  onHover: () => void;
  onLeave: () => void;
}

const ProjectCard = ({ project, index, isHovered, onHover, onLeave }: ProjectCardProps) => {
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
      className="group relative h-[350px] rounded-lg overflow-hidden border bg-card shadow-sm hover:shadow-xl transition-all duration-500 cursor-pointer"
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      whileHover={{ y: -8 }}
      onClick={() => window.location.href = `/projects/${project.id}`}
      role="article"
      aria-label={`Project: ${project.title}`}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          window.location.href = `/projects/${project.id}`;
        }
      }}
    >
      {/* Project image */}
      <img 
        src={project.imageUrl} 
        alt={project.title}
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
      />
      
      {/* Project info overlay - animated on hover */}
      <motion.div 
        className="absolute inset-0 z-20 p-6 flex flex-col justify-end"
        initial={{ opacity: 1 }}
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <motion.div 
          className="space-y-2"
          initial={{ y: 0 }}
          whileHover={{ y: -5 }}
          transition={{ 
            duration: 0.3,
            type: "spring", 
            stiffness: 200 
          }}
        >
          {/* Project category */}
          <motion.div 
            className="flex gap-2 mb-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Badge 
              variant="secondary" 
              className="capitalize bg-primary/80 hover:bg-primary text-white transition-colors"
            >
              {project.category}
            </Badge>
          </motion.div>
          
          {/* Project title with animated underline on hover */}
          <div className="relative">
            <h3 className="text-xl font-bold text-white">{project.title}</h3>
            <motion.div 
              className="absolute -bottom-1 left-0 h-[2px] bg-primary/80"
              initial={{ width: "0%" }}
              whileHover={{ width: "100%" }}
              transition={{ duration: 0.3 }}
            />
          </div>
          
          {/* Description - fades in on hover */}
          <motion.p 
            className="text-white/90 text-sm line-clamp-2 mb-4"
            initial={{ opacity: 0.7 }}
            whileHover={{ opacity: 1 }}
          >
            {project.description}
          </motion.p>
          
          {/* Technology tags with staggered animation */}
          <div className="flex flex-wrap gap-2 mb-4">
            {project.technologies.map((tech, i) => (
              <motion.span 
                key={i}
                className="text-xs px-2 py-1 bg-white/10 text-white/90 rounded hover:bg-white/20 transition-colors"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ 
                  delay: 0.1 + (i * 0.05),
                  type: "spring",
                  stiffness: 300,
                  damping: 20 
                }}
                whileHover={{ y: -2, scale: 1.05 }}
              >
                {tech}
              </motion.span>
            ))}
          </div>
          
          {/* Action buttons with hover effects */}
          <motion.div 
            className="flex gap-3"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            {project.githubUrl && (
              <Button 
                size="sm" 
                variant="outline" 
                className="bg-black/30 text-white border-white/20 hover:bg-primary/80 hover:border-transparent hover:text-white hover:scale-105 transition-all"
                aria-label={`View source code for ${project.title}`}
                onClick={(e) => {
                  e.stopPropagation();
                  window.open(project.githubUrl, '_blank');
                }}
              >
                <Github size={16} className="mr-1" /> Code
              </Button>
            )}
            {project.liveUrl && (
              <Button 
                size="sm" 
                className="bg-primary hover:bg-primary/90 hover:scale-105 transition-all gap-1"
                aria-label={`View live demo of ${project.title}`}
                onClick={(e) => {
                  e.stopPropagation();
                  window.open(project.liveUrl, '_blank');
                }}
              >
                <ExternalLink size={16} /> Demo
              </Button>
            )}
          </motion.div>
        </motion.div>
      </motion.div>
      
      {/* Animated gradient overlay */}
      <motion.div 
        className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent z-10"
        initial={{ opacity: 0.7 }}
        animate={{ opacity: isHovered ? 0.95 : 0.7 }}
        transition={{ duration: 0.3 }}
      />
      
      {/* Interactive corner badge - appears on hover */}
      {isHovered && (
        <motion.div
          className="absolute top-4 right-4 z-30"
          initial={{ opacity: 0, scale: 0.5, rotate: -10 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ 
            duration: 0.3,
            type: "spring",
            stiffness: 300
          }}
          onClick={(e) => {
            e.stopPropagation();
            window.location.href = `/projects/${project.id}`;
          }}
        >
          <Badge 
            className="bg-primary/90 hover:bg-primary text-white px-3 py-1.5 text-xs cursor-pointer flex items-center gap-1 focus:ring-2 focus:ring-white focus:ring-offset-1"
            tabIndex={0}
            role="link"
            aria-label={`View detailed case study for ${project.title}`}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                window.location.href = `/projects/${project.id}`;
              }
            }}
          >
            View Case Study <ArrowRight size={12} aria-hidden="true" />
          </Badge>
        </motion.div>
      )}
    </motion.div>
  );
};

export default Projects;