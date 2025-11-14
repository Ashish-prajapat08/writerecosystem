import { supabase } from '@/lib/supabaseClient';

export const followUser = async (followerId: string, followingId: string) => {
  if (followerId === followingId) {
    throw new Error("Cannot follow yourself");
  }

  const { data, error } = await supabase
    .from('user_follows')
    .insert({
      follower_id: followerId,
      following_id: followingId
    })
    .select();

  if (error) throw error;
  return data;
};

export const unfollowUser = async (followerId: string, followingId: string) => {
  const { data, error } = await supabase
    .from('user_follows')
    .delete()
    .eq('follower_id', followerId)
    .eq('following_id', followingId)
    .select();

  if (error) throw error;
  return data;
};

export const getFollowers = async (userId: string) => {
  const { data, error } = await supabase
    .from('user_follows')
    .select(`
      follower_id,
      profiles:follower_id (user_id, username, full_name, avatar_url, bio)
    `)
    .eq('following_id', userId);

  if (error) throw error;
  return data?.map(item => item.profiles) || [];
};

export const getFollowing = async (userId: string) => {
  const { data, error } = await supabase
    .from('user_follows')
    .select(`
      following_id,
      profiles:following_id (user_id, username, full_name, avatar_url, bio)
    `)
    .eq('follower_id', userId);

  if (error) throw error;
  return data?.map(item => item.profiles) || [];
};

export const getFollowCounts = async (userId: string) => {
  const [
    { count: followerCount },
    { count: followingCount },
    { data: isFollowing }
  ] = await Promise.all([
    supabase
      .from('user_follows')
      .select('*', { count: 'exact' })
      .eq('following_id', userId),
    supabase
      .from('user_follows')
      .select('*', { count: 'exact' })
      .eq('follower_id', userId),
    supabase
      .from('user_follows')
      .select()
      .eq('follower_id', userId)
      .maybeSingle()
  ]);

  return {
    followerCount: followerCount || 0,
    followingCount: followingCount || 0,
    isFollowing: !!isFollowing
  };
};