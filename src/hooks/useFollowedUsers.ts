// hooks/useFollowedUsers.ts
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export const useFollowedUsers = () => {
  const [followedUserIds, setFollowedUserIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasFollowedUsers, setHasFollowedUsers] = useState(false);

  useEffect(() => {
    const fetchFollowedUsers = async () => {
      try {
        setLoading(true);
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) return;

        const { data, error } = await supabase
          .from("user_follows")
          .select("following_id")
          .eq("follower_id", user.id);

        if (error) throw error;

        const ids = data.map((item) => item.following_id);
        setFollowedUserIds(ids);
        setHasFollowedUsers(ids.length > 0);
      } catch (err) {
        setError("Failed to fetch followed users");
      } finally {
        setLoading(false);
      }
    };

    fetchFollowedUsers();
  }, []);

  return { followedUserIds, loading, hasFollowedUsers, error };
};
