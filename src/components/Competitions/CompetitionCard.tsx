import { useState, useEffect } from "react";
import { Competition } from "./types";
import {
  createCompetitionSubmission,
  checkUserSubmission,
} from "@/lib/competitions";
import {
  Calendar,
  Award,
  Users,
  Clock,
  CheckCircle,
  ExternalLink,
} from "lucide-react";
import { ContestSubmissionForm } from "../forms/ContestSubmissionForm";

interface CompetitionCardProps {
  competition: Competition;
  userId: string | null;
}

export default function CompetitionCard({
  competition,
  userId,
}: CompetitionCardProps) {
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [hasSubmitted, setHasSubmitted] = useState<boolean>(false);
  const [loadingSubmission, setLoadingSubmission] = useState<boolean>(true);

  const hasStarted = () => new Date() >= new Date(competition.start_date);
  const hasEnded = () => new Date() > new Date(competition.end_date);
  const isExpiringSoon = () => {
    const endDate = new Date(competition.end_date);
    const now = new Date();
    const timeDiff = endDate.getTime() - now.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
    return daysDiff <= 2 && !hasEnded() && hasStarted();
  };

  // Check submission status for THIS specific competition
  useEffect(() => {
    const checkSubmission = async () => {
      if (!userId) {
        setLoadingSubmission(false);
        return;
      }

      setLoadingSubmission(true);
      try {
        const hasUserSubmitted = await checkUserSubmission(competition.id);
        setHasSubmitted(hasUserSubmitted);
      } catch (error) {
        console.error("Error checking submission:", error);
        setHasSubmitted(false);
      } finally {
        setLoadingSubmission(false);
      }
    };

    checkSubmission();
  }, [competition.id, userId]); // Only re-run when competition.id or userId changes

  const handleSubmitSuccess = async (articleId: string) => {
    if (!userId) return;

    try {
      const { error } = await createCompetitionSubmission({
        competition_id: competition.id,
        article_id: articleId,
      });

      if (!error) {
        setHasSubmitted(true);
        setIsFormOpen(false);
      } else {
        // Handle the error - user might have submitted elsewhere simultaneously
        const hasUserSubmitted = await checkUserSubmission(competition.id);
        setHasSubmitted(hasUserSubmitted);
      }
    } catch (error) {
      console.error("Failed to submit to competition:", error);
      // Re-check submission status in case of error
      const hasUserSubmitted = await checkUserSubmission(competition.id);
      setHasSubmitted(hasUserSubmitted);
    }
  };

  if (loadingSubmission) {
    return (
      <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-4 sm:p-6 lg:p-8">
        <div className="animate-pulse">
          <div className="h-32 sm:h-48 bg-slate-700/50 rounded-xl mb-4 sm:mb-6"></div>
          <div className="h-6 sm:h-8 bg-slate-700/50 rounded-lg w-3/4 mb-3 sm:mb-4"></div>
          <div className="h-4 bg-slate-700/50 rounded w-full mb-2"></div>
          <div className="h-4 bg-slate-700/50 rounded w-5/6 mb-4 sm:mb-6"></div>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="space-y-2">
              <div className="h-4 bg-slate-700/50 rounded w-32"></div>
              <div className="h-4 bg-slate-700/50 rounded w-32"></div>
            </div>
            <div className="h-10 sm:h-12 bg-slate-700/50 rounded-xl w-full sm:w-40"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="group bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl overflow-hidden hover:border-purple-500/30 transition-all duration-500 hover:shadow-2xl hover:shadow-purple-500/10">
      {/* Competition Image */}
      {competition.cover_image_url && (
        <div className="relative overflow-hidden">
          <img
            src={competition.cover_image_url}
            alt={competition.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent"></div>

          {/* Status badge */}
          <div className="absolute top-4 right-4">
            {hasSubmitted ? (
              <div className="flex items-center space-x-2 bg-green-500/20 backdrop-blur-sm border border-green-500/30 text-green-400 px-2 sm:px-3 py-1 sm:py-2 rounded-lg">
                <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="text-xs sm:text-sm font-medium">
                  Submitted
                </span>
              </div>
            ) : !hasStarted() ? (
              <div className="flex items-center space-x-2 bg-purple-500/20 backdrop-blur-sm border border-purple-500/30 text-purple-400 px-2 sm:px-3 py-1 sm:py-2 rounded-lg">
                <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="text-xs sm:text-sm font-medium">
                  Starting Soon
                </span>
              </div>
            ) : isExpiringSoon() ? (
              <div className="flex items-center space-x-2 bg-amber-500/20 backdrop-blur-sm border border-amber-500/30 text-amber-400 px-2 sm:px-3 py-1 sm:py-2 rounded-lg">
                <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="text-xs sm:text-sm font-medium">
                  Ending Soon
                </span>
              </div>
            ) : (
              <div className="flex items-center space-x-2 bg-blue-500/20 backdrop-blur-sm border border-blue-500/30 text-blue-400 px-2 sm:px-3 py-1 sm:py-2 rounded-lg">
                <Users className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="text-xs sm:text-sm font-medium">Active</span>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="p-4 sm:p-6 lg:p-8">
        {/* Competition Title & Description */}
        <div className="mb-4 sm:mb-6">
          <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 sm:mb-3 group-hover:text-purple-400 transition-colors duration-300 break-words">
            {competition.title}
          </h3>
          <p className="text-slate-300 leading-relaxed text-sm sm:text-base">
            {competition.description}
          </p>
        </div>

        {/* Competition Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
          <div className="flex items-center space-x-3 text-slate-400">
            <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-xs sm:text-sm font-medium text-slate-300">
                Start Date
              </p>
              <p className="text-xs sm:text-sm truncate">
                {new Date(competition.start_date).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3 text-slate-400">
            <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-xs sm:text-sm font-medium text-slate-300">
                End Date
              </p>
              <p className="text-xs sm:text-sm truncate">
                {new Date(competition.end_date).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>
        </div>

        {/* Prize Details */}
        {competition.prize_details && (
          <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 rounded-xl p-3 sm:p-4 mb-4 sm:mb-6">
            <div className="flex items-center space-x-3">
              <Award className="w-5 h-5 sm:w-6 sm:h-6 text-amber-400 flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-xs sm:text-sm font-medium text-amber-300 mb-1">
                  Prize
                </p>
                <p className="text-amber-100 font-semibold text-sm sm:text-base break-words">
                  {competition.prize_details}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Action Button */}
        <div className="flex gap-3">
          {userId ? (
            hasStarted() ? (
              <button
                onClick={() => setIsFormOpen(true)}
                disabled={hasSubmitted || loadingSubmission}
                className={`
          flex-1 flex items-center justify-center space-x-2 py-3 sm:py-4 px-4 sm:px-6 rounded-xl font-semibold transition-all duration-300 text-sm sm:text-base
          ${
            hasSubmitted
              ? "bg-green-500/20 border border-green-500/30 text-green-400 cursor-default"
              : "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 hover:scale-105"
          }
          ${loadingSubmission ? "opacity-50 cursor-not-allowed" : ""}
        `}
              >
                {loadingSubmission ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Checking...</span>
                  </>
                ) : hasSubmitted ? (
                  <>
                    <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="hidden sm:inline">Already Submitted</span>
                    <span className="sm:hidden">Submitted</span>
                  </>
                ) : (
                  <>
                    <ExternalLink className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="hidden sm:inline">Submit New Article</span>
                    <span className="sm:hidden">Submit</span>
                  </>
                )}
              </button>
            ) : (
              <button
                className="flex-1 flex items-center justify-center space-x-2 py-3 sm:py-4 px-4 sm:px-6 bg-slate-700/50 border border-slate-600/50 text-slate-400 rounded-xl cursor-not-allowed text-sm sm:text-base"
                disabled
              >
                <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="hidden sm:inline">
                  Submissions open on start date
                </span>
                <span className="sm:hidden">Not Started</span>
              </button>
            )
          ) : (
            <button
              className="flex-1 flex items-center justify-center space-x-2 py-3 sm:py-4 px-4 sm:px-6 bg-slate-700/50 border border-slate-600/50 text-slate-400 rounded-xl cursor-not-allowed text-sm sm:text-base"
              disabled
            >
              <Users className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="hidden sm:inline">Sign in to participate</span>
              <span className="sm:hidden">Sign in</span>
            </button>
          )}
        </div>
      </div>

      {isFormOpen && (
        <ContestSubmissionForm
          competitionId={competition.id}
          onClose={() => setIsFormOpen(false)}
          onSuccess={handleSubmitSuccess}
        />
      )}
    </div>
  );
}
