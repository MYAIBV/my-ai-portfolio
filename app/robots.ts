import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://portfolio.my-ai.nl';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/dashboard/',
          '/*/dashboard/',
          '/login/',
          '/*/login/',
          '/showcase/new/',
          '/*/showcase/new/',
          '/showcase/*/edit/',
          '/*/showcase/*/edit/',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
