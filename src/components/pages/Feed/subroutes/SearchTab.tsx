import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
  Search,
  User,
  FileText,
  Tag,
  Users,
  FilePlus,
  Clock,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabaseClient";
import { useNavigate } from "react-router-dom";
import useDocumentTitle from "@/hooks/useDocumentTitle";

const popularTags = ["Current affairs","Politics","Technology","Geopolitics","Sports","Entertainment"]

export function SearchTab() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<{
    users: any[];
    articles: any[];
    tags: string[];
  }>({ users: [], articles: [], tags: [] });
  const [isSearching, setIsSearching] = useState(false);
  const [searchMode, setSearchMode] = useState<"general" | "tag">("general");

  const handleArticleClick = (articleId: string) => {
    navigate(`/article/${articleId}`);
  };

  const handleUserClick = (username: string) => {
    navigate(`/profile/${username}`);
  };

  const handleTagClick = (tag: string) => {
    setSearchQuery(tag.toLocaleLowerCase());
    setSearchMode("tag");
  };

  useDocumentTitle('Search | Writers Ecosystem');


  // Perform search when query changes
  useEffect(() => {
    const performSearch = async () => {
      if (!searchQuery.trim()) {
        setSearchResults({ users: [], articles: [], tags: [] });
        setSearchMode("general");
        return;
      }

      setIsSearching(true);

      try {
        if (searchMode === "tag") {
          setIsSearching(true);

          try {
            const { data: tagData, error: tagError } = await supabase
              .from("tags")
              .select("id")
              .eq("name", searchQuery)
              .single();

            if (tagError || !tagData) {
              console.error("Tag not found:", tagError);
              setSearchResults({ users: [], articles: [], tags: [] });
              return;
            }

            let articlesQuery = supabase
              .from("articles")
              .select(
                `
                id,
                title,
                content,
                excerpt,
                cover_image_url,
                created_at,
                published,
                published_at,
                user_id,
                profiles:user_id(full_name, username, avatar_url),
                article_tags!inner(
                  tags!inner(
                    name
                  )
                )
              `
              )
              .eq("article_tags.tag_id", tagData.id)
              .limit(10);

            const { data: articles, error: articlesError } =
              await articlesQuery;

            if (articlesError) {
              console.error("Articles search error:", articlesError);
            }

            setSearchResults({
              users: [],
              articles:
                articles?.map((article) => ({
                  ...article,
                  tags:
                    article.article_tags
                      ?.map((at: any) => at.tags?.name)
                      .filter(Boolean) || [],
                })) || [],
              tags: [],
            });
          } catch (error) {
            console.error("Search error:", error);
          } finally {
            setIsSearching(false);
          }
        } else {
          // Search users
          const { data: users } = await supabase
            .from("profiles")
            .select("user_id, full_name, username, avatar_url, bio")
            .or(
              `username.ilike.%${searchQuery}%,full_name.ilike.%${searchQuery}%`
            )
            .limit(5);

          // Search articles with tags and author info
          let articlesQuery = supabase
            .from("articles")
            .select(
              `
              id,
              title,
              content,
              excerpt,
              cover_image_url,
              created_at,
              published,
              published_at,
              user_id,
              profiles!inner(full_name, username, avatar_url),
              article_tags!inner(tags!inner(name))
            `
            )
            .or(`title.ilike.%${searchQuery}%,content.ilike.%${searchQuery}%`)
            .limit(10);

          const { data: articles } = await articlesQuery;

          // Search tags separately
          const { data: tags } = await supabase
            .from("tags")
            .select("name")
            .ilike("name", `%${searchQuery}%`)
            .limit(5);

          setSearchResults({
            users: users || [],
            articles:
              articles?.map((article) => ({
                ...article,
                tags:
                  article.article_tags
                    ?.map((at: any) => at.tags?.name)
                    .filter(Boolean) || [],
              })) || [],
            tags: tags?.map((tag) => tag.name) || [],
          });
        }
      } catch (error) {
        console.error("Search error:", error);
      } finally {
        setIsSearching(false);
      }
    };

    const debounceTimer = setTimeout(() => {
      performSearch();
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchQuery, searchMode, user]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-950 via-gray-900 to-slate-950 overflow-x-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent"></div>
      <div className="absolute top-0 left-1/4 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl"></div>

      <div className="relative z-10 w-full">
        <div className="w-full px-4 py-6 max-w-7xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-8 md:mb-12 w-full">
            <div className="mb-6">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-black mb-4 bg-gradient-to-r from-blue-400 via-blue-300 to-cyan-300 bg-clip-text text-transparent leading-tight px-2">
                Your Creative Space
              </h1>
              <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed px-4">
                Read what stirs you. Write what defines you. Meet who inspires you
              </p>
            </div>

            {/* Hero Stats */}
            <div className="flex flex-wrap justify-center items-center gap-4 md:gap-6 mt-6 px-4">
              <div className="flex items-center gap-2 text-gray-400 text-sm">
                <FileText className="w-4 h-4 text-blue-400 flex-shrink-0" />
                <span className="whitespace-nowrap">1,000+ Articles</span>
              </div>
              <div className="flex items-center gap-2 text-gray-400 text-sm">
                <Users className="w-4 h-4 text-green-400 flex-shrink-0" />
                <span className="whitespace-nowrap">500+ Writers</span>
              </div>
              <div className="flex items-center gap-2 text-gray-400 text-sm">
                <Tag className="w-4 h-4 text-yellow-400 flex-shrink-0" />
                <span className="whitespace-nowrap">100+ Topics</span>
              </div>
            </div>
          </div>

          {/* Enhanced Search Bar */}
          <div className="mb-6 md:mb-8 w-full">
            <div className="relative mb-6 w-full max-w-2xl mx-auto px-4">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl blur opacity-20"></div>
              <div className="relative w-full">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 flex-shrink-0" />
                <input
                  type="text"
                  placeholder="Search users, topics, or articles..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setSearchMode("general");
                  }}
                  className="w-full pl-12 pr-4 py-3 bg-gray-900/80 backdrop-blur-sm border border-gray-700/50 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300"
                />
              </div>
            </div>

            {/* Results Counter */}
            {searchQuery && !isSearching && (
              <div className="text-center px-4">
                <span className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900/40 backdrop-blur-sm border border-gray-700/30 rounded-full text-gray-300 text-sm">
                  <Search className="w-4 h-4 flex-shrink-0" />
                  <span className="whitespace-nowrap">
                    {searchResults.users.length +
                      searchResults.articles.length +
                      searchResults.tags.length}{" "}
                    results found
                  </span>
                </span>
              </div>
            )}
          </div>

          <motion.div
            key="search"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="w-full"
          >
            {isSearching ? (
              <div className="flex flex-col items-center justify-center py-16 px-4">
                <div className="relative">
                  <div className="w-16 h-16 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
                  <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-r-cyan-500 rounded-full animate-spin animate-reverse"></div>
                </div>
                <p className="text-gray-400 mt-4 text-lg text-center">
                  Searching the community...
                </p>
              </div>
            ) : (
              <div className="w-full">
                <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 xl:gap-8 w-full">
                  {/* Main Search Results */}
                  <div className="xl:col-span-3 order-2 xl:order-1 w-full min-w-0">
                    {searchQuery ? (
                      <div className="space-y-6 w-full">
                        <div className="flex items-center gap-3 mb-6 px-4 xl:px-0">
                          <h2 className="text-xl md:text-2xl font-bold text-white min-w-0 break-words">
                            {searchMode === "tag"
                              ? `Articles tagged with "${searchQuery}"`
                              : `Search Results for "${searchQuery}"`}
                          </h2>
                          <div className="flex-1 h-px bg-gradient-to-r from-blue-400/50 to-transparent"></div>
                        </div>

                        {/* Users Results - Only show in general search */}
                        {searchMode === "general" &&
                          searchResults.users.length > 0 && (
                            <div className="mb-8 w-full px-4 xl:px-0">
                              <div className="flex items-center gap-2 mb-4">
                                <User className="w-5 h-5 text-blue-400 flex-shrink-0" />
                                <h3 className="text-lg font-semibold text-white">
                                  Writers & Contributors
                                </h3>
                              </div>
                              <div className="space-y-4 w-full">
                                {searchResults.users.map((userProfile) => (
                                  <div
                                    key={userProfile.user_id}
                                    className="group w-full"
                                  >
                                    <Card
                                      className="bg-gradient-to-br from-gray-900/70 to-gray-800/50 backdrop-blur-sm border border-gray-700/30 hover:border-blue-500/30 p-4 md:p-6 transition-all duration-300 group-hover:transform group-hover:scale-[1.01] group-hover:shadow-xl group-hover:shadow-blue-500/10 cursor-pointer w-full"
                                      onClick={() =>
                                        handleUserClick(userProfile.username)
                                      }
                                    >
                                      <div className="flex items-center gap-4 w-full min-w-0">
                                        {userProfile.avatar_url ? (
                                          <img
                                            src={userProfile.avatar_url}
                                            alt={userProfile.username}
                                            className="w-12 md:w-16 h-12 md:h-16 rounded-full border-2 border-gray-700 group-hover:border-blue-500/50 transition-all duration-300 flex-shrink-0"
                                          />
                                        ) : (
                                          <div className="w-12 md:w-16 h-12 md:h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center font-bold text-white text-lg md:text-xl border-2 border-gray-700 group-hover:border-blue-500/50 transition-all duration-300 flex-shrink-0">
                                            {userProfile.username?.charAt(0) ||
                                              userProfile.full_name?.charAt(
                                                0
                                              ) ||
                                              "U"}
                                          </div>
                                        )}
                                        <div className="flex-1 min-w-0">
                                          <h4 className="font-bold text-white group-hover:text-blue-300 transition-colors text-base md:text-lg mb-1 break-words">
                                            {userProfile.full_name}
                                          </h4>
                                          <p className="text-blue-300 text-sm font-medium mb-2 break-words">
                                            @{userProfile.username}
                                          </p>
                                          {userProfile.bio && (
                                            <p className="text-gray-300 text-sm leading-relaxed break-words">
                                              {userProfile.bio}
                                            </p>
                                          )}
                                        </div>
                                      </div>
                                    </Card>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                        {/* Articles Results */}
                        {searchResults.articles.length > 0 && (
                          <div className="mb-8 w-full px-4 xl:px-0">
                            <div className="flex items-center gap-2 mb-4">
                              <FileText className="w-5 h-5 text-green-400 flex-shrink-0" />
                              <h3 className="text-lg font-semibold text-white">
                                {searchMode === "tag"
                                  ? "Tagged Articles"
                                  : "Articles & Stories"}
                              </h3>
                            </div>
                            <div className="space-y-4 w-full">
                              {searchResults.articles.map((article) => (
                                <div key={article.id} className="group w-full">
                                  <Card
                                    className="bg-gradient-to-br from-gray-900/70 to-gray-800/50 backdrop-blur-sm border border-gray-700/30 hover:border-blue-500/30 p-4 md:p-6 transition-all duration-300 group-hover:transform group-hover:scale-[1.01] group-hover:shadow-xl group-hover:shadow-blue-500/10 cursor-pointer w-full"
                                    onClick={() =>
                                      handleArticleClick(article.id)
                                    }
                                  >
                                    <div className="flex items-start gap-4 w-full min-w-0">
                                      <div className="flex-shrink-0">
                                        {article.profiles?.avatar_url ? (
                                          <img
                                            src={article.profiles.avatar_url}
                                            alt={article.profiles.full_name}
                                            className="w-10 md:w-12 h-10 md:h-12 rounded-full border-2 border-gray-700 group-hover:border-blue-500/50 transition-all duration-300"
                                          />
                                        ) : (
                                          <div className="w-10 md:w-12 h-10 md:h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center font-bold text-white text-sm md:text-base border-2 border-gray-700 group-hover:border-blue-500/50 transition-all duration-300">
                                            {article.profiles?.full_name?.charAt(
                                              0
                                            ) || "A"}
                                          </div>
                                        )}
                                      </div>
                                      <div className="flex-1 min-w-0">
                                        <h4 className="font-bold text-white group-hover:text-blue-300 transition-colors text-base md:text-lg mb-2 leading-tight break-words">
                                          {article.title}
                                        </h4>
                                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-3">
                                          <p className="text-blue-300 text-sm font-medium break-words">
                                            by{" "}
                                            {article.profiles?.full_name ||
                                              "Unknown author"}
                                          </p>
                                          <div className="flex items-center gap-1 text-gray-400 text-sm">
                                            <Clock className="w-3 h-3 flex-shrink-0" />
                                            <span>
                                              {formatDate(article.created_at)}
                                            </span>
                                          </div>
                                        </div>
                                        <p className="text-gray-300 text-sm leading-relaxed mb-4 break-words">
                                          {article.excerpt ||
                                            (article.content.length > 150
                                              ? article.content.substring(
                                                  0,
                                                  150
                                                ) + "..."
                                              : article.content)}
                                        </p>
                                        {article.tags?.length > 0 && (
                                          <div className="flex flex-wrap gap-2">
                                            {article.tags.map((tag: string) => (
                                              <span
                                                key={tag}
                                                className="px-3 py-1 bg-gradient-to-r from-blue-900/40 to-indigo-900/40 text-blue-100 text-xs font-medium rounded-xl border border-blue-700/30 hover:border-blue-600/50 hover:from-blue-800/60 hover:to-indigo-800/60 transition-all duration-300 transform hover:scale-105 cursor-pointer break-words"
                                                onClick={(e) => {
                                                  e.stopPropagation();
                                                  handleTagClick(tag);
                                                }}
                                              >
                                                #{tag}
                                              </span>
                                            ))}
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  </Card>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Tags Results - Only show in general search */}
                        {searchMode === "general" &&
                          searchResults.tags.length > 0 && (
                            <div className="mb-8 w-full px-4 xl:px-0">
                              <div className="flex items-center gap-2 mb-4">
                                <Tag className="w-5 h-5 text-yellow-400 flex-shrink-0" />
                                <h3 className="text-lg font-semibold text-white">
                                  Popular Tags
                                </h3>
                              </div>
                              <div className="flex flex-wrap gap-3">
                                {searchResults.tags.map((tag) => (
                                  <button
                                    key={tag}
                                    onClick={() => handleTagClick(tag)}
                                    className="px-4 py-2 bg-gradient-to-r from-gray-800/60 to-gray-900/60 backdrop-blur-sm hover:from-blue-600 hover:to-cyan-600 text-gray-300 hover:text-white rounded-xl border border-gray-700/30 hover:border-blue-500/50 transition-all duration-300 transform hover:scale-105 font-medium text-sm break-words"
                                  >
                                    #{tag}
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}

                        {searchResults.users.length === 0 &&
                          searchResults.articles.length === 0 &&
                          searchResults.tags.length === 0 && (
                            <div className="text-center py-16 px-4">
                              <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-gray-800 to-gray-900 rounded-full flex items-center justify-center">
                                <Search className="w-10 h-10 text-gray-600" />
                              </div>
                              <h3 className="text-lg font-semibold text-gray-400 mb-2">
                                No results found
                              </h3>
                              <p className="text-gray-500 px-4">
                                Try searching for different keywords or explore
                                popular tags below
                              </p>
                            </div>
                          )}
                      </div>
                    ) : (
                      <div className="space-y-6 w-full px-4 xl:px-0">
                        <div className="flex items-center gap-3 mb-6">
                          <h2 className="text-xl md:text-2xl font-bold text-white">
                            Trending Topics
                          </h2>
                          <div className="flex-1 h-px bg-gradient-to-r from-blue-400/50 to-transparent"></div>
                          <span className="text-gray-400 text-sm font-medium whitespace-nowrap">
                            {popularTags.length} tags
                          </span>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 w-full">
                          {popularTags.map((tag) => (
                            <button
                              key={tag}
                              onClick={() => handleTagClick(tag)}
                              className="group p-4 bg-gradient-to-br from-gray-900/70 to-gray-800/50 backdrop-blur-sm border border-gray-700/30 hover:border-blue-500/30 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-blue-500/20 w-full"
                            >
                              <div className="flex items-center justify-center gap-2 w-full min-w-0">
                                <Tag className="w-4 h-4 text-blue-400 group-hover:text-blue-300 transition-colors flex-shrink-0" />
                                <span className="text-gray-300 group-hover:text-white font-medium transition-colors text-sm break-words min-w-0">
                                  {tag}
                                </span>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Enhanced Right Sidebar */}
                  <div className="xl:col-span-1 order-1 xl:order-2 w-full px-4 xl:px-0">
                    <div className="space-y-6 w-full">
                      {/* Search Insights */}
                      {/* <div className="w-full">
                        <Card className="bg-gradient-to-br from-gray-900/80 to-gray-800/60 backdrop-blur-sm border border-gray-700/30 p-4 md:p-6 w-full">
                          <div className="flex items-center gap-2 mb-4">
                            <TrendingUp className="w-5 h-5 text-blue-400 flex-shrink-0" />
                            <h3 className="text-base md:text-lg font-bold text-white">
                              Search Insights
                            </h3>
                          </div>
                          <div className="space-y-3 w-full">
                            <div className="flex justify-between items-center p-3 bg-gray-800/40 rounded-lg w-full">
                              <span className="text-gray-300 text-sm">
                                Total Articles
                              </span>
                              <span className="font-bold text-blue-400">
                                1,000+
                              </span>
                            </div>
                            <div className="flex justify-between items-center p-3 bg-gray-800/40 rounded-lg w-full">
                              <span className="text-gray-300 text-sm">
                                Active Writers
                              </span>
                              <span className="font-bold text-green-400">
                                500+
                              </span>
                            </div>
                            <div className="flex justify-between items-center p-3 bg-gray-800/40 rounded-lg w-full">
                              <span className="text-gray-300 text-sm">
                                Popular Tags
                              </span>
                              <span className="font-bold text-yellow-400">
                                {popularTags.length}
                              </span>
                            </div>
                            <div className="flex justify-between items-center p-3 bg-gray-800/40 rounded-lg w-full">
                              <span className="text-gray-300 text-sm">
                                Daily Searches
                              </span>
                              <span className="font-bold text-purple-400">
                                2,000+
                              </span>
                            </div>
                          </div>
                        </Card>
                      </div> */}

                      {/* Success Tips */}
                      <div className="hidden lg:block w-full">
                        <Card className="bg-gradient-to-br from-gray-900/80 to-gray-800/60 backdrop-blur-sm border border-gray-700/30 p-4 md:p-6 w-full">
                          <h3 className="text-base md:text-lg font-bold text-white mb-4">
                            🔍 Search Tips
                          </h3>
                          <div className="space-y-3 text-sm text-gray-300 w-full">
                            <div className="p-3 bg-gray-800/40 rounded-lg w-full">
                              <p className="font-medium text-blue-300 mb-1">
                                Use Specific Keywords
                              </p>
                              <p>Target specific topics for better results</p>
                            </div>
                            <div className="p-3 bg-gray-800/40 rounded-lg w-full">
                              <p className="font-medium text-green-300 mb-1">
                                Explore Tags
                              </p>
                              <p>Click on tags to discover related content</p>
                            </div>
                            <div className="p-3 bg-gray-800/40 rounded-lg w-full">
                              <p className="font-medium text-purple-300 mb-1">
                                Follow Writers
                              </p>
                              <p>Connect with authors whose work you enjoy</p>
                            </div>
                          </div>
                        </Card>
                      </div>

                      {/* Post Job CTA */}
                      {user && (
                        <div className="hidden lg:block w-full">
                          <Card className="bg-gradient-to-br from-blue-900/50 via-purple-900/30 to-blue-800/40 backdrop-blur-sm border border-blue-500/20 p-4 md:p-6 w-full">
                            <div className="text-center w-full">
                              <div className="w-12 h-12 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                                <FilePlus className="w-6 h-6 text-white" />
                              </div>
                              <h3 className="text-base md:text-lg font-bold text-white mb-2">
                                Looking to Hire?
                              </h3>
                              <p className="text-gray-300 text-sm mb-4 leading-relaxed">
                                Post a job opportunity and connect with talented
                                writers from our community.
                              </p>
                              <Button
                                className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold shadow-lg shadow-blue-500/25"
                                onClick={() => navigate("/jobs/post")}
                              >
                                Post a Job
                              </Button>
                            </div>
                          </Card>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
