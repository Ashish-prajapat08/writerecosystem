import { motion } from "framer-motion";
import { ArrowRight, LucideIcon } from "lucide-react";
import { useState } from "react";

interface AnimatedButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  icon?: LucideIcon;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  disabled?: boolean;
}

export function AnimatedButton({
  children,
  onClick,
  icon: Icon,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false
}: AnimatedButtonProps) {
  const [isHovered, setIsHovered] = useState(false);

  const variants = {
    primary: "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white",
    secondary: "bg-gray-800 hover:bg-gray-700 text-white border border-gray-600",
    ghost: "bg-transparent hover:bg-white/10 text-white border border-white/20"
  };

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg"
  };

  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.05 }}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
      onHoverStart={() => !disabled && setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={onClick}
      disabled={disabled}
      className={`
        group relative inline-flex items-center gap-2 sm:gap-3 
        ${variants[variant]} 
        ${sizes[size]} 
        rounded-full font-semibold transition-all duration-300 
        shadow-lg hover:shadow-xl
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
    >
      {/* Enhanced glow effect for primary variant */}
      {variant === 'primary' && !disabled && (
        <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-400 via-purple-500 to-cyan-600 rounded-full blur opacity-30 group-hover:opacity-50 transition duration-300"></div>
      )}

      {/* Button content */}
      <div className="relative flex items-center gap-2 sm:gap-3">
        {Icon && (
          <motion.div
            animate={{
              rotate: isHovered ? 360 : 0,
            }}
            transition={{ duration: 0.6 }}
          >
            <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
          </motion.div>
        )}
        
        <span className="relative font-medium tracking-wide">
          {children}
        </span>
        
        <motion.div
          animate={{
            x: isHovered ? [0, 5, 0] : 0,
          }}
          transition={{
            duration: 0.6,
            repeat: isHovered ? Infinity : 0,
            repeatDelay: 0.3,
          }}
        >
          <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
        </motion.div>
      </div>

      {/* Pulse effect on click */}
      <motion.div
        className="absolute inset-0 bg-white/20 rounded-full opacity-0"
        whileTap={!disabled ? {
          opacity: [0, 0.3, 0],
          scale: [1, 1.1, 1],
        } : {}}
        transition={{ duration: 0.3 }}
      />
    </motion.button>
  );
}