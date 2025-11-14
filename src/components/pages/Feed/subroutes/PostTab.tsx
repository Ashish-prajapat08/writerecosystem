import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { PostArticleForm } from '@/components/forms/PostArticleForm';
import { 
  PenTool, 
  Sparkles, 
  TrendingUp, 
  Users, 
  Zap,
  BookOpen,
  Target,
  Award
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { ArticleSuccessAnimation } from '@/components/forms/ArticleSuccessAnimation';
import useDocumentTitle from '@/hooks/useDocumentTitle';

export function PostArticlePage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState<string | null>(null);

  // Redirect if not authenticated
  useEffect(() => {
    if (!user) {
      navigate('/login', { state: { from: '/post' } });
    }
  }, [user, navigate]);

  const handleArticleSuccess = (articleId: string) => {
    setShowSuccessAnimation(true);
    setPendingNavigation(`/article/${articleId}`);
  };

  const handleAnimationComplete = () => {
    setShowSuccessAnimation(false);
    if (pendingNavigation) {
      navigate(pendingNavigation, { replace: true });
      setPendingNavigation(null);
    }
  };
  useDocumentTitle('Post | Writers Ecosystem');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-gray-900 to-slate-950 overflow-x-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent"></div>
      <div className="absolute top-0 left-1/4 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl"></div>

      <div className="relative z-10 w-full">
        <div className="px-4 py-6 max-w-full">
          {/* Hero Section */}
          <div className="text-center mb-8 md:mb-12">
            <div className="mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl mb-6 shadow-lg shadow-blue-500/25 relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl blur opacity-30"></div>
                <PenTool className="w-8 h-8 md:w-10 md:h-10 text-white relative z-10" />
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-black mb-4 bg-gradient-to-r from-blue-400 via-blue-300 to-cyan-300 bg-clip-text text-transparent leading-tight">
                Create Your Masterpiece
              </h1>
              <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed px-2">
                Share your thoughts, insights, and expertise with the world. Craft compelling content that engages and inspires your audience.
              </p>
            </div>

            {/* Hero Stats */}
            <div className="flex flex-wrap justify-center items-center gap-4 md:gap-6 mt-6">
              <div className="flex items-center gap-2 text-gray-400 text-sm">
                <TrendingUp className="w-4 h-4 text-blue-400" />
                <span>Reach Thousands</span>
              </div>
              <div className="flex items-center gap-2 text-gray-400 text-sm">
                <Users className="w-4 h-4 text-green-400" />
                <span>Engaged Community</span>
              </div>
              <div className="flex items-center gap-2 text-gray-400 text-sm">
                <Zap className="w-4 h-4 text-yellow-400" />
                <span>Instant Publishing</span>
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
                    <span className="text-gray-300 font-medium text-base md:text-lg">Ready to publish your masterpiece?</span>
                  </div>
                  <PostArticleForm onSuccess={handleArticleSuccess} />
                </Card>
              </div>
            </div>

            {/* Enhanced Right Sidebar */}
            <div className="lg:col-span-1 w-full">
              <div className="space-y-6 w-full">
                {/* Writing Tips */}
                <div className="w-full">
                  <Card className="bg-gradient-to-br from-gray-900/80 to-gray-800/60 backdrop-blur-sm border border-gray-700/30 p-4 md:p-6 w-full">
                    <div className="flex items-center gap-2 mb-4">
                      <BookOpen className="w-5 h-5 text-blue-400 flex-shrink-0" />
                      <h3 className="text-base md:text-lg font-bold text-white">Writing Tips</h3>
                    </div>
                    <div className="space-y-3 text-sm text-gray-300 w-full">
                      <div className="p-3 bg-gray-800/40 rounded-lg w-full">
                        <p className="font-medium text-blue-300 mb-1">Compelling Headlines</p>
                        <p>Use action words and numbers to grab attention</p>
                      </div>
                      <div className="p-3 bg-gray-800/40 rounded-lg w-full">
                        <p className="font-medium text-green-300 mb-1">Clear Structure</p>
                        <p>Break content into digestible sections with headers</p>
                      </div>
                      <div className="p-3 bg-gray-800/40 rounded-lg w-full">
                        <p className="font-medium text-purple-300 mb-1">Engaging Opening</p>
                        <p>Hook readers with a compelling first paragraph</p>
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

                {/* Publishing Benefits */}
                <div className="w-full">
                  <Card className="bg-gradient-to-br from-blue-900/50 via-purple-900/30 to-blue-800/40 backdrop-blur-sm border border-blue-500/20 p-4 md:p-6 w-full">
                    <div className="text-center w-full">
                      <div className="w-12 h-12 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                        <Award className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-base md:text-lg font-bold text-white mb-2">Why Publish Here?</h3>
                      <div className="space-y-2 text-sm text-gray-300 text-left">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-blue-400 rounded-full flex-shrink-0"></div>
                          <span>Reach engaged readers</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-400 rounded-full flex-shrink-0"></div>
                          <span>Build your audience</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-purple-400 rounded-full flex-shrink-0"></div>
                          <span>Get valuable feedback</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-yellow-400 rounded-full flex-shrink-0"></div>
                          <span>Establish expertise</span>
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

      {/* Success Animation */}
      <ArticleSuccessAnimation
        isVisible={showSuccessAnimation}
        onComplete={handleAnimationComplete}
      />
    </div>
  );
}