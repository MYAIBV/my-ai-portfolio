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
    <div className="flex items-center gap-1">
      {/* Globe icon */}
      <svg className="w-4 h-4 text-slate-600 dark:text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
      </svg>
      <button
        onClick={() => switchLocale('en')}
        className={`px-2 py-1 rounded text-sm font-medium transition-colors ${
          locale === 'en'
            ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
            : 'text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400'
        }`}
      >
        EN
      </button>
      <button
        onClick={() => switchLocale('nl')}
        className={`px-2 py-1 rounded text-sm font-medium transition-colors ${
          locale === 'nl'
            ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
            : 'text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400'
        }`}
      >
        NL
      </button>
    </div>
  );
}
