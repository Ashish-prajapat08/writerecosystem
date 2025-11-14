
import { Bell } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useNotifications } from '@/context/NotificationsContext';

export function NotificationIndicator() {
  const { unreadCount } = useNotifications();
  const navigate = useNavigate();

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => navigate('/notifications')}
      className="relative flex items-center gap-2 text-gray-400 hover:text-blue-400 transition-colors p-2 rounded-lg hover:bg-gray-800/50"
    >
      <Bell className="w-5 h-5" />
      {unreadCount > 0 && (
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
          {unreadCount > 9 ? '9+' : unreadCount}
        </span>
      )}
      <span className="hidden sm:inline text-sm">Notifications</span>
    </motion.button>
  );
}