import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuid } from 'uuid';
import { getCurrentUser } from '@/lib/auth';
import {
  getAllShowcaseItems,
  getPublicShowcaseItems,
  createShowcaseItem,
} from '@/lib/kv';
import { ShowcaseItem } from '@/lib/types';

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
    } = body;

    if (!title || !description || !app_url) {
      return NextResponse.json(
        { error: 'Title, description, and app_url are required' },
        { status: 400 }
      );
    }

    const now = new Date().toISOString();
    const item: ShowcaseItem = {
      id: uuid(),
      title,
      description,
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
