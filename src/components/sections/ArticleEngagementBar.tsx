import { Heart, MessageCircle, Share2, Eye } from 'lucide-react';
import { useArticleEngagement } from '@/hooks/useArticleEngagement';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ShareModal } from '../modals/shareModal';

type ArticleEngagementBarProps = {
  articleId: string;
  className?: string;
};

export const ArticleEngagementBar: React.FC<ArticleEngagementBarProps> = ({ 
  articleId,
  className = '' 
}) => {
  const {
    likes,
    commentsCount,
    views,
    isLiked,
    toggleLike,
    addComment,
    trackShare,
    isLoading
  } = useArticleEngagement(articleId);

  const [comment, setComment] = useState('');
  const [showComments, setShowComments] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  const handleCommentSubmit = () => {
    if (!comment.trim()) return;
    addComment(comment);
    setComment('');
  };

  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex gap-6 items-center">
        {/* Like Button */}
        <button
          onClick={toggleLike}
          disabled={isLoading.like}
          aria-label={isLiked ? 'Unlike article' : 'Like article'}
          className={`flex items-center gap-1.5 transition-colors ${
            isLiked ? 'text-red-500 hover:text-red-600' : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <Heart 
            size={20} 
            className="shrink-0" 
            fill={isLiked ? 'currentColor' : 'none'} 
          />
          <span className="text-sm font-medium">{likes}</span>
        </button>

        {/* Comment Button */}
        <button
          onClick={() => setShowComments(!showComments)}
          aria-label={showComments ? 'Hide comments' : 'Show comments'}
          className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors"
        >
          <MessageCircle size={20} className="shrink-0" />
          <span className="text-sm font-medium">{commentsCount}</span>
        </button>

        {/* Share Button */}
        <button
        onClick={() => setShowShareModal(true)}
        className="flex items-center gap-1 text-gray-500 hover:text-gray-700"
      >
        <Share2 size={18} />
      </button>

        {/* View Count */}
        <div className="flex items-center gap-1.5 text-muted-foreground ml-auto">
          <Eye size={20} className="shrink-0" />
          <span className="text-sm font-medium">{views}</span>
        </div>
      </div>

      {/* Comment Input Section */}
      {showComments && (
        <div className="space-y-2">
          <Textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Write your comment..."
            className="min-h-[100px]"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleCommentSubmit();
              }
            }}
          />
          <div className="flex justify-end">
            <Button
              onClick={handleCommentSubmit}
              disabled={isLoading.comment || !comment.trim()}
              size="sm"
            >
              {isLoading.comment ? 'Posting...' : 'Post Comment'}
            </Button>
          </div>
        </div>
      )}

      {showShareModal && (
        <ShareModal
  articleId={articleId}
  onClose={() => setShowShareModal(false)}
  trackShare={trackShare} // This now matches the expected type
/>
      )}
    </div>
  );
};