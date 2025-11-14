import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}


// lib/utils.ts
export function generateTextPreview(htmlContent: string, maxLength: number): string {
  if (!htmlContent) return '';
  
  // Remove HTML tags
  const plainText = htmlContent.replace(/<[^>]*>/g, '');
  
  // Trim to max length
  return plainText.length > maxLength 
    ? plainText.substring(0, maxLength).trim() 
    : plainText.trim();
}