import { motion } from "framer-motion";

interface Service {
  icon: string;
  title: string;
  description: string;
}

const services: Service[] = [
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

const Services = () => {
  return (
    <section id="services" className="py-20 relative">
      <div className="container mx-auto px-6">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold font-['Poppins'] mb-4">My <span className="gradient-text">Services</span></h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Specialized solutions crafted to help your business grow with modern web technologies.
          </p>
        </motion.div>
        
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          {services.map((service, index) => (
            <motion.div 
              key={index}
              className="glass rounded-2xl p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-2"
              variants={item}
            >
              <div className="w-16 h-16 rounded-xl gradient-bg flex items-center justify-center mb-6">
                <i className={`bx ${service.icon} text-3xl text-white`}></i>
              </div>
              <h3 className="text-xl font-bold font-['Poppins'] mb-3">{service.title}</h3>
              <p className="text-slate-600 dark:text-slate-400">
                {service.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Services;
