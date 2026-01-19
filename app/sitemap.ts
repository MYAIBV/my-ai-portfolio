import { MetadataRoute } from 'next';
import { getPublicShowcaseItems } from '@/lib/kv';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://portfolio.my-ai.nl';

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/nl`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/en`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 1,
    },
  ];

  // Dynamic project pages with locale-specific slugs
  const items = await getPublicShowcaseItems();
  const projectPages: MetadataRoute.Sitemap = [];

  items.forEach((item) => {
    // Dutch version
    const slugNl = item.slug_nl || item.slug;
    if (slugNl) {
      projectPages.push({
        url: `${baseUrl}/nl/project/${slugNl}`,
        lastModified: new Date(item.updated_at),
        changeFrequency: 'monthly' as const,
        priority: 0.8,
      });
    }

    // English version
    const slugEn = item.slug_en || item.slug;
    if (slugEn) {
      projectPages.push({
        url: `${baseUrl}/en/project/${slugEn}`,
        lastModified: new Date(item.updated_at),
        changeFrequency: 'monthly' as const,
        priority: 0.8,
      });
    }
  });

  return [...staticPages, ...projectPages];
}
