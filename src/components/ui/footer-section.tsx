import { motion } from "framer-motion";
import { ArrowUp, Instagram} from "lucide-react";
import logo from "../../assets/logo.webp";
import { Link } from "react-router-dom";

export function Footerdemo() {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <footer className="bg-black text-white border-t border-gray-800/50 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-12 sm:py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
            {/* Brand */}
            <div className="text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-3 mb-4">
                <div className="w-12 h-12 rounded-full flex items-center justify-center">
                  <img src={logo} className="h-12" loading="eager" />
                </div>
                <h3 className="text-xl font-semibold">Writers Ecosystem</h3>
              </div>
              <p className="text-gray-400 text-sm max-w-xs mx-auto md:mx-0 mb-4">
                Where words inspire action and writers find their voice.
              </p>
              <div className="flex justify-center md:justify-start gap-4 text-xs text-gray-500">
                <Link 
                  to="/terms" 
                  className="hover:text-gray-300 transition-colors"
                >
                  Terms & Conditions
                </Link>
                <Link 
                  to="/privacy" 
                  className="hover:text-gray-300 transition-colors"
                >
                  Privacy Policy
                </Link>
              </div>
            </div>

            {/* Copyright */}
            <div className="text-center">
              <p className="text-gray-500 text-sm">
                © 2025 Writers Ecosystem. All rights reserved.
              </p>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-center md:justify-end gap-4">
              {/* Social Links */}
              <motion.a
                href="https://instagram.com/writersecosystem"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
                className="group relative w-10 h-10 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center hover:shadow-lg hover:shadow-pink-500/25 transition-all duration-300"
              >
                <Instagram className="w-5 h-5 text-white" />
                <div className="absolute -inset-0.5 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full blur opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
              </motion.a>

              {/* Back to Top */}
              <motion.button
                onClick={scrollToTop}
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="group relative w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300"
              >
                <ArrowUp className="w-5 h-5 text-white group-hover:-translate-y-0.5 transition-transform duration-200" />
                <div className="absolute -inset-0.5 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full blur opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}