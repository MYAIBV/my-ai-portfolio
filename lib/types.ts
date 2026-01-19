export type Category = 'voice' | 'chat' | 'image' | 'video' | 'automation' | 'other';

export const CATEGORIES: Category[] = ['voice', 'chat', 'image', 'video', 'automation', 'other'];

export interface ShowcaseItem {
  id: string;
  title: string;
  slug: string;
  description: string;
  // Multilingual fields
  title_nl: string;
  title_en: string;
  slug_nl: string;
  slug_en: string;
  description_nl: string;
  description_en: string;
  // Other fields
  image_url: string;
  app_url: string;
  categories: Category[];
  keywords: string[];
  is_public: boolean;
  created_by: string;
  created_at: string;
  updated_at: string;
}

// Helper type for supported locales
export type SupportedLocale = 'nl' | 'en';

// Helper to get localized content from a ShowcaseItem
export function getLocalizedContent(item: ShowcaseItem, locale: SupportedLocale) {
  return {
    title: locale === 'nl' ? item.title_nl : item.title_en,
    slug: locale === 'nl' ? item.slug_nl : item.slug_en,
    description: locale === 'nl' ? item.description_nl : item.description_en,
  };
}

export interface User {
  email: string;
  passwordHash: string;
  name: string;
  createdAt: string;
}

export interface JWTPayload {
  email: string;
  name: string;
  iat: number;
  exp: number;
}

export interface AuthState {
  user: { email: string; name: string } | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}
