export interface Service {
  icon: string;
  title: string;
  description: string;
}

export interface Skill {
  name: string;
  percentage: number;
}

export type ProjectCategory = 'all' | 'website' | 'webapp' | 'ecommerce';

export interface Project {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  category: Exclude<ProjectCategory, 'all'>;
  technologies: string[];
}

export interface Testimonial {
  id: number;
  content: string;
  name: string;
  position: string;
  image: string;
}

export const services: Service[] = [
  {
    icon: "bx-store",
    title: "Business Websites",
    description: "Custom, responsive websites for startups, coaches, restaurants, and more."
  },
  {
    icon: "bx-trending-up",
    title: "Landing Pages",
    description: "High-converting landing pages for marketing, lead generation, and sales."
  },
  {
    icon: "bx-code-alt",
    title: "Web Applications",
    description: "Custom web apps, dashboards, and interactive platforms with MERN stack."
  },
  {
    icon: "bx-bot",
    title: "Chatbot Development",
    description: "AI-powered chatbots for WhatsApp, Instagram, Messenger, and custom platforms."
  }
];

export const leftSkills: Skill[] = [
  { name: "React.js", percentage: 95 },
  { name: "Node.js", percentage: 90 },
  { name: "MongoDB", percentage: 85 },
  { name: "Express.js", percentage: 88 }
];

export const rightSkills: Skill[] = [
  { name: "JavaScript/ES6+", percentage: 92 },
  { name: "HTML5/CSS3", percentage: 98 },
  { name: "UI/UX Design", percentage: 80 },
  { name: "Redux/Context API", percentage: 85 }
];

export const projects: Project[] = [
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

export const testimonials: Testimonial[] = [
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
