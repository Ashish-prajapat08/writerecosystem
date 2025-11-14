import { toast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabaseClient";

interface TagRelationship {
  tags: {
    id: number;
    name: string;
  };
}

// Article types
export interface Article {
  id: string;
  user_id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  cover_image_url?: string;
  is_private?: boolean;
  created_at: string;
  updated_at: string;
  published: boolean;
  published_at?: string;
  author?: {
    user_id: string;
    full_name: string;
    username: string;
    avatar_url?: string;
  };
  tags?: Tag[];
}

export interface Tag {
  id: number;
  name: string;
}

// Article CRUD Operations
export const createArticle = async (article: {
  title: string;
  content: string;
  excerpt?: string;
  cover_image_url?: string;
  tags?: string[];
  published?: boolean;
}): Promise<Article | null> => {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated");

    // Generate initial slug
    const baseSlug = article.title
      ? generateSlug(article.title)
      : `article-${Date.now()}`;
    let slug = baseSlug;
    let attempt = 1;
    const maxAttempts = 5;

    // Check for existing slugs
    while (attempt <= maxAttempts) {
      const { count } = await supabase
        .from("articles")
        .select("*", { count: "exact" })
        .eq("slug", slug);

      if (count === 0) break;

      slug = `${baseSlug}-${attempt}`;
      attempt++;
    }

    if (attempt > maxAttempts) {
      slug = `article-${user.id}-${Date.now()}`;
    }

    // Create the article
    const { data, error } = await supabase
      .from("articles")
      .insert({
        user_id: user.id,
        title: article.title,
        slug,
        content: article.content,
        excerpt: article.excerpt,
        cover_image_url: article.cover_image_url,
        published: article.published || false,
        published_at: article.published ? new Date().toISOString() : null,
      })
      .select(
        `
        *,
        author:profiles(user_id, full_name, username, avatar_url)
      `
      )
      .single();

    if (error) throw error;

    // Add tags if provided - handle this more gracefully
    if (article.tags && article.tags.length > 0) {
      // Normalize tag names before adding them
      const normalizedTags = article.tags.map((tag) =>
        tag.toLowerCase().trim()
      );
      try {
        await addTagsToArticle(data.id, normalizedTags);
        // Return the article with tags
        return await getArticleById(data.id);
      } catch (tagError) {
        console.error("Error adding tags, but article was created:", tagError);
        // Even if tags fail, return the article without tags
        return data;
      }
    }

    return data;
  } catch (error: any) {
    console.error("Error creating article:", error);
    toast({
      title: "Error creating article",
      description: error.message,
      variant: "destructive",
    });
    return null;
  }
};

export const updateArticle = async (
  articleId: string,
  updates: {
    title?: string;
    content?: string;
    excerpt?: string;
    cover_image_url?: string;
    tags?: string[];
    published?: boolean;
  }
): Promise<Article | null> => {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated");

    // Verify the user owns the article
    const { data: existingArticle, error: fetchError } = await supabase
      .from("articles")
      .select("user_id")
      .eq("id", articleId)
      .single();

    if (fetchError) throw fetchError;
    if (existingArticle.user_id !== user.id) {
      throw new Error("You can only update your own articles");
    }

    // Prepare update data (excluding tags)
    const updateData: any = {
      ...updates,
      updated_at: new Date().toISOString(),
    };

    // Remove tags from updateData since they're handled separately
    delete updateData.tags;

    // Generate new slug if title changed
    if (updates.title) {
      updateData.slug = generateSlug(updates.title);

      // Verify slug is unique (excluding current article)
      const { count } = await supabase
        .from("articles")
        .select("*", { count: "exact" })
        .eq("slug", updateData.slug)
        .neq("id", articleId);

      if (count && count > 0) {
        throw new Error("Generated slug already exists");
      }
    }

    // Update article fields (excluding tags)
    const { error } = await supabase
      .from("articles")
      .update(updateData)
      .eq("id", articleId)
      .select(
        `
        *,
        author:profiles(user_id, full_name, username, avatar_url)
      `
      )
      .single();

    if (error) throw error;

    // Handle tags separately if provided
    // In the updateArticle function, normalize tags before processing
    if (updates.tags) {
      // Normalize tag names before updating them
      const normalizedTags = updates.tags.map((tag) =>
        tag.toLowerCase().trim()
      );

      // First remove all existing tags for this article
      await supabase.from("article_tags").delete().eq("article_id", articleId);

      // Then add new tags if any were provided
      if (normalizedTags.length > 0) {
        await addTagsToArticle(articleId, normalizedTags);
      }
    }

    // Return the updated article with tags
    return await getArticleById(articleId);
  } catch (error: any) {
    toast({
      title: "Error updating article",
      description: error.message,
      variant: "destructive",
    });
    return null;
  }
};

