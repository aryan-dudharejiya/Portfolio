import { motion } from "framer-motion";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useTheme } from "@/hooks/useTheme";
import {
  SiJavascript,
  SiReact,
  SiTypescript,
  SiHtml5,
  SiCss3,
  SiTailwindcss,
  SiNodedotjs,
  SiExpress,
  SiMongodb,
  SiNextdotjs,
  SiGraphql,
  SiRedux,
  SiJest,
  SiReactquery,
  SiGit,
  SiGithub,
  SiFramer,
  SiGreensock,
  SiThreedotjs,
  SiMui,
  SiFirebase,
  SiAmazon,
  SiDocker,
  SiGithubactions,
  SiFigma,
  SiVercel,
} from "react-icons/si";

interface Skill {
  name: string;
  percentage: number;
  icon: React.ReactNode;
  color: string;
}

const leftSkills: Skill[] = [
  {
    name: "JavaScript",
    percentage: 95,
    icon: <SiJavascript size={22} />,
    color: "text-yellow-500",
  },
  {
    name: "React.js",
    percentage: 90,
    icon: <SiReact size={22} />,
    color: "text-sky-500",
  },
  {
    name: "TypeScript",
    percentage: 85,
    icon: <SiTypescript size={22} />,
    color: "text-blue-500",
  },
  {
    name: "HTML/CSS",
    percentage: 90,
    icon: (
      <div className="flex gap-1">
        <SiHtml5 size={22} className="text-orange-500" />
        <SiCss3 size={22} className="text-blue-400" />
      </div>
    ),
    color: "",
  },
  {
    name: "Tailwind CSS",
    percentage: 85,
    icon: <SiTailwindcss size={22} />,
    color: "text-cyan-500",
  },
];

const rightSkills: Skill[] = [
  {
    name: "Node.js",
    percentage: 85,
    icon: <SiNodedotjs size={22} />,
    color: "text-green-500",
  },
  {
    name: "Express.js",
    percentage: 80,
    icon: <SiExpress size={22} />,
    color: "text-neutral-600 dark:text-neutral-400",
  },
  {
    name: "MongoDB",
    percentage: 80,
    icon: <SiMongodb size={22} />,
    color: "text-green-600",
  },
  {
    name: "Next.js",
    percentage: 75,
    icon: <SiNextdotjs size={22} />,
    color: "text-black dark:text-white",
  },
  {
    name: "GraphQL",
    percentage: 70,
    icon: <SiGraphql size={22} />,
    color: "text-pink-600",
  },
];

interface TechItem {
  name: string;
  icon: React.ReactNode;
  color: string;
}

const technologies: TechItem[] = [
  { name: "Redux", icon: <SiRedux size={20} />, color: "text-purple-600" },
  { name: "Jest", icon: <SiJest size={20} />, color: "text-red-600" },
  {
    name: "React Query",
    icon: <SiReactquery size={20} />,
    color: "text-red-500",
  },
  { name: "Git", icon: <SiGit size={20} />, color: "text-orange-600" },
  {
    name: "GitHub",
    icon: <SiGithub size={20} />,
    color: "text-neutral-800 dark:text-neutral-200",
  },
  {
    name: "REST API",
    icon: (
      <svg
        viewBox="0 0 24 24"
        width="20"
        height="20"
        fill="currentColor"
        className="text-blue-500"
      >
        <path d="M9.5 4.5v3h-3v-3h3M11 3H5v6h6V3zm-1.5 7.5v3h-3v-3h3M11 9H5v6h6V9zm5.5-5.5v3h-3v-3h3M21 3h-6v6h6V3zm-6 13.5h1.5v-3H15v3zm1.5 1.5H21v-6h-6v6zM9.5 16.5v3h-3v-3h3M11 15H5v6h6v-6z" />
      </svg>
    ),
    color: "",
  },
  {
    name: "Framer Motion",
    icon: <SiFramer size={20} />,
    color: "text-neutral-800 dark:text-neutral-200",
  },
  { name: "GSAP", icon: <SiGreensock size={20} />, color: "text-green-500" },
  {
    name: "Three.js",
    icon: <SiThreedotjs size={20} />,
    color: "text-neutral-800 dark:text-neutral-200",
  },
  { name: "Material UI", icon: <SiMui size={20} />, color: "text-blue-600" },
  { name: "Firebase", icon: <SiFirebase size={20} />, color: "text-amber-500" },
  { name: "AWS", icon: <SiAmazon size={20} />, color: "text-amber-600" }, // Using SiAmazon for AWS
  { name: "Docker", icon: <SiDocker size={20} />, color: "text-blue-500" },
  {
    name: "CI/CD",
    icon: <SiGithubactions size={20} />,
    color: "text-neutral-800 dark:text-neutral-200",
  },
  { name: "Figma", icon: <SiFigma size={20} />, color: "text-purple-500" },
  {
    name: "Vercel",
    icon: <SiVercel size={20} />,
    color: "text-neutral-800 dark:text-neutral-200",
  },
];

