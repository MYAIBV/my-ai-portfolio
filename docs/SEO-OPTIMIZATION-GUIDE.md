# SEO Optimization Guide for Next.js Applications

A comprehensive guide to implementing SEO-friendly features in Next.js applications. This document covers all optimizations implemented in this portfolio app and serves as a reusable reference for any web application.

---

## Table of Contents

1. [Overview](#overview)
2. [Generative Engine Optimization (GEO)](#generative-engine-optimization-geo) ← **NEW: For AI Search (Gemini, ChatGPT, etc.)**
3. [URL Structure & Slugs](#url-structure--slugs)
4. [Dynamic Metadata](#dynamic-metadata)
5. [Structured Data (JSON-LD)](#structured-data-json-ld)
6. [Sitemap Generation](#sitemap-generation)
7. [Robots.txt Configuration](#robotstxt-configuration)
8. [Server-Side Rendering (SSR)](#server-side-rendering-ssr)
9. [Internationalization (i18n) SEO](#internationalization-i18n-seo)
10. [Image Optimization](#image-optimization)
11. [Performance Considerations](#performance-considerations)
12. [Implementation Checklist](#implementation-checklist)

---

## Overview

Search Engine Optimization (SEO) ensures your content is discoverable by search engines like Google, Bing, and others. For modern JavaScript applications, this requires careful attention to:

- **Crawlability**: Can search engines access and parse your content?
- **Indexability**: Is your content structured for indexing?
- **Relevance**: Does your metadata accurately describe your content?
- **Performance**: Does your site load quickly (Core Web Vitals)?

### Key Principles

1. **Server-Side Rendering (SSR)** - Search engines need HTML content, not JavaScript promises
2. **Semantic URLs** - Human-readable URLs with keywords (`/project/ai-chatbot` vs `/project/123e4567-e89b`)
3. **Comprehensive Metadata** - Title, description, Open Graph, Twitter Cards
4. **Structured Data** - JSON-LD schemas for rich search results
5. **Technical SEO** - Sitemaps, robots.txt, canonical URLs

---

## Generative Engine Optimization (GEO)

> **Important**: This section covers optimization for AI-powered search engines like Google Gemini, ChatGPT, Perplexity, and similar LLM-based systems. This is the future of search.

### How AI Search Differs from Traditional Search

| Traditional Google Search | AI-Powered Search (Gemini, etc.) |
|---------------------------|----------------------------------|
| Returns list of links | Generates synthesized answers |
| Ranks pages by signals | Extracts facts from trusted sources |
| User clicks through to sites | User gets answer directly |
| Keyword matching | Semantic understanding |

**The Goal**: Become the source that AI trusts to construct its answers.

---

### Phase 1: Speak "AI's Language" (Structure & Data)

AI doesn't "read" pages like humans—it **extracts facts**. Make your facts easy to extract.

#### 1. Implement Entity Schema Markup

AI relies heavily on the Knowledge Graph. It needs to understand WHO you are.

```json
// Add to your homepage <head> or body
{
  "@context": "https://schema.org",
  "@type": ["Organization", "LocalBusiness"],
  "name": "My AI",
  "description": "Dutch AI consultancy specializing in custom AI solutions",
  "url": "https://my-ai.nl",
  "logo": "https://my-ai.nl/logo.png",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Your Street 123",
    "addressLocality": "Amsterdam",
    "postalCode": "1234 AB",
    "addressCountry": "NL"
  },
  "sameAs": [
    "https://linkedin.com/company/my-ai",
    "https://twitter.com/myai",
    "https://github.com/my-ai",
    "https://www.kvk.nl/orderstraat/product-background/?kvknummer=12345678"
  ],
  "areaServed": {
    "@type": "Country",
    "name": "Netherlands"
  },
  "knowsAbout": [
    "Artificial Intelligence",
    "Machine Learning",
    "Natural Language Processing",
    "AI Automation"
  ]
}
```

**Critical**: The `sameAs` property connects your entity to verified profiles (LinkedIn, KVK/Chamber of Commerce, etc.). This builds trust.

#### 2. Create "Answer Capsules"

AI often looks for a **direct definition** to serve as its answer. Provide it!

**Action**: After every H1 heading, include a 50-word direct definition.

```html
<!-- Bad: Vague marketing speak -->
<h1>Our AI Solutions</h1>
<p>We are passionate about innovation and helping businesses succeed...</p>

<!-- Good: Direct, factual, extractable -->
<h1>AI Solutions for Dutch Businesses</h1>
<p>
  <strong>My AI is a Dutch AI consultancy based in Amsterdam specializing in
  machine learning automation, natural language processing, and computer vision
  solutions for logistics, healthcare, and financial services companies in the
  Netherlands and Benelux region.</strong>
</p>
```

This 50-word "answer capsule" is exactly what Gemini will quote.

#### 3. Use Structured Lists and Tables

LLMs love tables. When users ask "Compare AI agencies in Netherlands," AI pulls from tables.

```html
<!-- Feature Comparison Table -->
<h2>Our AI Solution vs. Traditional Methods</h2>
<table>
  <thead>
    <tr>
      <th>Aspect</th>
      <th>Traditional Approach</th>
      <th>My AI Solution</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Processing Time</td>
      <td>Hours to days</td>
      <td>Real-time (< 1 second)</td>
    </tr>
    <tr>
      <td>Accuracy</td>
      <td>85% average</td>
      <td>98%+ with ML optimization</td>
    </tr>
    <tr>
      <td>Scalability</td>
      <td>Limited by human resources</td>
      <td>Unlimited with cloud infrastructure</td>
    </tr>
  </tbody>
</table>
```

---

### Phase 2: Local Authority (Geographic Relevance)

To rank for "AI solutions in the Netherlands," you must prove local relevance. AI treats geographic terms as strict filters.

#### 1. Dutch Context Signals

Even if your site is in English, include Dutch ecosystem signals:

**Footer Requirements**:
```html
<footer>
  <address>
    My AI B.V.<br>
    Herengracht 123<br>
    1015 BT Amsterdam<br>
    The Netherlands<br>
    KVK: 12345678<br>
    BTW: NL123456789B01
  </address>
</footer>
```

**Content Strategy**:
- Publish case studies mentioning Dutch cities: *"How we helped a Rotterdam logistics firm..."*
- Reference Dutch/EU regulations: *"...comply with EU AI Act requirements..."*
- Use Dutch industry terms where appropriate

#### 2. Get Listed on Tier-1 Data Sources

AI trusts verified databases over marketing content.

| Platform | Type | Priority |
|----------|------|----------|
| [Dealroom.co](https://dealroom.co) | Tech/Startup Database | **Critical** for Dutch tech |
| [TechLeap.nl](https://techleap.nl) | Dutch Tech Ecosystem | **High** |
| [Crunchbase](https://crunchbase.com) | Global Startup Database | High |
| [Google Business Profile](https://business.google.com) | Local Business | High |
| [Trustpilot](https://trustpilot.com) | Reviews | Medium |
| [Clutch.co](https://clutch.co) | B2B Reviews | Medium |
| LinkedIn Company Page | Professional Network | High |

**Action Items**:
- [ ] Create/claim Dealroom.co profile
- [ ] Register on TechLeap.nl ecosystem
- [ ] Verify Google Business Profile with Dutch address
- [ ] Set up Trustpilot profile (Dutch locale)

---

### Phase 3: Generative Content Strategy (E-E-A-T)

AI prioritizes **"Information Gain"**—new information, not recycled content.

#### 1. Publish Original Data

AI loves to cite statistics. If you publish unique data, you become the "source of truth."

**Strategy Examples**:
- Survey 50 Dutch CTOs → Publish "State of AI Adoption in Netherlands 2026"
- Analyze your client data → "AI Implementation Success Rates by Industry"
- Track industry trends → "Monthly Dutch AI Innovation Index"

When users ask Gemini about Dutch AI trends, YOUR data gets cited.

#### 2. The "Co-Occurrence" Strategy

AI learns by association. You want your brand name near target keywords.

**Goal**: "My AI" appearing textually near "Top AI Agency Netherlands"

**Tactics**:
- Guest post on Dutch tech publications (Emerce, Tweakers, MT/Sprout, Frankwatching)
- Get mentioned in "Top AI Companies in Netherlands" roundup articles
- Partner with other Dutch tech companies for co-marketing
- Speak at Dutch tech events (coverage mentions you + keywords)

**High-Value Mentions**:
```
"...according to My AI, one of the leading AI consultancies in the Netherlands..."
"...Top AI Innovations in the Benelux include solutions from My AI..."
```

---

### Phase 4: Technical Crawlability for AI

AI (Gemini) uses Google's index. If Google hasn't indexed it, AI can't read it.

#### Crawlability Checklist

```python
# robots.txt - Don't block AI bots (unless intentional)
User-agent: *
Allow: /

# If you WANT to block AI training (optional):
User-agent: GPTBot
Disallow: /

User-agent: Google-Extended  # Gemini training
Disallow: /
```

#### Speed = Trust

Slow sites are associated with low quality. Ensure Core Web Vitals are green:

| Metric | Target | Tool |
|--------|--------|------|
| LCP | < 2.5s | PageSpeed Insights |
| FID | < 100ms | Chrome DevTools |
| CLS | < 0.1 | Lighthouse |

---

### GEO Summary Checklist

| Area | Task | Goal |
|------|------|------|
| Schema | Add `LocalBusiness` + `Organization` JSON-LD | Help AI identify you as a Dutch entity |
| Content | Add "Answer Capsules" (50-word summaries) | Be the snippet AI quotes directly |
| Tables | Create comparison tables on service pages | Provide structured data for comparisons |
| Authority | Get listed on Dealroom.co, TechLeap.nl | Establish verified local presence |
| Data | Publish one piece of original research | Become a primary source for citations |
| Co-occurrence | Get brand mentions in relevant articles | Associate brand with target keywords |
| Technical | Ensure Core Web Vitals are green | Speed signals quality to AI |

---

## URL Structure & Slugs

### Why Slugs Matter

URLs are a ranking factor. A descriptive slug:
- Tells users and search engines what the page is about
- Contains keywords that improve relevance
- Is shareable and memorable

**Bad URL**: `/project/550e8400-e29b-41d4-a716-446655440000`
**Good URL**: `/project/ai-powered-customer-support-chatbot`

### Implementation

#### 1. Slug Utility Functions

Create a utility file for slug operations:

```typescript
// lib/slug.ts

/**
 * Convert a title to a URL-friendly slug
 * - Converts to lowercase
 * - Removes accents/diacritics
 * - Replaces spaces with hyphens
 * - Removes special characters
 * - Removes consecutive hyphens
 */
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove accents
    .replace(/[^a-z0-9\s-]/g, '')    // Remove special characters
    .replace(/\s+/g, '-')            // Replace spaces with hyphens
    .replace(/-+/g, '-')             // Remove consecutive hyphens
    .replace(/^-|-$/g, '');          // Trim hyphens from ends
}

/**
 * Validate slug format
 * - Only lowercase letters, numbers, and hyphens
 * - No consecutive hyphens
 * - Minimum 2 characters
 */
export function validateSlug(slug: string): boolean {
  if (slug.length < 2) return false;
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug);
}

/**
 * Check if a slug is available (not already used)
 */
export async function isSlugAvailable(
  slug: string,
  excludeId?: string
): Promise<boolean> {
  const items = await getAllItems();
  return !items.some(
    (item) => item.slug === slug && item.id !== excludeId
  );
}
```

#### 2. Data Model

Add `slug` field to your data model:

```typescript
// lib/types.ts
export interface Item {
  id: string;
  title: string;
  slug: string;  // URL-friendly identifier
  description: string;
  // ... other fields
  created_at: string;
  updated_at: string;
}
```

#### 3. API Validation

Validate slugs on creation and update:

```typescript
// app/api/items/route.ts (POST)
export async function POST(request: NextRequest) {
  const { title, slug: providedSlug, ...rest } = await request.json();

  // Generate slug from title if not provided
  let slug = providedSlug || generateSlug(title);

  // Validate format
  if (!validateSlug(slug)) {
    return NextResponse.json(
      { error: 'Invalid slug format' },
      { status: 400 }
    );
  }

  // Check uniqueness
  if (!(await isSlugAvailable(slug))) {
    return NextResponse.json(
      { error: 'Slug already taken' },
      { status: 400 }
    );
  }

  // Create item with slug
  const item = await createItem({ ...rest, title, slug });
  return NextResponse.json({ item }, { status: 201 });
}
```

#### 4. Form with Auto-Generation

```typescript
// components/ItemForm.tsx
const [title, setTitle] = useState('');
const [slug, setSlug] = useState('');
const [slugTouched, setSlugTouched] = useState(false);

// Auto-generate slug when title changes (if not manually edited)
useEffect(() => {
  if (!slugTouched && title) {
    setSlug(generateSlug(title));
  }
}, [title, slugTouched]);

// Allow manual editing
const handleSlugChange = (value: string) => {
  setSlug(value.toLowerCase().replace(/\s+/g, '-'));
  setSlugTouched(true);
};
```

---

## Dynamic Metadata

### Why It Matters

Each page needs unique metadata for:
- Search engine results (title, description)
- Social media sharing (Open Graph, Twitter Cards)
- Browser tabs and bookmarks

### Implementation with Next.js `generateMetadata`

```typescript
// app/[locale]/project/[slug]/page.tsx
import { Metadata } from 'next';

interface PageProps {
  params: { locale: string; slug: string };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const item = await getItemBySlug(params.slug);

  if (!item) {
    return { title: 'Not Found' };
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://example.com';
  const canonicalUrl = `${baseUrl}/${params.locale}/project/${item.slug}`;

  return {
    // Basic metadata
    title: `${item.title} | My Site`,
    description: item.description.slice(0, 160), // Google truncates at ~160 chars
    keywords: item.keywords?.join(', '),

    // Open Graph (Facebook, LinkedIn, etc.)
    openGraph: {
      title: item.title,
      description: item.description.slice(0, 160),
      url: canonicalUrl,
      siteName: 'My Site',
      type: 'article', // or 'website', 'product', etc.
      images: item.image_url ? [
        {
          url: item.image_url,
          width: 1200,
          height: 630,
          alt: item.title,
        },
      ] : [],
      locale: params.locale,
    },

    // Twitter Cards
    twitter: {
      card: 'summary_large_image',
      title: item.title,
      description: item.description.slice(0, 160),
      images: item.image_url ? [item.image_url] : [],
      // creator: '@yourhandle', // Optional
    },

    // Canonical URL (prevents duplicate content issues)
    alternates: {
      canonical: canonicalUrl,
      languages: {
        'en': `${baseUrl}/en/project/${item.slug}`,
        'nl': `${baseUrl}/nl/project/${item.slug}`,
        // Add all supported languages
      },
    },

    // Robots directives (optional per-page control)
    robots: {
      index: true,
      follow: true,
    },
  };
}
```

### Metadata Best Practices

| Element | Best Practice | Character Limit |
|---------|--------------|-----------------|
| Title | Include primary keyword, brand name | 50-60 chars |
| Description | Compelling summary with call-to-action | 150-160 chars |
| OG Image | 1200x630px, high contrast, readable text | - |
| Keywords | Relevant terms, don't stuff | 5-10 keywords |

---

## Structured Data (JSON-LD)

### Why It Matters

JSON-LD helps search engines understand your content semantically, enabling:
- Rich snippets in search results
- Knowledge Graph integration
- Voice search compatibility

### Implementation

```typescript
// app/[locale]/project/[slug]/page.tsx
export default async function ProjectPage({ params }: PageProps) {
  const item = await getItemBySlug(params.slug);

  // JSON-LD structured data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication', // Choose appropriate type
    name: item.title,
    description: item.description,
    url: item.app_url,
    image: item.image_url,
    applicationCategory: item.categories.join(', '),
    dateCreated: item.created_at,
    dateModified: item.updated_at,
    author: {
      '@type': 'Organization',
      name: 'Your Company',
      url: 'https://yoursite.com',
    },
    // Add more properties based on schema type
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ProjectContent item={item} />
    </>
  );
}
```

### Common Schema Types

| Content Type | Schema | Key Properties |
|--------------|--------|----------------|
| Software/App | `SoftwareApplication` | name, description, applicationCategory, operatingSystem |
| Article/Blog | `Article` | headline, author, datePublished, image |
| Product | `Product` | name, description, price, availability, review |
| Organization | `Organization` | name, url, logo, contactPoint |
| Person | `Person` | name, jobTitle, worksFor, image |
| FAQ | `FAQPage` | mainEntity (array of Question/Answer) |
| How-to | `HowTo` | name, step (array of HowToStep) |

### Validation

Test your structured data at:
- [Google Rich Results Test](https://search.google.com/test/rich-results)
- [Schema.org Validator](https://validator.schema.org/)

---

## Sitemap Generation

### Why It Matters

Sitemaps help search engines:
- Discover all your pages
- Understand site structure
- Know when content was updated
- Prioritize crawling

### Implementation

```typescript
// app/sitemap.ts
import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://example.com';
  const locales = ['en', 'nl']; // Your supported locales

  // Static pages
  const staticPages: MetadataRoute.Sitemap = locales.flatMap((locale) => [
    {
      url: `${baseUrl}/${locale}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${baseUrl}/${locale}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
  ]);

  // Dynamic pages (from database)
  const items = await getPublicItems();
  const dynamicPages: MetadataRoute.Sitemap = items
    .filter((item) => item.slug) // Only items with slugs
    .flatMap((item) =>
      locales.map((locale) => ({
        url: `${baseUrl}/${locale}/project/${item.slug}`,
        lastModified: new Date(item.updated_at),
        changeFrequency: 'monthly' as const,
        priority: 0.8,
      }))
    );

  return [...staticPages, ...dynamicPages];
}
```

### Sitemap Best Practices

- **Maximum 50,000 URLs** per sitemap (use sitemap index for more)
- **Maximum 50MB** uncompressed file size
- Include `lastmod` for frequently updated content
- Set realistic `changeFrequency` values
- Use `priority` to indicate relative importance (0.0 to 1.0)

---

## Robots.txt Configuration

### Why It Matters

Robots.txt tells search engines:
- Which pages to crawl
- Which pages to ignore
- Where to find your sitemap

### Implementation

```typescript
// app/robots.ts
import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://example.com';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',           // API routes
          '/dashboard/',     // Admin pages
          '/*/dashboard/',   // Localized admin pages
          '/login/',         // Auth pages
          '/*/login/',
          '/admin/',         // Admin sections
          '/*.json$',        // JSON files
          '/private/',       // Private content
        ],
      },
      // Optional: Block specific bots
      {
        userAgent: 'GPTBot',
        disallow: ['/'],  // Block AI training crawlers if desired
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
```

### What to Block

| Block | Reason |
|-------|--------|
| `/api/` | Internal endpoints, not for indexing |
| `/dashboard/`, `/admin/` | Private admin areas |
| `/login/`, `/register/` | Auth pages with no unique content |
| `/search?` | Search results (duplicate content) |
| `/*.pdf$` | PDFs (optional, if you want them indexed separately) |
| `/tmp/`, `/private/` | Temporary or private content |

---

## Server-Side Rendering (SSR)

### Why It Matters

Search engine crawlers need HTML content. Client-side rendered content may not be indexed properly.

### Best Practices

1. **Use Server Components for SEO-critical pages**

```typescript
// app/[locale]/project/[slug]/page.tsx (Server Component)
export default async function ProjectPage({ params }) {
  const item = await getItemBySlug(params.slug); // Server-side fetch

  return (
    <>
      {/* JSON-LD and meta tags are in the HTML */}
      <script type="application/ld+json" ... />
      <ProjectContent item={item} />
    </>
  );
}
```

2. **Static Generation for known pages**

```typescript
// Generate static pages at build time
export async function generateStaticParams() {
  const items = await getPublicItems();
  return items.map((item) => ({
    slug: item.slug,
  }));
}
```

3. **Use semantic HTML**

```html
<!-- Good: Semantic structure -->
<article>
  <header>
    <h1>Page Title</h1>
    <time datetime="2024-01-15">January 15, 2024</time>
  </header>
  <main>
    <p>Content...</p>
  </main>
</article>

<!-- Bad: Div soup -->
<div class="article">
  <div class="header">
    <div class="title">Page Title</div>
  </div>
</div>
```

---

## Internationalization (i18n) SEO

### Why It Matters

Proper i18n SEO ensures:
- Users find content in their language
- No duplicate content penalties
- Proper regional targeting

### Implementation

1. **Hreflang Tags** (via `alternates` in metadata)

```typescript
alternates: {
  canonical: `${baseUrl}/en/project/${slug}`,
  languages: {
    'en': `${baseUrl}/en/project/${slug}`,
    'nl': `${baseUrl}/nl/project/${slug}`,
    'x-default': `${baseUrl}/en/project/${slug}`, // Fallback
  },
},
```

2. **Language in URL Structure**

```
✅ Good: example.com/en/about, example.com/nl/about
✅ Good: en.example.com/about, nl.example.com/about
❌ Bad: example.com/about?lang=en (query parameters)
```

3. **Localized Content**

```typescript
// Each language version should have unique, translated content
// Not just the same content with different URLs
```

---

## Image Optimization

### Why It Matters

Images impact:
- Page load speed (Core Web Vitals)
- Image search visibility
- Accessibility

### Best Practices

1. **Use Next.js Image Component**

```typescript
import Image from 'next/image';

<Image
  src={item.image_url}
  alt={item.title} // Descriptive alt text
  width={1200}
  height={630}
  priority // For above-the-fold images
/>
```

2. **Descriptive File Names**

```
✅ Good: ai-chatbot-dashboard-screenshot.jpg
❌ Bad: IMG_12345.jpg, screenshot.png
```

3. **Alt Text Guidelines**

- Describe the image content
- Include relevant keywords naturally
- Keep under 125 characters
- Don't start with "Image of..." or "Picture of..."

---

## Performance Considerations

### Core Web Vitals

Google uses these metrics for ranking:

| Metric | Target | Impact |
|--------|--------|--------|
| LCP (Largest Contentful Paint) | < 2.5s | Main content load time |
| FID (First Input Delay) | < 100ms | Interactivity responsiveness |
| CLS (Cumulative Layout Shift) | < 0.1 | Visual stability |

### Optimization Tips

1. **Minimize JavaScript bundle size**
2. **Use dynamic imports for non-critical components**
3. **Optimize images (WebP, proper sizing)**
4. **Enable compression (gzip/brotli)**
5. **Use CDN for static assets**
6. **Implement caching strategies**

---

## Implementation Checklist

### Generative Engine Optimization (GEO) - For AI Search
- [ ] Add `Organization` + `LocalBusiness` JSON-LD schema to homepage
- [ ] Include `sameAs` links to verified profiles (LinkedIn, KVK, etc.)
- [ ] Add "Answer Capsules" (50-word definitions) after H1 headings
- [ ] Create comparison tables on service/product pages
- [ ] Include physical address and KVK number in footer
- [ ] Register on Dealroom.co, TechLeap.nl, Crunchbase
- [ ] Verify Google Business Profile with Dutch address
- [ ] Publish original research/data content
- [ ] Get brand mentions on relevant industry publications
- [ ] Ensure robots.txt allows AI crawlers (unless blocking intentionally)

### URL & Structure
- [ ] Implement SEO-friendly slugs for all public content
- [ ] Validate slug format and uniqueness
- [ ] Auto-generate slugs from titles
- [ ] Use lowercase, hyphen-separated URLs

### Metadata
- [ ] Implement `generateMetadata` for all public pages
- [ ] Unique title and description per page
- [ ] Open Graph tags for social sharing
- [ ] Twitter Card tags
- [ ] Canonical URLs to prevent duplicate content

### Structured Data
- [ ] Add JSON-LD schema to relevant pages
- [ ] Choose appropriate schema types (SoftwareApplication, Article, Product, etc.)
- [ ] Validate with Google Rich Results Test

### Technical SEO
- [ ] Create dynamic sitemap.xml
- [ ] Configure robots.txt
- [ ] Block admin/private routes from indexing
- [ ] Implement hreflang for multi-language sites

### Rendering
- [ ] Use Server Components for SEO-critical pages
- [ ] Implement static generation where possible
- [ ] Use semantic HTML elements

### Performance
- [ ] Optimize images with Next.js Image
- [ ] Minimize bundle size
- [ ] Test Core Web Vitals (LCP < 2.5s, FID < 100ms, CLS < 0.1)
- [ ] Enable compression

### Links
- [ ] Use proper anchor text (not "click here")
- [ ] Implement internal linking strategy
- [ ] Use `rel="nofollow"` for untrusted external links
- [ ] Ensure all links are crawlable (not JavaScript-only)

---

## Testing & Validation Tools

| Tool | Purpose |
|------|---------|
| [Google Search Console](https://search.google.com/search-console) | Monitor indexing, errors, performance |
| [Google Rich Results Test](https://search.google.com/test/rich-results) | Validate structured data |
| [PageSpeed Insights](https://pagespeed.web.dev/) | Core Web Vitals testing |
| [Mobile-Friendly Test](https://search.google.com/test/mobile-friendly) | Mobile usability |
| [Lighthouse](https://developer.chrome.com/docs/lighthouse) | Comprehensive audits |
| [Schema Validator](https://validator.schema.org/) | JSON-LD validation |
| [Ahrefs/SEMrush](https://ahrefs.com/) | Competitive analysis, backlinks |

---

## Quick Reference: File Structure

```
app/
├── sitemap.ts              # Dynamic sitemap generation
├── robots.ts               # Robots.txt configuration
├── [locale]/
│   ├── layout.tsx          # Root metadata, lang attribute
│   ├── page.tsx            # Homepage
│   └── project/
│       └── [slug]/
│           ├── page.tsx    # generateMetadata + JSON-LD
│           └── ProjectPageClient.tsx
lib/
├── slug.ts                 # Slug utilities
└── types.ts                # Data types with slug field
```

---

## Summary

Implementing SEO properly requires attention to:

1. **Generative Engine Optimization (GEO)**: Entity schema, answer capsules, tables, verified listings
2. **Technical Foundation**: SSR, sitemaps, robots.txt
3. **URL Strategy**: Clean, keyword-rich slugs
4. **Metadata**: Unique titles, descriptions, social tags
5. **Structured Data**: JSON-LD for rich results
6. **Performance**: Fast load times, optimized assets
7. **Internationalization**: Proper hreflang setup
8. **Authority Building**: Original data, co-occurrence mentions, trusted platform listings

### Traditional SEO vs. GEO

| Focus | Traditional SEO | Generative Engine Optimization |
|-------|-----------------|-------------------------------|
| Goal | Rank in link results | Be cited by AI as source |
| Content | Keywords + backlinks | Extractable facts + original data |
| Structure | Meta tags | Answer capsules + tables |
| Authority | Domain authority | Entity verification + trusted listings |
| Technical | Crawlable HTML | Same + AI-friendly formatting |

Following this guide ensures your Next.js application is fully optimized for both traditional search engines AND AI-powered search systems like Google Gemini, ChatGPT, and Perplexity.

---

*Last updated: January 2026*
*Implemented in: my-ai-portfolio*
*Source: Traditional SEO best practices + Generative Engine Optimization (GEO) strategies*
