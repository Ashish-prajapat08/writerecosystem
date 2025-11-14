import { useEffect, useState, useRef } from 'react';
import { CheckCircle2, Sparkles } from 'lucide-react';

interface ArticleSuccessAnimationProps {
  isVisible: boolean;
  onComplete: () => void;
}

export const ArticleSuccessAnimation = ({ isVisible, onComplete }: ArticleSuccessAnimationProps) => {
  const [show, setShow] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout>();


  useEffect(() => {
    if (!isVisible) {
      setShow(false);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      return;
    }

    setShow(true);

    // Set timeout to hide after 3 seconds
    timeoutRef.current = setTimeout(() => {
      setShow(false);
      // Wait for fade out animation to complete before calling onComplete
      setTimeout(() => onComplete(), 300);
    }, 3000);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [isVisible, onComplete]);

  if (!isVisible && !show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300"
        style={{
          opacity: show ? 1 : 0,
        }}
      />
      
      {/* Animated Card */}
      <div 
        className="relative z-10 w-full max-w-md bg-white dark:bg-gray-800 rounded-xl shadow-2xl overflow-hidden transition-all duration-500"
        style={{
          opacity: show ? 1 : 0,
          transform: show 
            ? 'translateY(0) scale(1)' 
            : 'translateY(20px) scale(0.95)',
        }}
      >
        {/* Gradient Border Effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 opacity-10" />
        
        {/* Card Content */}
        <div className="relative p-6">
          {/* Icon with animation */}
          <div className="flex justify-center mb-4">
            <div className="relative">
              <div className="absolute inset-0 bg-blue-500/10 rounded-full animate-ping" />
              <div 
                className="relative flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full shadow-lg"
                style={{
                  transform: show ? 'scale(1)' : 'scale(0)',
                  transition: 'transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
                }}
              >
                <CheckCircle2 className="w-8 h-8 text-white" />
              </div>
              <Sparkles 
                className="absolute -top-2 -right-2 w-5 h-5 text-yellow-400"
                style={{
                  opacity: show ? 1 : 0,
                  transform: show ? 'scale(1) rotate(0deg)' : 'scale(0) rotate(45deg)',
                  transition: 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) 0.2s',
                }}
              />
            </div>
          </div>

          {/* Text content */}
          <div className="text-center">
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
              Article Published!
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Your content is now live and ready to inspire readers.
            </p>
            
            {/* Progress bar that fills over 3 seconds */}
            <div className="h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 to-purple-600"
                style={{
                  width: show ? '100%' : '0%',
                  transition: 'width 3s linear',
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};