import { useState } from 'react';
import { motion } from 'framer-motion';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useToast } from '@/hooks/use-toast';
import { Mail, Phone, MapPin, Send, Loader2, Github, Linkedin, Instagram } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

// Form validation schema with enhanced validation
const formSchema = z.object({
  name: z.string()
    .min(2, { message: 'Name must be at least 2 characters' })
    .max(50, { message: 'Name cannot exceed 50 characters' })
    .regex(/^[a-zA-Z\s'-]+$/, { message: 'Name can only contain letters, spaces, hyphens, and apostrophes' }),
  
  email: z.string()
    .email({ message: 'Please enter a valid email address' })
    .min(5, { message: 'Email is too short to be valid' })
    .max(100, { message: 'Email cannot exceed 100 characters' }),
  
  subject: z.string()
    .min(5, { message: 'Subject must be at least 5 characters' })
    .max(100, { message: 'Subject cannot exceed 100 characters' }),
  
  message: z.string()
    .min(10, { message: 'Message must be at least 10 characters' })
    .max(1000, { message: 'Message cannot exceed 1000 characters' })
    .refine(value => !value.includes('<script>'), {
      message: 'Message cannot contain potentially harmful script tags',
    }),
});

type FormValues = z.infer<typeof formSchema>;

const Contact = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  const titleAnimation = useScrollAnimation({ threshold: 0.1 });
  const subtitleAnimation = useScrollAnimation({ threshold: 0.1, delay: 200 });
  const formAnimation = useScrollAnimation({ threshold: 0.1, delay: 300 });
  const contactInfoAnimation = useScrollAnimation({ threshold: 0.1, delay: 400 });
  
  // Form setup
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      subject: '',
      message: '',
    },
  });
  
  // Form submission handler
  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    
    try {
      // Send data to the API endpoint
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || 'Failed to send message');
      }
      
      toast({
        title: "Message sent successfully!",
        description: "Thank you for your message. I'll get back to you soon.",
      });
      
      // If we're in development and have a preview URL, show a link
      if (result.previewUrl) {
        toast({
          title: "Email Preview Available",
          description: (
            <div>
              <p>This is a development preview:</p>
              <a 
                href={result.previewUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                View the sent email
              </a>
            </div>
          ),
          duration: 10000,
        });
      }
      
      form.reset();
    } catch (error) {
      console.error('Error submitting form:', error);
      toast({
        title: "Error sending message",
        description: error instanceof Error ? error.message : "Please try again later or contact me directly via email.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <section 
      id="contact" 
      className="py-20 md:py-28 relative overflow-hidden"
      aria-labelledby="contact-heading"
      role="region"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      <div className="absolute bottom-0 right-0 w-64 h-64 rounded-full bg-primary/5 blur-3xl"></div>
      <div className="absolute top-40 left-0 w-72 h-72 rounded-full bg-secondary/5 blur-3xl"></div>
      
      <div className="container mx-auto px-4 md:px-6 relative">
        {/* Section header */}
        <div className="text-center mb-16">
          <motion.h2
            id="contact-heading"
            ref={titleAnimation.ref}
            initial={{ opacity: 0, y: 20 }}
            animate={titleAnimation.isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-4xl font-bold mb-4"
          >
            Get In <span className="gradient-text">Touch</span>
          </motion.h2>
          
          <motion.p
            ref={subtitleAnimation.ref}
            initial={{ opacity: 0, y: 20 }}
            animate={subtitleAnimation.isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="text-muted-foreground max-w-2xl mx-auto"
          >
            Have a project in mind or want to collaborate? Feel free to reach out.
            I'm always open to discussing new opportunities and ideas.
          </motion.p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
          {/* Contact form */}
          <motion.div
            ref={formAnimation.ref}
            initial={{ opacity: 0, x: -20 }}
            animate={formAnimation.isVisible ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="lg:col-span-3 bg-card border rounded-xl p-6 md:p-8 shadow-md hover:shadow-lg transition-all duration-300 relative overflow-hidden"
          >
            {/* Decorative elements */}
            <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-primary/5 blur-xl"></div>
            <div className="absolute -bottom-20 -left-20 w-40 h-40 rounded-full bg-secondary/5 blur-xl"></div>
            
            <motion.h3 
              id="contact-form-heading"
              className="text-xl font-semibold mb-6 relative inline-block"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              Send Me a Message
              <motion.div 
                className="absolute -bottom-1 left-0 h-[2px] bg-primary"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ delay: 0.3, duration: 0.6 }}
              />
            </motion.h3>
            
            <Form {...form}>
              <form 
                onSubmit={form.handleSubmit(onSubmit)} 
                className="space-y-6"
                aria-labelledby="contact-form-heading"
                noValidate
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center">
                            <span className="mr-1 text-primary font-medium">Name</span>
                            <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Your name" 
                              className="transition-all border-border focus-visible:border-primary focus-visible:ring-primary/20 shadow-sm" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage className="text-xs animate-in slide-in-from-left-2 duration-200" />
                        </FormItem>
                      )}
                    />
                  </motion.div>
                  
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center">
                            <span className="mr-1 text-primary font-medium">Email</span>
                            <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Your email" 
                              className="transition-all border-border focus-visible:border-primary focus-visible:ring-primary/20 shadow-sm" 
                              {...field} 
                              type="email" 
                            />
                          </FormControl>
                          <FormMessage className="text-xs animate-in slide-in-from-left-2 duration-200" />
                        </FormItem>
                      )}
                    />
                  </motion.div>
                </div>
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <FormField
                    control={form.control}
                    name="subject"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center">
                          <span className="mr-1 text-primary font-medium">Subject</span>
                          <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Message subject" 
                            className="transition-all border-border focus-visible:border-primary focus-visible:ring-primary/20 shadow-sm" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage className="text-xs animate-in slide-in-from-left-2 duration-200" />
                      </FormItem>
                    )}
                  />
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field, formState }) => (
                      <FormItem>
                        <FormLabel className="flex items-center">
                          <span className="mr-1 text-primary font-medium">Message</span>
                          <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Textarea 
                              placeholder="Your message"
                              className="min-h-[150px] resize-none transition-all border-border focus-visible:border-primary focus-visible:ring-primary/20 shadow-sm"
                              {...field}
                            />
                            
                            {/* Character counter */}
                            <div className="absolute bottom-2 right-2 text-xs text-muted-foreground">
                              {field.value?.length || 0}/1000
                            </div>
                          </div>
                        </FormControl>
                        <FormMessage className="text-xs animate-in slide-in-from-left-2 duration-200" />
                      </FormItem>
                    )}
                  />
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="pt-2"
                >
                  <Button 
                    type="submit" 
                    size="lg" 
                    disabled={isSubmitting} 
                    className="w-full group relative overflow-hidden"
                  >
                    <span className="relative z-10 flex items-center justify-center">
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending...
                        </>
                      ) : (
                        <>
                          <Send className="mr-2 h-4 w-4 group-hover:translate-x-1 transition-transform" /> Send Message
                        </>
                      )}
                    </span>
                    <span className="absolute inset-0 bg-gradient-to-r from-primary-600 to-secondary-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                  </Button>
                  
                  <p className="text-xs text-muted-foreground text-center mt-4">
                    By submitting this form, you agree to our <a href="#" className="text-primary hover:underline">Privacy Policy</a>.
                  </p>
                </motion.div>
              </form>
            </Form>
          </motion.div>
          
          {/* Contact information */}
          <motion.div
            ref={contactInfoAnimation.ref}
            initial={{ opacity: 0, x: 20 }}
            animate={contactInfoAnimation.isVisible ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="lg:col-span-2 flex flex-col justify-center space-y-8 lg:pl-4 relative z-10"
          >
            {/* Decorative background */}
            <div className="absolute -z-10 inset-0 bg-gradient-to-tr from-transparent via-transparent to-primary/5 opacity-50 rounded-3xl"></div>
            
            <motion.div 
              className="space-y-6 p-6 backdrop-blur-sm bg-card/30 rounded-xl border border-border/40 shadow-sm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <motion.h3 
                className="text-xl font-semibold relative inline-block"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                Contact Information
                <motion.div 
                  className="absolute -bottom-1 left-0 h-[2px] bg-primary"
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ delay: 0.6, duration: 0.6 }}
                />
              </motion.h3>
              
              <motion.p 
                className="text-muted-foreground"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                Feel free to reach out through any of these channels. I typically respond within 24 hours.
              </motion.p>
              
              <div className="space-y-5 mt-6">
                <motion.div 
                  className="flex items-start space-x-4 group"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 }}
                  whileHover={{ x: 5 }}
                >
                  <div className="bg-primary/10 p-3 rounded-full group-hover:bg-primary/20 transition-colors duration-300 shadow-sm">
                    <Mail className="h-5 w-5 text-primary group-hover:scale-110 transition-transform" />
                  </div>
                  <div>
                    <h4 className="font-medium">Email</h4>
                    <a 
                      href="mailto:work.aryandudharejiya@gmail.com" 
                      className="text-muted-foreground hover:text-primary transition-all duration-300 hover:font-medium relative inline-block"
                    >
                      work.aryandudharejiya@gmail.com
                      <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-primary group-hover:w-full transition-all duration-300"></span>
                    </a>
                  </div>
                </motion.div>
                
                <motion.div 
                  className="flex items-start space-x-4 group"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 }}
                  whileHover={{ x: 5 }}
                >
                  <div className="bg-primary/10 p-3 rounded-full group-hover:bg-primary/20 transition-colors duration-300 shadow-sm">
                    <Phone className="h-5 w-5 text-primary group-hover:scale-110 transition-transform" />
                  </div>
                  <div>
                    <h4 className="font-medium">Phone</h4>
                    <a 
                      href="tel:+919773254534" 
                      className="text-muted-foreground hover:text-primary transition-all duration-300 hover:font-medium relative inline-block"
                    >
                      +91 9773 254 534
                      <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-primary group-hover:w-full transition-all duration-300"></span>
                    </a>
                  </div>
                </motion.div>
                
                <motion.div 
                  className="flex items-start space-x-4 group"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 }}
                  whileHover={{ x: 5 }}
                >
                  <div className="bg-primary/10 p-3 rounded-full group-hover:bg-primary/20 transition-colors duration-300 shadow-sm">
                    <MapPin className="h-5 w-5 text-primary group-hover:scale-110 transition-transform" />
                  </div>
                  <div>
                    <h4 className="font-medium">Location</h4>
                    <p className="text-muted-foreground group-hover:text-foreground transition-colors duration-300">
                      Ahmedabad, Gujarat, India
                    </p>
                  </div>
                </motion.div>
              </div>
            </motion.div>
            
            <motion.div 
              className="p-6 backdrop-blur-sm bg-card/30 rounded-xl border border-border/40 shadow-sm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
            >
              <motion.h3 
                className="text-xl font-semibold mb-4 relative inline-block"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
              >
                Availability
                <motion.div 
                  className="absolute -bottom-1 left-0 h-[2px] bg-primary"
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ delay: 1.2, duration: 0.6 }}
                />
              </motion.h3>
              
              <motion.p 
                className="text-muted-foreground mb-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.1 }}
              >
                Currently available for:
              </motion.p>
              
              <ul className="space-y-3">
                <motion.li 
                  className="flex items-center p-2 rounded-lg hover:bg-primary/5 transition-colors"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.2 }}
                  whileHover={{ x: 5 }}
                >
                  <div className="w-3 h-3 rounded-full bg-green-500 mr-3 shadow-sm shadow-green-500/20"></div>
                  <span className="font-medium">Freelance Projects</span>
                </motion.li>
                
                <motion.li 
                  className="flex items-center p-2 rounded-lg hover:bg-primary/5 transition-colors"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.3 }}
                  whileHover={{ x: 5 }}
                >
                  <div className="w-3 h-3 rounded-full bg-green-500 mr-3 shadow-sm shadow-green-500/20"></div>
                  <span className="font-medium">Contract Work</span>
                </motion.li>
                
                <motion.li 
                  className="flex items-center p-2 rounded-lg hover:bg-primary/5 transition-colors"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.4 }}
                  whileHover={{ x: 5 }}
                >
                  <div className="w-3 h-3 rounded-full bg-yellow-500 mr-3 shadow-sm shadow-yellow-500/20"></div>
                  <span className="font-medium">Full-time Positions</span>
                </motion.li>
              </ul>
              
              {/* Social media icons */}
              <motion.div 
                className="flex gap-3 mt-6 pt-4 border-t border-border/50"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.5 }}
                role="group"
                aria-label="Social media links"
              >
                <a 
                  href="https://github.com/aryan-dudharejiya" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-full bg-card hover:bg-primary/10 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                  aria-label="GitHub Profile"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      e.currentTarget.click();
                    }
                  }}
                >
                  <Github className="h-5 w-5 text-foreground hover:text-primary transition-colors" />
                </a>
                <a 
                  href="https://www.linkedin.com/in/aryan-dudharejiya" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-full bg-card hover:bg-[#0A66C2]/10 transition-colors focus:outline-none focus:ring-2 focus:ring-[#0A66C2] focus:ring-offset-2"
                  aria-label="LinkedIn Profile"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      e.currentTarget.click();
                    }
                  }}
                >
                  <Linkedin className="h-5 w-5 text-foreground hover:text-[#0A66C2] transition-colors" />
                </a>
                <a 
                  href="https://instagram.com/aryan_dudharejiya" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-full bg-card hover:bg-[#E4405F]/10 transition-colors focus:outline-none focus:ring-2 focus:ring-[#E4405F] focus:ring-offset-2"
                  aria-label="Instagram Profile"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      e.currentTarget.click();
                    }
                  }}
                >
                  <Instagram className="h-5 w-5 text-foreground hover:text-[#E4405F] transition-colors" />
                </a>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;