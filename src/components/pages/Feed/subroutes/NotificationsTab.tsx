"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabaseClient";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useNotifications } from "@/context/NotificationsContext";
import { 
  Bell, 
  BellRing, 
  Calendar, 
  FileText, 
  User,
  CheckCheck,
  Heart,
  MessageSquare,
  Users,
} from "lucide-react";

type NotificationType = 'new_article' | 'article_like' | 'article_comment' | 'follow';

interface BaseNotification {
  id: string;
  type: NotificationType;
  sender_id: string;
  message: string;
  created_at: string;
  read: boolean;
  sender?: {
    username: string;
    avatar_url?: string;
    full_name?: string;
  };
}

interface ArticleNotification extends BaseNotification {
  type: 'new_article' | 'article_like';
  article_id: string;
  article?: {
    title: string;
    slug: string;
  };
}

interface ArticleCommentNotification extends BaseNotification {
  type: 'article_comment';
  article_id: string;
  comment_id: number;
  comment?: {
    content: string;
  };
  article?: {
    title: string;
    slug: string;
  };
}

interface FollowNotification extends BaseNotification {
  type: 'follow';
}

type Notification = ArticleNotification | ArticleCommentNotification | FollowNotification;

const UserAvatar = ({
  name,
  avatarUrl,
}: {
  name?: string;
  avatarUrl?: string;
}) => {
  const initials = name
    ?.split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="relative">
      <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/30 to-cyan-500/30 rounded-full blur opacity-40"></div>
      <div className="relative w-12 h-12 rounded-full flex items-center justify-center overflow-hidden bg-gradient-to-br from-gray-700 to-gray-800 border-2 border-gray-600/50">
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt={name || "User"}
            className="w-full h-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = "none";
            }}
            loading="lazy"
            referrerPolicy="no-referrer"
          />
        ) : (
          <span className="text-sm font-bold text-white">
            {initials || "US"}
          </span>
        )}
      </div>
    </div>
  );
};

