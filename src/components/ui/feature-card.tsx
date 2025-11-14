import { motion } from "framer-motion";
import {LucideIcon, ArrowRight } from "lucide-react";
interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  subtitle: string;
  description: string;
  color: string;
  bgGradient: string;
  borderColor: string;
  hoverBorder: string;
  index: number;
  onHover?: (index: number | null) => void;
  isHovered?: boolean;
}

export function FeatureCard({
  icon: Icon,
  title,
  subtitle,
  description,
  color,
  bgGradient,
  borderColor,
  hoverBorder,
  index,
  onHover,
  isHovered = false
}: FeatureCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.6 }}
      onHoverStart={() => onHover?.(index)}
      onHoverEnd={() => onHover?.(null)}
      className="group relative"
    >
      {/* Glow effect */}
      <div className={`absolute -inset-0.5 bg-gradient-to-r ${color} rounded-2xl blur opacity-0 group-hover:opacity-30 transition-all duration-500`}></div>
      
      {/* Card */}
      <div className={`relative bg-gradient-to-br ${bgGradient} backdrop-blur-sm p-4 sm:p-6 lg:p-8 xl:p-10 rounded-2xl border ${borderColor} ${hoverBorder} transition-all duration-500 h-full flex flex-col group-hover:transform group-hover:scale-[1.02]`}>
        {/* Icon */}
        <motion.div
          animate={{
            rotate: isHovered ? 360 : 0,
            scale: isHovered ? 1.1 : 1,
          }}
          transition={{ duration: 0.6 }}
          className={`w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-xl bg-gradient-to-r ${color} p-2.5 sm:p-3 lg:p-4 mb-4 sm:mb-6 group-hover:shadow-lg group-hover:shadow-blue-500/25 transition-all duration-300`}
        >
          <Icon className="w-full h-full text-white" />
        </motion.div>

        {/* Content */}
        <div className="flex-1">
          <motion.h3 
            className={`text-lg sm:text-xl lg:text-2xl font-semibold mb-2 sm:mb-3 bg-gradient-to-r ${color} bg-clip-text text-transparent group-hover:from-white group-hover:to-gray-200 transition-all duration-300`}
          >
            {title}
          </motion.h3>
          
          <motion.p 
            className="text-sm sm:text-base lg:text-lg font-medium mb-3 sm:mb-4 text-gray-300 group-hover:text-gray-200 transition-colors duration-300"
          >
            {subtitle}
          </motion.p>
          
          <motion.p 
            className="text-gray-400 leading-relaxed text-xs sm:text-sm lg:text-base font-light group-hover:text-gray-300 transition-colors duration-300"
          >
            {description}
          </motion.p>
        </div>

        {/* Hover arrow */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{
            opacity: isHovered ? 1 : 0,
            x: isHovered ? 0 : -10,
          }}
          transition={{ duration: 0.3 }}
          className="flex items-center gap-2 mt-4 sm:mt-6 text-blue-400 font-medium"
        >
          <span className="text-xs sm:text-sm">Explore feature</span>
          <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
        </motion.div>

        {/* Corner decoration */}
        <div className="absolute top-3 right-3 sm:top-4 sm:right-4 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>
    </motion.div>
  );
}