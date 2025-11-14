// types.ts
export interface Competition {
  id: string;
  title: string;
  description: string | null;
  start_date: string;
  end_date: string;
  created_at: string;
  cover_image_url: string | null;
  prize_details: string | null;
}

export interface Article {
  id: string;
  title: string;
  published?: boolean;
}

export interface CompetitionSubmission {
  id: string;
  competition_id: string;
  article_id: string;
  user_id: string;
  submitted_at: string;
  is_winner: boolean;
  article?: {
    id: string;
    title: string;
  };
}

export interface LeaderboardUser {
  user_id: string;
  full_name: string;
  username: string;
  avatar_url: string | null;
  total_submissions: number;
  total_wins: number;
}