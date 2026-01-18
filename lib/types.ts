export type Category = 'voice' | 'chat' | 'image' | 'video' | 'automation' | 'other';

export const CATEGORIES: Category[] = ['voice', 'chat', 'image', 'video', 'automation', 'other'];

export interface ShowcaseItem {
  id: string;
  title: string;
  slug: string;
  description: string;
  image_url: string;
  app_url: string;
  categories: Category[];
  keywords: string[];
  is_public: boolean;
  created_by: string;
  created_at: string;
  updated_at: string;
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
