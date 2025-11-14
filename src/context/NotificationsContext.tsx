// context/NotificationContext.tsx
import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from './AuthContext';

type NotificationType = 'new_article' | 'article_like' | 'article_comment' | 'follow';

interface NotificationContextType {
  unreadCount: number;
  refreshNotifications: () => Promise<void>;
  notificationTypes: NotificationType[];
  markAsRead: (notificationId: string) => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType>({
  unreadCount: 0,
  refreshNotifications: async () => {},
  notificationTypes: [],
  markAsRead: async () => {},
});

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);
  const [notificationTypes] = useState<NotificationType[]>([
    'new_article',
    'article_like',
    'article_comment',
    'follow',
  ]);

  const fetchUnreadCount = async () => {
    if (!user?.id) {
      setUnreadCount(0);
      return;
    };
    
    const { count, error } = await supabase
      .from('notifications')
      .select('*', { count: 'exact' })
      .eq('recipient_id', user.id)
      .eq('read', false)
      .in('type', notificationTypes);

    if (error) {
      console.error('Error fetching unread count:', error);
      return;
    }

    setUnreadCount(count || 0);
  };

  const markAsRead = async (notificationId: string) => {
    if (!user?.id) return;
    
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', notificationId)
        .eq('recipient_id', user.id);

      if (error) throw error;
      await fetchUnreadCount();
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  useEffect(() => {
    if (!user?.id) return;

    // Initial fetch
    fetchUnreadCount();

    // Real-time subscription
    const channel = supabase
      .channel(`notification_count:${user.id}`)
      .on(
        'postgres_changes',
        {
          event: '*', // Listen for all changes
          schema: 'public',
          table: 'notifications',
          filter: `recipient_id=eq.${user.id}`,
        },
        (payload) => {
          // Handle inserts and updates
          if (payload.eventType === 'INSERT' && !payload.new.read) {
            setUnreadCount(prev => prev + 1);
          } else if (payload.eventType === 'UPDATE' && payload.new.read) {
            setUnreadCount(prev => Math.max(0, prev - 1));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id]);

  return (
    <NotificationContext.Provider value={{ 
      unreadCount, 
      refreshNotifications: fetchUnreadCount,
      notificationTypes,
      markAsRead
    }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}