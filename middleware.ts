import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';
import { locales, defaultLocale } from './i18n';

const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'always',
});

const protectedPaths = ['/dashboard', '/showcase/new', '/showcase/edit'];

function isProtectedPath(pathname: string): boolean {
  const pathWithoutLocale = pathname.replace(/^\/(nl|en)/, '');
  return protectedPaths.some(
    (path) => pathWithoutLocale === path || pathWithoutLocale.startsWith(`${path}/`)
  );
}

export default async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Skip API routes
  if (pathname.startsWith('/api')) {
    return NextResponse.next();
  }

  // Check for protected routes
  if (isProtectedPath(pathname)) {
    const token = request.cookies.get('auth-token')?.value;

    if (!token) {
      const locale = pathname.match(/^\/(nl|en)/)?.[1] || defaultLocale;
      const loginUrl = new URL(`/${locale}/login`, request.url);
      loginUrl.searchParams.set('from', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Handle i18n routing
  return intlMiddleware(request);
}

export const config = {
  matcher: ['/((?!_next|_vercel|.*\\..*).*)'],
};
