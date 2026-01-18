import { MetadataRoute } from 'next';
import { getPublicShowcaseItems } from '@/lib/kv';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://portfolio.my-ai.nl';
  const locales = ['en', 'nl'];

  // Static pages
  const staticPages: MetadataRoute.Sitemap = locales.flatMap((locale) => [
    {
      url: `${baseUrl}/${locale}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 1,
    },
  ]);

  // Dynamic project pages
  const items = await getPublicShowcaseItems();
  const projectPages: MetadataRoute.Sitemap = items
    .filter((item) => item.slug)
    .flatMap((item) =>
      locales.map((locale) => ({
        url: `${baseUrl}/${locale}/project/${item.slug}`,
        lastModified: new Date(item.updated_at),
        changeFrequency: 'monthly' as const,
        priority: 0.8,
      }))
    );

  return [...staticPages, ...projectPages];
}