// Enhanced deleteArticle function
export const deleteArticle = async (articleId: string): Promise<boolean> => {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated");

    // Verify the user owns the article
    const { data: existingArticle, error: fetchError } = await supabase
      .from("articles")
      .select("user_id, cover_image_url")
      .eq("id", articleId)
      .single();

    if (fetchError) throw fetchError;
    if (existingArticle.user_id !== user.id) {
      throw new Error("You can only delete your own articles");
    }

    // Delete associated image if exists
    if (existingArticle.cover_image_url) {
      const imagePath = existingArticle.cover_image_url.split("/").pop();
      await supabase.storage.from("article-images").remove([imagePath]);
    }

    // Delete the article (foreign key constraints will handle related data)
    const { error } = await supabase
      .from("articles")
      .delete()
      .eq("id", articleId);

    if (error) throw error;
    return true;
  } catch (error: any) {
    toast({
      title: "Error deleting article",
      description: error.message,
      variant: "destructive",
    });
    return false;
  }
};

// Article fetching
export const getArticleById = async (id: string): Promise<Article | null> => {
  try {
    const { data, error } = await supabase
      .from("articles")
      .select(
        `
        *,
        author:profiles(user_id, full_name, username, avatar_url),
        tags:article_tags(tags(name, id))
      `
      )
      .eq("id", id)
      .single();

    if (error) throw error;
    return transformArticleData(data);
  } catch (error) {
    console.error("Error fetching article:", error);
    return null;
  }
};

export const getArticleBySlug = async (
  slug: string
): Promise<Article | null> => {
  try {
    const { data, error } = await supabase
      .from("articles")
      .select(
        `
        *,
        author:profiles(user_id, full_name, username, avatar_url),
        tags:article_tags(tags(name, id))
      `
      )
      .eq("slug", slug)
      .single();

    if (error) throw error;
    return transformArticleData(data);
  } catch (error) {
    console.error("Error fetching article:", error);
    return null;
  }
};

export const getArticles = async (
  options: {
    page?: number;
    limit?: number;
    userId?: string;
    userIds?: string[];
    tag?: string;
    publishedOnly?: boolean;
  } = {}
): Promise<Article[]> => {
  try {
    const page = options.page || 1;
    const limit = options.limit || 10;
    const offset = (page - 1) * limit;

    // Get filtered article IDs if tag is specified
    let filteredArticleIds: string[] | null = null;

    if (options.tag) {
      const { data: tagData, error: tagError } = await supabase
        .from("tags")
        .select("id")
        .ilike("name", options.tag)
        .single();

      if (tagError) throw tagError;
      if (!tagData?.id) return [];

      const { data: articleTags, error: atError } = await supabase
        .from("article_tags")
        .select("article_id")
        .eq("tag_id", tagData.id);

      if (atError) throw atError;
      if (!articleTags?.length) return [];

      filteredArticleIds = articleTags.map((at) => at.article_id);
    }

    // Build main query
    let query = supabase
      .from("articles")
      .select(
        `
        *,
        author:profiles(user_id, full_name, username, avatar_url),
        tags:article_tags(tags(name, id))
      `
      )
      .order("created_at", { ascending: false });

    if (options.userId) {
      query = query.eq("user_id", options.userId);
    } else if (options.userIds && options.userIds.length > 0) {
      query = query.in("user_id", options.userIds);
    }

    if (filteredArticleIds) {
      query = query.in("id", filteredArticleIds);
    }

    query = query.range(offset, offset + limit - 1);

    if (options.publishedOnly !== false) {
      query = query.eq("published", true);
    }

    if (options.userId) {
      query = query.eq("user_id", options.userId);
    }

    const { data, error } = await query;

    if (error) throw error;

    // Type-safe transformation
    return data.map((article) => ({
      ...article,
      tags:
        article.tags
          ?.map((tagRel: TagRelationship) => tagRel.tags)
          .filter(Boolean) || [],
    }));
  } catch (error) {
    console.error("Error fetching articles:", error);
    return [];
  }
};
// Tags
export const addTagsToArticle = async (
  articleId: string,
  tagNames: string[]
): Promise<void> => {
  try {
    // Normalize all tag names to lowercase
    const normalizedTagNames = tagNames.map((name) =>
      name.toLowerCase().trim()
    );

    // First ensure all tags exist
    const { data: existingTags } = await supabase
      .from("tags")
      .select("name, id")
      .in("name", normalizedTagNames);

    const existingTagNames = existingTags?.map((tag) => tag.name) || [];
    const newTags = normalizedTagNames.filter(
      (name) => !existingTagNames.includes(name)
    );

    // Insert new tags (all in lowercase)
    if (newTags.length > 0) {
      const { error: insertError } = await supabase
        .from("tags")
        .insert(newTags.map((name) => ({ name })));

      if (insertError) throw insertError;
    }

    // Get all tag IDs (using normalized names)
    const { data: allTags } = await supabase
      .from("tags")
      .select("id, name")
      .in("name", normalizedTagNames);

    if (!allTags) throw new Error("Failed to retrieve tags");

    // Create article-tag relationships
    const { error: relationError } = await supabase.from("article_tags").insert(
      allTags.map((tag) => ({
        article_id: articleId,
        tag_id: tag.id,
      }))
    );

    if (relationError) throw relationError;
  } catch (error: any) {
    console.error("Error adding tags:", error);
    throw error;
  }
};

