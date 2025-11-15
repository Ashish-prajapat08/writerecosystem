import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Filter,
  Globe,
  Users,
  Briefcase,
  ExternalLink,
  Zap,
  ChevronDown,
  Loader,
  BookOpen,
  PenTool,
  Clock,
  Trophy,
  Award,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";
import { useArticles } from "@/hooks/useArticles";
import { ArticleCard } from "@/components/sections/ArticleCard";
import { adaptToCardArticle } from "@/types/articleTypes";
import { useFollowedArticles } from "@/hooks/useFollowedArticles";
import { useAuth } from "@/context/AuthContext";
import { checkIfApplied, fetchJobs } from "@/lib/jobs";
import { toast } from "@/hooks/use-toast";
import { ApplicationModal } from "@/components/modals/ApplicationModel";
import { formatDistanceToNow } from "date-fns";
import { useNavigate } from "react-router-dom";
import useDocumentTitle from "@/hooks/useDocumentTitle";
import { supabase } from "@/lib/supabaseClient";
import { useScroll } from "@/context/ScrollContext";

const topicFilters = [
  "All Topics",
  "Technology",
  "Politics",
  "Science",
  "Philosophy",
  "Culture",
  "Economics",
  "Environment",
  "Health",
  "Education",
  "Art",
  "History",
  "Geopolitics",
  "Sports",
  "Literature",
  "Sprituality",
  "Horror",
  "Lifestyle",
  "Travel",
  "Business",
  "Finance",
  "Marketing",
  "Fashion",
  "Music",
  "Crypto currency",
  "Food",
  "Gadgets",
];

interface Competition {
  id: string;
  title: string;
  category: string;
  prize_details: string;
  participant_count: string;
  time_remaining: string;
}

// Key for localStorage persistence
const FEED_FILTER_KEY = "feedFilterState";

