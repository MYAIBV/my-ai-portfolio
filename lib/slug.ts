/**
 * Slug utilities for SEO-friendly URLs
 * These are pure functions safe for both client and server use
 */

/**
 * Convert a title to a URL-friendly slug
 * - Converts to lowercase
 * - Replaces spaces and special characters with hyphens
 * - Removes consecutive hyphens
 * - Trims hyphens from start and end
 */
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove accents
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Remove consecutive hyphens
    .replace(/^-|-$/g, ''); // Trim hyphens from start and end
}

/**
 * Validate that a slug has the correct format
 * - Only lowercase letters, numbers, and hyphens
 * - No consecutive hyphens
 * - Doesn't start or end with a hyphen
 * - At least 2 characters
 */
export function validateSlug(slug: string): boolean {
  if (slug.length < 2) return false;
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) return false;
  return true;
}
