import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getCookieOptions } from '@/lib/auth';

export async function POST() {
  try {
    const cookieOptions = getCookieOptions();
    const cookieStore = await cookies();

    cookieStore.set(cookieOptions.name, '', {
      httpOnly: cookieOptions.httpOnly,
      secure: cookieOptions.secure,
      sameSite: cookieOptions.sameSite,
      path: cookieOptions.path,
      maxAge: 0,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
