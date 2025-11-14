import { useEffect, useState } from "react";
import { LeaderboardUser } from "./types";
import { supabase } from "@/lib/supabaseClient";
import {
  Trophy,
  Medal,
  Award,
  Target,
  Crown,
  Star,
  Zap,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLeaderboard = async () => {
      const { data } = await supabase
        .from("leaderboard_view")
        .select("*")
        .order("total_wins", { ascending: false });
      setLeaderboard(data || []);
      setLoading(false);
    };

    fetchLeaderboard();
  }, []);

  const getRankIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Crown className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-400" />;
      case 1:
        return <Medal className="w-5 h-5 sm:w-6 sm:h-6 text-gray-300" />;
      case 2:
        return <Award className="w-5 h-5 sm:w-6 sm:h-6 text-amber-600" />;
      default:
        return (
          <span className="text-slate-400 font-bold text-base sm:text-lg">
            #{index + 1}
          </span>
        );
    }
  };

  const getRankBadgeStyle = (index: number) => {
    switch (index) {
      case 0:
        return "bg-gradient-to-r from-yellow-500/20 to-amber-500/20 border-yellow-500/30 text-yellow-400";
      case 1:
        return "bg-gradient-to-r from-gray-400/20 to-slate-400/20 border-gray-400/30 text-gray-300";
      case 2:
        return "bg-gradient-to-r from-amber-600/20 to-orange-600/20 border-amber-600/30 text-amber-500";
      default:
        return "bg-slate-700/50 border-slate-600/50 text-slate-400";
    }
  };

  const hasResults = () => {
    if (leaderboard.length === 0) return false;
    const totalWins = leaderboard.reduce((sum, user) => sum + user.total_wins, 0);
    const totalSubmissions = leaderboard.reduce((sum, user) => sum + user.total_submissions, 0);
    return totalWins > 0 || totalSubmissions > 0;
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(10)].map((_, i) => (
          <div
            key={i}
            className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-4 sm:p-6"
          >
            <div className="animate-pulse flex items-center space-x-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-slate-700/50 rounded-full flex-shrink-0"></div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-slate-700/50 rounded-full flex-shrink-0"></div>
              <div className="flex-1 space-y-2 min-w-0">
                <div className="h-4 sm:h-5 bg-slate-700/50 rounded w-1/3"></div>
                <div className="h-3 sm:h-4 bg-slate-700/50 rounded w-1/4"></div>
              </div>
              <div className="text-right space-y-2 flex-shrink-0">
                <div className="h-4 sm:h-5 bg-slate-700/50 rounded w-12 sm:w-16"></div>
                <div className="h-3 sm:h-4 bg-slate-700/50 rounded w-16 sm:w-20"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!hasResults()) {
    return (
      <div className="text-center py-12 sm:py-16">
        <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8 sm:p-12 max-w-md mx-auto">
          <Trophy className="w-12 h-12 sm:w-16 sm:h-16 text-slate-500 mx-auto mb-4" />
          <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">
            No Competitions Yet
          </h3>
          <p className="text-slate-400 text-sm sm:text-base">
            The leaderboard will appear once competitions are completed and results are in.
          </p>
        </div>
      </div>
    );
  }

  const handleProfileClick = (username: string) => {
    navigate(`/profile/${username}`);
  };

  const totalSubmissions = leaderboard.reduce((sum, user) => sum + user.total_submissions, 0);
  const totalWins = leaderboard.reduce((sum, user) => sum + user.total_wins, 0);

  return (
    <div className="space-y-6 w-full">
      {/* Header Stats - Only show if there are actual numbers to display */}
      {(totalSubmissions > 0 || totalWins > 0) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
          {totalSubmissions > 0 && (
            <div className="bg-gradient-to-r from-green-600/20 to-emerald-600/20 backdrop-blur-sm border border-green-500/30 rounded-2xl p-4 sm:p-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Target className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <div className="min-w-0">
                  <p className="text-xl sm:text-2xl font-bold text-white">
                    {totalSubmissions}
                  </p>
                  <p className="text-green-300 text-xs sm:text-sm">
                    Total Submissions
                  </p>
                </div>
              </div>
            </div>
          )}

          {totalWins > 0 && (
            <div className="bg-gradient-to-r from-amber-600/20 to-orange-600/20 backdrop-blur-sm border border-amber-500/30 rounded-2xl p-4 sm:p-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-amber-600 to-orange-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Trophy className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <div className="min-w-0">
                  <p className="text-xl sm:text-2xl font-bold text-white">
                    {totalWins}
                  </p>
                  <p className="text-amber-300 text-xs sm:text-sm">Total Wins</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Top 3 Podium - Only show if there are at least 3 users with wins */}
      {leaderboard.filter(user => user.total_wins > 0).length >= 3 && (
        <div className="mb-8 sm:mb-12 hidden lg:block">
          <div className="text-center mb-6 sm:mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-2 flex items-center justify-center space-x-2">
              <Star className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-400" />
              <span>Top Champions</span>
              <Star className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-400" />
            </h2>
            <p className="text-slate-400 text-sm sm:text-base">
              Our most accomplished writers
            </p>
          </div>

          <div className="flex justify-center items-end space-x-2 sm:space-x-4 max-w-5xl mx-auto">
            {/* Second Place */}
            <div className="flex flex-col items-center">
              <div className="bg-gradient-to-r from-gray-400/20 to-slate-400/20 backdrop-blur-sm border border-gray-400/30 rounded-2xl p-4 sm:p-6 w-48 sm:w-64 mb-4 hover:scale-105 transition-transform duration-300">
                <div className="text-center">
                  <div className="relative mb-3 sm:mb-4">
                    {leaderboard[1].avatar_url ? (
                      <img
                        src={leaderboard[1].avatar_url}
                        alt={leaderboard[1].full_name}
                        className="w-12 h-12 sm:w-16 sm:h-16 rounded-full mx-auto border-4 border-gray-400/50"
                      />
                    ) : (
                      <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-gray-400 to-slate-400 rounded-full mx-auto flex items-center justify-center">
                        <span className="text-white font-bold text-lg sm:text-xl">
                          {leaderboard[1].full_name?.charAt(0) || "U"}
                        </span>
                      </div>
                    )}
                    <div className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-gray-400 to-slate-400 rounded-full flex items-center justify-center">
                      <Medal className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                    </div>
                  </div>
                  <h3 className="font-bold text-white text-sm sm:text-lg mb-1 truncate">
                    {leaderboard[1].full_name}
                  </h3>
                  <p className="text-gray-300 text-xs sm:text-sm mb-2 sm:mb-3 truncate">
                    @{leaderboard[1].username}
                  </p>
                  <div className="flex justify-center space-x-3 sm:space-x-4 text-xs sm:text-sm">
                    <div className="text-center">
                      <p className="font-bold text-gray-300">
                        {leaderboard[1].total_wins}
                      </p>
                      <p className="text-gray-400">Wins</p>
                    </div>
                    <div className="text-center">
                      <p className="font-bold text-gray-300">
                        {leaderboard[1].total_submissions}
                      </p>
                      <p className="text-gray-400">Submissions</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="w-24 h-16 sm:w-32 sm:h-20 bg-gradient-to-t from-gray-400/30 to-gray-400/10 rounded-t-xl border-t-4 border-gray-400/50"></div>
            </div>

            {/* First Place */}
            <div className="flex flex-col items-center">
              <div className="bg-gradient-to-r from-yellow-500/20 to-amber-500/20 backdrop-blur-sm border border-yellow-500/30 rounded-2xl p-6 sm:p-8 w-56 sm:w-72 mb-4 hover:scale-105 transition-transform duration-300 shadow-2xl shadow-yellow-500/20">
                <div className="text-center">
                  <div className="relative mb-4 sm:mb-6">
                    {leaderboard[0].avatar_url ? (
                      <img
                        src={leaderboard[0].avatar_url}
                        alt={leaderboard[0].full_name}
                        className="w-16 h-16 sm:w-20 sm:h-20 rounded-full mx-auto border-4 border-yellow-400/50"
                      />
                    ) : (
                      <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-yellow-500 to-amber-500 rounded-full mx-auto flex items-center justify-center">
                        <span className="text-white font-bold text-xl sm:text-2xl">
                          {leaderboard[0].full_name?.charAt(0) || "U"}
                        </span>
                      </div>
                    )}
                    <div className="absolute -top-2 -right-2 sm:-top-3 sm:-right-3 w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-yellow-500 to-amber-500 rounded-full flex items-center justify-center">
                      <Crown className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                    </div>
                  </div>
                  <h3 className="font-bold text-white text-lg sm:text-xl mb-1 sm:mb-2 truncate">
                    {leaderboard[0].full_name}
                  </h3>
                  <p className="text-yellow-300 text-sm mb-3 sm:mb-4 truncate">
                    @{leaderboard[0].username}
                  </p>
                  <div className="flex justify-center space-x-4 sm:space-x-6">
                    <div className="text-center">
                      <p className="font-bold text-yellow-400 text-base sm:text-lg">
                        {leaderboard[0].total_wins}
                      </p>
                      <p className="text-yellow-300 text-xs sm:text-sm">Wins</p>
                    </div>
                    <div className="text-center">
                      <p className="font-bold text-yellow-400 text-base sm:text-lg">
                        {leaderboard[0].total_submissions}
                      </p>
                      <p className="text-yellow-300 text-xs sm:text-sm">
                        Submissions
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="w-28 h-20 sm:w-36 sm:h-28 bg-gradient-to-t from-yellow-500/30 to-yellow-500/10 rounded-t-xl border-t-4 border-yellow-500/50"></div>
            </div>

            {/* Third Place */}
            <div className="flex flex-col items-center">
              <div className="bg-gradient-to-r from-amber-600/20 to-orange-600/20 backdrop-blur-sm border border-amber-600/30 rounded-2xl p-4 sm:p-6 w-48 sm:w-64 mb-4 hover:scale-105 transition-transform duration-300">
                <div className="text-center">
                  <div className="relative mb-3 sm:mb-4">
                    {leaderboard[2].avatar_url ? (
                      <img
                        src={leaderboard[2].avatar_url}
                        alt={leaderboard[2].full_name}
                        className="w-12 h-12 sm:w-16 sm:h-16 rounded-full mx-auto border-4 border-amber-600/50"
                      />
                    ) : (
                      <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-amber-600 to-orange-600 rounded-full mx-auto flex items-center justify-center">
                        <span className="text-white font-bold text-lg sm:text-xl">
                          {leaderboard[2].full_name?.charAt(0) || "U"}
                        </span>
                      </div>
                    )}
                    <div className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-amber-600 to-orange-600 rounded-full flex items-center justify-center">
                      <Award className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                    </div>
                  </div>
                  <h3 className="font-bold text-white text-sm sm:text-lg mb-1 truncate">
                    {leaderboard[2].full_name}
                  </h3>
                  <p className="text-amber-300 text-xs sm:text-sm mb-2 sm:mb-3 truncate">
                    @{leaderboard[2].username}
                  </p>
                  <div className="flex justify-center space-x-3 sm:space-x-4 text-xs sm:text-sm">
                    <div className="text-center">
                      <p className="font-bold text-amber-500">
                        {leaderboard[2].total_wins}
                      </p>
                      <p className="text-amber-400">Wins</p>
                    </div>
                    <div className="text-center">
                      <p className="font-bold text-amber-500">
                        {leaderboard[2].total_submissions}
                      </p>
                      <p className="text-amber-400">Submissions</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="w-20 h-12 sm:w-28 sm:h-16 bg-gradient-to-t from-amber-600/30 to-amber-600/10 rounded-t-xl border-t-4 border-amber-600/50"></div>
            </div>
          </div>
        </div>
      )}

      {/* Full Leaderboard - Only show users with at least one win or submission */}
      <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 border-b border-slate-700/50 px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex items-center space-x-3">
            <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-purple-400" />
            <h2 className="text-lg sm:text-2xl font-bold text-white">
              Complete Rankings
            </h2>
          </div>
          <p className="text-slate-400 mt-1 text-sm sm:text-base">
            All writers ranked by competition wins
          </p>
        </div>

        <div className="divide-y divide-slate-700/50">
          {leaderboard
            .filter(user => user.total_wins > 0 || user.total_submissions > 0)
            .map((user, index) => (
              <div
                key={user.user_id}
                onClick={() => handleProfileClick(user.username)}
                className="cursor-pointer group px-4 sm:px-6 lg:px-8 py-4 sm:py-6 flex items-center hover:bg-slate-700/30 transition-all duration-300"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {/* Rank Badge */}
                <div
                  className={`
                  flex-shrink-0 mr-3 sm:mr-6 w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center border backdrop-blur-sm
                  ${getRankBadgeStyle(index)}
                `}
                >
                  {getRankIcon(index)}
                </div>

                {/* User Info */}
                <div className="flex items-center flex-1 min-w-0">
                  <div className="relative mr-3 sm:mr-4">
                    {user.avatar_url ? (
                      <img
                        src={user.avatar_url}
                        alt={user.full_name}
                        className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-slate-600/50 group-hover:border-purple-500/50 transition-colors duration-300"
                      />
                    ) : (
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-slate-600 to-slate-700 rounded-full flex items-center justify-center border-2 border-slate-600/50 group-hover:border-purple-500/50 transition-colors duration-300">
                        <span className="text-white font-semibold text-sm sm:text-base">
                          {user.full_name?.charAt(0) || "U"}
                        </span>
                      </div>
                    )}
                    {index < 3 && (
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 sm:w-6 sm:h-6 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
                        <Star className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white" />
                      </div>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-white text-sm sm:text-lg group-hover:text-purple-400 transition-colors duration-300 truncate">
                      {user.full_name}
                    </h3>
                    <p className="text-slate-400 text-xs sm:text-sm truncate">
                      @{user.username}
                    </p>
                  </div>
                </div>

                {/* Stats */}
                <div className="text-right flex-shrink-0">
                  <div className="flex items-center space-x-3 sm:space-x-6">
                    <div className="text-center">
                      <p className="font-bold text-white text-sm sm:text-lg">
                        {user.total_wins}
                      </p>
                      <p className="text-slate-400 text-xs sm:text-sm">Wins</p>
                    </div>
                    <div className="text-center hidden sm:block">
                      <p className="font-medium text-slate-300">
                        {user.total_submissions}
                      </p>
                      <p className="text-slate-400 text-sm">Submissions</p>
                    </div>
                    <div className="text-center hidden lg:block">
                      <p className="font-medium text-purple-400">
                        {user.total_submissions > 0
                          ? Math.round(
                              (user.total_wins / user.total_submissions) * 100
                            )
                          : 0}
                        %
                      </p>
                      <p className="text-slate-400 text-sm">Win Rate</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}