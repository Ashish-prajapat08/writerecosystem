import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { format, formatDistanceToNow, isBefore, subDays } from "date-fns";
import {
  Heart,
  MessageCircle,
  Share2,
  Eye,
  Calendar,
  Clock,
  Tag,
} from "lucide-react";
import { useArticleEngagement } from "@/hooks/useArticleEngagement";
import { ShareModal } from "../modals/shareModal";
import { CardArticle } from "@/types/articleTypes";
import { generateTextPreview } from "@/lib/utils";
import { useScroll } from "@/context/ScrollContext";

type ArticleCardProps = {
  article: CardArticle;
};

export const ArticleCard: React.FC<ArticleCardProps> = ({ article }) => {
  const {
    likes,
    commentsCount,
    views,
    isLiked,
    toggleLike,
    addComment,
    trackShare,
    isLoading,
    comments,
    fetchComments,
  } = useArticleEngagement(article.id, false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [comment, setComment] = useState("");
  const [showComments, setShowComments] = useState(false);
  const { saveScrollPosition } = useScroll();
  const navigate = useNavigate();

  const handleClick = () => {
    saveScrollPosition("feed");
    navigate(`/article/${article.id}`);
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

  const wordCount = article.content?.split(/\s+/).length || 0;
  const readTime = `${Math.max(1, Math.ceil(wordCount / 200))} min`;

  const authorName =
    article.author?.full_name || article.author?.username || "Unknown";
  const authorInitials = article.author?.full_name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const previewText = article.excerpt
    ? article.excerpt
    : generateTextPreview(article.content, 150);

  const handleAuthorClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (article.author?.username) {
      navigate(`/profile/${article.author.username}`);
    }
  };

  const toggleComments = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!showComments && commentsCount > 0) {
      await fetchComments();
    }
    setShowComments(!showComments);
  };

  const lastTwoComments = comments
    ?.sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )
    .slice(0, 2);

  return (
    <div className="group relative w-full min-w-0" onClick={handleClick}>
      {/* Subtle hover glow effect */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-cyan-600/20  blur opacity-0 group-hover:opacity-30 transition-all duration-500"></div>

      <div className="relative bg-gradient-to-br from-gray-900/70 to-gray-800/50 backdrop-blur-sm border border-gray-700/30 hover:border-blue-500/30 p-4 md:p-6  transition-all duration-300 cursor-pointer group-hover:transform group-hover:scale-[1.01] group-hover:shadow-xl group-hover:shadow-blue-500/10 w-full min-w-0">
        {/* Enhanced Header: Avatar + Author Info */}
        <div className="flex items-start gap-3 md:gap-4 mb-4">
          <div
            className="relative cursor-pointer flex-shrink-0"
            onClick={handleAuthorClick}
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full blur opacity-20"></div>
            <div className="relative w-10 h-10 md:w-12 md:h-12 rounded-full overflow-hidden border-2 border-blue-500/30">
              {!article.author.avatar_url ? (
                <div className="w-full h-full bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center text-white font-bold text-sm md:text-base">
                  {authorInitials || "NA"}
                </div>
              ) : (
                <img
                  src={article.author.avatar_url}
                  alt={authorName}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = "none";
                  }}
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />
              )}
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-2">
              <h4
                className="font-semibold text-white hover:text-blue-300 transition-colors cursor-pointer break-words min-w-0 text-sm md:text-base"
                onClick={handleAuthorClick}
              >
                {authorName}
              </h4>
              <span className="text-gray-500 text-sm hidden sm:inline">•</span>
              <div className="flex items-center gap-1 text-gray-400 text-xs md:text-sm">
                <Calendar className="w-3 h-3 flex-shrink-0" />
                <span className="break-words">
                  {formatArticleTime(article.created_at)}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1 text-gray-400 text-xs md:text-sm">
              <Clock className="w-3 h-3 flex-shrink-0" />
              <span>Estimated Read Time: {readTime}</span>
            </div>
          </div>
        </div>

        {/* Enhanced Title */}
        <h3 className="text-lg md:text-xl font-bold text-white group-hover:text-blue-300 transition-colors mb-4 break-words line-clamp-2 leading-tight">
          {article.title}
        </h3>

        {/* Enhanced Content Preview */}
        <div className="mb-4">
          <div className="text-gray-300 leading-relaxed text-sm md:text-base break-words line-clamp-3">
            {previewText}
            {!article.excerpt &&
              previewText.length < article.content.length && (
                <span className="text-blue-400 hover:text-blue-300 ml-1 cursor-pointer font-medium">
                  ...read more
                </span>
              )}
          </div>
        </div>

        {/* Enhanced Tags Section */}
        {article.tags && article.tags.length > 0 && (
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <Tag className="w-4 h-4 text-blue-400 flex-shrink-0" />
              <span className="text-sm font-medium text-blue-300">Tags:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {article.tags.slice(0, 5).map((tag) => (
                <span
                  key={tag.id}
                  className="px-3 py-1 bg-gradient-to-r from-blue-900/40 to-indigo-900/40 text-blue-100 text-xs font-medium rounded-lg border border-blue-700/30 hover:border-blue-600/40 hover:from-blue-800/60 hover:to-indigo-800/60 transition-all duration-300 transform hover:scale-105 cursor-pointer break-words"
                  onClick={(e) => {
                    e.stopPropagation();
                    // Optional: Add tag filtering navigation
                  }}
                >
                  {tag.name}
                </span>
              ))}
              {article.tags.length > 5 && (
                <span className="px-3 py-1 bg-gray-800/50 text-gray-400 text-xs font-medium rounded-lg border border-gray-700/30 whitespace-nowrap">
                  +{article.tags.length - 4} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* Fixed Engagement Section - All in one row */}
        <div className="flex items-center justify-between gap-2 pt-4 border-t border-gray-700/30">
          {/* Left side: Like, Comment, Share buttons */}
          <div className="flex items-center gap-2 sm:gap-3 md:gap-4 min-w-0">
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleLike();
              }}
              disabled={isLoading.like}
              className={`flex items-center gap-1 text-xs sm:text-sm md:text-base transition-all duration-300 transform hover:scale-105 ${
                isLiked
                  ? "text-red-400 hover:text-red-300"
                  : "text-gray-400 hover:text-red-400"
              } ${isLoading.like ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              <Heart
                className="w-4 h-4 md:w-5 md:h-5 flex-shrink-0"
                fill={isLiked ? "currentColor" : "none"}
              />
              <span className="font-medium">{likes}</span>
            </button>

            <button
              onClick={toggleComments}
              className="flex items-center gap-1 text-gray-400 hover:text-blue-400 transition-all duration-300 transform hover:scale-105 text-xs sm:text-sm md:text-base"
            >
              <MessageCircle className="w-4 h-4 md:w-5 md:h-5 flex-shrink-0" />
              <span className="font-medium">{commentsCount}</span>
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowShareModal(true);
              }}
              className="flex items-center gap-1 text-gray-400 hover:text-green-400 transition-all duration-300 transform hover:scale-105 text-xs sm:text-sm md:text-base"
            >
              <Share2 className="w-4 h-4 md:w-5 md:h-5 flex-shrink-0" />
              <span className="font-medium hidden sm:inline">Share</span>
            </button>
          </div>

          {/* Right side: Views */}
          <div className="flex items-center gap-1 text-gray-400 text-xs sm:text-sm md:text-base flex-shrink-0">
            <Eye className="w-4 h-4 md:w-5 md:h-5 flex-shrink-0" />
            <span className="font-medium">{views.toLocaleString()}</span>
          </div>
        </div>

        {/* Enhanced Comment Section */}
        {showComments && (
          <div
            className="mt-6 pt-4 border-t border-gray-700/30"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Recent Comments Section */}
            {lastTwoComments.map((comment) => (
              <div
                key={comment.id}
                className="p-3 bg-gray-800/30 rounded-lg border border-gray-700/50"
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="relative w-6 h-6 rounded-full overflow-hidden border border-blue-500/30 flex-shrink-0">
                    {comment.author.avatar_url ? (
                      <img
                        src={comment.author.avatar_url}
                        alt={comment.author.username}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = "none";
                        }}
                        loading="lazy"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-blue-500/30 to-cyan-600/30 flex items-center justify-center text-xs font-bold text-blue-300">
                        {comment.author.username.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <span className="text-sm font-medium text-blue-300">
                    {comment.author.username}
                  </span>
                  <span className="text-gray-500 text-xs">
                    {formatArticleTime(comment.created_at)}
                  </span>
                </div>
                <p className="text-gray-300 text-sm">{comment.content}</p>
              </div>
            ))}

            {/* Comment Input Section */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 mb-3">
                <MessageCircle className="w-4 h-4 text-blue-400 flex-shrink-0" />
                <span className="text-sm font-medium text-blue-300">
                  Add a comment
                </span>
              </div>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your thoughts about this article..."
                rows={3}
                className="w-full p-3 bg-gray-900/50 border border-gray-600/50 rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 resize-none text-sm md:text-base"
              />
              <div className="flex flex-col sm:flex-row gap-2 sm:justify-end">
                <button
                  onClick={() => setShowComments(false)}
                  className="px-4 py-2 text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-lg transition-all duration-300 text-sm font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    addComment(comment);
                    setComment("");
                  }}
                  disabled={isLoading.comment || !comment.trim()}
                  className="px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white rounded-lg font-medium shadow-lg shadow-blue-500/25 transition-all duration-300 transform hover:scale-105 disabled:transform-none text-sm"
                >
                  {isLoading.comment ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2 inline-block"></div>
                      Posting...
                    </>
                  ) : (
                    "Post Comment"
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <ShareModal
          articleId={article.id}
          onClose={() => setShowShareModal(false)}
          trackShare={trackShare}
        />
      )}
    </div>
  );
};
