import { useParams, useNavigate } from "react-router-dom";
import { useArticle } from "@/hooks/useArticles";
import { useArticleEngagement } from "@/hooks/useArticleEngagement";
import { useAuth } from "@/context/AuthContext";
import { deleteArticle } from "@/lib/articles";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Edit,
  Trash2,
  Heart,
  MessageCircle,
  Share2,
  Eye,
  ArrowLeft,
  Sparkles,
  Clock,
  User,
  Users,
} from "lucide-react";
import { ArticleContent } from "@/components/Article-content";
import { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { format, formatDistanceToNow, isBefore, subDays } from "date-fns";
import { ShareModal } from "@/components/modals/shareModal";
import { Card } from "@/components/ui/card";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useScroll } from "@/context/ScrollContext";

export function ArticleDetailPage() {
  const { articleId } = useParams();
  const { article, loading } = useArticle(articleId || "");

  //Track views
  const { trackView } = useArticleEngagement(articleId || "", true);
  const [viewTracked, setViewTracked] = useState(false);

  useEffect(() => {
    if (articleId && !viewTracked && !loading && article) {
      trackView();
      setViewTracked(true);
    }
  }, [articleId, trackView, viewTracked, loading, article]);

  const { markNavigationOrigin } = useScroll();

  useEffect(() => {
    markNavigationOrigin("feed");
    window.scrollTo(0, 0);

    return () => {
      markNavigationOrigin("other");
    };
  }, [markNavigationOrigin]);

  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showCommentInput, setShowCommentInput] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showLikesModal, setShowLikesModal] = useState(false);
  const [commentText, setCommentText] = useState("");

  const {
    likes,
    commentsCount,
    views,
    isLiked,
    comments,
    likesList,
    toggleLike,
    addComment,
    deleteComment,
    trackShare,
    fetchComments,
    fetchLikes,
    isLoading,
  } = useArticleEngagement(articleId || "", true);

  useEffect(() => {
    if (articleId) {
      fetchComments();
    }
  }, [articleId]);

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    try {
      await addComment(commentText);
      setCommentText("");
      setShowCommentInput(false);
    } catch (error) {
      toast({
        title: "Error posting comment",
        description: "Failed to submit comment",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async () => {
    if (!articleId) return;

    try {
      const success = await deleteArticle(articleId);
      if (success) {
        toast({
          title: "Success",
          description: "Article deleted successfully",
        });
        navigate("/feed");
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete article",
        variant: "destructive",
      });
    }
  };

  const formatArticleTime = (dateString: string) => {
    try {
      const articleDate = new Date(dateString);
      const now = new Date();
      const oneDayAgo = subDays(now, 1);

      if (isBefore(oneDayAgo, articleDate)) {
        return formatDistanceToNow(articleDate, { addSuffix: true });
      }
      return format(articleDate, "MMM d, yyyy 'at' h:mm a");
    } catch (e) {
      console.error("Error formatting date:", e);
      return "recently";
    }
  };

  const formatCommentTime = (dateString: string) => {
    try {
      const commentDate = new Date(dateString);
      const now = new Date();
      const oneDayAgo = subDays(now, 1);

      if (isBefore(oneDayAgo, commentDate)) {
        return formatDistanceToNow(commentDate, { addSuffix: true });
      }
      return format(commentDate, "MMM d, yyyy 'at' h:mm a");
    } catch (e) {
      console.error("Error formatting date:", e);
      return "recently";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-gray-900 to-slate-950 overflow-x-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent"></div>
        <div className="absolute top-0 left-1/4 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl"></div>

        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl mb-6 shadow-lg shadow-blue-500/25 relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl blur opacity-30"></div>
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white relative z-10"></div>
            </div>
            <p className="text-xl text-gray-300 font-medium">
              Loading article...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-gray-900 to-slate-950 overflow-x-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent"></div>
        <div className="absolute top-0 left-1/4 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl"></div>

        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <Card className="bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-sm border border-red-500/20 p-8 text-center max-w-md mx-4">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-red-400 to-red-300 bg-clip-text text-transparent mb-4">
              Article not found
            </h2>
            <p className="text-gray-400 mb-6">
              The article you're looking for doesn't exist.
            </p>
            <Button
              onClick={() => navigate("/feed")}
              className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Feed
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  const handleAuthorClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (article.author?.username) {
      navigate(`/profile/${article.author.username}`);
    }
  };

  const handleCommentAuthorClick = (username: string) => {
    navigate(`/profile/${username}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-gray-900 to-slate-950 overflow-x-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent"></div>
      <div className="absolute top-0 left-1/4 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl"></div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="bg-gradient-to-br from-gray-900/95 to-gray-800/95 backdrop-blur-sm border border-gray-700/50">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-gray-100">
              Are you absolutely sure?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400">
              This action cannot be undone. This will permanently delete your
              article and remove all associated data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-gray-800 text-gray-100 border-gray-700 hover:bg-gray-700">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white"
            >
              Delete Article
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Share Modal */}
      {showShareModal && (
        <ShareModal
          articleId={articleId || ""}
          onClose={() => setShowShareModal(false)}
          trackShare={trackShare}
        />
      )}

      {/* Likes Modal */}
      {showLikesModal && (
        <AlertDialog open={showLikesModal} onOpenChange={setShowLikesModal}>
          <AlertDialogContent className="bg-gradient-to-br from-gray-900/95 to-gray-800/95 backdrop-blur-sm border border-purple-500/20 max-h-[80dvh] overflow-y-auto p-0 sm:max-w-lg">
            {/* Header with gradient background */}
            <div className="bg-gradient-to-r from-purple-900/50 to-blue-900/50 px-6 py-4 border-b border-purple-500/20">
              <AlertDialogHeader className="text-left">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-purple-600/20 border border-purple-500/30">
                    <Users className="w-5 h-5 text-purple-300" />
                  </div>
                  <div>
                    <AlertDialogTitle className="text-gray-100 text-lg font-bold">
                      Article Likes
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-purple-200/80 text-sm">
                      {likes} {likes === 1 ? "person liked" : "people liked"}{" "}
                      this article
                    </AlertDialogDescription>
                  </div>
                </div>
              </AlertDialogHeader>
            </div>

            {/* Content area */}
            <div className="p-4 sm:p-6">
              {isLoading.likes ? (
                <div className="flex flex-col items-center justify-center py-12 gap-4">
                  <div className="animate-spin rounded-full h-10 w-10 border-2 border-purple-500 border-t-transparent"></div>
                  <p className="text-gray-400">Loading likes...</p>
                </div>
              ) : likesList.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 gap-4 text-center">
                  <Users className="w-10 h-10 text-gray-500" />
                  <h3 className="text-gray-300 font-medium">No likes yet</h3>
                  <p className="text-gray-500 text-sm max-w-xs">
                    Be the first to like this article!
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {likesList.map((user) => (
                    <Card
                      key={user.user_id}
                      className="group bg-gray-800/50 hover:bg-gray-700/60 border border-gray-700/50 hover:border-purple-500/30 p-3 rounded-lg transition-all duration-200 cursor-pointer"
                      onClick={() => {
                        navigate(`/profile/${user.username}`);
                        setShowLikesModal(false);
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center overflow-hidden ring-2 ring-purple-500/30 group-hover:ring-purple-400/50 transition-all">
                            {user.avatar_url ? (
                              <img
                                src={user.avatar_url}
                                alt={user.full_name || user.username}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <span className="text-white font-bold text-lg">
                                {(user.full_name || user.username)
                                  .charAt(0)
                                  .toUpperCase()}
                              </span>
                            )}
                          </div>
                          <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-purple-600 rounded-full border-2 border-gray-800 flex items-center justify-center">
                            <Heart className="w-3 h-3 fill-white text-white" />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-100 truncate">
                            {user.full_name || user.username}
                          </p>
                          {user.full_name && (
                            <p className="text-sm text-gray-400 truncate">
                              @{user.username}
                            </p>
                          )}
                          <p className="text-xs text-gray-500 mt-1">
                            Liked{" "}
                            {formatDistanceToNow(new Date(user.created_at), {
                              addSuffix: true,
                            })}
                          </p>
                        </div>
                        <div className="text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M5 12h14M12 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <AlertDialogFooter className="px-6 py-4 border-t border-gray-800/50 bg-gray-900/50">
              <AlertDialogCancel className="bg-gray-800 hover:bg-gray-700 text-gray-100 border-gray-700 hover:border-gray-600 rounded-lg px-4 py-2 transition-colors">
                Close
              </AlertDialogCancel>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
      <div className="relative z-10 w-full">
        {/* Header Navigation */}
        <div className="sticky top-0 z-20 bg-gray-950/80 backdrop-blur-md border-b border-gray-800/50">
          <div className="max-w-6xl mx-auto px-4 py-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(-1)}
              className="text-gray-400 hover:text-gray-100 hover:bg-gray-800/50 p-2 rounded-xl transition-all duration-200"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <div className="px-4 py-6 max-w-6xl mx-auto">
          {/* Article Header */}
          <div className="mb-8">
            <Card className="relative bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-sm border border-blue-500/20 p-6 md:p-8 rounded-3xl">
              {/* Subtle glow effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-cyan-600/20 rounded-3xl blur opacity-30"></div>

              <div className="relative">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-black mb-6 bg-gradient-to-r from-blue-400 via-blue-300 to-cyan-300 bg-clip-text text-transparent leading-tight">
                  {article.title}
                </h1>

                {/* Author Info & Actions */}
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                  <div className="flex items-center gap-4">
                    <div
                      className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center overflow-hidden cursor-pointer ring-2 ring-blue-500/20 hover:ring-blue-500/40 transition-all duration-200 shadow-lg shadow-blue-500/25"
                      onClick={handleAuthorClick}
                    >
                      {article.author?.avatar_url ? (
                        <img
                          src={article.author.avatar_url}
                          alt={
                            article.author.full_name || article.author.username
                          }
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-white font-bold text-xl">
                          {(
                            article.author?.full_name ||
                            article.author?.username ||
                            "U"
                          )
                            .charAt(0)
                            .toUpperCase()}
                        </span>
                      )}
                    </div>
                    <div>
                      <p
                        className="text-lg font-bold text-gray-100 cursor-pointer hover:text-blue-400 transition-colors mb-1"
                        onClick={handleAuthorClick}
                      >
                        {article.author?.full_name ||
                          article.author?.username ||
                          "Unknown Author"}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-gray-400">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-blue-400" />
                          <span>{formatArticleTime(article.created_at)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-purple-400" />
                          <span>
                            {Math.ceil(
                              article.content.split(/\s+/).length / 200
                            )}{" "}
                            min read
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Edit/Delete Buttons */}
                  {user?.id === article.user_id && (
                    <div className="flex gap-3">
                      <Button
                        onClick={() => navigate(`/article/${article.id}/edit`)}
                        className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white px-4 py-2 rounded-xl transition-all duration-200"
                      >
                        <Edit className="h-4 w-4" />
                        <span className="hidden sm:inline">Edit</span>
                      </Button>
                      <Button
                        variant="ghost"
                        onClick={() => setShowDeleteDialog(true)}
                        className="flex items-center gap-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 px-4 py-2 rounded-xl transition-all duration-200"
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="hidden sm:inline">Delete</span>
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          </div>

          {/* Article Content */}
          <div className="mb-8">
            <Card className="bg-gradient-to-br from-gray-900/80 to-gray-800/60 backdrop-blur-sm border border-gray-700/30 p-6 md:p-8 rounded-3xl">
              <div className="prose prose-invert prose-lg max-w-none">
                <ArticleContent content={article?.content || ""} />
              </div>
            </Card>
          </div>

          {/* Engagement Bar */}
          <div className="mb-8">
            <Card className="bg-gradient-to-r from-gray-900/95 via-gray-800/95 to-gray-900/95 backdrop-blur-sm border border-blue-500/20 p-4 md:p-6 rounded-2xl relative overflow-hidden">
              {/* Subtle glow effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-cyan-600/10 rounded-2xl blur opacity-50"></div>

              <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-2 sm:gap-6 flex-wrap">
                  <button
                    onClick={toggleLike}
                    disabled={isLoading.like}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-200 ${
                      isLiked
                        ? "text-red-400 bg-red-500/20 hover:bg-red-500/30 ring-1 ring-red-500/30"
                        : "text-gray-400 hover:text-red-400 hover:bg-red-500/10"
                    } disabled:opacity-50`}
                  >
                    <Heart
                      className="w-5 h-5"
                      fill={isLiked ? "currentColor" : "none"}
                    />
                    <span className="font-bold">{likes}</span>
                  </button>

                  {likes > 0 && (
                    <button
                      onClick={() => {
                        setShowLikesModal(true);
                        fetchLikes();
                      }}
                      className="flex items-center gap-2 px-4 py-2 rounded-full text-gray-400 hover:text-purple-400 hover:bg-purple-500/10 transition-all duration-200"
                    >
                      <Users className="w-5 h-5" />
                      <span className="font-bold">Who liked</span>
                    </button>
                  )}

                  <button
                    onClick={() => setShowCommentInput(!showCommentInput)}
                    className="flex items-center gap-2 px-4 py-2 rounded-full text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 transition-all duration-200"
                  >
                    <MessageCircle className="w-5 h-5" />
                    <span className="font-bold">{commentsCount}</span>
                  </button>

                  <button
                    onClick={() => setShowShareModal(true)}
                    className="flex items-center gap-2 px-4 py-2 rounded-full text-gray-400 hover:text-green-400 hover:bg-green-500/10 transition-all duration-200"
                  >
                    <Share2 className="w-5 h-5" />
                    <span className="hidden sm:inline font-bold">Share</span>
                  </button>
                </div>

                <div className="flex items-center gap-2 px-4 py-2 bg-gray-800/40 rounded-full">
                  <Eye className="w-5 h-5 text-purple-400" />
                  <span className="font-bold text-gray-300">{views}</span>
                </div>
              </div>
            </Card>
          </div>

          {/* Comment Input */}
          {showCommentInput && (
            <div className="mb-8">
              <Card className="bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-sm border border-blue-500/20 p-6 rounded-3xl">
                <div className="flex items-center gap-3 mb-4">
                  <Sparkles className="w-6 h-6 text-blue-400" />
                  <span className="text-gray-300 font-medium text-lg">
                    Share your thoughts
                  </span>
                </div>
                <form onSubmit={handleCommentSubmit} className="space-y-4">
                  <Textarea
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="What's on your mind about this article?"
                    className="bg-gray-800/50 border-gray-700/50 text-gray-100 placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500/20 resize-none rounded-2xl min-h-[120px]"
                    disabled={isLoading.comment}
                  />
                  <div className="flex justify-end gap-3">
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => setShowCommentInput(false)}
                      className="text-gray-400 hover:text-gray-100 hover:bg-gray-800/50 rounded-xl"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={isLoading.comment || !commentText.trim()}
                      className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white disabled:opacity-50 rounded-xl"
                    >
                      {isLoading.comment ? "Posting..." : "Post Comment"}
                    </Button>
                  </div>
                </form>
              </Card>
            </div>
          )}

          {/* Comments Section */}
          <div className="border-t border-gray-800/50 pt-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
              <h2 className="text-2xl md:text-3xl font-black bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                Comments ({comments.length})
              </h2>
              {!showCommentInput && (
                <Button
                  onClick={() => setShowCommentInput(true)}
                  className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white rounded-xl"
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Add Comment
                </Button>
              )}
            </div>

            {comments.length > 0 ? (
              <div className="space-y-6">
                {comments.map((comment) => (
                  <Card
                    key={comment.id}
                    className="bg-gradient-to-br from-gray-900/80 to-gray-800/60 backdrop-blur-sm border border-gray-700/30 p-6 rounded-2xl hover:border-gray-600/50 transition-all duration-200"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0">
                        <div
                          className="cursor-pointer h-12 w-12 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center overflow-hidden ring-2 ring-purple-500/20 hover:ring-purple-500/40 transition-all duration-200 shadow-lg shadow-purple-500/25"
                          onClick={() =>
                            handleCommentAuthorClick(comment.author.username)
                          }
                        >
                          {comment.author.avatar_url ? (
                            <img
                              src={comment.author.avatar_url}
                              alt={
                                comment.author.full_name ||
                                comment.author.username
                              }
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <span className="text-white font-bold text-lg">
                              {(
                                comment.author.full_name ||
                                comment.author.username
                              )
                                .charAt(0)
                                .toUpperCase()}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-3 mb-3">
                          <div className="flex items-center gap-3">
                            <span
                              className="font-bold text-gray-100 cursor-pointer hover:text-purple-400 transition-colors"
                              onClick={() =>
                                handleCommentAuthorClick(
                                  comment.author.username
                                )
                              }
                            >
                              {comment.author.full_name ||
                                comment.author.username}
                            </span>
                            <div className="flex items-center gap-2 text-xs text-gray-400 bg-gray-800/40 px-2 py-1 rounded-full border border-gray-700/50">
                              <User className="w-3 h-3 text-blue-400" />
                              <span>
                                {formatCommentTime(comment.created_at)}
                              </span>
                            </div>
                          </div>

                          {user?.id === comment.author.user_id && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteComment(comment.id)}
                              disabled={isLoading.comment}
                              className="group relative p-1.5 h-7 w-7 rounded-lg bg-gray-800/30 hover:bg-red-900/40 border border-gray-700/50 hover:border-red-500/30 transition-all duration-200"
                            >
                              <Trash2 className="w-3.5 h-3.5 text-gray-400 group-hover:text-red-400 transition-colors" />
                              <span className="sr-only">Delete comment</span>
                            </Button>
                          )}
                        </div>

                        <p className="text-gray-300 whitespace-pre-wrap leading-relaxed break-words">
                          {comment.content}
                        </p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="bg-gradient-to-br from-gray-900/80 to-gray-800/60 backdrop-blur-sm border border-gray-700/30 p-8 md:p-12 rounded-3xl text-center">
                <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/25">
                  <MessageCircle className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-gray-100 mb-2">
                  No comments yet
                </h3>
                <p className="text-gray-400 text-lg mb-6">
                  Be the first to share your thoughts!
                </p>
                {!showCommentInput && (
                  <Button
                    onClick={() => setShowCommentInput(true)}
                    className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white rounded-xl px-6 py-3"
                  >
                    Write a Comment
                  </Button>
                )}
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
