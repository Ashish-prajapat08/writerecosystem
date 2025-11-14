import { useState, useEffect } from 'react';
import { 
  Article, 
  Tag,
  getArticleById,
  getArticleBySlug,
  getArticles,
  getPopularTags
} from '@/lib/articles';
import { supabase } from '@/lib/supabaseClient';

export const useArticle = (id: string) => {
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        setLoading(true);
        const data = await getArticleById(id);
        setArticle(data);
      } catch (err) {
        setError('Failed to fetch article');
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [id]);

  const refreshArticle = async () => {
    if (!id) return;
    try {
      setLoading(true);
      const data = await getArticleById(id);
      setArticle(data);
    } catch (err) {
      setError('Failed to refresh article');
    } finally {
      setLoading(false);
    }
  };

  return { article, loading, error, refreshArticle };
};

export const useArticleBySlug = (slug: string) => {
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        setLoading(true);
        const data = await getArticleBySlug(slug);
        setArticle(data);
      } catch (err) {
        setError('Failed to fetch article');
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [slug]);

  const refreshArticle = async () => {
    if (!slug) return;
    try {
      setLoading(true);
      const data = await getArticleBySlug(slug);
      setArticle(data);
    } catch (err) {
      setError('Failed to refresh article');
    } finally {
      setLoading(false);
    }
  };

  return { article, loading, error, refreshArticle };
};


export const useArticles = (initialOptions: {
  limit?: number;
  userId?: string;
  userIds?:string[];
  tag?: string;
  publishedOnly?: boolean;
} = {}) => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1); // Keep track of page

  const fetchArticles = async (pageToFetch = 1, isLoadMore = false) => {
    try {
      setLoading(true);
      const data = await getArticles({
        ...initialOptions,
        page: pageToFetch,
      });

      setArticles(prev =>
        isLoadMore ? [...prev, ...data] : data
      );

      setHasMore(data.length === (initialOptions.limit || 10));
    } catch (err) {
      setError('Failed to fetch articles');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Reset when filters (userId, tag) change
    setPage(1);
    fetchArticles(1);
  }, [initialOptions.userId,initialOptions.userIds, initialOptions.tag]);

  const loadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchArticles(nextPage, true);
  };

  const refresh = () => {
    setPage(1);
    fetchArticles(1);
  };

  return { articles, loading, error, hasMore, loadMore, refresh };
};


export const useFollowedArticles = (options: {
  limit?: number;
  publishedOnly?: boolean;
} = {}) => {
  const [followedUserIds, setFollowedUserIds] = useState<string[]>([]);
  const [loadingFollows, setLoadingFollows] = useState(true);
  const [followError, setFollowError] = useState<string | null>(null);

  // Fetch the user's followed accounts
  useEffect(() => {
    const fetchFollowedUsers = async () => {
      try {
        setLoadingFollows(true);
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data, error } = await supabase
          .from('user_follows')
          .select('following_id')
          .eq('follower_id', user.id);

        if (error) throw error;

        setFollowedUserIds(data.map(item => item.following_id));
      } catch (err) {
        setFollowError('Failed to fetch followed users');
      } finally {
        setLoadingFollows(false);
      }
    };

    fetchFollowedUsers();
  }, []);

  // Use the main useArticles hook with the followed user IDs
  const articlesQuery = useArticles({
    ...options,
    userIds: followedUserIds
  });

  return {
    ...articlesQuery,
    loading: articlesQuery.loading || loadingFollows,
    error: articlesQuery.error || followError
  };
};


export const usePopularTags = () => {
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        setLoading(true);
        const data = await getPopularTags();
        setTags(data);
      } catch (err) {
        setError('Failed to fetch popular tags');
      } finally {
        setLoading(false);
      }
    };

    fetchTags();
  }, []);

  return { tags, loading, error };
};

