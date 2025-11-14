import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, ChevronDown } from "lucide-react";
import { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { trackEvent } from "../utils/analytics";
import logo from "../../assets/logo.webp";

// Particle system for animated background
const ParticleSystem = () => {
  const [particles, setParticles] = useState<
    Array<{
      id: number;
      x: number;
      y: number;
      size: number;
      opacity: number;
      speed: number;
    }>
  >([]);

  useEffect(() => {
    const generateParticles = () => {
      const newParticles = [];
      for (let i = 0; i < 50; i++) {
        newParticles.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 3 + 1,
          opacity: Math.random() * 0.5 + 0.1,
          speed: Math.random() * 2 + 0.5,
        });
      }
      setParticles(newParticles);
    };

    generateParticles();
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full bg-blue-400/20"
          style={{
            width: particle.size,
            height: particle.size,
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            opacity: particle.opacity,
          }}
          animate={{
            y: [0, -100, 0],
            x: [0, Math.random() * 50 - 25, 0],
            opacity: [
              particle.opacity,
              particle.opacity * 0.3,
              particle.opacity,
            ],
          }}
          transition={{
            duration: particle.speed * 10,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
};

// Flowing ink animation component
const FlowingInk = () => {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 1000 1000"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <linearGradient id="inkGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.1" />
            <stop offset="50%" stopColor="#1d4ed8" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#1e40af" stopOpacity="0.1" />
          </linearGradient>
        </defs>
        <motion.path
          d="M0,500 Q250,300 500,500 T1000,500 L1000,1000 L0,1000 Z"
          fill="url(#inkGradient)"
          animate={{
            d: [
              "M0,500 Q250,300 500,500 T1000,500 L1000,1000 L0,1000 Z",
              "M0,400 Q250,600 500,400 T1000,400 L1000,1000 L0,1000 Z",
              "M0,500 Q250,300 500,500 T1000,500 L1000,1000 L0,1000 Z",
            ],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.path
          d="M0,700 Q250,500 500,700 T1000,700 L1000,1000 L0,1000 Z"
          fill="url(#inkGradient)"
          animate={{
            d: [
              "M0,700 Q250,500 500,700 T1000,700 L1000,1000 L0,1000 Z",
              "M0,600 Q250,800 500,600 T1000,600 L1000,1000 L0,1000 Z",
              "M0,700 Q250,500 500,700 T1000,700 L1000,1000 L0,1000 Z",
            ],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </svg>
    </div>
  );
};

// Word particles floating animation
const WordParticles = () => {
  const words = [
    "Write",
    "Think",
    "Create",
    "Inspire",
    "Connect",
    "Express",
    "Dream",
    "Evolve",
  ];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {words.map((word, index) => (
        <motion.div
          key={word}
          className="absolute text-blue-400/10 font-serif text-lg md:text-xl font-light"
          style={{
            left: `${Math.random() * 80 + 10}%`,
            top: `${Math.random() * 80 + 10}%`,
          }}
          animate={{
            y: [0, -50, 0],
            opacity: [0.1, 0.3, 0.1],
            rotate: [0, 5, -5, 0],
          }}
          transition={{
            duration: 8 + index,
            repeat: Infinity,
            ease: "easeInOut",
            delay: index * 0.5,
          }}
        >
          {word}
        </motion.div>
      ))}
    </div>
  );
};

export function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  const scrollToNext = () => {
    const nextSection = document.querySelector("#mission-section");
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleJoinClick = () => {
    trackEvent("hero_cta_click", {
      button_type: "primary",
      button_text: "Join the Movement",
      page_path: window.location.pathname,
    });
    navigate("/login");
  };

  const handleExploreClick = () => {
    trackEvent("hero_cta_click", {
      button_type: "secondary",
      button_text: "Explore the Feed",
      page_path: window.location.pathname,
    });
    navigate("/feed");
  };

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen bg-black text-white overflow-hidden flex items-center justify-center"
    >
      {/* Animated Background Layers */}
      <div className="absolute inset-0">
        <FlowingInk />
        <ParticleSystem />
        <WordParticles />
      </div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40" />

      {/* Main Content */}
      <motion.div
        style={{ y, opacity }}
        className="relative z-10 text-center px-8 sm:px-6 lg:px-8 max-w-6xl mx-auto"
      >
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex justify-center mb-4 sm:mb-2"
        >
          <img src={logo} alt="Logo" className="h-16 sm:h-20 md:h-24 w-auto" />
        </motion.div>
        {/* Main Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-serif font-light leading-tight mb-8"
          style={{ letterSpacing: "0.02em" }}
        >
          <span className="block">This isn't just a platform.</span>
          <motion.span
            className="block bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 bg-clip-text text-transparent"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
          >
            It's a revolution in ink.
          </motion.span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-gray-300 font-light mb-12 max-w-4xl mx-auto leading-relaxed"
          style={{ letterSpacing: "0.01em" }}
        >
          Where writing finds meaning. Where thinkers find their voice.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.6 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 mb-16"
        >
          {/* Primary CTA */}
          <motion.button
            onClick={handleJoinClick}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="group relative inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full text-lg font-semibold text-white transition-all duration-300 shadow-lg hover:shadow-xl overflow-hidden"
          >
            {/* Glow effect */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 rounded-full blur opacity-30 group-hover:opacity-60 transition duration-300"></div>

            {/* Button content */}
            <span className="relative">Join the Movement</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform relative" />

            {/* Shimmer effect */}
            <div className="absolute inset-0 -top-2 -bottom-2 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
          </motion.button>

          {/* Secondary CTA */}
          <motion.button
            onClick={handleExploreClick}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="group inline-flex items-center gap-2 px-6 py-3 border border-blue-400/30 rounded-full text-blue-400 hover:text-white hover:border-blue-400 transition-all duration-300 backdrop-blur-sm"
          >
            <span>Explore the Feed</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </motion.button>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 2 }}
          className="flex flex-col items-center gap-2"
        >
          <span className="text-gray-400 text-sm font-light tracking-wider">
            DISCOVER MORE
          </span>
          <motion.button
            onClick={scrollToNext}
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="text-blue-400 hover:text-blue-300 transition-colors p-2"
          >
            <ChevronDown className="w-6 h-6" />
          </motion.button>
        </motion.div>
      </motion.div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent pointer-events-none" />
    </section>
  );
}
