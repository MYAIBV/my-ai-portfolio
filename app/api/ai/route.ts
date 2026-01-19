import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { translateContent, suggestContent, Language, ContentField } from '@/lib/gemini';

export async function POST(request: NextRequest) {
  try {
    // Require authentication for AI features
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { action } = body;

    if (action === 'translate') {
      const { text, fromLang, toLang } = body;

      if (!text || !fromLang || !toLang) {
        return NextResponse.json(
          { error: 'Missing required fields: text, fromLang, toLang' },
          { status: 400 }
        );
      }

      if (!['nl', 'en'].includes(fromLang) || !['nl', 'en'].includes(toLang)) {
        return NextResponse.json(
          { error: 'Invalid language. Supported: nl, en' },
          { status: 400 }
        );
      }

      const translated = await translateContent(
        text,
        fromLang as Language,
        toLang as Language
      );

      return NextResponse.json({ result: translated });
    }

    if (action === 'suggest') {
      const { context, field, language } = body;

      if (!field || !language) {
        return NextResponse.json(
          { error: 'Missing required fields: field, language' },
          { status: 400 }
        );
      }

      if (!['title', 'description'].includes(field)) {
        return NextResponse.json(
          { error: 'Invalid field. Supported: title, description' },
          { status: 400 }
        );
      }

      if (!['nl', 'en'].includes(language)) {
        return NextResponse.json(
          { error: 'Invalid language. Supported: nl, en' },
          { status: 400 }
        );
      }

      const suggestion = await suggestContent(
        context || {},
        field as ContentField,
        language as Language
      );

      return NextResponse.json({ result: suggestion });
    }

    return NextResponse.json(
      { error: 'Invalid action. Supported: translate, suggest' },
      { status: 400 }
    );
  } catch (error) {
    console.error('AI API error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}
