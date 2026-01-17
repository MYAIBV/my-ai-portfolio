'use client';

import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import ThemeToggle from './ThemeToggle';
import LanguageSwitcher from '../LanguageSwitcher';
import Button from '../ui/Button';
import { useAuth } from '@/hooks/useAuth';

export default function Header() {
  const t = useTranslations('nav');
  const locale = useLocale();
  const { isAuthenticated, logout, isLoading } = useAuth();

  return (
    <header className="sticky top-0 z-40">
      {/* Multi-layer background for depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/95 via-white/90 to-white/85 dark:from-slate-900/95 dark:via-slate-900/90 dark:to-slate-900/85" />

      {/* Subtle top glow */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/20 to-transparent" />

      {/* Refined bottom shadow for depth */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-200/60 dark:via-slate-700/60 to-transparent" />
      <div className="absolute -bottom-4 left-0 right-0 h-4 bg-gradient-to-b from-black/5 dark:from-black/20 to-transparent pointer-events-none" />

      <div className="relative max-w-[1440px] mx-auto px-6 md:px-12 py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link
              href={`/${locale}`}
              className="block transition-all duration-300 group"
            >
              <svg
                viewBox="25 35 375 145"
                className="h-12 w-auto"
                style={{ overflow: 'visible' }}
              >
                <defs>
                  <linearGradient id="logoGradient-header" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="30%" stopColor="#2563eb" />
                    <stop offset="50%" stopColor="#4f46e5" />
                    <stop offset="70%" stopColor="#9333ea" />
                  </linearGradient>
                </defs>

                <g transform="translate(45, 55)">
                  {/* M letter */}
                  <g transform="translate(0, 75)">
                    <path
                      d="M 76.640625 0 L 76.546875 -44.703125 L 54.609375 -7.875 L 46.84375 -7.875 L 25.015625 -43.75 L 25.015625 0 L 8.828125 0 L 8.828125 -74.515625 L 23.09375 -74.515625 L 50.984375 -28.203125 L 78.453125 -74.515625 L 92.609375 -74.515625 L 92.828125 0 Z"
                      className="fill-slate-900 dark:fill-white"
                    />
                  </g>
                  {/* Y letter */}
                  <g transform="translate(100, 75)">
                    <path
                      d="M 44.609375 -26.40625 L 44.609375 0 L 27.359375 0 L 27.359375 -26.609375 L -1.484375 -74.515625 L 16.8125 -74.515625 L 36.71875 -41.40625 L 56.640625 -74.515625 L 73.5625 -74.515625 Z"
                      className="fill-slate-900 dark:fill-white"
                    />
                  </g>

                  {/* Sparkle */}
                  <g transform="translate(172, -32)">
                    <path
                      d="M33 0 C33 30, 36 33, 66 33 C36 33, 33 36, 33 66 C33 36, 30 33, 0 33 C30 33, 33 30, 33 0 Z"
                      fill="url(#logoGradient-header)"
                      className="transition-transform duration-500 group-hover:rotate-180"
                      style={{ transformOrigin: 'center', transformBox: 'fill-box' }}
                    />
                  </g>

                  {/* A letter */}
                  <g transform="translate(205, 75)">
                    <path
                      d="M 57.90625 -15.96875 L 23.3125 -15.96875 L 16.71875 0 L -0.953125 0 L 32.25 -74.515625 L 49.28125 -74.515625 L 82.609375 0 L 64.515625 0 Z M 52.484375 -29.0625 L 40.671875 -57.59375 L 28.84375 -29.0625 Z"
                      className="fill-slate-900 dark:fill-white"
                    />
                  </g>
                  {/* I letter */}
                  <g transform="translate(285, 75)">
                    <path
                      d="M 8.828125 -74.515625 L 26.078125 -74.515625 L 26.078125 0 L 8.828125 0 Z"
                      className="fill-slate-900 dark:fill-white"
                    />
                  </g>

                  {/* Tagline */}
                  <text
                    x="165"
                    y="120"
                    textAnchor="middle"
                    className="fill-slate-900 dark:fill-white"
                    style={{ fontSize: '36px', fontWeight: 800, letterSpacing: '0.25em', fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif', textTransform: 'uppercase' }}
                  >
                    {t('tagline')}
                  </text>
                </g>
              </svg>
            </Link>
            {/* Vertical divider */}
            <div className="hidden md:block h-8 w-px bg-slate-200 dark:bg-slate-700" />

            {isAuthenticated && (
              <nav className="hidden md:flex items-center space-x-10">
                <Link
                  href={`/${locale}/dashboard`}
                  className="text-[15px] font-medium text-slate-900 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  {t('dashboard')}
                </Link>
              </nav>
            )}
          </div>

          <div className="flex items-center space-x-4 md:pl-4 md:border-l border-slate-200 dark:border-slate-700">
            <LanguageSwitcher />
            <ThemeToggle />
            {!isLoading && (
              <>
                {isAuthenticated ? (
                  <Button variant="ghost" size="sm" onClick={logout}>
                    {t('logout')}
                  </Button>
                ) : (
                  <Link href={`/${locale}/login`}>
                    <Button variant="primary" size="sm">
                      {t('login')}
                    </Button>
                  </Link>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
