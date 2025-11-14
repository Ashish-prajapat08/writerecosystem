// components/contest-submission-form.tsx
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { createArticle } from "@/lib/articles";
import { createCompetitionSubmission } from "@/lib/competitions";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { PostArticleForm } from "./PostArticleForm";
import { X } from "lucide-react";

export function ContestSubmissionForm({
  competitionId,
  onClose,
  onSuccess,
}: {
  competitionId: string;
  onClose: () => void;
  onSuccess?: (articleId: string) => void;
}) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleArticleSubmit = async (articleData: {
    title: string;
    content: string;
    excerpt?: string;
    tags?: string[];
  }) => {
    setIsSubmitting(true);
    try {
      // Ensure "Contest" tag is always included and remove duplicates
      const allTags = [...new Set([...(articleData.tags || []), "Contest"])];

      // Create article with Contest tag
      const article = await createArticle({
        ...articleData,
        tags: allTags, // Use the enforced tags array
        published: true,
      });

      if (!article) {
        throw new Error("Failed to create article");
      }

      // Submit to competition
      const submissionResult = await createCompetitionSubmission({
        competition_id: competitionId,
        article_id: article.id,
      });

      if (submissionResult.error) {
        // Handle specific competition submission errors
        if (submissionResult.error.message.includes("already submitted")) {
          toast({
            title: "Already Submitted",
            description: submissionResult.error.message,
            variant: "destructive",
          });
        } else {
          // Article was created but competition submission failed
          toast({
            title: "Partial Success",
            description:
              "Article was published but failed to submit to competition. Please try submitting again.",
            variant: "default",
          });
        }

        if (onSuccess) onSuccess(article.id);
        onClose();
        return;
      }

      toast({
        title: "Success!",
        description: "Your article has been submitted to the competition!",
      });

      if (onSuccess) onSuccess(article.id);
      onClose();
    } catch (error: any) {
      console.error("Submission error:", error);
      toast({
        title: "Submission Failed",
        description: error.message || "Failed to submit your article",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={true} onOpenChange={isSubmitting ? undefined : onClose}>
      <DialogContent className="max-w-[95vw] w-full max-h-[95vh] overflow-y-auto p-0 sm:max-w-4xl md:max-w-5xl lg:max-w-6xl bg-transparent border-none">
        <div className="relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl overflow-hidden border border-gray-700 w-full max-h-[inherit]">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-blue-500/10 pointer-events-none" />

          {/* Fixed close button positioning */}
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="absolute top-3 right-3 z-50 p-2 bg-gray-800/90 hover:bg-gray-700/90 rounded-full text-gray-300 hover:text-white transition-colors shadow-lg"
            aria-label="Close submission form"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="relative p-4 sm:p-6 max-h-[inherit] overflow-y-auto">
            <div className="mb-4 sm:mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-white text-center sm:text-left">
                Create Submission for Competition
              </h2>
            </div>

            <div className="w-full max-w-full overflow-x-hidden">
              <PostArticleForm
                onSubmit={handleArticleSubmit}
                defaultTags={["Contest"]}
                disableTags={false}
                isContestSubmission={true}
              />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}