import { useToast } from "@/hooks/use-toast";
import { SharePlatform } from "@/types/share";
import { Button } from "../ui/button";
import {
  Copy,
  FacebookIcon,
  Linkedin,
  LinkIcon,
  Twitter,
  X,
  MessageCircle,
} from "lucide-react";
import { useEffect } from "react";

type ShareModalProps = { 
  articleId: string;
  onClose: () => void;
  trackShare: (platform: SharePlatform) => Promise<void>;
   title?: string; 
   type?: 'article' | 'ebook';
};

export const ShareModal = ({
  articleId,
  onClose,
  trackShare,
   type = 'article', 
}: ShareModalProps) => {
  const { toast } = useToast();
 const shareUrl = `${window.location.origin}/${type}/${articleId}`;

  useEffect(() => {
    // Properly check if navigator.share exists before calling it
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    if (isMobile && typeof navigator.share !== 'undefined') {
      handleNativeShare();
      onClose();
    }
  }, []);

  const handleNativeShare = async () => {
    try {
      // Additional safety check
      if (typeof navigator.share === 'undefined') {
        handleCopyLink();
        return;
      }
      
      await navigator.share({
        title: "Check out this article",
        text: "I found this interesting article you might like",
        url: shareUrl,
      });
      await trackShare("native");
    } catch (err) {
      if ((err as Error).name !== 'AbortError') {
        handleCopyLink();
      }
    }
  };

  // Rest of your component remains the same...
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      await trackShare("copy");
      toast({
        title: "Copied!",
        description: "Link copied to clipboard",
      });
      onClose();
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to copy link",
        variant: "destructive",
      });
    }
  };

  const handlePlatformShare = async (platform: SharePlatform) => {
    try {
      await trackShare(platform);
      
      let shareLink = "";
      const text = `Check out this article: ${shareUrl}`;
      
      switch (platform) {
        case "twitter":
          shareLink = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
          break;
        case "facebook":
          shareLink = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
          break;
        case "linkedin":
          shareLink = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
          break;
        case "whatsapp":
          shareLink = `https://wa.me/?text=${encodeURIComponent(text)}`;
          break;
      }
      
      window.open(shareLink, '_blank', 'noopener,noreferrer');
      onClose();
    } catch (err) {
      toast({
        title: "Error",
        description: `Could not share to ${platform}`,
        variant: "destructive",
      });
    }
  };

  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  if (isMobile && typeof navigator.share !== 'undefined') {
    return null;
  }

  return (
    <>
      {/* Background overlay */}
      <div
        className="fixed inset-0 bg-black/80 z-50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal container */}
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div
          className="bg-background rounded-lg shadow-xl max-w-md w-full p-6"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center mb-6">
            
            <h3 className="text-xl font-bold">Share this article</h3>
            <Button variant="ghost" onClick={onClose} className="rounded-full">
              <X className="h-5 w-5" />
            </Button>
          </div>

          <div className="grid grid-cols-4 gap-4">
            <ShareOption
              icon={<Twitter className="h-5 w-5" />}
              label="Twitter"
              onClick={() => handlePlatformShare("twitter")}
            />

            <ShareOption
              icon={<FacebookIcon className="h-5 w-5" />}
              label="Facebook"
              onClick={() => handlePlatformShare("facebook")}
            />

            <ShareOption
              icon={<Linkedin className="h-5 w-5" />}
              label="LinkedIn"
              onClick={() => handlePlatformShare("linkedin")}
            />

            <ShareOption
              icon={<MessageCircle className="h-5 w-5" />}
              label="WhatsApp"
              onClick={() => handlePlatformShare("whatsapp")}
            />

            <ShareOption
              icon={<Copy className="h-5 w-5" />}
              label="Copy Link"
              onClick={handleCopyLink}
            />
          </div>

          <div className="mt-6">
            <Button
              variant="outline"
              className="w-full"
              onClick={handleNativeShare}
            >
              <LinkIcon className="h-4 w-4 mr-2" />
              More share options
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

const ShareOption = ({
  icon,
  label,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-accent/50 transition-colors"
  >
    <div className="p-3 bg-accent rounded-full">{icon}</div>
    <span className="text-sm font-medium">{label}</span>
  </button>
);