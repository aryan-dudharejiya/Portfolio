import { useEffect, useState } from 'react';
import { useRoute } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import SEOHead from '@/components/SEOHead';
import { Github, ExternalLink, Calendar, Clock, Users, ArrowLeft, ChevronRight } from 'lucide-react';
import { Link } from 'wouter';

// Extended Project Type for detailed case study
interface ProjectDetail {
  id: number;
  title: string;
  description: string;
  longDescription: string;
  imageUrl: string;
  images: string[];
  category: string;
  technologies: string[];
  githubUrl?: string;
  liveUrl?: string;
  duration: string;
  client: string;
  role: string;
  date: string;
  features: string[];
  challenges: {
    title: string;
    description: string;
  }[];
  solutions: {
    title: string;
    description: string;
  }[];
  metrics: {
    title: string;
    value: number;
    unit: string;
    increase?: number;
  }[];
  testimonial?: {
    quote: string;
    author: string;
    role: string;
  };
}

// Mock project details for demonstration
const projectDetails: ProjectDetail[] = [
  {
    id: 1,
    title: "E-Commerce Platform",
    description: "A full-featured e-commerce platform with product catalog, shopping cart, payment integration, and admin dashboard.",
    longDescription: "Developed a comprehensive e-commerce solution with a focus on performance, scalability, and user experience. The platform features a modern UI, advanced product filtering, secure payment processing, real-time inventory management, and a powerful admin dashboard for business owners to manage their online store with ease.",
    imageUrl: "https://images.unsplash.com/photo-1556742031-c6961e8560b0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1556742031-c6961e8560b0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1556741533-6e6a62bd8b49?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1556740772-1a741367b93e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1556740758-90de374c12ad?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80"
    ],
    category: "ecommerce",
    technologies: ["React", "Node.js", "MongoDB", "Express", "Stripe", "Redis", "AWS S3", "Docker"],
    githubUrl: "#",
    liveUrl: "#",
    duration: "4 months",
    client: "FashionStore Inc.",
    role: "Full Stack Developer",
    date: "June 2023",
    features: [
      "Responsive product catalog with advanced filtering",
      "User authentication and profile management",
      "Shopping cart with persistent storage",
      "Secure payment processing with Stripe",
      "Order tracking and history",
      "Admin dashboard for inventory and order management",
      "Real-time sales analytics",
      "Automated email notifications"
    ],
    challenges: [
      {
        title: "Performance Optimization",
        description: "The initial product listing page was slow to load with large inventory, causing high bounce rates."
      },
      {
        title: "Payment Security",
        description: "Implementing secure payment processing while maintaining a seamless checkout experience."
      },
      {
        title: "Mobile Responsiveness",
        description: "Creating a consistent experience across various device sizes and orientations."
      }
    ],
    solutions: [
      {
        title: "Implementation of Redis Caching",
        description: "Added Redis caching layer for product data and implemented lazy loading of images to improve initial load time by 65%."
      },
      {
        title: "Custom Stripe Integration",
        description: "Developed a secure custom Stripe integration with 3D Secure authentication while maintaining a smooth user experience."
      },
      {
        title: "Mobile-First Design Approach",
        description: "Adopted a mobile-first design strategy with extensive testing across devices to ensure consistent experience."
      }
    ],
    metrics: [
      {
        title: "Conversion Rate",
        value: 4.2,
        unit: "%",
        increase: 35
      },
      {
        title: "Page Load Time",
        value: 1.8,
        unit: "seconds",
        increase: -65
      },
      {
        title: "Average Order Value",
        value: 78,
        unit: "$",
        increase: 15
      },
      {
        title: "Customer Retention",
        value: 68,
        unit: "%",
        increase: 22
      }
    ],
    testimonial: {
      quote: "The e-commerce platform developed has transformed our online business. The attention to detail, performance optimization, and user-friendly interface have significantly improved our conversion rates and customer satisfaction.",
      author: "Sarah Johnson",
      role: "CEO, FashionStore Inc."
    }
  },
  {
    id: 2,
    title: "Portfolio Website",
    description: "A modern personal portfolio website with smooth animations, 3D elements, and responsive design.",
    longDescription: "Created an innovative portfolio website showcasing a developer's skills and projects. The design emphasizes creativity through custom animations, interactive 3D elements, and a responsive layout that adapts seamlessly to any device. Special attention was given to performance optimization, accessibility, and SEO to ensure a fast, inclusive, and discoverable online presence.",
    imageUrl: "https://images.unsplash.com/photo-1545235617-9465d2a55698?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1545235617-9465d2a55698?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1545235617-7a424c1a60cc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1545239351-ef35f43d514b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1545235617-7a424c1a60cc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80"
    ],
    category: "website",
    technologies: ["React", "Three.js", "Framer Motion", "Tailwind CSS", "Vite", "TypeScript"],
    githubUrl: "#",
    liveUrl: "#",
    duration: "3 weeks",
    client: "Personal Project",
    role: "Frontend Developer",
    date: "August 2023",
    features: [
      "Interactive 3D elements with Three.js",
      "Smooth page transitions and animations",
      "Responsive design for all device sizes",
      "Dark/light mode toggle",
      "Project showcase with filtering",
      "Contact form with validation",
      "Performance optimized assets",
      "PWA capabilities for offline access"
    ],
    challenges: [
      {
        title: "3D Performance",
        description: "Balancing impressive 3D visuals with performance, especially on mobile devices."
      },
      {
        title: "Animation Complexity",
        description: "Creating complex, coordinated animations that enhance rather than distract from the content."
      },
      {
        title: "Accessibility",
        description: "Ensuring interactive elements and animations remained accessible to all users."
      }
    ],
    solutions: [
      {
        title: "Optimized 3D Rendering",
        description: "Implemented level-of-detail switching for 3D models and deferred loading based on device capabilities."
      },
      {
        title: "Orchestrated Animation System",
        description: "Developed a system to coordinate animations based on scroll position and viewport visibility for a cohesive experience."
      },
      {
        title: "Accessibility-First Approach",
        description: "Added proper ARIA attributes, keyboard navigation, and ensured all animations can be disabled for users with motion sensitivity."
      }
    ],
    metrics: [
      {
        title: "Performance Score",
        value: 97,
        unit: "/100",
        increase: 28
      },
      {
        title: "Accessibility Score",
        value: 100,
        unit: "/100",
        increase: 15
      },
      {
        title: "Time on Site",
        value: 3.5,
        unit: "minutes",
        increase: 75
      },
      {
        title: "Conversion Rate",
        value: 8.2,
        unit: "%",
        increase: 120
      }
    ],
    testimonial: {
      quote: "This portfolio site perfectly captures my professional identity while showcasing my technical capabilities. The attention to both aesthetics and performance has resulted in significantly more project inquiries and opportunities.",
      author: "Alex Chen",
      role: "Frontend Developer"
    }
  },
  {
    id: 3,
    title: "Task Management App",
    description: "A collaborative task management application with real-time updates, task assignments, and project tracking.",
    longDescription: "Built a comprehensive task management solution enabling teams to collaborate efficiently on projects. The application features real-time updates, intuitive task assignment, detailed project tracking, and insightful analytics. Special focus was given to creating a friction-free user experience that promotes productivity while providing powerful organizational tools for project managers.",
    imageUrl: "https://images.unsplash.com/photo-1611224885990-ab7363d7f2a9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1611224885990-ab7363d7f2a9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1611224923853-80b023f02d71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1611225825197-9fe532ff9e5a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1611224923853-80b023f02d71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80"
    ],
    category: "webapp",
    technologies: ["React", "Firebase", "Redux", "Material UI", "Chart.js", "PWA"],
    githubUrl: "#",
    liveUrl: "#",
    duration: "3 months",
    client: "TaskMaster Inc.",
    role: "Lead Developer",
    date: "March 2023",
    features: [
      "Drag-and-drop task organization",
      "Real-time collaboration",
      "Task comments and file attachments",
      "User roles and permissions",
      "Project templates and recurring tasks",
      "Time tracking and reporting",
      "Calendar integration",
      "Mobile app with offline support"
    ],
    challenges: [
      {
        title: "Real-time Synchronization",
        description: "Ensuring multiple users could collaborate simultaneously without conflicts or data loss."
      },
      {
        title: "Complex State Management",
        description: "Managing application state across multiple interconnected features while maintaining performance."
      },
      {
        title: "Offline Capability",
        description: "Implementing robust offline support that allows users to continue working without internet connection."
      }
    ],
    solutions: [
      {
        title: "Firebase Realtime Database",
        description: "Utilized Firebase's realtime database with custom conflict resolution strategies to ensure data integrity during collaborative editing."
      },
      {
        title: "Redux Architecture Optimization",
        description: "Implemented a normalized Redux store structure with selective updates to minimize re-renders and maintain smooth performance."
      },
      {
        title: "Service Worker Background Sync",
        description: "Developed a sophisticated sync system using service workers to queue changes when offline and synchronize when connectivity is restored."
      }
    ],
    metrics: [
      {
        title: "Team Productivity",
        value: 32,
        unit: "%",
        increase: 32
      },
      {
        title: "Meeting Time",
        value: 15.5,
        unit: "hrs/week",
        increase: -45
      },
      {
        title: "Project Delivery",
        value: 28,
        unit: "%",
        increase: 28
      },
      {
        title: "User Adoption",
        value: 94,
        unit: "%",
        increase: 40
      }
    ],
    testimonial: {
      quote: "This task management platform has revolutionized how our teams collaborate. The intuitive interface, real-time updates, and comprehensive reporting have significantly improved our productivity and project visibility.",
      author: "Michael Torres",
      role: "Product Manager, TaskMaster Inc."
    }
  }
];

