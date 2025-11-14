import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import CompetitionList from "./CompetitionList";
import Leaderboard from "./Leaderboard";
import { Trophy, Users } from "lucide-react";
import useDocumentTitle from "@/hooks/useDocumentTitle";

export default function CompetitionsPage() {
  const [activeTab, setActiveTab] = useState<"competitions" | "leaderboard">(
    "competitions"
  );
  const [userId, setUserId] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const getUserId = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUserId(user?.id || null);
    };
    getUserId();
  }, []);

  const tabs = [
    {
      id: "competitions" as const,
      label: "Current Competitions",
      icon: Trophy,
      count: null,
    },
    {
      id: "leaderboard" as const,
      label: "Leaderboard",
      icon: Users,
      count: null,
    },
  ];

  useDocumentTitle("Contests | Writers Ecosystem");

  return (
    <div
      className={`min-h-screen bg-slate-950 ${
        !isMobile
          ? "bg-gradient-to-br from-slate-950 via-purple-950/20 to-slate-950"
          : ""
      }`}
    >
      {!isMobile && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"></div>
        </div>
      )}

      <div className="relative z-10">
        {/* Header */}
        <div className="backdrop-blur-xl">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
            <div className="text-center mb-6 sm:mb-8">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2 sm:mb-3 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                Writing Competitions
              </h1>
              <p className="text-slate-400 text-sm sm:text-base lg:text-lg max-w-2xl mx-auto px-4">
                Showcase your writing skills and compete with writers from
                around the world
              </p>
            </div>

            {/* Guidelines Section - Improved Responsive Design */}
            <div className="mb-8 bg-slate-800/50 backdrop-blur-md rounded-xl border border-slate-700/70 p-5 sm:p-6 overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-blue-500/5 to-slate-900/30 pointer-events-none"></div>

              <div className="relative z-10">
                <div className="flex items-center mb-4 justify-center">
                  <svg
                    className="w-6 h-6 mr-2 text-purple-400 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                  <h3 className="text-xl font-bold text-white">
                    Competition Rules & Guidelines
                  </h3>
                </div>

                <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                  {[
                    "Only original work is allowed — plagiarism will result in immediate disqualification",
                    "Strictly follow the assigned topic",
                    "Word count must be between 300-500 words",
                    "Only one entry per participant is allowed",
                    "No hate speech, discriminatory remarks, or explicit adult content",
                    "Once submitted, entries cannot be edited or replaced",
                  ].map((rule, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-purple-400 font-bold mr-2 mt-0.5">
                        •
                      </span>
                      <span className="text-slate-200 text-sm sm:text-base">
                        {rule}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Tab Navigation */}
            <div className="flex justify-center">
              <div className="bg-slate-800/50 backdrop-blur-sm p-1 rounded-xl border border-slate-700/50 w-full max-w-md">
                <div className="grid grid-cols-2 gap-1">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;

                    return (
                      <button
                        key={tab.id}
                        className={`
                          relative flex items-center justify-center space-x-2 px-3 sm:px-6 py-2 sm:py-3 rounded-lg font-medium transition-all duration-300 text-sm sm:text-base
                          ${
                            isActive
                              ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg shadow-purple-500/25"
                              : "text-slate-400 hover:text-white hover:bg-slate-700/50"
                          }
                        `}
                        onClick={() => setActiveTab(tab.id)}
                      >
                        <Icon className="w-4 h-4" />
                        <span className="hidden sm:inline">{tab.label}</span>
                        <span className="sm:hidden">
                          {tab.id === "competitions"
                            ? "Competitions"
                            : "Leaderboard"}
                        </span>
                        {isActive && (
                          <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg blur opacity-50 -z-10"></div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {activeTab === "competitions" ? (
            <CompetitionList userId={userId} />
          ) : (
            <Leaderboard />
          )}
        </div>
      </div>
    </div>
  );
}
