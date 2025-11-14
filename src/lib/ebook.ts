// lib/supabase/ebook.ts
import { supabase } from '@/lib/supabaseClient';
import { Ebook, EbookWithCount } from '@/types/ebook';

export const getEbooks = async (): Promise<EbookWithCount> => {
  const { data, count, error } = await supabase
    .from('ebooks')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching ebooks:', error);
    throw error;
  }

  return { data: data || [], count: count || 0 };
};

export const getEbookById = async (id: string): Promise<Ebook | null> => {
  const { data, error } = await supabase
    .from('ebooks')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching ebook:', error);
    return null;
  }

  return data;
};