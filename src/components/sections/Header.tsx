import React, { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { LogInIcon, LogOut, BookOpen, Home } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { NotificationIndicator } from "../NotificationIndicator";
import logo from "@/assets/logo.webp";

interface HeaderProps {
  handleLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ handleLogout }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [lastPath, setLastPath] = useState<string | null>(null);

  const isEbookPage = location.pathname === "/ebookhub";

  const handleNotificationClick = useCallback(() => {
    if (location.pathname === "/notifications") {
      navigate(lastPath || "/");
    } else {
      setLastPath(location.pathname);
      navigate("/notifications");
    }
  }, [location.pathname, lastPath, navigate]);

  const handleLogoClick = useCallback(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleNavigation = useCallback(
    (path: string) => {
      navigate(path);
    },
    [navigate]
  );

  const handleWhatsAppClick = useCallback(() => {
    // Replace with your actual WhatsApp group invite link
    window.open("https://chat.whatsapp.com/Cjr3gyeEUShBfEDgAackbS?mode=ems_share_c", "_blank");
  }, []);

  // Dynamic navigation button component to reduce duplication
  const DynamicNavButton = () => (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => handleNavigation(isEbookPage ? "/" : "/ebookhub")}
      className="flex items-center gap-2 p-2 rounded-lg text-gray-400 hover:text-blue-400 transition-colors hover:bg-gray-800/50"
      aria-label={isEbookPage ? "Go to feed" : "Go to ebooks"}
    >
      {isEbookPage ? (
        <>
          <Home className="w-5 h-5" />
          <span className="hidden sm:inline text-sm">Feed</span>
        </>
      ) : (
        <>
          <BookOpen className="w-5 h-5" />
          <span className="hidden sm:inline text-sm">Ebooks</span>
        </>
      )}
    </motion.button>
  );

  return (
    <header className="w-full border-b border-gray-800 bg-black/95 backdrop-blur-sm sticky top-0 z-40">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="relative flex items-center justify-between h-16">
          {/* Logo and Title */}
          <button
            onClick={handleLogoClick}
            className="flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md p-1"
            aria-label="Scroll to top"
          >
            <div className="w-12 h-12 rounded-full flex items-center justify-center">
              <img
                src={logo}
                className="h-12"
                alt="Writers Ecosystem Logo"
                loading="eager"
              />
            </div>

            <h1 className="hidden sm:block text-lg sm:text-xl font-bold">
              Writers Ecosystem
            </h1>
          </button>

          {/* Header Actions */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* WhatsApp Group Button with Logo */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleWhatsAppClick}
              className="flex items-center gap-2 p-2 rounded-lg text-gray-400 hover:text-blue-400 transition-colors hover:bg-gray-800/50"
              aria-label="Join our WhatsApp group"
            >
              {/* WhatsApp SVG Logo */}
              <svg 
                className="w-5 h-5" 
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.465 3.49" />
              </svg>
              <span className="hidden sm:inline text-sm">Join Group</span>
            </motion.button>

            <DynamicNavButton />

            {user ? (
              <>
                {/* Notifications Button */}
                <button
                  onClick={handleNotificationClick}
                  className="focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md p-1"
                  aria-label="Notifications"
                >
                  <NotificationIndicator />
                </button>

                {/* Log Out Button */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleLogout}
                  className="flex items-center gap-2 p-2 rounded-lg text-red-400 hover:text-red-300 transition-colors hover:bg-gray-800/50"
                  aria-label="Log out"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="hidden sm:inline text-sm">Log Out</span>
                </motion.button>
              </>
            ) : (
              /* Log In Button */
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleNavigation("/login")}
                className="flex items-center gap-2 p-2 rounded-lg text-gray-300 hover:text-white border border-gray-600 hover:border-gray-400 transition-colors"
                aria-label="Log in"
              >
                <LogInIcon className="w-5 h-5" />
                <span className="hidden sm:inline text-sm">Log In</span>
              </motion.button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;