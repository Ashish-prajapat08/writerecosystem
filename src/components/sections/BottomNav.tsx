import React from 'react';
import { motion } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import {  Briefcase, Globe, Plus, Search, Trophy, User } from 'lucide-react';

const tabs = [
  { id: 'main', label: 'Feed', icon: Globe, path: '/feed' },
  { id: 'search', label: 'Search', icon: Search, path: '/search'},
  { id: 'post', label: 'Post', icon: Plus, path: '/post'},
  { id: 'myprofile', label: 'Profile', icon: User, path: '/myprofile' },
  { id: 'contests', label: 'Contests', icon: Trophy , path: '/competitions'},
  { id: 'jobs', label: 'Jobs', icon: Briefcase, path: '/jobs'},
];

const BottomNav: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-sm border-t border-gray-800 safe-area-inset-bottom">
      <div className="w-full max-w-md mx-auto px-2 sm:px-4">
        <div className="grid grid-cols-6 gap-1 py-2">
          {tabs.map((tab) => {
            const isActive = location.pathname.startsWith(tab.path);

            const handleClick = () => navigate(tab.path);


            return (
              <motion.button
                key={tab.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleClick}
                className={`relative flex flex-col items-center justify-center gap-1 p-2 rounded-lg transition-all duration-200 min-h-[60px] ${
                  isActive ? "text-blue-400" : "text-gray-400 hover:text-white"
                }`}
              >
                <tab.icon className="w-5 h-5" />
                <span className="text-xs font-medium max-w-full">{tab.label}</span>

                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute top-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-blue-400 rounded-full"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default BottomNav;
