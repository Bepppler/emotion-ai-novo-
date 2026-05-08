import { motion } from "motion/react";
import { Zap, Shield, Globe, Cpu, Layout, Smartphone } from "lucide-react";

const features = [
  {
    icon: <Layout className="w-6 h-6" />,
    title: "UI/UX Design",
    description: "Creating intuitive and beautiful interfaces that users love to interact with."
  },
  {
    icon: <Cpu className="w-6 h-6" />,
    title: "Web Development",
    description: "Building fast, scalable, and secure web applications using modern technologies."
  },
  {
    icon: <Smartphone className="w-6 h-6" />,
    title: "Mobile First",
    description: "Ensuring your digital presence looks and works perfectly on every device."
  },
  {
    icon: <Zap className="w-6 h-6" />,
    title: "Performance",
    description: "Optimizing every line of code for lightning-fast load times and smooth interactions."
  },
  {
    icon: <Shield className="w-6 h-6" />,
    title: "Security",
    description: "Implementing industry-standard security practices to protect your data and users."
  },
  {
    icon: <Globe className="w-6 h-6" />,
    title: "SEO Strategy",
    description: "Helping your brand get discovered with data-driven search engine optimization."
  }
];

export default function Features() {
  return (
    <section id="services" className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl font-bold tracking-tight text-black mb-4"
          >
            Our Expertise
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-gray-500"
          >
            We combine technical excellence with creative vision to deliver results that matter.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -5 }}
              className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all"
            >
              <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center text-black mb-6">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-black mb-3">{feature.title}</h3>
              <p className="text-gray-500 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
