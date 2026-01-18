import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getShowcaseItemBySlug, getPublicShowcaseItems } from '@/lib/kv';
import { getTranslations } from 'next-intl/server';
import ProjectPageClient from './ProjectPageClient';

interface ProjectPageProps {
  params: {
    locale: string;
    slug: string;
  };
}

// Generate static paths for all public projects
export async function generateStaticParams() {
  const items = await getPublicShowcaseItems();
  return items
    .filter((item) => item.slug)
    .map((item) => ({
      slug: item.slug,
    }));
}

// Generate dynamic metadata for SEO
export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const item = await getShowcaseItemBySlug(params.slug);

  if (!item || !item.is_public) {
    return {
      title: 'Project Not Found',
    };
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://portfolio.my-ai.nl';
  const canonicalUrl = `${baseUrl}/${params.locale}/project/${item.slug}`;

  return {
    title: `${item.title} | MY AI Portfolio`,
    description: item.description.slice(0, 160),
    keywords: item.keywords.join(', '),
    openGraph: {
      title: item.title,
      description: item.description.slice(0, 160),
      url: canonicalUrl,
      siteName: 'MY AI Portfolio',
      type: 'article',
      images: item.image_url
        ? [
            {
              url: item.image_url,
              width: 1200,
              height: 630,
              alt: item.title,
            },
          ]
        : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: item.title,
      description: item.description.slice(0, 160),
      images: item.image_url ? [item.image_url] : [],
    },
    alternates: {
      canonical: canonicalUrl,
      languages: {
        en: `${baseUrl}/en/project/${item.slug}`,
        nl: `${baseUrl}/nl/project/${item.slug}`,
      },
    },
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const item = await getShowcaseItemBySlug(params.slug);
  const t = await getTranslations('showcase');
  const tCategories = await getTranslations('categories');

  if (!item || !item.is_public) {
    notFound();
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://portfolio.my-ai.nl';

  // JSON-LD structured data for SEO
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: item.title,
    description: item.description,
    url: item.app_url,
    image: item.image_url || undefined,
    applicationCategory: item.categories.map((cat) => tCategories(cat)).join(', '),
    keywords: item.keywords.join(', '),
    dateCreated: item.created_at,
    dateModified: item.updated_at,
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