// Components for different sections of the case study page
const ProjectHeader = ({ project }: { project: ProjectDetail }) => {
  const animation = useScrollAnimation({ threshold: 0.1 });
  return (
    <div className="relative overflow-hidden rounded-xl">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/60 to-black/90 z-10"></div>
      <img 
        src={project.imageUrl} 
        alt={project.title} 
        className="w-full h-[500px] object-cover object-center"
      />
      <div className="absolute inset-0 z-20 flex flex-col justify-end p-8 md:p-12">
        <motion.div
          ref={animation.ref}
          initial={{ opacity: 0, y: 20 }}
          animate={animation.isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          <Badge variant="secondary" className="mb-4 capitalize bg-primary/90 text-white">
            {project.category}
          </Badge>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">{project.title}</h1>
          <p className="text-white/80 text-lg md:text-xl max-w-3xl mb-6">{project.description}</p>
          <div className="flex flex-wrap gap-3 mb-6">
            {project.technologies.map((tech, index) => (
              <Badge 
                key={index} 
                variant="outline" 
                className="bg-white/10 text-white border-white/20 hover:bg-white/20"
              >
                {tech}
              </Badge>
            ))}
          </div>
          <div className="flex flex-wrap gap-4">
            {project.githubUrl && (
              <Button variant="outline" size="lg" className="gap-2 bg-white/10 text-white border-white/20 hover:bg-white/20 hover:text-white">
                <Github size={18} /> View Code
              </Button>
            )}
            {project.liveUrl && (
              <Button size="lg" className="gap-2">
                <ExternalLink size={18} /> Live Demo
              </Button>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

const ProjectMetadata = ({ project }: { project: ProjectDetail }) => {
  const animation = useScrollAnimation({ threshold: 0.1 });
  return (
    <motion.div 
      ref={animation.ref}
      initial={{ opacity: 0, y: 20 }}
      animate={animation.isVisible ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5 }}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-6 bg-card rounded-xl border shadow-sm"
    >
      <div className="flex items-center gap-4">
        <div className="bg-primary/10 p-3 rounded-full">
          <Calendar className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h3 className="text-sm font-medium text-muted-foreground">Date</h3>
          <p className="font-medium">{project.date}</p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="bg-primary/10 p-3 rounded-full">
          <Clock className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h3 className="text-sm font-medium text-muted-foreground">Duration</h3>
          <p className="font-medium">{project.duration}</p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="bg-primary/10 p-3 rounded-full">
          <Users className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h3 className="text-sm font-medium text-muted-foreground">Client</h3>
          <p className="font-medium">{project.client}</p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="bg-primary/10 p-3 rounded-full">
          <Users className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h3 className="text-sm font-medium text-muted-foreground">Role</h3>
          <p className="font-medium">{project.role}</p>
        </div>
      </div>
    </motion.div>
  );
};

const ProjectDescription = ({ project }: { project: ProjectDetail }) => {
  const animation = useScrollAnimation({ threshold: 0.1 });
  return (
    <motion.div
      ref={animation.ref}
      initial={{ opacity: 0, y: 20 }}
      animate={animation.isVisible ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-2xl md:text-3xl font-bold mb-6">Project Overview</h2>
      <p className="text-muted-foreground leading-relaxed mb-8">{project.longDescription}</p>
      
      <h3 className="text-xl font-semibold mb-4">Key Features</h3>
      <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-8">
        {project.features.map((feature, index) => (
          <li key={index} className="flex items-start gap-2">
            <span className="text-primary mt-1">
              <ChevronRight size={16} />
            </span>
            <span>{feature}</span>
          </li>
        ))}
      </ul>
    </motion.div>
  );
};

const ProjectGallery = ({ project }: { project: ProjectDetail }) => {
  const animation = useScrollAnimation({ threshold: 0.1 });
  return (
    <motion.div
      ref={animation.ref}
      initial={{ opacity: 0, y: 20 }}
      animate={animation.isVisible ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5 }}
      className="mb-16"
    >
      <h2 className="text-2xl md:text-3xl font-bold mb-6">Project Gallery</h2>
      <Carousel className="w-full">
        <CarouselContent>
          {project.images.map((image, index) => (
            <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
              <div className="p-1">
                <div className="overflow-hidden rounded-xl border shadow-sm group">
                  <img 
                    src={image} 
                    alt={`${project.title} screenshot ${index + 1}`}
                    className="w-full aspect-video object-cover object-center transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="flex justify-end gap-2 mt-4">
          <CarouselPrevious />
          <CarouselNext />
        </div>
      </Carousel>
    </motion.div>
  );
};

const ProjectChallengesSolutions = ({ project }: { project: ProjectDetail }) => {
  const animation = useScrollAnimation({ threshold: 0.1 });
  return (
    <motion.div
      ref={animation.ref}
      initial={{ opacity: 0, y: 20 }}
      animate={animation.isVisible ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5 }}
      className="mb-16"
    >
      <Tabs defaultValue="challenges" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="challenges">Challenges</TabsTrigger>
          <TabsTrigger value="solutions">Solutions</TabsTrigger>
        </TabsList>
        <TabsContent value="challenges" className="space-y-6">
          {project.challenges.map((challenge, index) => (
            <div key={index} className="bg-card rounded-lg border p-6 shadow-sm">
              <h3 className="text-lg font-semibold mb-2">{challenge.title}</h3>
              <p className="text-muted-foreground">{challenge.description}</p>
            </div>
          ))}
        </TabsContent>
        <TabsContent value="solutions" className="space-y-6">
          {project.solutions.map((solution, index) => (
            <div key={index} className="bg-card rounded-lg border p-6 shadow-sm">
              <h3 className="text-lg font-semibold mb-2">{solution.title}</h3>
              <p className="text-muted-foreground">{solution.description}</p>
            </div>
          ))}
        </TabsContent>
      </Tabs>
    </motion.div>
  );
};

const ProjectMetrics = ({ project }: { project: ProjectDetail }) => {
  const animation = useScrollAnimation({ threshold: 0.1 });
  return (
    <motion.div
      ref={animation.ref}
      initial={{ opacity: 0, y: 20 }}
      animate={animation.isVisible ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5 }}
      className="mb-16"
    >
      <h2 className="text-2xl md:text-3xl font-bold mb-6">Impact & Metrics</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {project.metrics.map((metric, index) => (
          <div key={index} className="bg-card rounded-lg border p-6 shadow-sm relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute right-0 top-0 w-24 h-24 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
            
            <h3 className="text-muted-foreground mb-1">{metric.title}</h3>
            <div className="flex items-end gap-2 mb-3">
              <span className="text-3xl font-bold">{metric.value}{metric.unit}</span>
              {metric.increase && (
                <span className={`text-sm font-medium ${metric.increase > 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {metric.increase > 0 ? '+' : ''}{metric.increase}%
                </span>
              )}
            </div>
            <Progress 
              value={Math.min(100, Math.abs(metric.increase || 50))} 
              className={`h-2 ${metric.increase && metric.increase > 0 ? 'bg-green-100' : 'bg-red-100'}`}
            />
          </div>
        ))}
      </div>
    </motion.div>
  );
};

const ProjectTestimonial = ({ testimonial }: { testimonial?: ProjectDetail['testimonial'] }) => {
  if (!testimonial) return null;
  
  const animation = useScrollAnimation({ threshold: 0.1 });
  return (
    <motion.div
      ref={animation.ref}
      initial={{ opacity: 0, y: 20 }}
      animate={animation.isVisible ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5 }}
      className="mb-16"
    >
      <div className="bg-primary/5 rounded-xl p-8 relative">
        <div className="text-6xl text-primary/20 absolute top-6 left-6">"</div>
        <blockquote className="relative z-10">
          <p className="text-lg md:text-xl italic mb-6">
            {testimonial.quote}
          </p>
          <footer>
            <p className="font-medium">{testimonial.author}</p>
            <p className="text-muted-foreground">{testimonial.role}</p>
          </footer>
        </blockquote>
      </div>
    </motion.div>
  );
};

// Main Project Details Component
const ProjectDetails = () => {
  const [, params] = useRoute<{ id: string }>('/projects/:id');
  const [project, setProject] = useState<ProjectDetail | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Simulate API fetch
    const fetchProject = async () => {
      try {
        setLoading(true);
        // In a real app, this would be an API call
        const id = parseInt(params?.id || '0');
        const foundProject = projectDetails.find(p => p.id === id) || null;
        
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        setProject(foundProject);
      } catch (error) {
        console.error('Error fetching project details:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProject();
  }, [params?.id]);
  
  // If loading, show skeleton
  if (loading) {
    return (
      <div className="container mx-auto px-4 md:px-6 py-12">
        <div className="animate-pulse">
          <div className="h-[500px] bg-gray-200 dark:bg-gray-800 rounded-xl mb-8"></div>
          <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-2/3 mb-8"></div>
          {/* More skeleton elements */}
        </div>
      </div>
    );
  }
  
  // If project not found
  if (!project) {
    return (
      <div className="container mx-auto px-4 md:px-6 py-24 text-center">
        <h1 className="text-3xl font-bold mb-4">Project Not Found</h1>
        <p className="text-muted-foreground mb-8">The project you're looking for doesn't exist or has been removed.</p>
        <Link href="/#projects">
          <Button size="lg">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Projects
          </Button>
        </Link>
      </div>
    );
  }
  
  return (
    <>
      <SEOHead 
        title={`${project.title} | Case Study`}
        description={project.description}
        keywords={project.technologies.join(', ')}
      />
      
      <div className="container mx-auto px-4 md:px-6 pb-20 pt-8">
        {/* Back to projects link */}
        <Link href="/#projects">
          <Button variant="ghost" className="mb-8 group">
            <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" /> 
            Back to Projects
          </Button>
        </Link>
        
        {/* Project header with main image and title */}
        <ProjectHeader project={project} />
        
        <div className="mt-8 space-y-12">
          {/* Project metadata (date, duration, client, role) */}
          <ProjectMetadata project={project} />
          
          {/* Project description and features */}
          <ProjectDescription project={project} />
          
          {/* Project image gallery */}
          <ProjectGallery project={project} />
          
          {/* Challenges and solutions */}
          <ProjectChallengesSolutions project={project} />
          
          {/* Metrics and impact */}
          <ProjectMetrics project={project} />
          
          {/* Client testimonial if available */}
          {project.testimonial && <ProjectTestimonial testimonial={project.testimonial} />}
          
          {/* Call to action buttons */}
          <div className="flex flex-wrap gap-4 justify-center">
            {project.githubUrl && (
              <Button variant="outline" size="lg" className="gap-2">
                <Github size={18} /> View Code
              </Button>
            )}
            {project.liveUrl && (
              <Button size="lg" className="gap-2">
                <ExternalLink size={18} /> Live Demo
              </Button>
            )}
            <Link href="/#contact">
              <Button variant="secondary" size="lg" className="gap-2">
                Discuss a Similar Project
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProjectDetails;