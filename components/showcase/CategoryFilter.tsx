'use client';

import { useTranslations } from 'next-intl';
import { Category } from '@/lib/types';

interface CategoryFilterProps {
  categories: readonly Category[];
  selected: Category | 'all';
  onChange: (category: Category | 'all') => void;
}

export default function CategoryFilter({
  categories,
  selected,
  onChange,
}: CategoryFilterProps) {
  const t = useTranslations('home');
  const tCategories = useTranslations('categories');

  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => onChange('all')}
        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
          selected === 'all'
            ? 'bg-primary-600 text-white'
            : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
        }`}
      >
        {t('allCategories')}
      </button>
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => onChange(cat)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            selected === cat
              ? 'bg-primary-600 text-white'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
          }`}
        >
          {tCategories(cat)}
        </button>
      ))}
    </div>
  );
}
