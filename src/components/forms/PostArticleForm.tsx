import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { createArticle } from "@/lib/articles";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { TiptapEditor } from "@/components/tiptap-editor";
import {
  Type,
  Edit3,
  Tags,
  Send,
  X,
  CheckCircle2,
  Eye,
  AlertCircle,
  Plus,
} from "lucide-react";

interface PostArticleFormProps {
  onSuccess?: (articleId: string) => void;
  onSubmit?: (articleData: {
    title: string;
    content: string;
    excerpt?: string;
    tags?: string[];
  }) => Promise<void>;
  defaultTags?: string[];
  disableTags?: boolean;
  isContestSubmission?: boolean; // New prop to identify contest submissions
}

interface TagInputProps {
  tags: string[];
  onTagsChange: (tags: string[]) => void;
  placeholder?: string;
  maxTags?: number;
  disabled?: boolean;
  lockedTags?: string[];
}

export function TagInput({
  tags,
  onTagsChange,
  placeholder = "Add tags...",
  maxTags = 5,
  disabled = false,
  lockedTags = [],
}: TagInputProps) {
  const [inputValue, setInputValue] = useState<string>("");
  const [showCustomInput, setShowCustomInput] = useState<boolean>(false);

  const existingTags = [
    "Technology",
    "Politics",
    "Science",
    "Philosophy",
    "Sports",
    "Business",
    "Music",
  ];

  const handleCheckboxChange = (tag: string, checked: boolean) => {
    if (checked) {
      if (tags.length < maxTags) {
        onTagsChange([...tags, tag]);
      }
    } else {
      if (!lockedTags.includes(tag)) {
        onTagsChange(tags.filter((t) => t !== tag));
      }
    }
  };

  const addCustomTag = () => {
    if (inputValue.trim() && !tags.includes(inputValue.trim())) {
      if (tags.length < maxTags) {
        onTagsChange([...tags, inputValue.trim()]);
        setInputValue("");
        setShowCustomInput(false);
      }
    }
  };

  const removeTag = (tagToRemove: string) => {
    // Don't allow removal of locked tags
    if (!lockedTags.includes(tagToRemove)) {
      onTagsChange(tags.filter((tag) => tag !== tagToRemove));
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <Badge
            key={tag}
            variant="outline"
            className={`px-3 py-1 text-sm flex items-center gap-1 ${
              lockedTags.includes(tag)
                ? "bg-blue-500/20 border-blue-500/30 text-blue-300 cursor-default"
                : "bg-gray-800 border-gray-700 text-gray-200"
            }`}
          >
            {tag}
            {!disabled && !lockedTags.includes(tag) && (
              <button
                type="button"
                onClick={() => removeTag(tag)}
                className="ml-1 text-gray-400 hover:text-white"
              >
                <X className="w-3 h-3" />
              </button>
            )}
            {lockedTags.includes(tag) && (
              <span className="ml-1 text-blue-400">🔒</span>
            )}
          </Badge>
        ))}
      </div>

      {!disabled && !showCustomInput && (
        <div className="space-y-2">
          <p className="text-sm text-gray-400">Select from popular tags:</p>
          <div className="flex flex-wrap gap-3">
            {existingTags.map((tag) => (
              <div key={tag} className="flex items-center space-x-2">
                <Checkbox
                  id={`tag-${tag}`}
                  checked={tags.includes(tag)}
                  onCheckedChange={(checked: boolean) =>
                    handleCheckboxChange(tag, checked)
                  }
                  disabled={
                    (!tags.includes(tag) && tags.length >= maxTags) ||
                    lockedTags.includes(tag)
                  }
                />
                <label
                  htmlFor={`tag-${tag}`}
                  className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${
                    lockedTags.includes(tag) ? "text-blue-300" : "text-gray-300"
                  }`}
                >
                  {tag}
                  {lockedTags.includes(tag) && (
                    <span className="ml-1 text-blue-400 text-xs">
                      (required)
                    </span>
                  )}
                </label>
              </div>
            ))}
          </div>
        </div>
      )}

      {!disabled && showCustomInput ? (
        <div className="flex gap-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={placeholder}
            className="bg-gray-900/50 border-gray-600 text-white"
            onKeyDown={(e) => e.key === "Enter" && addCustomTag()}
          />
          <Button
            type="button"
            size="sm"
            onClick={addCustomTag}
            disabled={!inputValue.trim()}
          >
            Add
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setShowCustomInput(false)}
          >
            Cancel
          </Button>
        </div>
      ) : !disabled ? (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="text-blue-400 hover:text-blue-300"
          onClick={() => setShowCustomInput(true)}
          disabled={tags.length >= maxTags}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add custom tag
        </Button>
      ) : null}

      <div className="text-sm text-gray-400">
        {tags.length}/{maxTags} tags selected
      </div>
    </div>
  );
}

export const PostArticleForm = ({
  onSuccess,
  onSubmit,
  defaultTags = [],
  disableTags = false,
  isContestSubmission = false, // Default to false
}: PostArticleFormProps) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [tags, setTags] = useState<string[]>(defaultTags);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!disableTags && tags.length === 0) {
      toast({
        title: "Tags Required",
        description: "Please add at least one tag to publish your article",
        variant: "destructive",
      });
      return;
    }

    if (title.length < 10) {
      toast({
        title: "Title Too Short",
        description: "Title must be at least 10 characters",
        variant: "destructive",
      });
      return;
    }

    // Remove content length validation for contest submissions
    if (!isContestSubmission && content.length < 100) {
      toast({
        title: "Content Too Short",
        description: "Content must be at least 100 characters",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      if (onSubmit) {
        await onSubmit({
          title,
          content,
          excerpt,
          tags,
        });
      } else {
        const article = await createArticle({
          title,
          content,
          excerpt,
          tags,
          published: true,
        });

        if (article) {
          if (onSuccess) {
            onSuccess(article.id);
          } else {
            navigate(`/article/${article.id}`, { replace: true });
          }

          toast({
            title: "Success!",
            description: "Your article has been published!",
          });
        }
      }
    } catch (error: any) {
      if (error.message.includes("slug")) {
        toast({
          title: "Title Conflict",
          description:
            "Please modify your title slightly to create a unique URL",
          variant: "destructive",
        });
      } else if (error.message.includes("tags")) {
        toast({
          title: "Tag Error",
          description: "Could not create new tags. Please try different tags.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: error.message || "Failed to create article",
          variant: "destructive",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 md:space-y-8 w-full">
      {/* Contest Submission Banner */}
    

      {/* Title Section */}
      <div className="group relative w-full">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-cyan-600/20 rounded-2xl blur opacity-0 group-hover:opacity-30 transition-all duration-500"></div>

        <Card className="relative bg-gradient-to-br from-gray-900/70 to-gray-800/50 backdrop-blur-sm border border-gray-700/30 hover:border-blue-500/30 transition-all duration-300 w-full">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/10 rounded-lg flex-shrink-0">
                <Type className="w-5 h-5 text-blue-400" />
              </div>
              <div className="min-w-0 flex-1">
                <CardTitle className="text-white text-base md:text-lg">
                  Article Title
                </CardTitle>
                <p className="text-gray-400 text-sm mt-1">
                  Create a compelling headline that captures attention
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter your article title..."
              required
              minLength={10}
              maxLength={100}
              className="bg-gray-900/50 border-gray-600 text-white placeholder:text-gray-500 focus:border-blue-400 focus:ring-blue-400/20 text-base md:text-lg h-12 md:h-14 w-full"
            />
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
              <div className="flex items-center gap-2">
                {title.length < 10 ? (
                  <>
                    <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0" />
                    <span className="text-sm text-amber-400">
                      Minimum 10 characters
                    </span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0" />
                    <span className="text-sm text-green-400"></span>
                  </>
                )}
              </div>
              <span className="text-sm text-gray-400">{title.length}/100</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Excerpt Section */}
      <div className="group relative w-full">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600/20 via-pink-600/20 to-purple-600/20 rounded-2xl blur opacity-0 group-hover:opacity-30 transition-all duration-500"></div>

        <Card className="relative bg-gradient-to-br from-gray-900/70 to-gray-800/50 backdrop-blur-sm border border-gray-700/30 hover:border-purple-500/30 transition-all duration-300 w-full">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-500/10 rounded-lg flex-shrink-0">
                <Eye className="w-5 h-5 text-purple-400" />
              </div>
              <div className="min-w-0 flex-1">
                <CardTitle className="text-white text-base md:text-lg">
                  Article Preview
                </CardTitle>
                <p className="text-gray-400 text-sm mt-1">
                  A brief summary that appears in article previews (optional)
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <Textarea
              id="excerpt"
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="Write a compelling excerpt that summarizes your article..."
              rows={4}
              maxLength={200}
              className="bg-gray-900/50 border-gray-600 text-white placeholder:text-gray-500 focus:border-purple-400 focus:ring-purple-400/20 resize-none w-full"
            />
            <div className="flex justify-end">
              <span className="text-sm text-gray-400">
                {excerpt.length}/200
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Content Section */}
      <div className="group relative w-full">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-green-600/20 via-emerald-600/20 to-green-600/20 rounded-2xl blur opacity-0 group-hover:opacity-30 transition-all duration-500"></div>

        <Card className="relative bg-gradient-to-br from-gray-900/70 to-gray-800/50 backdrop-blur-sm border border-gray-700/30 hover:border-green-500/30 transition-all duration-300 w-full">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-500/10 rounded-lg flex-shrink-0">
                <Edit3 className="w-5 h-5 text-green-400" />
              </div>
              <div className="min-w-0 flex-1">
                <CardTitle className="text-white text-base md:text-lg">
                  Article Content
                </CardTitle>
                <p className="text-gray-400 text-sm mt-1">
                  Write your full article content using the rich text editor
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="w-full min-w-0">
              <TiptapEditor
                content={content}
                onChange={(newContent) => setContent(newContent)}
              />
            </div>
            {/* Only show validation for non-contest submissions */}
            {!isContestSubmission &&
              content.length > 0 &&
              content.length < 100 && (
                <div className="flex items-center gap-2 text-amber-400 text-sm bg-amber-400/10 px-3 py-2 rounded-lg">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>Minimum 100 characters required for publication</span>
                </div>
              )}
            {!isContestSubmission && content.length >= 100 && (
              <div className="flex items-center gap-2 text-green-400 text-sm bg-green-400/10 px-3 py-2 rounded-lg">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                <span>Content length looks great!</span>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Tags Section - Conditionally rendered */}
      {!disableTags && (
        <div className="group relative w-full">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-orange-600/20 via-yellow-600/20 to-orange-600/20 rounded-2xl blur opacity-0 group-hover:opacity-30 transition-all duration-500"></div>

          <Card className="relative bg-gradient-to-br from-gray-900/70 to-gray-800/50 backdrop-blur-sm border border-gray-700/30 hover:border-orange-500/30 transition-all duration-300 w-full">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-500/10 rounded-lg flex-shrink-0">
                  <Tags className="w-5 h-5 text-orange-400" />
                </div>
                <div className="min-w-0 flex-1">
                  <CardTitle className="text-white text-base md:text-lg">
                    Tags & Categories
                  </CardTitle>
                  <p className="text-gray-400 text-sm mt-1">
                    Help readers discover your content with relevant tags
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="w-full min-w-0">
                <TagInput
                  tags={tags}
                  onTagsChange={setTags}
                  placeholder="Add tags to categorize your article..."
                  maxTags={5}
                  lockedTags={isContestSubmission ? ["Contest"] : []}
                />
              </div>
              {tags.length === 0 && (
                <div className="flex items-center gap-2 text-red-400 text-sm bg-red-400/10 px-3 py-2 rounded-lg">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>Please add at least one tag</span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Divider */}
      <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-700/50 to-transparent"></div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 pt-6 w-full">
        <Button
          type="button"
          variant="outline"
          onClick={() => navigate(-1)}
          disabled={isSubmitting}
          className="flex-1 bg-gray-700/50 border-gray-600 text-gray-300 hover:bg-gray-600/50 hover:text-white hover:border-gray-500 transition-all duration-300 h-12 font-medium"
        >
          <X className="w-4 h-4 mr-2" />
          Cancel
        </Button>

        <Button
          type="submit"
          disabled={
            isSubmitting ||
            !title ||
            !content ||
            (!disableTags && tags.length === 0) ||
            // Only apply content length validation for non-contest submissions
            (!isContestSubmission && content.length < 100)
          }
          className="flex-1 h-12 font-semibold transition-all duration-300 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white shadow-lg shadow-blue-500/25 transform hover:scale-105 disabled:transform-none disabled:opacity-50"
        >
          {isSubmitting ? (
            <>
              <div className="w-4 h-4 mr-2 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              {isContestSubmission ? "Submitting..." : "Publishing..."}
            </>
          ) : (
            <>
              <Send className="w-4 h-4 mr-2" />
              {isContestSubmission ? "Submit to Contest" : "Publish Article"}
            </>
          )}
        </Button>
      </div>
    </form>
  );
};
