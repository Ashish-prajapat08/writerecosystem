import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Article } from './types';
import { Plus, X, FileText, AlertCircle, CheckCircle } from 'lucide-react';

interface SubmitArticleModalProps {
  isOpen: boolean;
  onClose: () => void;
  articles: Article[];
  onSubmit: (articleId: string) => Promise<void>;
  hasSubmitted: boolean;
}

export default function SubmitArticleModal({ 
  isOpen, 
  onClose, 
  articles, 
  onSubmit,
  hasSubmitted
}: SubmitArticleModalProps) {
  const [selectedArticle, setSelectedArticle] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!selectedArticle) {
      setError('Please select an article');
      return;
    }

    setIsSubmitting(true);
    setError(null);
    
    try {
      await onSubmit(selectedArticle);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateNewArticle = () => {
    onClose();
    navigate('/post');
  };

  useEffect(() => {
    if (isOpen) {
      setSelectedArticle('');
      setError(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-slate-800 border border-slate-700 rounded-2xl w-full max-w-md max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 border-b border-slate-700 p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-white">Submit Article</h2>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 bg-slate-700/50 hover:bg-slate-700 border border-slate-600 rounded-lg flex items-center justify-center text-slate-400 hover:text-white transition-all duration-200"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 max-h-[calc(90vh-120px)] overflow-y-auto">
          {hasSubmitted ? (
            <div className="text-center py-6 sm:py-8">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-green-500/20 border border-green-500/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-6 h-6 sm:w-8 sm:h-8 text-green-400" />
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-white mb-2">Already Submitted!</h3>
              <p className="text-slate-400 mb-6 text-sm sm:text-base">You've already submitted an article to this competition.</p>
              <button
                onClick={onClose}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white rounded-xl font-medium transition-all duration-200 text-sm sm:text-base"
              >
                Close
              </button>
            </div>
          ) : articles.length === 0 ? (
            <div className="text-center py-6 sm:py-8">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-amber-500/20 border border-amber-500/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-6 h-6 sm:w-8 sm:h-8 text-amber-400" />
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-white mb-2">No Articles Found</h3>
              <p className="text-slate-400 mb-6 text-sm sm:text-base">You don't have any published articles to submit. Create one first!</p>
              
              <div className="space-y-3">
                <button
                  onClick={handleCreateNewArticle}
                  className="w-full flex items-center justify-center space-x-2 py-3 px-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white rounded-xl font-medium transition-all duration-200 shadow-lg shadow-green-500/25 text-sm sm:text-base"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create New Article</span>
                </button>
                <button
                  onClick={onClose}
                  className="w-full py-3 px-4 bg-slate-700/50 hover:bg-slate-700 border border-slate-600 text-slate-300 hover:text-white rounded-xl transition-all duration-200 text-sm sm:text-base"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4 sm:space-y-6">
              {/* Article Selection */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-3">
                  Select your article to submit:
                </label>
                <div className="relative">
                  <select
                    className="w-full appearance-none bg-slate-700/50 border border-slate-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-200 text-sm sm:text-base"
                    value={selectedArticle}
                    onChange={(e) => setSelectedArticle(e.target.value)}
                  >
                    <option value="" className="bg-slate-700">-- Select an article --</option>
                    {articles.map((article) => (
                      <option key={article.id} value={article.id} className="bg-slate-700">
                        {article.title}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Selected Article Preview */}
              {selectedArticle && (
                <div className="bg-slate-700/30 border border-slate-600/50 rounded-xl p-4">
                  <div className="flex items-center space-x-3">
                    <FileText className="w-5 h-5 text-purple-400 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-slate-300">Selected Article</p>
                      <p className="text-white font-semibold text-sm sm:text-base truncate">
                        {articles.find(a => a.id === selectedArticle)?.title}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
                  <div className="flex items-start space-x-3">
                    <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                    <p className="text-red-400 text-sm">{error}</p>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  onClick={onClose}
                  className="flex-1 py-3 px-4 bg-slate-700/50 hover:bg-slate-700 border border-slate-600 text-slate-300 hover:text-white rounded-xl font-medium transition-all duration-200 text-sm sm:text-base"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  className={`
                    flex-1 py-3 px-4 rounded-xl font-medium transition-all duration-200 text-sm sm:text-base
                    ${selectedArticle && !isSubmitting
                      ? 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white shadow-lg shadow-purple-500/25'
                      : 'bg-slate-700/50 text-slate-500 cursor-not-allowed'
                    }
                  `}
                  disabled={isSubmitting || !selectedArticle}
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Submitting...</span>
                    </div>
                  ) : (
                    'Submit Article'
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}