import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import {
  Eye,
  MapPin,
  Users,
  Heart,
  MessageCircle,
  TrendingUp,
  Zap,
  PenTool,
  Calendar,
  BarChart3,
  FileText,
  UserPlus,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabaseClient";
import { useArticles } from "@/hooks/useArticles";
import { Article } from "@/lib/articles";
import { useArticleEngagement } from "@/hooks/useArticleEngagement";
import { useParams, useNavigate } from "react-router-dom";
import { FollowButton } from "@/components/FollowButton";
import { CollaborateButton } from "../utils/CollaborateButton";

interface Profile {
  user_id: string;
  full_name: string;
  username: string;
  avatar_url: string | null;
  bio: string | null;
  location: string | null;
  email: string;
}

const ArticleCard = ({ article }: { article: Article }) => {
  const { likes, commentsCount } = useArticleEngagement(article.id, false);
  const navigate = useNavigate();

  const handleArticleClick = () => {
    navigate(`/article/${article.id}`);
  };

  return (
    <div className="group relative w-full min-w-0">
      {/* Subtle hover glow effect */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-cyan-600/20 rounded-2xl blur opacity-0 group-hover:opacity-30 transition-all duration-500"></div>

      <Card
        onClick={handleArticleClick}
        className="relative bg-gradient-to-br from-gray-900/70 to-gray-800/50 backdrop-blur-sm border border-gray-700/30 hover:border-blue-500/30 p-4 md:p-6 transition-all duration-300 cursor-pointer group-hover:transform group-hover:scale-[1.01] group-hover:shadow-xl group-hover:shadow-blue-500/10 w-full min-w-0"
      >
        {/* Article Header */}
        <div className="mb-4">
          <h4 className="text-lg font-bold text-white group-hover:text-blue-300 transition-colors mb-2 break-words">
            {article.title}
          </h4>
          {article.excerpt && (
            <p className="text-gray-300 text-sm leading-relaxed break-words line-clamp-2">
              {article.excerpt}
            </p>
          )}
        </div>

        {/* Tags Section */}
        {article.tags && article.tags.length > 0 && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-2">
              {article.tags.slice(0, 4).map((tag) => (
                <span
                  key={tag.id}
                  className="px-3 py-1 bg-gradient-to-r from-blue-900/40 to-indigo-900/40 text-blue-100 text-xs font-medium rounded-lg border border-blue-700/30 hover:border-blue-600/40 transition-all duration-200 break-words"
                >
                  {tag.name}
                </span>
              ))}
              {article.tags.length > 4 && (
                <span className="px-3 py-1 bg-gray-800/50 text-gray-400 text-xs font-medium rounded-lg border border-gray-700/30 whitespace-nowrap">
                  +{article.tags.length - 4} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* Article Stats and Meta */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-4 border-t border-gray-700/30">
          <div className="flex flex-wrap items-center gap-3 text-xs md:text-sm text-gray-400 min-w-0">
            {article.published_at && (
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3 flex-shrink-0" />
                <span className="break-words">
                  {formatTimeAgo(article.published_at)}
                </span>
              </span>
            )}
            <span className="flex items-center gap-1">
              <FileText className="w-3 h-3 flex-shrink-0" />
              <span className="break-words">Article</span>
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 text-red-400">
              <Heart
                className="w-4 h-4 flex-shrink-0"
                fill={likes > 0 ? "#f87171" : "none"}
              />
              <span className="font-medium">{likes}</span>
            </div>
            <div className="flex items-center gap-1 text-blue-400">
              <MessageCircle
                className="w-4 h-4 flex-shrink-0"
                fill={commentsCount > 0 ? "#60a5fa" : "none"}
              />
              <span className="font-medium">{commentsCount}</span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

const formatTimeAgo = (dateString: string) => {
  const now = new Date();
  const date = new Date(dateString);
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return "Just now";
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  return `${Math.floor(diffInSeconds / 86400)}d ago`;
};

const UserProfilePage = () => {
  const { username } = useParams();
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [followerCount, setFollowerCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [isFollowing, setIsFollowing] = useState(false);
  const [userIdForArticles, setUserIdForArticles] = useState<
    string | undefined
  >();
  const [totalViews, setTotalViews] = useState(0);
  const [totalLikes, setTotalLikes] = useState(0);
  const [totalComments, setTotalComments] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Fetch profile data including user ID
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setProfileLoading(true);

        // Fetch profile by username
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("username", username)
          .single();

        if (profileError) throw profileError;
        setProfile(profileData);
        setUserIdForArticles(profileData.user_id);

        // Fetch follower count
        const { count: followers } = await supabase
          .from("user_follows")
          .select("*", { count: "exact" })
          .eq("following_id", profileData.user_id);

        // Fetch following count
        const { count: following } = await supabase
          .from("user_follows")
          .select("*", { count: "exact" })
          .eq("follower_id", profileData.user_id);

        // Check if current user is following this profile
        if (user?.id) {
          const { data: followData } = await supabase
            .from("user_follows")
            .select()
            .eq("follower_id", user.id)
            .eq("following_id", profileData.user_id)
            .maybeSingle();

          setIsFollowing(!!followData);
        }

        // Calculate engagement metrics
        const { data: engagementData } = await supabase
          .from("articles")
          .select(
            `
            id,
            article_views(count),
            article_likes(count),
            article_comments(count)
          `
          )
          .eq("user_id", profileData.user_id)
          .eq("published", true);

        let views = 0;
        let likes = 0;
        let comments = 0;

        if (engagementData) {
          views = engagementData.reduce(
            (sum, article) => sum + (article.article_views[0]?.count || 0),
            0
          );
          likes = engagementData.reduce(
            (sum, article) => sum + (article.article_likes[0]?.count || 0),
            0
          );
          comments = engagementData.reduce(
            (sum, article) => sum + (article.article_comments[0]?.count || 0),
            0
          );
        }

        setFollowerCount(followers || 0);
        setFollowingCount(following || 0);
        setTotalViews(views);
        setTotalLikes(likes);
        setTotalComments(comments);
      } catch (error) {
        console.error("Error fetching profile:", error);
        navigate("/404");
      } finally {
        setProfileLoading(false);
      }
    };

    if (username) {
      fetchProfileData();
    }
  }, [username, navigate, user?.id]);

  const handleFollowChange = async (newFollowingState: boolean) => {
    setIsFollowing(newFollowingState);
    setFollowerCount((prev) =>
      newFollowingState ? prev + 1 : Math.max(0, prev - 1)
    );
  };

  // Use existing useArticles hook with the fetched user ID
  const {
    articles,
    loading: articlesLoading,
    error: articlesError,
    hasMore,
    loadMore,
  } = useArticles({
    userId: userIdForArticles,
    limit: 10,
    publishedOnly: true,
  });

  if (profileLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-gray-900 to-slate-950 overflow-x-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent"></div>
        <div className="relative z-10 flex flex-col items-center justify-center py-16">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
            <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-r-cyan-500 rounded-full animate-spin animate-reverse"></div>
          </div>
          <p className="text-gray-400 mt-4 text-lg">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-gray-900 to-slate-950 overflow-x-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent"></div>
        <div className="relative z-10 flex items-center justify-center py-16">
          <Card className="bg-gradient-to-br from-gray-900/80 to-gray-800/60 backdrop-blur-sm border border-gray-700/30 p-6 text-center">
            <p className="text-gray-400">Profile not found</p>
          </Card>
        </div>
      </div>
    );
  }

  const isCurrentUser = user?.id === profile.user_id;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-gray-900 to-slate-950 overflow-x-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent"></div>
      <div className="absolute top-0 left-1/4 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl"></div>

      <div className="relative z-10 w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="px-4 py-6 max-w-full"
        >
          {/* Enhanced Profile Header */}
          <div className="mb-8 md:mb-12">
            <div className="relative">
              {/* Header Background Gradient */}
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 rounded-3xl blur opacity-20"></div>

              <Card className="relative bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-sm border border-blue-500/20 p-6 md:p-8 rounded-3xl">
                <div className="flex flex-col lg:flex-row items-center lg:items-start gap-6 lg:gap-8">
                  {/* Enhanced Avatar */}
                  <div className="relative">
                    <div className="absolute -inset-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full blur opacity-30"></div>
                    <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-4 border-gradient-to-r from-blue-500/50 to-cyan-500/50">
                      {profile.avatar_url ? (
                        <img
                          src={profile.avatar_url}
                          alt={profile.full_name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = "none";
                          }}
                          loading="lazy"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center text-2xl md:text-4xl font-bold text-white">
                          {profile.full_name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Profile Info */}
                  <div className="flex-1 text-center lg:text-left max-w-3xl">
                    <div className="mb-4">
                      <h1 className="text-2xl md:text-3xl lg:text-4xl font-black mb-2 bg-gradient-to-r from-blue-400 via-blue-300 to-cyan-300 bg-clip-text text-transparent">
                        {profile.full_name}
                      </h1>
                      <p className="text-lg md:text-xl text-blue-300 font-medium mb-3">
                        @{profile.username}
                      </p>
                      <p className="text-gray-300 text-base md:text-lg leading-relaxed max-w-2xl mx-auto lg:mx-0">
                        {profile.bio ||
                          "Welcome to my profile! I'm passionate about writing and sharing ideas."}
                      </p>
                    </div>

                    {/* Profile Stats */}
                    <div className="flex flex-wrap justify-center lg:justify-start items-center gap-4 md:gap-6 mb-6">
                      <div
                        className="flex items-center gap-2 cursor-pointer hover:text-blue-400 transition-colors group"
                        onClick={() =>
                          navigate(`/profile/${profile.username}/followers`)
                        }
                      >
                        <Users className="w-5 h-5 text-blue-400 group-hover:scale-110 transition-transform" />
                        <span className="text-gray-300">
                          <strong className="text-white text-lg">
                            {followerCount}
                          </strong>{" "}
                          <span className="text-sm">followers</span>
                        </span>
                      </div>
                      <div
                        className="flex items-center gap-2 cursor-pointer hover:text-blue-400 transition-colors group"
                        onClick={() =>
                          navigate(`/profile/${profile.username}/following`)
                        }
                      >
                        <Eye className="w-5 h-5 text-blue-400 group-hover:scale-110 transition-transform" />
                        <span className="text-gray-300">
                          <strong className="text-white text-lg">
                            {followingCount}
                          </strong>{" "}
                          <span className="text-sm">following</span>
                        </span>
                      </div>
                      {profile.location && (
                        <div className="flex items-center gap-2 text-gray-300">
                          <MapPin className="w-5 h-5 text-green-400" />
                          <span className="text-sm">{profile.location}</span>
                        </div>
                      )}
                    </div>

                    {/* Follow Button */}
                    {!isCurrentUser && user && (
                      <div className="flex justify-center lg:justify-start">
                        <FollowButton
                          profileUserId={profile.user_id}
                          onFollowChange={handleFollowChange}
                          initialFollowing={isFollowing}
                        />
                        {profile.email && (
                          <CollaborateButton email={profile.email} />
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            </div>
          </div>

          {/* Main Content Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8 w-full">
            {/* Main Articles Section */}
            <div className="lg:col-span-3 w-full min-w-0">
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <h2 className="text-xl md:text-2xl font-bold text-white">
                    {isCurrentUser
                      ? "Your Articles"
                      : `${profile.full_name}'s Articles`}
                  </h2>
                  <div className="flex-1 h-px bg-gradient-to-r from-blue-400/50 to-transparent"></div>
                  <span className="text-gray-400 text-sm font-medium">
                    {articles.length} published
                  </span>
                </div>

                {articlesLoading && !articles.length ? (
                  <div className="flex flex-col items-center justify-center py-16">
                    <div className="relative">
                      <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
                    </div>
                    <p className="text-gray-400 mt-4">Loading articles...</p>
                  </div>
                ) : articlesError ? (
                  <div className="text-center py-16">
                    <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-red-800 to-red-900 rounded-full flex items-center justify-center">
                      <Zap className="w-10 h-10 text-red-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-red-400 mb-2">
                      Error loading articles
                    </h3>
                    <p className="text-gray-500">
                      Please try refreshing the page
                    </p>
                  </div>
                ) : articles.length > 0 ? (
                  <div className="space-y-6">
                    {articles.map((article) => (
                      <ArticleCard key={article.id} article={article} />
                    ))}
                    {hasMore && (
                      <div className="text-center pt-6">
                        <Button
                          onClick={loadMore}
                          disabled={articlesLoading}
                          className="bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 text-white px-6 py-3 font-medium shadow-lg shadow-gray-500/20 transition-all duration-300"
                        >
                          {articlesLoading ? (
                            <>
                              <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin mr-2"></div>
                              Loading...
                            </>
                          ) : (
                            "Load More Articles"
                          )}
                        </Button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-16">
                    <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-gray-800 to-gray-900 rounded-full flex items-center justify-center">
                      <PenTool className="w-10 h-10 text-gray-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-400 mb-2">
                      No articles yet
                    </h3>
                    <p className="text-gray-500 mb-6">
                      {isCurrentUser
                        ? "Start writing and share your thoughts with the world"
                        : `${profile.full_name} hasn't published any articles yet`}
                    </p>
                    {isCurrentUser && (
                      <Button
                        onClick={() => navigate("/write")}
                        className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white px-6 py-3 font-semibold shadow-lg shadow-blue-500/25"
                      >
                        <PenTool className="w-4 h-4 mr-2" />
                        Write Your First Article
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Enhanced Right Sidebar */}
            <div className="lg:col-span-1 w-full">
              <div className="space-y-6 w-full">
                {/* Profile Stats Card */}
                <div className="w-full">
                  <Card className="bg-gradient-to-br from-gray-900/80 to-gray-800/60 backdrop-blur-sm border border-gray-700/30 p-4 md:p-6 w-full">
                    <div className="flex items-center gap-2 mb-4">
                      <BarChart3 className="w-5 h-5 text-blue-400 flex-shrink-0" />
                      <h3 className="text-base md:text-lg font-bold text-white">
                        Profile Stats
                      </h3>
                    </div>
                    <div className="space-y-3 w-full">
                      <div className="flex justify-between items-center p-3 bg-gray-800/40 rounded-lg w-full">
                        <span className="text-gray-300 text-sm">Articles</span>
                        <span className="font-bold text-blue-400">
                          {articles.length}
                        </span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-gray-800/40 rounded-lg w-full">
                        <span className="text-gray-300 text-sm">Followers</span>
                        <span className="font-bold text-green-400">
                          {followerCount}
                        </span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-gray-800/40 rounded-lg w-full">
                        <span className="text-gray-300 text-sm">Following</span>
                        <span className="font-bold text-purple-400">
                          {followingCount}
                        </span>
                      </div>
                    </div>
                  </Card>
                </div>

                {/* Engagement Metrics Card */}
                <div className="w-full">
                  <Card className="bg-gradient-to-br from-gray-900/80 to-gray-800/60 backdrop-blur-sm border border-gray-700/30 p-4 md:p-6 w-full">
                    <div className="flex items-center gap-2 mb-4">
                      <TrendingUp className="w-5 h-5 text-green-400 flex-shrink-0" />
                      <h3 className="text-base md:text-lg font-bold text-white">
                        Engagement
                      </h3>
                    </div>
                    <div className="space-y-3 w-full">
                      <div className="flex justify-between items-center p-3 bg-gray-800/40 rounded-lg w-full">
                        <span className="text-gray-300 text-sm">
                          Total Views
                        </span>
                        <span className="font-bold text-cyan-400">
                          {totalViews.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-gray-800/40 rounded-lg w-full">
                        <span className="text-gray-300 text-sm">
                          Total Likes
                        </span>
                        <span className="font-bold text-red-400">
                          {totalLikes}
                        </span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-gray-800/40 rounded-lg w-full">
                        <span className="text-gray-300 text-sm">Comments</span>
                        <span className="font-bold text-blue-400">
                          {totalComments}
                        </span>
                      </div>
                    </div>
                  </Card>
                </div>

                {/* Connect CTA */}
                {!isCurrentUser && (
                  <div className="w-full">
                    <Card className="bg-gradient-to-br from-blue-900/50 via-purple-900/30 to-blue-800/40 backdrop-blur-sm border border-blue-500/20 p-4 md:p-6 w-full">
                      <div className="text-center w-full">
                        <div className="w-12 h-12 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                          <UserPlus className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="text-base md:text-lg font-bold text-white mb-2">
                          Connect & Follow
                        </h3>
                        <p className="text-gray-300 text-sm mb-4 leading-relaxed">
                          Stay updated with {profile.full_name}'s latest
                          articles and insights.
                        </p>
                        <FollowButton
                          profileUserId={profile.user_id}
                          onFollowChange={handleFollowChange}
                          initialFollowing={isFollowing}
                        />
                      </div>
                    </Card>
                  </div>
                )}

                {/* Reader Tips */}
                <div className="w-full">
                  <Card className="bg-gradient-to-br from-gray-900/80 to-gray-800/60 backdrop-blur-sm border border-gray-700/30 p-4 md:p-6 w-full">
                    <h3 className="text-base md:text-lg font-bold text-white mb-4">
                      💡 Reader Tips
                    </h3>
                    <div className="space-y-3 text-sm text-gray-300 w-full">
                      <div className="p-3 bg-gray-800/40 rounded-lg w-full">
                        <p className="font-medium text-blue-300 mb-1">
                          Engage Actively
                        </p>
                        <p>Like and comment on articles you find interesting</p>
                      </div>
                      <div className="p-3 bg-gray-800/40 rounded-lg w-full">
                        <p className="font-medium text-green-300 mb-1">
                          Follow Authors
                        </p>
                        <p>Stay updated with your favorite writers' content</p>
                      </div>
                      <div className="p-3 bg-gray-800/40 rounded-lg w-full">
                        <p className="font-medium text-purple-300 mb-1">
                          Share Insights
                        </p>
                        <p>Thoughtful comments spark great discussions</p>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default UserProfilePage;
