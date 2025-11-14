// hooks/useFollowedArticles.ts
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Article } from '@/lib/articles';

export const useFollowedArticles = (options: {
  limit?: number;
  publishedOnly?: boolean;
} = {}) => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [hasFollowedUsers, setHasFollowedUsers] = useState(false);

  const fetchArticles = async (pageToFetch = 1, isLoadMore = false) => {
    try {
      setLoading(true);
      
      // 1. First get current user's followed users
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data: follows, error: followsError } = await supabase
        .from('user_follows')
        .select('following_id')
        .eq('follower_id', user.id);

      if (followsError) throw followsError;
      if (!follows.length) {
        setHasFollowedUsers(false);
        setArticles([]);
        return;
      }

      setHasFollowedUsers(true);
      const followedIds = follows.map(f => f.following_id);

      // 2. Then get articles with proper author data
      const { data, error: articlesError } = await supabase
        .from('articles')
        .select(`
          *,
          author:profiles!user_id(
            user_id,
            full_name,
            username,
            avatar_url
          ),
          tags:article_tags(tags(name, id))
        `)
        .in('user_id', followedIds)
        .eq('published', options.publishedOnly !== false)
        .order('created_at', { ascending: false })
        .range(
          (pageToFetch - 1) * (options.limit || 10),
          pageToFetch * (options.limit || 10) - 1
        );

      if (articlesError) throw articlesError;

      // Transform data to ensure proper author handling
      const transformedArticles = data.map(article => ({
        ...article,
        author: article.author || null,
        tags: article.tags?.map((at: any) => at.tags) || []
      }));

      setArticles(prev => 
        isLoadMore ? [...prev, ...transformedArticles] : transformedArticles
      );
      setHasMore(data.length === (options.limit || 10));
    } catch (err:any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles(1);
  }, [options.publishedOnly]);

  const loadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchArticles(nextPage, true);
  };

  const refresh = () => {
    setPage(1);
    fetchArticles(1);
  };

  return { 
    articles, 
    loading, 
    error, 
    hasMore, 
    loadMore, 
    refresh,
    hasFollowedUsers 
  };
};