export const getPopularTags = async (limit: number = 10): Promise<Tag[]> => {
  try {
    const { data, error } = await supabase
      .from("tags")
      .select("id, name, article_tags(count)")
      .order("article_tags->count", { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error fetching popular tags:", error);
    return [];
  }
};

// Helper function to transform article data
const transformArticleData = (data: any): Article => {
  return {
    ...data,
    tags: data.tags?.map((at: any) => at.tags) || [],
  };
};

//
export const validateArticle = (article: {
  title: string;
  content: string;
  tags?: string[];
}): { valid: boolean; errors: Record<string, string> } => {
  const errors: Record<string, string> = {};

  if (!article.title || article.title.length < 10) {
    errors.title = "Title must be at least 10 characters";
  }

  if (!article.content || article.content.length < 100) {
    errors.content = "Content must be at least 100 characters";
  }

  if (article.tags && article.tags.length > 5) {
    errors.tags = "Maximum 5 tags allowed";
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
};

//
export const uploadArticleImage = async (
  file: File
): Promise<string | null> => {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated");

    const fileExt = file.name.split(".").pop();
    const fileName = `${user.id}-${Date.now()}.${fileExt}`;
    const filePath = `article-images/${fileName}`;

    const { data, error } = await supabase.storage
      .from("article-images")
      .upload(filePath, file);

    if (error) throw error;

    const {
      data: { publicUrl },
    } = supabase.storage.from("article-images").getPublicUrl(data.path);

    return publicUrl;
  } catch (error) {
    console.error("Error uploading image:", error);
    return null;
  }
};

// Utility function to generate a slug from the article title
const generateSlug = (title: string): string => {
  if (!title) return `article-${Date.now()}`;

  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, "") // Remove special chars
    .replace(/[\s]+/g, "-") // Replace spaces with -
    .replace(/[-]+/g, "-") // Replace multiple - with single -
    .substring(0, 60) // Limit length
    .replace(/-$/, ""); // Remove trailing -
};

// Utility function to normalize tag names
export const normalizeTagName = (tagName: string): string => {
  return tagName.toLowerCase().trim();
};

// Utility function to check if a tag exists (case-insensitive)
export const tagExists = async (tagName: string): Promise<boolean> => {
  const normalizedName = normalizeTagName(tagName);

  const { data, error } = await supabase
    .from("tags")
    .select("id")
    .ilike("name", normalizedName)
    .single();

  return !!data && !error;
};

// Utility function to get a tag by name (case-insensitive)
export const getTagByName = async (tagName: string): Promise<Tag | null> => {
  const normalizedName = normalizeTagName(tagName);

  const { data, error } = await supabase
    .from("tags")
    .select("*")
    .ilike("name", normalizedName)
    .single();

  if (error) {
    console.error("Error fetching tag:", error);
    return null;
  }

  return data;
};
