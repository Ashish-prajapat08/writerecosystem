import { useState, useEffect } from "react";
import { Competition } from "./types";
import { supabase } from "@/lib/supabaseClient";
import CompetitionCard from "./CompetitionCard";
import { Trophy } from "lucide-react";

interface CompetitionListProps {
  userId: string | null;
}

export default function CompetitionList({ userId }: CompetitionListProps) {
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchCompetitions = async () => {
      const { data, error } = await supabase
        .from("competitions")
        .select("*")
        .gte("end_date", new Date().toISOString())
        .order("created_at", { ascending: false });

      if (!error) setCompetitions(data || []);
      setLoading(false);
    };

    fetchCompetitions();
  }, []);
  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4"
          >
            <div className="animate-pulse space-y-3">
              <div className="h-5 bg-slate-700/50 rounded w-3/4"></div>
              <div className="h-3 bg-slate-700/50 rounded w-full"></div>
              <div className="h-3 bg-slate-700/50 rounded w-5/6"></div>
              <div className="h-8 bg-slate-700/50 rounded-xl mt-2"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Competitions grid - simplified without any filters */}
      <div className="space-y-6 sm:space-y-8">
        {competitions.length === 0 ? (
          <div className="text-center py-12 sm:py-16">
            <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8 sm:p-12 max-w-md mx-auto">
              <Trophy className="w-12 h-12 sm:w-16 sm:h-16 text-slate-500 mx-auto mb-4" />
              <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">
                No active competitions
              </h3>
              <p className="text-slate-400 text-sm sm:text-base">
                Check back later for new competitions!
              </p>
            </div>
          </div>
        ) : (
          competitions.map((competition, index) => (
            <div
              key={competition.id}
              className="animate-fade-in-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CompetitionCard competition={competition} userId={userId} />
            </div>
          ))
        )}
      </div>
    </div>
  );
}
