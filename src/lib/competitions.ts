// lib/competitions.ts
import { supabase } from "./supabaseClient";

export interface CompetitionSubmission {
  id: string;
  competition_id: string;
  article_id: string;
  user_id: string;
  submitted_at: string;
  is_winner: boolean;
}

export const checkUserSubmission = async (competitionId: string): Promise<boolean> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return false;

    const { count, error } = await supabase
      .from("competition_submissions")
      .select("*", { count: "exact" })
      .eq("competition_id", competitionId)
      .eq("user_id", user.id);

    if (error) {
      console.error("Error checking submission:", error);
      return false;
    }

    return (count || 0) > 0;
  } catch (error) {
    console.error("Error in checkUserSubmission:", error);
    return false;
  }
};

export const createCompetitionSubmission = async (submission: {
  competition_id: string;
  article_id: string;
}) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error("User not authenticated");
    }

    // Check if user already submitted to THIS specific competition
    const hasSubmitted = await checkUserSubmission(submission.competition_id);
    if (hasSubmitted) {
      throw new Error("You have already submitted an article to this competition. Only one submission per user is allowed.");
    }

    const { data, error } = await supabase
      .from("competition_submissions")
      .insert({
        ...submission,
        user_id: user.id
      })
      .select()
      .single();

    if (error) {
      if (error.code === '23505') { // Unique violation
        throw new Error("You have already submitted an article to this competition.");
      }
      throw error;
    }
    
    return { data, error: null };
  } catch (error: any) {
    console.error("Competition submission failed:", error);
    return { data: null, error };
  }
};

export const getUserCompetitionSubmissions = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from("competition_submissions")
      .select(`
        *,
        competition:competitions(*)
      `)
      .eq("user_id", userId);

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error getting user submissions:", error);
    return [];
  }
};