import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';

interface FollowButtonProps {
  profileUserId: string;
  className?: string;
  onFollowChange?: (isFollowing: boolean) => void;
  initialFollowing?: boolean;
}

export const FollowButton = ({ 
  profileUserId, 
  className,
  onFollowChange,
  initialFollowing = false
}: FollowButtonProps) => {
  const { user } = useAuth();
  const [isFollowing, setIsFollowing] = useState(initialFollowing);
  const [isLoading, setIsLoading] = useState(false);

  // Sync with parent's initialFollowing prop
  useEffect(() => {
    setIsFollowing(initialFollowing);
  }, [initialFollowing]);

  const handleFollowToggle = async () => {
    if (!user || isLoading) return;
    
    setIsLoading(true);
    const newFollowingState = !isFollowing;
    
    // Optimistic UI update
    setIsFollowing(newFollowingState);
    if (onFollowChange) onFollowChange(newFollowingState);

    try {
      if (newFollowingState) {
        const { error } = await supabase
          .from('user_follows')
          .insert({
            follower_id: user.id,
            following_id: profileUserId
          });
        
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('user_follows')
          .delete()
          .eq('follower_id', user.id)
          .eq('following_id', profileUserId);
        
        if (error) throw error;
      }
    } catch (error) {
      console.error('Error toggling follow:', error);
      // Revert on error
      setIsFollowing(isFollowing);
      if (onFollowChange) onFollowChange(isFollowing);
    } finally {
      setIsLoading(false);
    }
  };

  if (!user || user.id === profileUserId) return null;

  return (
    <Button
      onClick={handleFollowToggle}
      disabled={isLoading}
      className={`${className} ${
        isFollowing 
          ? 'bg-gray-200 text-gray-800 hover:bg-gray-300' 
          : 'bg-blue-600 hover:bg-blue-700 text-white'
      }`}
    >
      {isLoading ? (
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          {isFollowing ? 'Unfollowing' : 'Following'}
        </div>
      ) : isFollowing ? (
        'Following'
      ) : (
        'Follow'
      )}
    </Button>
  );
};