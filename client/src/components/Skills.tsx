import { motion } from 'framer-motion';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useTheme } from '@/hooks/useTheme';

interface Skill {
  name: string;
  percentage: number;
}

const leftSkills: Skill[] = [
  { name: 'JavaScript', percentage: 95 },
  { name: 'React.js', percentage: 90 },
  { name: 'TypeScript', percentage: 85 },
  { name: 'HTML/CSS', percentage: 90 },
  { name: 'Tailwind CSS', percentage: 85 },
];

const rightSkills: Skill[] = [
  { name: 'Node.js', percentage: 85 },
  { name: 'Express.js', percentage: 80 },
  { name: 'MongoDB', percentage: 80 },
  { name: 'Next.js', percentage: 75 },
  { name: 'GraphQL', percentage: 70 },
];

const technologies = [
  'Redux', 'Jest', 'React Query', 'Git', 'GitHub', 'REST API', 
  'Framer Motion', 'GSAP', 'Three.js', 'Material UI', 'Firebase',
  'AWS', 'Docker', 'CI/CD', 'Figma', 'Responsive Design'
];

const SkillBar = ({ skill }: { skill: Skill }) => {
  const { theme } = useTheme();
  const animation = useScrollAnimation({ threshold: 0.1 });
  
  return (
    <div ref={animation.ref} className="mb-6">
      <div className="flex justify-between mb-1">
        <span className="font-medium">{skill.name}</span>
        <span className="text-muted-foreground">{skill.percentage}%</span>
      </div>
      <Progress 
        value={animation.isVisible ? skill.percentage : 0} 
        className={`h-2 transition-all duration-1000 ease-out ${
          theme === 'dark' ? 'bg-muted' : 'bg-muted/50'
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
    <section id="skills" className="py-20 md:py-28 relative">
      {/* Background overlay */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      
      <div className="container mx-auto px-4 md:px-6 relative">
        {/* Section Header */}
        <div className="text-center mb-16">
          <motion.h2
            ref={titleAnimation.ref}
            initial={{ opacity: 0, y: 20 }}
            animate={titleAnimation.isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-4xl font-bold mb-4"
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
            A comprehensive collection of technologies and tools I've mastered through years of experience.
          </motion.p>
        </div>
        
        {/* Skills Progress Bars */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
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
        
        {/* Technologies */}
        <motion.div
          ref={techAnimation.ref}
          initial={{ opacity: 0, y: 20 }}
          animate={techAnimation.isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="mt-12"
        >
          <h3 className="text-xl font-bold mb-6 text-center">Other Technologies</h3>
          
          <div className="flex flex-wrap justify-center gap-2">
            {technologies.map((tech, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={techAnimation.isVisible ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Badge variant="outline" className="px-4 py-2 text-sm">
                  {tech}
                </Badge>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Skills;