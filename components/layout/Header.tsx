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
  const { user, isAuthenticated, logout, isLoading } = useAuth();

  return (
    <header className="sticky top-0 z-40 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <Link
              href={`/${locale}`}
              className="text-xl font-bold text-primary-600 dark:text-primary-400"
            >
              My AI Portfolio
            </Link>
            <nav className="hidden md:flex items-center gap-6">
              <Link
                href={`/${locale}`}
                className="text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
              >
                {t('home')}
              </Link>
              {isAuthenticated && (
                <Link
                  href={`/${locale}/dashboard`}
                  className="text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                >
                  {t('dashboard')}
                </Link>
              )}
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <LanguageSwitcher />
            <ThemeToggle />
            {!isLoading && (
              <>
                {isAuthenticated ? (
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-600 dark:text-gray-400 hidden sm:inline">
                      {user?.name}
                    </span>
                    <Button variant="ghost" size="sm" onClick={logout}>
                      {t('logout')}
                    </Button>
                  </div>
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
