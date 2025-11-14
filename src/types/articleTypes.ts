import { Article as ApiArticle } from '@/lib/articles';

// This matches your ArticleCard's expected type
export type CardArticle = {
  id: string;
  user_id: string;
  title: string;
  content: string;
  excerpt: string | null;
  cover_image_url: string | null;
  created_at: string;
  updated_at: string;
  published: boolean;
  published_at: string | null;
  is_private: boolean;
  author: {
    user_id: string;
    username: string;
    full_name: string;
    avatar_url: string | null;
  };
  tags?: {
    id: number;
    name: string;
  }[];
};

// Conversion function
export function adaptToCardArticle(article: ApiArticle): CardArticle {
  return {
    ...article,
    excerpt: article.excerpt ?? null,
    cover_image_url: article.cover_image_url ?? null,
    published_at: article.published_at ?? null,
    is_private: article.is_private ?? false,
    author: article.author ? {
      user_id: article.author.user_id,
      username: article.author.username,
      full_name: article.author.full_name,
      avatar_url: article.author.avatar_url ?? null
    } : {
      user_id: 'unknown',
      username: 'unknown',
      full_name: 'Unknown Author',
      avatar_url: null
    },
    tags: article.tags?.map(tag => ({
      id: tag.id,
      name: tag.name
    }))
  };
}