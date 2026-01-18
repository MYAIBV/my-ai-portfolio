import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import {
  getShowcaseItem,
  updateShowcaseItem,
  deleteShowcaseItem,
  isSlugAvailable,
} from '@/lib/kv';
import { validateSlug } from '@/lib/slug';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const item = await getShowcaseItem(params.id);

    if (!item) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 });
    }

    // Check if item is private and user is not authenticated
    if (!item.is_public) {
      const user = await getCurrentUser();
      if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
    }

    return NextResponse.json({ item });
  } catch (error) {
    console.error('Error getting showcase item:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
      slug,
    } = body;

    // Validate slug if provided
    if (slug !== undefined) {
      if (!validateSlug(slug)) {
        return NextResponse.json(
          { error: 'Invalid slug format. Use only lowercase letters, numbers, and hyphens.' },
          { status: 400 }
        );
      }

      const slugAvailable = await isSlugAvailable(slug, params.id);
      if (!slugAvailable) {
        return NextResponse.json(
          { error: 'This slug is already taken' },
          { status: 400 }
        );
      }
    }

    const item = await updateShowcaseItem(params.id, {
      title,
      description,
      image_url,
      app_url,
      categories,
      keywords,
      is_public,
      slug,
    });

    if (!item) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 });
    }

    return NextResponse.json({ item });
  } catch (error) {
    console.error('Error updating showcase item:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const success = await deleteShowcaseItem(params.id);

    if (!success) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting showcase item:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
