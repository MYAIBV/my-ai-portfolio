'use client';

import { useLocale } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const switchLocale = (newLocale: string) => {
    const newPath = pathname.replace(`/${locale}`, `/${newLocale}`);
    router.push(newPath);
  };

  return (
    <div className="flex items-center gap-1 text-sm">
      <button
        onClick={() => switchLocale('nl')}
        className={`px-2 py-1 rounded transition-colors ${
          locale === 'nl'
            ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300'
            : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400'
        }`}
      >
        NL
      </button>
      <button
        onClick={() => switchLocale('en')}
        className={`px-2 py-1 rounded transition-colors ${
          locale === 'en'
            ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300'
            : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400'
        }`}
      >
        EN
      </button>
    </div>
  );
}
