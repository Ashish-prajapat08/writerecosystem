import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/context/AuthContext";
import { toast } from "@/hooks/use-toast";
import { SharePlatform } from "@/types/share";
import { PostgrestError } from "@supabase/supabase-js";

// Add this interface near your other interfaces
interface LikeData {
  user_id: string;
  username: string;
  full_name: string | null;
  avatar_url: string | null;
  created_at: string;
}

interface ProfileData {
  user_id: string;
  username: string;
  full_name: string | null;
  avatar_url: string | null;
}

interface Comment {
  id: number;
  content: string;
  created_at: string;
  author: ProfileData;
}

export const useArticleEngagement = (
  articleId: string,
  isDetailPage: boolean = false
) => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState({
    like: false,
    comment: false,
    share: false,
    view: false,
  });
  const [likesList, setLikesList] = useState<LikeData[]>([]);
  const [isLoadingLikes, setIsLoadingLikes] = useState(false);
  const [engagement, setEngagement] = useState({
    likes: 0,
    commentsCount: 0, // Renamed from 'comments' to be explicit
    views: 0,
    isLiked: false,
  });

  // Fetch initial engagement data
  useEffect(() => {
    fetchEngagementData();
  }, [articleId, user]);

  const [comments, setComments] = useState<Comment[]>([]);

  const fetchEngagementData = async () => {
    try {
      // Get all counts in parallel
      const [likesData, commentsData, viewsData] = await Promise.all([
        supabase
          .from("article_likes")
          .select("*", { count: "exact" })
          .eq("article_id", articleId),
        supabase
          .from("article_comments")
          .select("*", { count: "exact" })
          .eq("article_id", articleId),
        supabase
          .from("article_views")
          .select("*", { count: "exact" })
          .eq("article_id", articleId),
      ]);

      const isLiked = user ? await checkIfLiked() : false;

      setEngagement({
        likes: likesData.count || 0,
        commentsCount: commentsData.count || 0,
        views: viewsData.count || 0,
        isLiked,
      });
    } catch (error) {
      console.error("Error fetching engagement data:", error);
    }
  };

  const checkIfLiked = async () => {
    const { data } = await supabase
      .from("article_likes")
      .select()
      .eq("article_id", articleId)
      .eq("user_id", user?.id)
      .maybeSingle();
    return !!data;
  };

  // Track view (works for logged-in + anonymous users)
  const trackView = async () => {
    if (typeof window === "undefined" || !isDetailPage) return;

    setIsLoading((prev) => ({ ...prev, view: true }));

    try {
      // For authenticated users
      if (user) {
        const { error } = await supabase.from("article_views").upsert(
          {
            article_id: articleId,
            user_id: user.id,
          },
          { onConflict: "article_id,user_id" } // Won't insert if exists
        );

        if (error) throw error;

        // Only increment if this was a new view
        const { count } = await supabase
          .from("article_views")
          .select("*", { count: "exact" })
          .eq("article_id", articleId);

        setEngagement((prev) => ({
          ...prev,
          views: count || prev.views,
        }));
      }
      // For anonymous users
      else {
        const storageKey = `viewed_${articleId}`;
        const lastView = localStorage.getItem(storageKey);
        const now = new Date().getTime();

        // Skip if viewed in the last 24 hours
        if (lastView && now - parseInt(lastView) < 86400000) return;

        await supabase
          .from("article_views")
          .insert({ article_id: articleId, user_id: null });

        setEngagement((prev) => ({ ...prev, views: prev.views + 1 }));
        localStorage.setItem(storageKey, now.toString());
      }
    } catch (error) {
      console.error("Error tracking view:", error);
    } finally {
      setIsLoading((prev) => ({ ...prev, view: false }));
    }
  };

  // Toggle like (only for logged-in users)
  const toggleLike = async () => {
    if (!user) {
      toast({
        title: "Please sign in",
        description: "You need to sign in to like articles",
        variant: "destructive",
      });
      return;
    }

    setIsLoading((prev) => ({ ...prev, like: true }));

    try {
      if (engagement.isLiked) {
        await supabase
          .from("article_likes")
          .delete()
          .eq("article_id", articleId)
          .eq("user_id", user.id);

        setEngagement((prev) => ({
          ...prev,
          likes: prev.likes - 1,
          isLiked: false,
        }));
      } else {
        await supabase.from("article_likes").insert({
          article_id: articleId,
          user_id: user.id,
        });

        setEngagement((prev) => ({
          ...prev,
          likes: prev.likes + 1,
          isLiked: true,
        }));
      }
    } catch (error) {
      console.error("Error toggling like:", error);
      toast({
        title: "Error",
        description: "Failed to update like",
        variant: "destructive",
      });
    } finally {
      setIsLoading((prev) => ({ ...prev, like: false }));
    }
  };

  // Update fetchComments function
  const fetchComments = async () => {
    setIsLoading((prev) => ({ ...prev, comment: true }));
    try {
      const { data, error } = await supabase
        .from("article_comments")
        .select(
          `
        id,
        content,
        created_at,
        profiles:user_id (
          user_id,
          username,
          full_name,
          avatar_url
        )
      `
        )
        .eq("article_id", articleId)
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Type assertion for the response data
      const commentsData = data as unknown as Array<{
        id: number;
        content: string;
        created_at: string;
        profiles: ProfileData;
      }>;

      const formattedComments: Comment[] = commentsData.map((comment) => ({
        id: comment.id,
        content: comment.content,
        created_at: comment.created_at,
        author: comment.profiles,
      }));

      setComments(formattedComments);
    } catch (error) {
      console.error("Error fetching comments:", error);
    } finally {
      setIsLoading((prev) => ({ ...prev, comment: false }));
    }
  };

  // Update addComment function
  const addComment = async (content: string) => {
    if (!user) {
      toast({
        title: "Please sign in",
        description: "You need to sign in to comment",
        variant: "destructive",
      });
      return;
    }

    setIsLoading((prev) => ({ ...prev, comment: true }));

    try {
      const { data, error } = await supabase
        .from("article_comments")
        .insert({
          article_id: articleId,
          user_id: user.id,
          content,
        })
        .select(
          `
        id,
        content,
        created_at,
        profiles:user_id (
          user_id,
          username,
          full_name,
          avatar_url
        )
      `
        )
        .single();

      if (error) {
        // Rollback optimistic update
        setComments((prev) => prev.filter((c) => c.id !== newComment.id));
        setEngagement((prev) => ({
          ...prev,
          commentsCount: prev.commentsCount - 1,
        }));
        throw error;
      }

      // Type assertion for the response data
      const commentData = data as unknown as {
        id: number;
        content: string;
        created_at: string;
        profiles: ProfileData;
      };

      const newComment: Comment = {
        id: commentData.id,
        content: commentData.content,
        created_at: commentData.created_at,
        author: commentData.profiles,
      };

      setComments((prev) => [newComment, ...prev]);
      setEngagement((prev) => ({
        ...prev,
        commentsCount: prev.commentsCount + 1,
      }));

      toast({
        title: "Comment posted!",
        description: "Your comment has been successfully added",
        variant: "default",
      });
    } catch (error) {
      console.error("Error adding comment:", error);
      toast({
        title: "Error",
        description: "Failed to post comment",
        variant: "destructive",
      });
    } finally {
      setIsLoading((prev) => ({ ...prev, comment: false }));
    }
  };

  const deleteComment = async (commentId: number) => {
  if (!user) {
    toast({
      title: "Unauthorized",
      description: "You must be logged in to delete comments",
      variant: "destructive",
    });
    return;
  }

  setIsLoading((prev) => ({ ...prev, comment: true }));

  try {
    const { error } = await supabase
      .from("article_comments")
      .delete()
      .eq("id", commentId)
      .eq("user_id", user.id);

    if (error) throw error;

    // Optimistically update UI
    setComments((prev) => prev.filter((comment) => comment.id !== commentId));
    setEngagement((prev) => ({
      ...prev,
      commentsCount: prev.commentsCount - 1,
    }));

    toast({
      title: "Comment Deleted",
      description: "Your comment has been successfully removed",
      variant: "default",
    });
  } catch (error) {
    console.error("Error deleting comment:", error);
    toast({
      title: "Deletion Failed",
      description: "We couldn't delete your comment. Please try again.",
      variant: "destructive",
    });
  } finally {
    setIsLoading((prev) => ({ ...prev, comment: false }));
  }
};
  // Track share (works for both logged-in + anonymous users)
  const trackShare = async (platform: SharePlatform): Promise<void> => {
    setIsLoading((prev) => ({ ...prev, share: true }));

    try {
      // Track in database
      await supabase.from("article_shares").insert({
        article_id: articleId,
        user_id: user?.id || null,
        platform,
      });

      // Handle actual sharing
      const shareUrl = `${window.location.origin}/article/${articleId}`;
      const shareText = `Check out this article!`;

      switch (platform) {
        case "twitter":
          window.open(
            `https://twitter.com/intent/tweet?url=${encodeURIComponent(
              shareUrl
            )}&text=${encodeURIComponent(shareText)}`,
            "_blank"
          );
          break;
        case "facebook":
          window.open(
            `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
              shareUrl
            )}`,
            "_blank"
          );
          break;
        case "linkedin":
          window.open(
            `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
              shareUrl
            )}`,
            "_blank"
          );
          break;
        case "copy":
          await navigator.clipboard.writeText(shareUrl);
          toast({
            title: "Copied!",
            description: "Link copied to clipboard",
          });
          break;
        case "link":
          // Just track the share, no additional action
          break;
      }
    } catch (error) {
      console.error("Error tracking share:", error);
      toast({
        title: "Error",
        description: "Failed to share article",
        variant: "destructive",
      });
    } finally {
      setIsLoading((prev) => ({ ...prev, share: false }));
    }
  };

  const fetchLikes = async () => {
    if (!articleId) return;

    setIsLoadingLikes(true);
    try {
      const { data, error } = await supabase
        .from("article_likes")
        .select(
          `
          created_at,
          profiles:user_id (
            user_id,
            username,
            full_name,
            avatar_url
          )
        `
        )
        .eq("article_id", articleId)
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Type assertion and transformation
      const likesData = data as unknown as Array<{
        created_at: string;
        profiles: ProfileData;
      }>;

      const formattedLikes: LikeData[] = likesData.map((like) => ({
        user_id: like.profiles.user_id,
        username: like.profiles.username,
        full_name: like.profiles.full_name,
        avatar_url: like.profiles.avatar_url,
        created_at: like.created_at,
      }));

      setLikesList(formattedLikes);
    } catch (error) {
      console.error("Error fetching likes:", error);
      const pgError = error as PostgrestError;
      throw new Error(pgError.message || "Failed to fetch likes");
    } finally {
      setIsLoadingLikes(false);
    }
  };

  return {
    ...engagement,
    comments,
    likesList,
    isLoading: {
      ...isLoading,
      likes: isLoadingLikes,
    },
    fetchComments,
    toggleLike,
    addComment,
    deleteComment,
    trackShare,
    trackView,
    fetchLikes,
  };
};
