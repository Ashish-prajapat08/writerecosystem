import { motion, AnimatePresence } from "framer-motion";
import { Award, Trophy, Crown, Star} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

interface CompetitionWinnersPopupProps {
  isVisible: boolean;
  onDismiss: () => void;
}

export default function CompetitionWinnersPopup({
  isVisible,
  onDismiss,
}: CompetitionWinnersPopupProps) {
  // Updated to show winners data
  const winners = [
    { name: "Saurabh Ahuja", position: "1st", prize: "₹500" },
    { name: "Puja Bhanu", position: "2nd", prize: "₹300" },
    { name: "Soham Ghosh", position: "3rd", prize: "₹200" },
  ];

  const competition = {
    title: "Contest Topic: The Price We Pay for Corruption",
    resultsDate: "27 Aug",
  };

  const navigate = useNavigate();

  const handleContentClick = () => {
    navigate("/competitions");
    onDismiss();
  };

  const handleDismiss = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDismiss();
  };

  // Function to get appropriate icon for each position
  const getPositionIcon = (position: string) => {
    switch (position) {
      case "1st":
        return <Crown className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-500" />;
      case "2nd":
        return <Trophy className="w-5 h-5 sm:w-6 sm:h-6 text-gray-300" />;
      case "3rd":
        return <Award className="w-5 h-5 sm:w-6 sm:h-6 text-amber-600" />;
      default:
        return <Star className="w-5 h-5 sm:w-6 sm:h-6 text-purple-400" />;
    }
  };

  // Function to get background gradient based on position
  const getPositionBackground = (position: string) => {
    switch (position) {
      case "1st":
        return "bg-gradient-to-r from-yellow-500/20 to-amber-400/10";
      case "2nd":
        return "bg-gradient-to-r from-gray-400/20 to-gray-300/10";
      case "3rd":
        return "bg-gradient-to-r from-amber-700/20 to-amber-600/10";
      default:
        return "bg-gradient-to-r from-purple-500/20 to-purple-400/10";
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Blurred overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            onClick={onDismiss}
          />

          {/* Popup container - responsive positioning and sizing */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-3 md:p-4"
          >
            <div className="relative w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg bg-slate-800 border border-slate-700/50 rounded-xl sm:rounded-2xl overflow-hidden shadow-2xl shadow-purple-500/10">
            

              {/* Content - enhanced responsive layout */}
              <div className="p-3 sm:p-4 md:p-5" onClick={handleContentClick}>
                <div className="flex items-start space-x-2.5 sm:space-x-3 mb-4">
                  <div className="bg-purple-500/10 p-1.5 sm:p-2 rounded-lg flex-shrink-0">
                    <Award className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400" />
                  </div>

                  <div className="flex-1 min-w-0 pr-1 sm:pr-2">
                    <h3 className="text-sm sm:text-base md:text-lg font-bold text-white mb-1 sm:mb-1.5 leading-tight">
                      {competition.title}
                    </h3>
                    <div className="flex items-center text-blue-400 mt-2">
                      <Award className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5" />
                      <span className="text-xs sm:text-sm">
                        Results Announced: {competition.resultsDate}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Winners section */}
                <div className="mb-4">
                  <h4 className="text-xs sm:text-sm font-semibold text-slate-300 mb-3 uppercase tracking-wider flex items-center">
                    <Trophy className="w-4 h-4 mr-2 text-amber-400" />
                    Congratulations to the Winners!
                  </h4>

                  <div className="space-y-3">
                    {winners.map((winner, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`p-3 rounded-lg border border-slate-700/50 ${getPositionBackground(
                          winner.position
                        )}`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="flex-shrink-0">
                              {getPositionIcon(winner.position)}
                            </div>
                            <div>
                              <span className="text-xs font-medium text-slate-300 block">
                                {winner.position} Place
                              </span>
                              <span className="text-sm sm:text-base font-bold text-white">
                                {winner.name}
                              </span>
                            </div>
                          </div>
                          <div className="text-xs font-semibold px-2 py-1 bg-slate-700/50 rounded-md">
                            {winner.prize}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Note section */}
                <div className="bg-slate-700/30 p-3 rounded-lg border border-slate-600/50 mb-4">
                  <p className="text-xs text-slate-300">
                    <span className="font-semibold text-green-400">Note:</span> Winners will be
                    notified through their registered email, where detailed instructions for
                    claiming the prize will be shared shortly. Winners must respond and claim their
                    prize within 3 days of receiving the email.
                  </p>
                </div>

                {/* Action buttons - improved responsive layout */}
                <div className="mt-3 sm:mt-4 flex flex-col sm:flex-row sm:justify-between items-stretch sm:items-center gap-2 sm:gap-3">
                  <button
                    onClick={handleDismiss}
                    className="order-2 sm:order-1 w-full sm:w-auto text-xs sm:text-sm px-3 sm:px-4 py-2 sm:py-2.5 text-slate-400 hover:text-slate-200 transition-colors border border-slate-700/50 hover:border-slate-600/50 rounded-lg font-medium"
                  >
                    Close
                  </button>

                  <Link
                    to="/competitions"
                    onClick={onDismiss}
                    className="order-1 sm:order-2 w-full sm:w-auto text-center px-3 sm:px-5 py-2 sm:py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white rounded-lg text-xs sm:text-sm font-medium transition-all hover:shadow-lg hover:shadow-purple-500/20 hover:scale-105"
                  >
                    View All Competitions
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}