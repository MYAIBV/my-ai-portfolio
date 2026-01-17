'use client';

import { useTranslations } from 'next-intl';

export default function Footer() {
  const t = useTranslations('footer');
  const year = new Date().getFullYear();

  return (
    <footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 py-4">
        <div className="text-center text-sm text-gray-500 dark:text-gray-400">
          {t('copyright', { year })}
        </div>
      </div>
    </footer>
  );
}
