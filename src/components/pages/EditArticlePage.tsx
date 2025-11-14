import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { getArticleById, updateArticle } from "@/lib/articles";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TagInput } from "@/components/ui/tag-input";
import { TiptapEditor } from "@/components/tiptap-editor";
import { 
  Loader2, 
  ArrowLeft, 
  Save, 
  Edit3, 
  Sparkles, 
  BookOpen,
  Target,
  Award,
  TrendingUp,
  Users,
  Zap
} from "lucide-react";
import { Card } from "@/components/ui/card";

export const EditArticlePage = () => {
  const { articleId } = useParams();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const loadArticle = async () => {
      if (!articleId) return;

      try {
        const article = await getArticleById(articleId);
        if (article) {
          setTitle(article.title);
          setContent(article.content);
          setExcerpt(article.excerpt || "");
          setTags(article.tags?.map((t) => t.name) || []);
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load article",
          variant: "destructive",
        });
        navigate("/feed");
      } finally {
        setIsLoading(false);
      }
    };

    loadArticle();
  }, [articleId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!articleId) return;

    setIsSubmitting(true);

    try {
      const updatedArticle = await updateArticle(articleId, {
        title,
        content,
        excerpt,
        tags,
      });

      if (updatedArticle) {
        toast({
          title: "Success!",
          description: "Your article has been updated!",
        });
        navigate(`/article/${updatedArticle.id}`);
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
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
              <Loader2 className="w-8 h-8 animate-spin text-white relative z-10" />
            </div>
            <p className="text-xl text-gray-300 font-medium">Loading article...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-gray-900 to-slate-950 overflow-x-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent"></div>
      <div className="absolute top-0 left-1/4 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl"></div>

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

        <div className="px-4 py-6 max-w-full">
          {/* Hero Section */}
          <div className="text-center mb-8 md:mb-12">
            <div className="mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl mb-6 shadow-lg shadow-blue-500/25 relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl blur opacity-30"></div>
                <Edit3 className="w-8 h-8 md:w-10 md:h-10 text-white relative z-10" />
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-black mb-4 bg-gradient-to-r from-blue-400 via-blue-300 to-cyan-300 bg-clip-text text-transparent leading-tight">
                Edit Your Article
              </h1>
              <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed px-2">
                Refine your content, update your insights, and perfect your message to better engage your audience.
              </p>
            </div>

            {/* Hero Stats */}
            <div className="flex flex-wrap justify-center items-center gap-4 md:gap-6 mt-6">
              <div className="flex items-center gap-2 text-gray-400 text-sm">
                <TrendingUp className="w-4 h-4 text-blue-400" />
                <span>Improve Engagement</span>
              </div>
              <div className="flex items-center gap-2 text-gray-400 text-sm">
                <Users className="w-4 h-4 text-green-400" />
                <span>Reach More Readers</span>
              </div>
              <div className="flex items-center gap-2 text-gray-400 text-sm">
                <Zap className="w-4 h-4 text-yellow-400" />
                <span>Instant Updates</span>
              </div>
            </div>
          </div>

          {/* Main Content Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8 w-full max-w-7xl mx-auto">
            {/* Main Form Section */}
            <div className="lg:col-span-3 w-full min-w-0">
              <div className="relative">
                {/* Subtle glow effect */}
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-cyan-600/20 rounded-3xl blur opacity-30"></div>
                
                <Card className="relative bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-sm border border-blue-500/20 p-6 md:p-8 rounded-3xl w-full min-w-0">
                  <div className="flex items-center gap-3 mb-8">
                    <Sparkles className="w-6 h-6 text-blue-400 flex-shrink-0" />
                    <span className="text-gray-300 font-medium text-base md:text-lg">Perfect your masterpiece</span>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Title Field */}
                    <div className="space-y-3">
                      <Label htmlFor="title" className="text-gray-300 font-medium text-base">
                        Article Title
                      </Label>
                      <Input
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        minLength={10}
                        maxLength={100}
                        placeholder="Enter your compelling title..."
                        className="bg-gray-800/50 border-gray-700/50 text-gray-100 placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500/20 rounded-xl h-12 text-lg"
                      />
                      <p className="text-sm text-gray-400">
                        {title.length}/100 characters • Minimum 10 characters
                      </p>
                    </div>

                    {/* Excerpt Field */}
                    <div className="space-y-3">
                      <Label htmlFor="excerpt" className="text-gray-300 font-medium text-base">
                        Article Excerpt <span className="text-gray-500">(Optional)</span>
                      </Label>
                      <Textarea
                        id="excerpt"
                        value={excerpt}
                        onChange={(e) => setExcerpt(e.target.value)}
                        rows={3}
                        maxLength={200}
                        placeholder="Write a compelling summary that draws readers in..."
                        className="bg-gray-800/50 border-gray-700/50 text-gray-100 placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500/20 resize-none rounded-xl"
                      />
                      <p className="text-sm text-gray-400">
                        {excerpt.length}/200 characters • A short summary to entice readers
                      </p>
                    </div>

                    {/* Content Editor */}
                    <div className="space-y-3">
                      <Label className="text-gray-300 font-medium text-base">Article Content</Label>
                      <div className="bg-gray-800/30 border border-gray-700/50 rounded-xl overflow-hidden">
                        <TiptapEditor
                          content={content}
                          onChange={(newContent) => setContent(newContent)}
                        />
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <p className={`${content.length < 100 ? 'text-red-400' : 'text-gray-400'}`}>
                          {content.length < 100 ? 'Minimum 100 characters required' : `${content.length} characters`}
                        </p>
                        <p className="text-gray-400">
                          ~{Math.ceil(content.split(/\s+/).length / 200)} min read
                        </p>
                      </div>
                    </div>

                    {/* Tags Input */}
                    <div className="space-y-3">
                      <Label className="text-gray-300 font-medium text-base">Tags</Label>
                      <div className="bg-gray-800/30 border border-gray-700/50 rounded-xl p-4">
                        <TagInput 
                          tags={tags} 
                          onTagsChange={setTags} 
                          maxTags={5}
                        />
                      </div>
                      <p className="text-sm text-gray-400">
                        {tags.length}/5 tags • Help readers discover your content
                      </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col-reverse sm:flex-row justify-end gap-4 pt-6 border-t border-gray-700/50">
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => navigate(-1)}
                        disabled={isSubmitting}
                        className="w-full sm:w-auto text-gray-400 hover:text-gray-100 hover:bg-gray-800/50 rounded-xl px-6 py-3"
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        disabled={isSubmitting || !title || !content || content.length < 100}
                        className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white disabled:opacity-50 rounded-xl px-6 py-3"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="h-5 w-5 animate-spin mr-2" />
                            Updating Article...
                          </>
                        ) : (
                          <>
                            <Save className="h-5 w-5 mr-2" />
                            Update Article
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                </Card>
              </div>
            </div>

            {/* Enhanced Right Sidebar */}
            <div className="lg:col-span-1 w-full">
              <div className="space-y-6 w-full">
                {/* Editing Tips */}
                <div className="w-full">
                  <Card className="bg-gradient-to-br from-gray-900/80 to-gray-800/60 backdrop-blur-sm border border-gray-700/30 p-4 md:p-6 w-full">
                    <div className="flex items-center gap-2 mb-4">
                      <BookOpen className="w-5 h-5 text-blue-400 flex-shrink-0" />
                      <h3 className="text-base md:text-lg font-bold text-white">Editing Tips</h3>
                    </div>
                    <div className="space-y-3 text-sm text-gray-300 w-full">
                      <div className="p-3 bg-gray-800/40 rounded-lg w-full">
                        <p className="font-medium text-blue-300 mb-1">Review & Refine</p>
                        <p>Check for clarity, flow, and engagement</p>
                      </div>
                      <div className="p-3 bg-gray-800/40 rounded-lg w-full">
                        <p className="font-medium text-green-300 mb-1">Update Tags</p>
                        <p>Ensure tags reflect current content accurately</p>
                      </div>
                      <div className="p-3 bg-gray-800/40 rounded-lg w-full">
                        <p className="font-medium text-purple-300 mb-1">Fresh Perspective</p>
                        <p>Add new insights or recent developments</p>
                      </div>
                    </div>
                  </Card>
                </div>

                {/* Content Guidelines */}
                <div className="w-full">
                  <Card className="bg-gradient-to-br from-gray-900/80 to-gray-800/60 backdrop-blur-sm border border-gray-700/30 p-4 md:p-6 w-full">
                    <div className="flex items-center gap-2 mb-4">
                      <Target className="w-5 h-5 text-green-400 flex-shrink-0" />
                      <h3 className="text-base md:text-lg font-bold text-white">Content Guidelines</h3>
                    </div>
                    <div className="space-y-3 w-full">
                      <div className="flex justify-between items-center p-3 bg-gray-800/40 rounded-lg w-full">
                        <span className="text-gray-300 text-sm">Min Title Length</span>
                        <span className="font-bold text-blue-400">10 chars</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-gray-800/40 rounded-lg w-full">
                        <span className="text-gray-300 text-sm">Min Content</span>
                        <span className="font-bold text-green-400">100 chars</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-gray-800/40 rounded-lg w-full">
                        <span className="text-gray-300 text-sm">Required Tags</span>
                        <span className="font-bold text-purple-400">1+ tags</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-gray-800/40 rounded-lg w-full">
                        <span className="text-gray-300 text-sm">Max Tags</span>
                        <span className="font-bold text-yellow-400">5 tags</span>
                      </div>
                    </div>
                  </Card>
                </div>

                {/* Update Benefits */}
                <div className="w-full">
                  <Card className="bg-gradient-to-br from-blue-900/50 via-purple-900/30 to-blue-800/40 backdrop-blur-sm border border-blue-500/20 p-4 md:p-6 w-full">
                    <div className="text-center w-full">
                      <div className="w-12 h-12 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                        <Award className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-base md:text-lg font-bold text-white mb-2">Why Update?</h3>
                      <div className="space-y-2 text-sm text-gray-300 text-left">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-blue-400 rounded-full flex-shrink-0"></div>
                          <span>Improve search visibility</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-400 rounded-full flex-shrink-0"></div>
                          <span>Keep content relevant</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-purple-400 rounded-full flex-shrink-0"></div>
                          <span>Boost engagement</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-yellow-400 rounded-full flex-shrink-0"></div>
                          <span>Maintain quality</span>
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};