export function MainFeed() {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // Get initial filter state from localStorage or default
  const getInitialFilterState = () => {
    if (typeof window === 'undefined') return "All Topics";
    
    try {
      const savedState = localStorage.getItem(FEED_FILTER_KEY);
      return savedState ? JSON.parse(savedState).topic : "All Topics";
    } catch (error) {
      console.error("Error loading filter state:", error);
      return "All Topics";
    }
  };

  const [isTopicDropdownOpen, setIsTopicDropdownOpen] = useState(false);
  const [feedType, setFeedType] = useState<"world" | "following">("world");
  const [selectedTopic, setSelectedTopic] = useState(getInitialFilterState);
  const feedContainerRef = useRef<HTMLDivElement>(null);
  const [jobs, setJobs] = useState<any[]>([]);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [applicationModalOpen, setApplicationModalOpen] = useState(false);
  const [applicationStatus, setApplicationStatus] = useState<
    Record<string, boolean>
  >({});
  
  const { saveScrollPosition, restoreScrollPosition, markNavigationOrigin, clearScrollPositions, getScrollPosition } = useScroll();
  const [isScrollRestored, setIsScrollRestored] = useState(false);
  const [isContentLoaded, setIsContentLoaded] = useState(false);
  const prevUserRef = useRef(user);
  const filterChangedRef = useRef(false);

  // Save filter state to localStorage whenever it changes
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.setItem(FEED_FILTER_KEY, JSON.stringify({
        topic: selectedTopic,
        timestamp: Date.now()
      }));
    } catch (error) {
      console.error("Error saving filter state:", error);
    }
  }, [selectedTopic]);

  // Enhanced scroll restoration with filter awareness
  useEffect(() => {
    markNavigationOrigin("other");
    
    // Check if user state changed (login/logout)
    const userChanged = prevUserRef.current !== user;
    prevUserRef.current = user;

    if (userChanged && user) {
      // User just logged in - clear scroll positions to avoid conflicts
      clearScrollPositions();
    }

    const savedPosition = getScrollPosition("feed");
    const restoreScroll = () => {
      // Multiple attempts to ensure restoration works with dynamic content
      restoreScrollPosition("feed", true);
      
      setTimeout(() => {
        restoreScrollPosition("feed", true);
      }, 100);
      
      setTimeout(() => {
        restoreScrollPosition("feed", true);
        setIsScrollRestored(true);
      }, 300);
    };
    
    // Only restore if we have a saved position and user didn't just log in
    if (savedPosition > 0 && !userChanged) {
      restoreScroll();
    } else {
      // No saved position or user just logged in - scroll to top
      window.scrollTo(0, 0);
      setIsScrollRestored(true);
    } 

    return () => {
      // Cleanup if needed
    };
  }, [restoreScrollPosition, markNavigationOrigin, clearScrollPositions, getScrollPosition, user]);

  // Save scroll position on scroll (with throttling)
  useEffect(() => {
    if (!isScrollRestored) return;
    
    let scrollTimeout: NodeJS.Timeout;
    
    const handleScroll = () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        // Save both scroll position and current filter
        saveScrollPosition("feed");
      }, 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(scrollTimeout);
    };
  }, [saveScrollPosition, isScrollRestored]);

  // Save scroll position when leaving the page
  useEffect(() => {
    const handleBeforeUnload = () => {
      saveScrollPosition("feed");
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [saveScrollPosition]);

  const [activeCompetitions, setActiveCompetitions] = useState<Competition[]>([]);

  useEffect(() => {
    const fetchActiveCompetitions = async () => {
      const { data } = await supabase
        .from("competitions")
        .select("*")
        .gte("end_date", new Date().toISOString())
        .order("created_at", { ascending: false });
      setActiveCompetitions(data || []);
    };
    fetchActiveCompetitions();
  }, []);

  useDocumentTitle("Feed | Writers Ecosystem");

  // Fetch jobs
  useEffect(() => {
    const loadJobs = async () => {
      try {
        const data = await fetchJobs({
          featured: true,
        });
        setJobs(data);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load jobs",
          variant: "destructive",
        });
      }
    };

    loadJobs();
  }, []);

  // Check application status
  useEffect(() => {
    const checkApplications = async () => {
      if (!user || jobs.length === 0) return;

      const status: Record<string, boolean> = {};
      for (const job of jobs) {
        const hasApplied = await checkIfApplied(job.id, user.id);
        status[job.id] = hasApplied;
      }
      setApplicationStatus(status);
    };

    checkApplications();
  }, [jobs, user]);

  // Format salary display
  const formatSalary = (job: any) => {
    if (job.salary_display) return job.salary_display;
    if (job.salary_min && job.salary_max) {
      return `${
        job.salary_currency || ""
      }${job.salary_min.toLocaleString()} - ${job.salary_max.toLocaleString()}`;
    }
    return "Salary not disclosed";
  };

  const handleViewAllJobs = () => {
    window.scrollTo(0, 0);
    navigate("/jobs");
  };

  // Format job type
  const formatJobType = (type: string) => {
    return type.charAt(0).toUpperCase() + type.slice(1).replace("-", " ");
  };

  // World feed articles
  const worldArticles = useArticles({
    publishedOnly: true,
    limit: 2000,
    tag: selectedTopic !== "All Topics" ? selectedTopic : undefined,
  });

  // Following feed articles
  const followingArticles = useFollowedArticles();

  // Active feed based on selection
  const activeFeed = feedType === "world" ? worldArticles : followingArticles;
  const { articles, loading, error, hasMore, loadMore } = activeFeed;

  const hasFollowedUsers =
    "hasFollowedUsers" in activeFeed ? activeFeed.hasFollowedUsers : false;

  // Track when content is loaded for scroll restoration
  useEffect(() => {
    if (!loading && articles.length > 0 && !isContentLoaded) {
      setIsContentLoaded(true);
      
      // Attempt scroll restoration after content loads
      setTimeout(() => {
        restoreScrollPosition("feed", true);
      }, 100);
    }
  }, [loading, articles, isContentLoaded, restoreScrollPosition]);

  // Reset scroll when switching feeds or filters
  useEffect(() => {
    if (feedContainerRef.current) {
      feedContainerRef.current.scrollTop = 0;
    }
    // Reset content loaded state when filter changes
    setIsContentLoaded(false);
    filterChangedRef.current = true;
  }, [feedType, selectedTopic]);

  const handleTopicSelect = (topic: string) => {
    setSelectedTopic(topic);
    setIsTopicDropdownOpen(false);
  };

  // Infinite scroll observer
  const observer = useRef<IntersectionObserver>();
  const lastArticleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (loading || !hasMore) return;

    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        loadMore();
      }
    });

    if (lastArticleRef.current) {
      observer.current.observe(lastArticleRef.current);
    }

    return () => observer.current?.disconnect();
  }, [loading, hasMore, loadMore, articles]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-gray-900 to-slate-950 overflow-x-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent"></div>
      <div className="absolute top-0 left-1/4 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl "></div>
      <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl"></div>

      <div className="relative w-full">
        <motion.div
          ref={feedContainerRef}
          key="feed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="py-6 max-w-full"
        >
          <div className="space-y-6 lg:space-y-0 lg:grid lg:grid-cols-4 lg:gap-8 max-w-7xl mx-auto">
            {/* Main Feed */}
            <div className="lg:col-span-3 order-2 lg:order-1 w-full min-w-0">
              {/* Feed Header - Wrapped in relative z-10 to ensure it stays above content */}
              <div className="mb-8 relative">
                <Card className="relative bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-sm border border-blue-500/20 p-6 md:p-8 ">
                  {/* Subtle glow effect */}
                  <div className="absolute -inset-1 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-cyan-600/20 blur opacity-30"></div>

                  <div className="relative">
                    {/* Feed Controls */}
                    <div className="flex flex-col gap-6">
                      {/* Top Row: Title and Feed Type Toggle */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/25">
                            {feedType === "world" ? (
                              <Globe className="w-6 h-6 text-white" />
                            ) : (
                              <Users className="w-6 h-6 text-white" />
                            )}
                          </div>
                          <div>
                            <h2 className="text-2xl md:text-3xl font-black bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                              {feedType === "world"
                                ? "World Feed"
                                : "Following Feed"}
                            </h2>
                            <p className="text-gray-400 text-sm">
                              {feedType === "world"
                                ? "Discover amazing content from writers worldwide"
                                : "Stay updated with writers you follow"}
                            </p>
                          </div>
                        </div>

                        {/* Feed Type Toggle */}
                        <div className="flex bg-gray-800/50 rounded-2xl p-1 border border-gray-700/30">
                          <button
                            onClick={() => setFeedType("world")}
                            className={`px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                              feedType === "world"
                                ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg shadow-blue-500/25"
                                : "text-gray-300 hover:text-white hover:bg-gray-700/50"
                            }`}
                          >
                            <Globe className="w-4 h-4" />
                            <span className="hidden sm:inline">World</span>
                          </button>
                          <button
                            onClick={() => setFeedType("following")}
                            className={`px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                              feedType === "following"
                                ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg shadow-blue-500/25"
                                : "text-gray-300 hover:text-white hover:bg-gray-700/50"
                            }`}
                          >
                            <Users className="w-4 h-4" />
                            <span className="hidden sm:inline">Following</span>
                          </button>
                        </div>
                      </div>

                      {/* Only show topic filter for world feed */}
                      {feedType === "world" && (
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                          {/* Topic Filter Dropdown */}
                          <div className="relative">
                            <button
                              onClick={() =>
                                setIsTopicDropdownOpen(!isTopicDropdownOpen)
                              }
                              className={`flex items-center gap-2 px-4 py-3 rounded-xl transition-all duration-200 text-sm font-medium ${
                                selectedTopic !== "All Topics"
                                  ? "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg shadow-purple-500/25"
                                  : "bg-gray-800/50 hover:bg-gray-700/50 text-gray-300 border border-gray-700/30"
                              }`}
                            >
                              <Filter className="w-4 h-4" />
                              <span>{selectedTopic}</span>
                              <ChevronDown
                                className={`w-4 h-4 transition-transform ${
                                  isTopicDropdownOpen ? "rotate-180" : ""
                                }`}
                              />
                            </button>
                            {selectedTopic !== "All Topics" && (
                              <button
                                onClick={() => handleTopicSelect("All Topics")}
                                className="px-3 py-1 text-sm text-gray-400 hover:text-white transition-colors"
                              >
                                Clear filter
                              </button>
                            )}

                            <AnimatePresence>
                              {isTopicDropdownOpen && (
                                <motion.div
                                  initial={{ opacity: 0, y: -10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  exit={{ opacity: 0, y: -10 }}
                                  className="absolute top-full left-0 mt-2 w-64 bg-gradient-to-br from-gray-900/95 to-gray-800/95 backdrop-blur-sm border border-gray-700/50 rounded-2xl shadow-xl z-50"
                                >
                                  <div className="p-2 max-h-64 overflow-y-auto">
                                    {topicFilters.map((topic) => (
                                      <button
                                        key={topic}
                                        onClick={() => handleTopicSelect(topic)}
                                        className={`w-full text-left px-3 py-2 rounded-xl text-sm transition-all duration-200 ${
                                          selectedTopic === topic
                                            ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white"
                                            : "text-gray-300 hover:bg-gray-800/50 hover:text-white"
                                        }`}
                                      >
                                        {topic}
                                      </button>
                                    ))}
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              </div>

              {/* Posts - Added relative z-0 and proper spacing */}
              <div className="space-y-2 relative">
                {loading && !articles.length ? (
                  <Card className="bg-gradient-to-br from-gray-900/80 to-gray-800/60 backdrop-blur-sm border border-gray-700/30 p-8 rounded-3xl mt-4">
                    <div className="flex flex-col items-center justify-center py-8">
                      <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-blue-500/25">
                        <Loader className="animate-spin w-8 h-8 text-white" />
                      </div>
                      <p className="text-gray-300 text-lg font-medium">
                        Loading amazing content...
                      </p>
                    </div>
                  </Card>
                ) : error ? (
                  <Card className="bg-gradient-to-br from-gray-900/80 to-gray-800/60 backdrop-blur-sm border border-red-500/20 p-8 rounded-3xl text-center mt-4">
                    <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center shadow-lg shadow-red-500/25">
                      <Users className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-100 mb-2">
                      Authentication Required
                    </h3>
                    <p className="text-gray-400 mb-6">
                      Please login to view the following feed
                    </p>
                    <Button
                      onClick={() => navigate("/login")}
                      className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white rounded-xl px-6 py-3"
                    >
                      Login to Continue
                    </Button>
                  </Card>
                ) : articles.length === 0 ? (
                  <Card className="bg-gradient-to-br from-gray-900/80 to-gray-800/60 backdrop-blur-sm border border-gray-700/30 p-8 md:p-12 rounded-3xl text-center mt-4">
                    <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/25">
                      <BookOpen className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl md:text-2xl font-bold text-gray-100 mb-2">
                      {feedType === "following"
                        ? "No Posts Yet"
                        : "No Articles Found"}
                    </h3>
                    <p className="text-gray-400 text-lg mb-6">
                      {feedType === "following"
                        ? hasFollowedUsers
                          ? "No posts yet from users you follow"
                          : "You're not following anyone yet. Follow writers to see their articles here."
                        : "No articles found for the selected topic"}
                    </p>

                    {feedType === "world" && selectedTopic !== "All Topics" && (
                      <Button
                        onClick={() => handleTopicSelect("All Topics")}
                        className="mt-4 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white rounded-xl px-6 py-3"
                      >
                        Reset Filters
                      </Button>
                    )}
                  </Card>
                ) : (
                  <>
                    {articles.map((article, index) => (
                      <motion.div
                        key={`${feedType}-${article.id}`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <ArticleCard article={adaptToCardArticle(article)} />
                      </motion.div>
                    ))}
                    <div ref={lastArticleRef} />
                    {loading && articles.length > 0 && (
                      <Card className="bg-gradient-to-br from-gray-900/80 to-gray-800/60 backdrop-blur-sm border border-gray-700/30 p-6 rounded-3xl mt-4">
                        <div className="flex justify-center items-center gap-3">
                          <Loader className="animate-spin w-5 h-5 text-blue-400" />
                          <span className="text-gray-300 font-medium">
                            Loading more content...
                          </span>
                        </div>
                      </Card>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* Right Sidebar - Desktop Only */}
            <div className="lg:col-span-1 space-y-6 order-1 lg:order-2 hidden lg:block w-full">
              {/* Publish Promotion Card */}
              <Card className="bg-gradient-to-br from-gray-900/80 to-gray-800/60 backdrop-blur-sm border border-gray-700/30 p-4 sm:p-6 w-full">
                <div className="flex items-center gap-2 mb-4">
                  <BookOpen className="w-5 h-5 text-blue-400" />
                  <h3 className="text-lg font-bold text-white">
                    Publish Your Ebook
                  </h3>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 bg-gray-800/40 rounded-xl border border-gray-700/30 hover:border-blue-500/30 transition-all duration-200">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/25">
                      <PenTool className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-100">
                        Join Our Authors
                      </p>
                      <p className="text-gray-400 text-sm">
                        Share your work with our community
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-gray-800/40 rounded-xl border border-gray-700/30 hover:border-green-500/30 transition-all duration-200">
                    <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg shadow-green-500/25">
                      <Zap className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-100">
                        Earn Royalties
                      </p>
                      <p className="text-gray-400 text-sm">
                        Get paid for your writing
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-gray-800/40 rounded-xl border border-gray-700/30 hover:border-purple-500/30 transition-all duration-200">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/25">
                      <Users className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-100">
                        Build Your Audience
                      </p>
                      <p className="text-gray-400 text-sm">
                        Connect with readers worldwide
                      </p>
                    </div>
                  </div>

                  <Button
                    onClick={() => navigate("/publish-ebook")}
                    className="w-full mt-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500 text-white rounded-xl py-3"
                  >
                    Start Publishing
                  </Button>
                </div>
              </Card>
              {/* Jobs Panel */}
              <Card className="bg-gradient-to-br from-gray-900/80 to-gray-800/60 backdrop-blur-sm border border-gray-700/30 p-4 sm:p-6 w-full">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-blue-400" />
                    <h3 className="text-lg font-bold text-white">
                      Featured Jobs
                    </h3>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleViewAllJobs}
                    className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 rounded-xl"
                  >
                    View All
                    <ExternalLink className="w-4 h-4 ml-2" />
                  </Button>
                </div>

                <div className="space-y-4 max-h-[400px] overflow-y-auto">
                  {loading ? (
                    <div className="flex justify-center py-4">
                      <Loader className="animate-spin text-blue-400" />
                    </div>
                  ) : jobs.length === 0 ? (
                    <div className="text-center py-8">
                      <div className="w-12 h-12 mx-auto mb-4 bg-gradient-to-br from-gray-600 to-gray-700 rounded-xl flex items-center justify-center">
                        <Briefcase className="w-6 h-6 text-gray-400" />
                      </div>
                      <p className="text-gray-400 text-sm">
                        No active job postings at the moment
                      </p>
                    </div>
                  ) : (
                    jobs.map((job) => (
                      <div
                        key={job.id}
                        className="p-4 bg-gray-800/40 rounded-xl border border-gray-700/30 hover:border-blue-500/30 transition-all duration-200"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <h4 className="font-medium text-sm flex-1 pr-2 text-gray-100">
                            {job.title}
                          </h4>
                          <div className="flex gap-1">
                            {job.urgent && (
                              <span className="px-2 py-1 bg-red-400/20 text-red-300 text-xs rounded-full border border-red-400/30">
                                URGENT
                              </span>
                            )}
                            {job.featured && (
                              <span className="px-2 py-1 bg-blue-400/20 text-blue-300 text-xs rounded-full border border-blue-400/30">
                                FEATURED
                              </span>
                            )}
                          </div>
                        </div>

                        <p className="text-blue-300 text-sm mb-3 font-medium">
                          {job.company}
                        </p>

                        <div className="flex flex-wrap items-center gap-2 text-xs text-gray-400 mb-3">
                          <span className="bg-gray-700/50 px-2 py-1 rounded-lg">
                            {formatJobType(job.job_type)}
                          </span>
                          <span className="bg-gray-700/50 px-2 py-1 rounded-lg">
                            {job.remote ? "Remote" : job.location}
                          </span>
                          {job.tags?.length > 0 && (
                            <span className="bg-gray-700/50 px-2 py-1 rounded-lg">
                              {job.tags[0]}
                              {job.tags.length > 1 &&
                                ` +${job.tags.length - 1}`}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center justify-between mb-3">
                          <span className="text-green-400 text-sm font-bold">
                            {formatSalary(job)}
                          </span>
                          <div className="flex items-center gap-1 text-xs text-gray-400">
                            <Clock className="w-3 h-3" />
                            <span>
                              {formatDistanceToNow(new Date(job.created_at))}{" "}
                              ago
                            </span>
                          </div>
                        </div>

                        {user?.id !== job.employer_id && (
                          <div className="mt-3">
                            {!user ? (
                              <Button
                                size="sm"
                                className="w-full text-xs bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white rounded-xl"
                                onClick={() => navigate("/login")}
                              >
                                Login to Apply
                              </Button>
                            ) : applicationStatus[job.id] ? (
                              <div className="text-xs text-green-400 flex items-center justify-center gap-1 py-2 bg-green-500/10 rounded-xl border border-green-500/20">
                                ✓ Applied Successfully
                              </div>
                            ) : (
                              <Button
                                size="sm"
                                className="w-full text-xs bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white rounded-xl"
                                onClick={() => {
                                  setSelectedJobId(job.id);
                                  setApplicationModalOpen(true);
                                }}
                              >
                                Apply Now
                              </Button>
                            )}
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </Card>
              {/* Feed Stats Card */}
              <Card className="bg-gradient-to-br from-blue-900/50 via-purple-900/30 to-blue-800/40 backdrop-blur-sm border border-blue-500/20 p-4 sm:p-6 w-full">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-yellow-400" />
                    <h3 className="text-lg font-bold text-white">
                      Active Competitions
                    </h3>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate("/competitions")}
                    className="text-blue-300 hover:text-white"
                  >
                    View All <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>

                {activeCompetitions.length > 0 ? (
                  <div className="space-y-4">
                    {activeCompetitions.slice(0, 2).map((competition) => (
                      <div
                        key={competition.id}
                        className="p-3 bg-gradient-to-br from-gray-800/60 to-gray-800/40 border border-gray-700/30 rounded-lg hover:border-yellow-500/30 transition-all cursor-pointer"
                        onClick={() => navigate(`/competitions`)}
                      >
                        <div className="flex items-start gap-3 mb-2">
                          <div className="bg-yellow-500/10 p-2 rounded-lg border border-yellow-500/20">
                            <Trophy className="w-4 h-4 text-yellow-400" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-white">
                              {competition.title}
                            </h4>
                          </div>
                        </div>

                        <div className="space-y-2 text-sm text-gray-300">
                          <div className="flex items-center justify-between">
                            <span className="flex items-center gap-1.5">
                              <Award className="w-3.5 h-3.5 text-blue-400" />
                              <span>Prize</span>
                            </span>
                            <span className="font-medium text-yellow-400">
                              {competition.prize_details}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}

                    {activeCompetitions.length > 2 && (
                      <Button
                        onClick={() => navigate("/competitions")}
                        className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white text-sm h-8"
                      >
                        View All {activeCompetitions.length} Competitions
                      </Button>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <div className="w-10 h-10 mx-auto mb-3 bg-gradient-to-br from-gray-700 to-gray-800 rounded-full flex items-center justify-center">
                      <Clock className="w-5 h-5 text-gray-500" />
                    </div>
                    <p className="text-gray-400 text-sm">
                      No active competitions at the moment
                    </p>
                    <Button
                      onClick={() => navigate("/competitions")}
                      className="w-full mt-3 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white text-sm h-8"
                    >
                      View Upcoming
                    </Button>
                  </div>
                )}
              </Card>
            </div>
          </div>

          {/* Application Modal */}
          {selectedJobId && (
            <ApplicationModal
              jobId={selectedJobId}
              open={applicationModalOpen}
              onClose={() => setApplicationModalOpen(false)}
              onSuccess={() => {
                setApplicationStatus((prev) => ({
                  ...prev,
                  [selectedJobId]: true,
                }));
                toast({
                  title: "Application submitted!",
                  description: "Your application has been received.",
                });
              }}
            />
          )}
        </motion.div>
      </div>
    </div>
  );
}