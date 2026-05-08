import { motion } from "motion/react";
import { ArrowRight, Play } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-2 lg:gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="inline-flex items-center space-x-2 bg-gray-100 px-3 py-1 rounded-full mb-6">
              <span className="flex h-2 w-2 rounded-full bg-black animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-wider text-gray-600">Now booking for Q3 2026</span>
            </div>
            <h1 className="text-6xl lg:text-8xl font-bold tracking-tighter leading-[0.9] text-black mb-8">
              CRAFTING <br />
              <span className="text-gray-400 italic">DIGITAL</span> <br />
              EXPERIENCES
            </h1>
            <p className="text-xl text-gray-500 max-w-lg mb-10 leading-relaxed">
              We build high-performance websites and digital products that help brands stand out in a crowded digital landscape.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="bg-black text-white px-8 py-4 rounded-full font-semibold flex items-center justify-center space-x-2 group"
              >
                <span>Start a Project</span>
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="bg-white text-black border border-gray-200 px-8 py-4 rounded-full font-semibold flex items-center justify-center space-x-2"
              >
                <Play size={18} fill="currentColor" />
                <span>Watch Reel</span>
              </motion.button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotate: 5 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
            className="mt-16 lg:mt-0 relative"
          >
            <div className="relative aspect-square rounded-3xl overflow-hidden shadow-2xl">
              <img 
                src="https://picsum.photos/seed/studio/1200/1200" 
                alt="Digital Art" 
                className="object-cover w-full h-full grayscale hover:grayscale-0 transition-all duration-700"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              <div className="absolute bottom-8 left-8 right-8">
                <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-2xl text-white">
                  <p className="text-sm font-medium opacity-80 mb-1">Featured Work</p>
                  <h3 className="text-2xl font-bold tracking-tight">The Future of Interface Design</h3>
                </div>
              </div>
            </div>
            
            {/* Decorative elements */}
            <div className="absolute -top-6 -right-6 w-24 h-24 bg-gray-100 rounded-full -z-10 animate-bounce" style={{ animationDuration: '3s' }} />
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-gray-50 rounded-full -z-10" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
