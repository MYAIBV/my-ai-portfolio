'use client';

import { useTranslations } from 'next-intl';

export type VisibilityOption = 'all' | 'public' | 'private';

interface VisibilityFilterProps {
  selected: VisibilityOption;
  onChange: (visibility: VisibilityOption) => void;
}

export default function VisibilityFilter({
  selected,
  onChange,
}: VisibilityFilterProps) {
  const t = useTranslations('dashboard');

  const options: { value: VisibilityOption; label: string }[] = [
    { value: 'all', label: t('allProjects') },
    { value: 'public', label: t('publicProjects') },
    { value: 'private', label: t('privateProjects') },
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => (
        <button
          key={option.value}
          onClick={() => onChange(option.value)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            selected === option.value
              ? 'bg-primary-600 text-white'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
