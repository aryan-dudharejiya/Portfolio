import { motion } from 'framer-motion';

interface Skill {
  name: string;
  percentage: number;
}

const leftSkills: Skill[] = [
  { name: "React.js", percentage: 95 },
  { name: "Node.js", percentage: 90 },
  { name: "MongoDB", percentage: 85 },
  { name: "Express.js", percentage: 88 }
];

const rightSkills: Skill[] = [
  { name: "JavaScript/ES6+", percentage: 92 },
  { name: "HTML5/CSS3", percentage: 98 },
  { name: "UI/UX Design", percentage: 80 },
  { name: "Redux/Context API", percentage: 85 }
];

const SkillBar = ({ skill }: { skill: Skill }) => {
  return (
    <div className="space-y-2">
      <div className="flex justify-between">
        <span className="font-medium">{skill.name}</span>
        <span>{skill.percentage}%</span>
      </div>
      <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
        <motion.div 
          className="h-full bg-gradient-to-r from-primary to-secondary rounded-full"
          initial={{ width: 0 }}
          whileInView={{ width: `${skill.percentage}%` }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.2 }}
        />
      </div>
    </div>
  );
};

const Skills = () => {
  return (
    <section className="py-20 bg-slate-100 dark:bg-slate-800/50">
      <div className="container mx-auto px-6">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold font-['Poppins'] mb-4">Technical <span className="gradient-text">Skills</span></h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            The technologies I use to create exceptional web experiences.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <motion.div 
            className="space-y-8"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            {leftSkills.map((skill, index) => (
              <SkillBar key={index} skill={skill} />
            ))}
          </motion.div>
          
          <motion.div 
            className="space-y-8"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            {rightSkills.map((skill, index) => (
              <SkillBar key={index} skill={skill} />
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Skills;
