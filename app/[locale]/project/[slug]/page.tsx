import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getShowcaseItemBySlug, getShowcaseItemByLocalizedSlug, getPublicShowcaseItems } from '@/lib/kv';
import { getTranslations } from 'next-intl/server';
import { SupportedLocale, getLocalizedContent } from '@/lib/types';
import ProjectPageClient from './ProjectPageClient';

interface ProjectPageProps {
  params: {
    locale: string;
    slug: string;
  };
}

// Generate static paths for all public projects with their locale-specific slugs
export async function generateStaticParams() {
  const items = await getPublicShowcaseItems();
  const params: { locale: string; slug: string }[] = [];

  items.forEach((item) => {
    // Add Dutch slug
    const slugNl = item.slug_nl || item.slug;
    if (slugNl) {
      params.push({ locale: 'nl', slug: slugNl });
    }
    // Add English slug
    const slugEn = item.slug_en || item.slug;
    if (slugEn) {
      params.push({ locale: 'en', slug: slugEn });
    }
  });

  return params;
}

// Helper to find item by slug (tries localized first, then falls back)
async function findItemBySlug(slug: string, locale: SupportedLocale) {
  // First try locale-specific slug
  let item = await getShowcaseItemByLocalizedSlug(slug, locale);

  // Fall back to default slug
  if (!item) {
    item = await getShowcaseItemBySlug(slug);
  }

  // Also try the other locale's slug as a last resort
  if (!item) {
    const otherLocale: SupportedLocale = locale === 'nl' ? 'en' : 'nl';
    item = await getShowcaseItemByLocalizedSlug(slug, otherLocale);
  }

  return item;
}

// Generate dynamic metadata for SEO
export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const locale = params.locale as SupportedLocale;
  const item = await findItemBySlug(params.slug, locale);

  if (!item || !item.is_public) {
    return {
      title: 'Project Not Found',
    };
  }

  // Get localized content
  const localizedContent = item.title_nl && item.title_en
    ? getLocalizedContent(item, locale)
    : { title: item.title, slug: item.slug, description: item.description };

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://portfolio.my-ai.nl';
  const canonicalUrl = `${baseUrl}/${locale}/project/${localizedContent.slug}`;

  // Get slugs for alternate languages
  const slugNl = item.slug_nl || item.slug;
  const slugEn = item.slug_en || item.slug;

  return {
    title: `${localizedContent.title} | MY AI Portfolio`,
    description: localizedContent.description.slice(0, 160),
    keywords: item.keywords.join(', '),
    openGraph: {
      title: localizedContent.title,
      description: localizedContent.description.slice(0, 160),
      url: canonicalUrl,
      siteName: 'MY AI Portfolio',
      type: 'article',
      images: item.image_url
        ? [
            {
              url: item.image_url,
              width: 1200,
              height: 630,
              alt: localizedContent.title,
            },
          ]
        : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: localizedContent.title,
      description: localizedContent.description.slice(0, 160),
      images: item.image_url ? [item.image_url] : [],
    },
    alternates: {
      canonical: canonicalUrl,
      languages: {
        en: `${baseUrl}/en/project/${slugEn}`,
        nl: `${baseUrl}/nl/project/${slugNl}`,
      },
    },
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const locale = params.locale as SupportedLocale;
  const item = await findItemBySlug(params.slug, locale);
  const t = await getTranslations('showcase');
  const tCategories = await getTranslations('categories');

  if (!item || !item.is_public) {
    notFound();
  }

  // Get localized content
  const localizedContent = item.title_nl && item.title_en
    ? getLocalizedContent(item, locale)
    : { title: item.title, slug: item.slug, description: item.description };

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://portfolio.my-ai.nl';

  // JSON-LD structured data for SEO with localized content
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: localizedContent.title,
    description: localizedContent.description,
    url: item.app_url,
    image: item.image_url || undefined,
    applicationCategory: item.categories.map((cat) => tCategories(cat)).join(', '),
    keywords: item.keywords.join(', '),
    dateCreated: item.created_at,
    dateModified: item.updated_at,
    inLanguage: locale,
    author: {
      '@type': 'Organization',
      name: 'MY AI',
      url: 'https://my-ai.nl',
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ProjectPageClient
        item={item}
        locale={params.locale}
        baseUrl={baseUrl}
      />
    </>
  );
}
