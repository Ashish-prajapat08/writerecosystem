// types/ebook.ts
export interface Ebook {
  id: string;
  created_at: string;
  title: string;
  author: string;
  cover_url: string;
  rating: number;
  price: string;
  form_url: string;
  genre: string;
  description: string;
  pages: number;
  read_time: string;
  chapters: string[];
  publish_date: string;
  language: string; 
  featured?: boolean;
}

export interface EbookWithCount {
  data: Ebook[];
  count: number;
}