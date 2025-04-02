import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { useIsMobile } from "@/hooks/use-mobile";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronRight, ExternalLink, ArrowRight } from "lucide-react";
import { Link } from "wouter";
import p1 from "../images/p1.svg";
import p2 from "../images/p2.svg";
import p3 from "../images/p3.svg";

type ProjectCategory = "all" | "website" | "webapp";

interface Project {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  category: Exclude<ProjectCategory, "all">;
  technologies: string[];
  liveUrl?: string;
}

const projects: Project[] = [
  {
    id: 1,
    title: "Restaurant App",
    description:
      "A restaurant app that enhances online presence by showcasing services, quality, and marketing strategies. Users can order food, book tables, and explore restaurant offerings seamlessly.",
    imageUrl: p2,
    category: "webapp",
    technologies: ["React", "Node.js", "Express", "MongoDB", "Tailwind CSS"],
    liveUrl: "https://savoria-restaurant-app.onrender.com/",
  },
  {
    id: 2,
    title: "Business Website Template",
    description:
      "A modern website template that helps businesses improve their online presence with a professional, conversion-optimized layout.",
    imageUrl: p1,
    category: "website",
    technologies: ["React", "Next.js", "Tailwind CSS", "Framer Motion"],
    liveUrl: "https://business-blue-print.vercel.app/",
  },
  {
    id: 3,
    title: "Exercise App",
    description:
      "A fitness app where users can search exercises by body part, watch YouTube tutorials, and learn proper workout techniques.",
    imageUrl: p3,
    category: "webapp",
    technologies: ["React", "Material UI", "RapidAPI", "Framer Motion"],
    liveUrl: "https://activize.netlify.app/",
  },
];

const allCategories: ProjectCategory[] = ["all", "website", "webapp"];

const Projects = () => {
  const [activeCategory, setActiveCategory] = useState<ProjectCategory>("all");
  const [hoveredProject, setHoveredProject] = useState<number | null>(null);
  const isMobile = useIsMobile();

  const titleAnimation = useScrollAnimation({ threshold: 0.1 });
  const subtitleAnimation = useScrollAnimation({ threshold: 0.1, delay: 200 });
  const filtersAnimation = useScrollAnimation({ threshold: 0.1, delay: 300 });

  // Filter projects based on active category
  const filteredProjects =
    activeCategory === "all"
      ? projects
      : projects.filter((project) => project.category === activeCategory);

  return (
    <section
      id="projects"
      className="py-12 md:py-16 lg:py-20 relative overflow-hidden"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      <div className="absolute top-40 left-0 w-64 h-64 rounded-full bg-primary/5 blur-3xl"></div>
      <div className="absolute bottom-20 right-0 w-72 h-72 rounded-full bg-secondary/5 blur-3xl"></div>

      <div className="section-container relative">
        {/* Section header */}
        <div className="text-center mb-8">
          <motion.h2
            ref={titleAnimation.ref}
            initial={{ opacity: 0, y: 20 }}
            animate={titleAnimation.isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-4xl font-bold mb-3"
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
            Explore my portfolio of web applications, websites, and digital
            experiences. Each project represents a unique challenge and
            solution.
          </motion.p>
        </div>

        {/* Category filters */}
        <motion.div
          ref={filtersAnimation.ref}
          initial={{ opacity: 0, y: 20 }}
          animate={filtersAnimation.isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="flex flex-wrap justify-center gap-3 mb-8"
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
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10 auto-rows-fr"
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
        <div className="mt-8 text-center">
          <Button
            size="lg"
            variant="outline"
            className="gap-2 group hover:border-primary hover:bg-primary/5 transition-all duration-300 focus:ring-2 focus:ring-primary focus:ring-offset-2"
            onClick={() => setActiveCategory("all")}
            aria-label="View all projects in every category"
            aria-pressed={activeCategory === "all"}
          >
            Explore All Projects
            <ArrowRight
              size={16}
              className="group-hover:translate-x-2 transition-transform duration-300"
              aria-hidden="true"
            />
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

const ProjectCard = ({
  project,
  index,
  isHovered,
  onHover,
  onLeave,
}: ProjectCardProps) => {
  const cardAnimation = useScrollAnimation({
    threshold: 0.1,
    delay: index * 100, // Stagger effect
  });

  const [imageError, setImageError] = useState(false);

  // Handle image errors
  const handleImageError = () => {
    console.error(`Failed to load image: ${project.imageUrl}`);
    setImageError(true);
  };

  return (
    <motion.div
      ref={cardAnimation.ref}
      initial={{ opacity: 0, y: 20 }}
      animate={cardAnimation.isVisible ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 0.5,
        type: "spring",
        stiffness: 100,
        damping: 20,
      }}
      className="group relative rounded-lg overflow-hidden border bg-card shadow-sm hover:shadow-xl transition-all duration-500 cursor-pointer h-full flex flex-col"
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      whileHover={{ y: -10, scale: 1.02 }}
      onClick={() => project.liveUrl && window.open(project.liveUrl, "_blank")}
      role="article"
      aria-label={`Project: ${project.title}`}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          project.liveUrl && window.open(project.liveUrl, "_blank");
        }
      }}
    >
      {/* Top section - Project Image */}
      <div className="h-56 flex items-center justify-center bg-gray-50 dark:bg-gray-900/40">
        {imageError ? (
          <div className="w-full h-full flex items-center justify-center bg-muted text-muted-foreground">
            <p>Image not available</p>
          </div>
        ) : (
          <div className="w-full h-full p-5 flex items-center justify-center">
            <img
              src={project.imageUrl}
              alt={project.title}
              className="max-h-full object-contain"
              onError={handleImageError}
            />
          </div>
        )}
      </div>

      {/* Bottom section - Project Info */}
      <div className="p-5 bg-card flex-1 flex flex-col">
        <div className="mb-1">
          <span className="text-xs font-medium text-primary uppercase tracking-wider">
            {project.category}
          </span>
        </div>

        <h3 className="text-xl font-bold mb-2">{project.title}</h3>

        <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
          {project.description}
        </p>

        {/* Technologies */}
        <div className="flex flex-wrap gap-2 mb-4">
          {project.technologies.map((tech, i) => (
            <span
              key={i}
              className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full"
            >
              {tech}
            </span>
          ))}
        </div>

        {/* Action button */}
        <div className="mt-auto pt-2">
          {project.liveUrl && (
            <Button
              size="sm"
              className="w-full gap-2 bg-primary hover:bg-primary/90 text-white"
              onClick={(e) => {
                e.stopPropagation();
                window.open(project.liveUrl, "_blank");
              }}
            >
              <ExternalLink size={16} /> Live Demo
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default Projects;
