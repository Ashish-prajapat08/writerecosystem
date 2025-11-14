
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { useState } from "react";
import { AnimatedButton } from "../ui/animated-button";
import AnimatedShaderBackground from "../ui/animated-shader-background";
import { useNavigate } from "react-router-dom";


export function AnimatedBackgroundSection() {
  const navigate = useNavigate();
  const handleCta =()=>{
    navigate('/login');
  }
  const [isHovered, setIsHovered] = useState(false);

  return (
    <section className="relative w-full h-screen bg-black overflow-hidden">
      <AnimatedShaderBackground />
      <div className="absolute inset-0 flex items-center justify-center z-10 px-4">
        <div className="text-center text-white max-w-6xl mx-auto">
          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-serif font-light mb-4 sm:mb-6 bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent leading-tight"
            style={{ letterSpacing: '0.02em' }}
          >
            Your Voice Was Never The Problem.
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-serif font-light text-gray-200 max-w-4xl mx-auto mb-8 sm:mb-12 leading-relaxed"
            style={{ letterSpacing: '0.03em' }}
          >
            <span className="text-white font-medium">
              The Platform Was.
            </span>
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="relative inline-block"
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
          >
            {/* Floating particles around button */}
            {isHovered && (
              <>
                {[...Array(8)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-1 h-1 bg-blue-400 rounded-full pointer-events-none"
                    style={{
                      left: `${50 + Math.cos((i * Math.PI * 2) / 8) * 60}%`,
                      top: `${50 + Math.sin((i * Math.PI * 2) / 8) * 60}%`,
                    }}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ 
                      scale: [0, 1, 0],
                      opacity: [0, 1, 0],
                      x: [0, Math.cos((i * Math.PI * 2) / 8) * 20],
                      y: [0, Math.sin((i * Math.PI * 2) / 8) * 20],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      delay: i * 0.1,
                    }}
                  />
                ))}
              </>
            )}

            <AnimatedButton
              icon={Sparkles}
              onClick={handleCta}
              size="lg"
              className="shadow-2xl hover:shadow-blue-500/50 text-base sm:text-lg px-8 sm:px-10 py-4 sm:py-5"
            >
              Begin Your Journey
            </AnimatedButton>

            {/* Floating text hint */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ 
                opacity: isHovered ? 1 : 0,
                y: isHovered ? 0 : 20,
              }}
              transition={{ duration: 0.3 }}
              className="absolute -bottom-12 sm:-bottom-16 left-1/2 transform -translate-x-1/2 text-blue-300 text-xs sm:text-sm font-light tracking-wider"
            >
              Your story awaits
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}