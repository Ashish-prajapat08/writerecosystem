import { Card } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
export const FollowersPage = () => {
  const { username } = useParams();
  const [followers, setFollowers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();



  useEffect(() => {
    const fetchFollowers = async () => {
      try {
        setLoading(true);
        
        // First get the user's ID from username
        const { data: profileData } = await supabase
          .from('profiles')
          .select('user_id')
          .eq('username', username)
          .single();

        if (!profileData) return;

        // Then get their followers
        const { data: followersData } = await supabase
          .from('user_follows')
          .select(`
            follower_id,
            profiles:follower_id (user_id, username, full_name, avatar_url, bio)
          `)
          .eq('following_id', profileData.user_id);

        setFollowers(followersData?.map(item => item.profiles) || []);
      } catch (error) {
        console.error('Error fetching followers:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFollowers();
  }, [username]);

  return (
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate(-1)}
            className="rounded-full"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">Followers</h1>
        </div>
        
        <Card className="p-6">
          {loading ? (
            <p>Loading...</p>
          ) : followers.length === 0 ? (
            <p>No followers yet</p>
          ) : (
            <div className="space-y-4">
              {followers.map(follower => (
                <div 
                  key={follower.user_id} 
                  className="flex items-center gap-4 p-3 hover:bg-gray-900/50 rounded-lg cursor-pointer"
                  onClick={() => navigate(`/profile/${follower.username}`)}
                >
                  {/* Avatar display */}
                  <div className="relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                    {follower.avatar_url ? (
                      <img
                        src={follower.avatar_url}
                        alt={follower.full_name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = "none";
                          // Show fallback initials if image fails to load
                          const fallback = document.createElement('div');
                          fallback.className = "w-full h-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold";
                          fallback.textContent = follower.full_name
                            .split(' ')
                            .map((n:any) => n[0])
                            .join('')
                            .toUpperCase();
                          target.parentNode?.insertBefore(fallback, target);
                          target.parentNode?.removeChild(target);
                        }}
                        loading="lazy"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold">
                        {follower.full_name
                          .split(' ')
                          .map((n:any) => n[0])
                          .join('')
                          .toUpperCase()}
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <h3 className="font-medium">{follower.full_name}</h3>
                    <p className="text-gray-400 text-sm">@{follower.username}</p>
                    {follower.bio && <p className="text-gray-500 text-sm mt-1">{follower.bio}</p>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
  );
};