const SkillBar = ({ skill }: { skill: Skill }) => {
  const { theme } = useTheme();
  const animation = useScrollAnimation({ threshold: 0.1 });

  return (
    <div ref={animation.ref} className="mb-6">
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-2">
          <span className={`${skill.color}`}>{skill.icon}</span>
          <span className="font-medium">{skill.name}</span>
        </div>
        <span className="text-muted-foreground">{skill.percentage}%</span>
      </div>
      <Progress
        value={animation.isVisible ? skill.percentage : 0}
        className={`h-2 transition-all duration-1000 ease-out ${
          theme === "dark" ? "bg-muted" : "bg-muted/50"
        }`}
      />
    </div>
  );
};

const Skills = () => {
  const titleAnimation = useScrollAnimation({ threshold: 0.1 });
  const subtitleAnimation = useScrollAnimation({ threshold: 0.1, delay: 200 });
  const techAnimation = useScrollAnimation({ threshold: 0.1, delay: 300 });

  return (
    <section id="skills" className="py-12 md:py-16 lg:py-20 relative">
      {/* Background overlay */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>

      <div className="section-container relative">
        {/* Section Header */}
        <div className="text-center mb-10">
          <motion.h2
            ref={titleAnimation.ref}
            initial={{ opacity: 0, y: 20 }}
            animate={titleAnimation.isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-4xl font-bold mb-3"
          >
            My <span className="gradient-text">Skills</span>
          </motion.h2>

          <motion.p
            ref={subtitleAnimation.ref}
            initial={{ opacity: 0, y: 20 }}
            animate={subtitleAnimation.isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="text-muted-foreground max-w-2xl mx-auto"
          >
            A comprehensive collection of technologies and tools I've mastered
            through years of experience.
          </motion.p>
        </div>

        {/* Skills Progress Bars */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
          <div className="md:border-r border-border pr-0 md:pr-8">
            {leftSkills.map((skill, index) => (
              <SkillBar key={index} skill={skill} />
            ))}
          </div>

          <div className="pl-0 md:pl-8">
            {rightSkills.map((skill, index) => (
              <SkillBar key={index} skill={skill} />
            ))}
          </div>
        </div>

        {/* Additional Technologies */}
        <div>
          <motion.h3
            ref={techAnimation.ref}
            initial={{ opacity: 0, y: 20 }}
            animate={techAnimation.isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="text-xl font-bold mb-8 text-center"
          >
            Additional Technologies & Tools
          </motion.h3>

          <motion.div
            ref={techAnimation.ref}
            initial={{ opacity: 0, y: 20 }}
            animate={techAnimation.isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-wrap justify-center gap-3"
          >
            <TooltipProvider>
              {technologies.map((tech, index) => (
                <Tooltip key={index}>
                  <TooltipTrigger asChild>
                    <Badge
                      variant="outline"
                      className="px-3 py-2 cursor-pointer hover:bg-primary/5 transition-colors"
                    >
                      <span className={`mr-2 ${tech.color}`}>{tech.icon}</span>
                      {tech.name}
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>
                      Expertise in{" "}
                      <span className="font-semibold">{tech.name}</span>
                    </p>
                  </TooltipContent>
                </Tooltip>
              ))}
            </TooltipProvider>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Skills;
