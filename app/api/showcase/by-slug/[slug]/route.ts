import { NextRequest, NextResponse } from 'next/server';
import { getShowcaseItemBySlug } from '@/lib/kv';
import { getCurrentUser } from '@/lib/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const item = await getShowcaseItemBySlug(params.slug);

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
