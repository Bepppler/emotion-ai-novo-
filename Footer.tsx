import { Github, Twitter, Linkedin, Instagram } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-2">
            <span className="text-2xl font-bold tracking-tighter text-black mb-6 block">
              STUDIO<span className="text-gray-400">.</span>
            </span>
            <p className="text-gray-500 max-w-sm mb-8 leading-relaxed">
              A boutique digital agency focused on crafting high-end web experiences for forward-thinking brands.
            </p>
            <div className="flex space-x-4">
              {[Twitter, Github, Linkedin, Instagram].map((Icon, i) => (
                <a key={i} href="#" className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-black hover:text-white transition-all">
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="font-bold text-black mb-6">Company</h4>
            <ul className="space-y-4">
              {["Work", "Services", "About", "Careers", "Contact"].map((item) => (
                <li key={item}>
                  <a href="#" className="text-gray-500 hover:text-black transition-colors">{item}</a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-black mb-6">Legal</h4>
            <ul className="space-y-4">
              {["Privacy Policy", "Terms of Service", "Cookie Policy"].map((item) => (
                <li key={item}>
                  <a href="#" className="text-gray-500 hover:text-black transition-colors">{item}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-100 pt-8 flex flex-col md:row justify-between items-center">
          <p className="text-sm text-gray-400">
            © 2026 Modern Web Studio. All rights reserved.
          </p>
          <div className="mt-4 md:mt-0">
            <p className="text-sm text-gray-400 italic">
              Built with passion and precision.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
