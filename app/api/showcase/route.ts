import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuid } from 'uuid';
import { getCurrentUser } from '@/lib/auth';
import {
  getAllShowcaseItems,
  getPublicShowcaseItems,
  createShowcaseItem,
  isSlugAvailable,
  isLocalizedSlugAvailable,
} from '@/lib/kv';
import { ShowcaseItem, SupportedLocale } from '@/lib/types';
import { generateSlug, validateSlug } from '@/lib/slug';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const publicOnly = searchParams.get('public') === 'true';

    const items = publicOnly
      ? await getPublicShowcaseItems()
      : await getAllShowcaseItems();

    // Sort by created_at descending (newest first)
    items.sort((a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

    return NextResponse.json({ items });
  } catch (error) {
    console.error('Error getting showcase items:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      title,
      description,
      image_url,
      app_url,
      categories,
      keywords,
      is_public,
      slug: providedSlug,
      // Multilingual fields
      title_nl,
      title_en,
      slug_nl: providedSlugNl,
      slug_en: providedSlugEn,
      description_nl,
      description_en,
    } = body;

    // Validate required multilingual fields
    if (!title_nl || !title_en) {
      return NextResponse.json(
        { error: 'Title is required in both Dutch and English' },
        { status: 400 }
      );
    }

    if (!description_nl || !description_en) {
      return NextResponse.json(
        { error: 'Description is required in both Dutch and English' },
        { status: 400 }
      );
    }

    if (!app_url) {
      return NextResponse.json(
        { error: 'App URL is required' },
        { status: 400 }
      );
    }

    // Generate or validate slugs for each language
    const slug_nl = providedSlugNl || generateSlug(title_nl);
    const slug_en = providedSlugEn || generateSlug(title_en);

    // Validate slug formats
    if (!validateSlug(slug_nl)) {
      return NextResponse.json(
        { error: 'Invalid Dutch slug format. Use only lowercase letters, numbers, and hyphens.' },
        { status: 400 }
      );
    }

    if (!validateSlug(slug_en)) {
      return NextResponse.json(
        { error: 'Invalid English slug format. Use only lowercase letters, numbers, and hyphens.' },
        { status: 400 }
      );
    }

    // Check slug availability for each language
    const slugNlAvailable = await isLocalizedSlugAvailable(slug_nl, 'nl');
    if (!slugNlAvailable) {
      return NextResponse.json(
        { error: 'The Dutch slug is already taken' },
        { status: 400 }
      );
    }

    const slugEnAvailable = await isLocalizedSlugAvailable(slug_en, 'en');
    if (!slugEnAvailable) {
      return NextResponse.json(
        { error: 'The English slug is already taken' },
        { status: 400 }
      );
    }

    // For backward compatibility, use title_nl/slug_nl as default title/slug
    const now = new Date().toISOString();
    const item: ShowcaseItem = {
      id: uuid(),
      title: title || title_nl,
      slug: providedSlug || slug_nl,
      description: description || description_nl,
      // Multilingual fields
      title_nl,
      title_en,
      slug_nl,
      slug_en,
      description_nl,
      description_en,
      // Other fields
      image_url: image_url || '',
      app_url,
      categories: categories || [],
      keywords: keywords || [],
      is_public: is_public ?? true,
      created_by: user.email,
      created_at: now,
      updated_at: now,
    };

    await createShowcaseItem(item);

    return NextResponse.json({ item }, { status: 201 });
  } catch (error) {
    console.error('Error creating showcase item:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
