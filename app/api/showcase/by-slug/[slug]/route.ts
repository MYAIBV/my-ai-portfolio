import { NextRequest, NextResponse } from 'next/server';
import { getShowcaseItemBySlug, getShowcaseItemByLocalizedSlug } from '@/lib/kv';
import { getCurrentUser } from '@/lib/auth';
import { SupportedLocale } from '@/lib/types';

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const locale = searchParams.get('locale') as SupportedLocale | null;

    // If locale is specified, search by localized slug
    let item;
    if (locale && ['nl', 'en'].includes(locale)) {
      item = await getShowcaseItemByLocalizedSlug(params.slug, locale);
    }

    // Fall back to default slug search if not found or no locale specified
    if (!item) {
      item = await getShowcaseItemBySlug(params.slug);
    }

    // Also try both localized slugs if still not found
    if (!item) {
      item = await getShowcaseItemByLocalizedSlug(params.slug, 'nl');
    }
    if (!item) {
      item = await getShowcaseItemByLocalizedSlug(params.slug, 'en');
    }

    if (!item) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 });
    }

    // Allow authenticated users to access private items
    if (!item.is_public) {
      const user = await getCurrentUser();
      if (!user) {
        return NextResponse.json({ error: 'Item not found' }, { status: 404 });
      }
    }

    return NextResponse.json({ item });
  } catch (error) {
    console.error('Error getting showcase item by slug:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