const NotificationCard = ({ 
  notification, 
  onMarkAsRead 
}: { 
  notification: Notification; 
  onMarkAsRead: (notificationId: string, targetId: string, type: NotificationType) => void;
}) => {
  const formatTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return "Just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

  const getNotificationDetails = () => {
    switch (notification.type) {
      case 'article_like':
        return {
          icon: <Heart className="w-4 h-4 text-red-500" />,
          typeText: 'Article Like',
          preview: notification.article && (
            <div className="mb-3 p-3 bg-gray-800/40 rounded-lg border border-gray-700/30">
              <p className="text-gray-200 font-medium text-sm break-words line-clamp-2">
                "{notification.article.title}"
              </p>
            </div>
          )
        };
      case 'article_comment':
        return {
          icon: <MessageSquare className="w-4 h-4 text-blue-500" />,
          typeText: 'Article Comment',
          preview: notification.comment && (
            <div className="mb-3 p-3 bg-gray-800/40 rounded-lg border border-gray-700/30">
              <p className="text-gray-200 font-medium text-sm break-words line-clamp-2">
                "{notification.comment.content}"
              </p>
            </div>
          )
        };
      case 'new_article':
        return {
          icon: <FileText className="w-4 h-4 text-green-500" />,
          typeText: 'New Article',
          preview: notification.article && (
            <div className="mb-3 p-3 bg-gray-800/40 rounded-lg border border-gray-700/30">
              <p className="text-gray-200 font-medium text-sm break-words line-clamp-2">
                "{notification.article.title}"
              </p>
            </div>
          )
        };
      case 'follow':
        return {
          icon: <Users className="w-4 h-4 text-purple-500" />,
          typeText: 'New Follower',
          preview: null,
          action: (
            <button 
              className="mt-2"
              onClick={(e:any) => {
                e.stopPropagation();
                onMarkAsRead(notification.id, notification.sender_id, 'follow');
              }}
            >
              View Profile
            </button>
          )
        };
      default:
        return {
          icon: <Bell className="w-4 h-4" />,
          typeText: 'Notification',
          preview: null
        };
    }
  };

  const handleClick = () => {
    const targetId = notification.type === 'article_comment' 
      ? notification.comment_id.toString() 
      : notification.type === 'follow'
      ? notification.sender_id
      : notification.article_id;
    onMarkAsRead(notification.id, targetId, notification.type);
  };

  const { icon, typeText, preview, action } = getNotificationDetails();

  return (
    <div className="group relative w-full min-w-0">
      <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-cyan-600/20 rounded-2xl blur opacity-0 group-hover:opacity-30 transition-all duration-500"></div>
      
      <Card
        onClick={handleClick}
        className={`relative backdrop-blur-sm border p-4 md:p-6 transition-all duration-300 cursor-pointer group-hover:transform group-hover:scale-[1.01] group-hover:shadow-xl w-full min-w-0 ${
          notification.read
            ? "bg-gradient-to-br from-gray-900/50 to-gray-800/30 border-gray-700/30 hover:border-gray-600/40 group-hover:shadow-gray-500/10"
            : "bg-gradient-to-br from-blue-900/30 to-purple-800/20 border-blue-500/30 hover:border-blue-400/50 group-hover:shadow-blue-500/10"
        }`}
      >
        <div className="flex items-start gap-4">
          <UserAvatar
            name={notification.sender?.full_name || notification.sender?.username}
            avatarUrl={notification.sender?.avatar_url}
          />
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-2">
              <h4 className={`font-semibold leading-relaxed break-words ${
                notification.read ? "text-gray-300" : "text-white"
              }`}>
                <span className="text-blue-300 hover:text-blue-200 transition-colors">
                  {notification.sender?.full_name || notification.sender?.username}
                </span>{" "}
                {notification.message}
              </h4>
              {!notification.read && (
                <div className="flex-shrink-0 w-3 h-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full shadow-lg shadow-blue-500/50 animate-pulse"></div>
              )}
            </div>
            
            {preview}
            {action}
            
            <div className="flex flex-wrap items-center gap-3 text-xs text-gray-400">
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3 flex-shrink-0" />
                <span>{formatTimeAgo(notification.created_at)}</span>
              </span>
              <span className="flex items-center gap-1">
                {icon}
                <span>{typeText}</span>
              </span>
              {!notification.read && (
                <span className="flex items-center gap-1 text-blue-400 font-medium">
                  <BellRing className="w-3 h-3 flex-shrink-0" />
                  <span>New</span>
                </span>
              )}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export function NotificationsTab() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { unreadCount, refreshNotifications, markAsRead: markAsReadContext } = useNotifications();
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchNotifications = async () => {
    if (!user?.id) return;

    try {
      const { data, error } = await supabase
        .from("notifications")
        .select(`
          id,
          type,
          sender_id,
          article_id,
          comment_id,
          message,
          created_at,
          read,
          sender:profiles!sender_id(username, full_name, avatar_url),
          article:articles!article_id(title, slug),
          comment:article_comments!comment_id(content)
        `)
        .eq("recipient_id", user.id)
        .in("type", ['new_article', 'article_like', 'article_comment', 'follow'])
        .order("created_at", { ascending: false })
        .limit(20);

      if (error) throw error;

      setNotifications((data as unknown as Notification[]) || []);
    } catch (error) {
      toast({
        title: "Error loading notifications",
        description: "Failed to fetch your notifications",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();

    const channel = supabase
      .channel(`notifications:${user?.id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
          filter: `recipient_id=eq.${user?.id}`,
        },
        (payload) => {
          const newNotification = {
            id: payload.new.id,
            type: payload.new.type,
            sender_id: payload.new.sender_id,
            article_id: payload.new.article_id,
            comment_id: payload.new.comment_id,
            message: payload.new.message,
            created_at: payload.new.created_at,
            read: payload.new.read,
            sender: payload.new.sender
              ? {
                  username: payload.new.sender.username,
                  avatar_url: payload.new.sender.avatar_url,
                  full_name: payload.new.sender.full_name,
                }
              : undefined,
            article: payload.new.article
              ? {
                  title: payload.new.article.title,
                  slug: payload.new.article.slug,
                }
              : undefined,
            comment: payload.new.comment
              ? {
                  content: payload.new.comment.content,
                }
              : undefined,
          };

          setNotifications((prev) => [newNotification, ...prev]);
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [user?.id]);

  const markAllAsRead = async () => {
    if (!user?.id || unreadCount === 0) return;

    try {
      const { error } = await supabase
        .from("notifications")
        .update({ read: true })
        .eq("recipient_id", user.id)
        .eq("read", false)
        .in("type", ['new_article', 'article_like', 'article_comment', 'follow']);

      if (error) throw error;

      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      await refreshNotifications();
    } catch (error) {
      toast({
        title: "Error marking notifications as read",
        variant: "destructive",
      });
    }
  };

  const handleMarkAsRead = async (notificationId: string, targetId: string, type: NotificationType) => {
    try {
      await markAsReadContext(notificationId);
      
      // Handle navigation based on type
      switch (type) {
        case 'article_like':
        case 'new_article':
          navigate(`/article/${targetId}`);
          break;
        case 'article_comment':
          const notification = notifications.find(n => n.id === notificationId);
          if (notification && 'article_id' in notification) {
            navigate(`/article/${notification.article_id}#comment-${targetId}`);
          }
          break;
        case 'follow':
        const followNotification = notifications.find(n => n.id === notificationId);
        if (followNotification?.sender?.username) {
          navigate(`/profile/${followNotification.sender.username}`); // Use username here
        }
        break;
      }
    } catch (error) {
      toast({
        title: "Error marking notification as read",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-gray-900 to-slate-950 overflow-x-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent"></div>
        <div className="absolute top-0 left-1/4 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl"></div>
        <div className="relative z-10 flex flex-col items-center justify-center py-16">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
            <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-r-cyan-500 rounded-full animate-spin animate-reverse"></div>
          </div>
          <p className="text-gray-400 mt-4 text-lg">Loading your notifications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-gray-900 to-slate-950 overflow-x-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent"></div>
      <div className="absolute top-0 left-1/4 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl"></div>

      <div className="relative z-10 w-full">
        <div className="px-4 py-6 max-w-4xl mx-auto">
          {/* Simple Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bell className="w-6 h-6 text-blue-400" />
                <h1 className="text-2xl md:text-3xl font-bold text-white">
                  Notifications
                </h1>
                {unreadCount > 0 && (
                  <div className="px-3 py-1 bg-blue-500 text-white text-sm font-medium rounded-full">
                    {unreadCount}
                  </div>
                )}
              </div>
              
              {unreadCount > 0 && (
                <Button
                  onClick={markAllAsRead}
                  variant="ghost"
                  className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/10"
                >
                  <CheckCheck className="w-4 h-4 mr-2" />
                  Mark all as read
                </Button>
              )}
            </div>
          </div>

          {/* Main Content */}
          {notifications.length === 0 ? (
            <div className="text-center py-16">
              <div className="relative mb-8">
                <div className="absolute -inset-2 bg-gradient-to-r from-gray-600 to-gray-700 rounded-full blur opacity-20"></div>
                <div className="relative w-20 h-20 mx-auto bg-gradient-to-br from-gray-800 to-gray-900 rounded-full flex items-center justify-center border-4 border-gray-700/30">
                  <Bell className="w-10 h-10 text-gray-600" />
                </div>
              </div>
              <Card className="bg-gradient-to-br from-gray-900/80 to-gray-800/60 backdrop-blur-sm border border-gray-700/30 p-8 text-center max-w-2xl mx-auto">
                <h3 className="text-xl font-bold text-gray-300 mb-3">No notifications yet</h3>
                <p className="text-gray-400 leading-relaxed mb-6">
                  You'll receive notifications here when someone likes your articles, comments, or follows you.
                </p>
                <Button
                  onClick={() => navigate('/feed')}
                  className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white px-6 py-3 font-semibold shadow-lg shadow-blue-500/25"
                >
                  <User className="w-4 h-4 mr-2" />
                  Discover Content
                </Button>
              </Card>
            </div>
          ) : (
            <div className="space-y-4">
              {notifications.map((notification, index) => (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2, delay: index * 0.05 }}
                >
                  <NotificationCard
                    notification={notification}
                    onMarkAsRead={handleMarkAsRead}
                  />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}