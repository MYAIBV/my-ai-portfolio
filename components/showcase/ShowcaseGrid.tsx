'use client';

import { useTranslations } from 'next-intl';
import ShowcaseCard from './ShowcaseCard';
import { ShowcaseItem } from '@/lib/types';

interface ShowcaseGridProps {
  items: ShowcaseItem[];
  isLoading?: boolean;
  showActions?: boolean;
  linkToProject?: boolean;
  onSelect?: (item: ShowcaseItem) => void;
  onEdit?: (item: ShowcaseItem) => void;
  onDelete?: (item: ShowcaseItem) => void;
}

export default function ShowcaseGrid({
  items,
  isLoading,
  showActions,
  linkToProject,
  onSelect,
  onEdit,
  onDelete,
}: ShowcaseGridProps) {
  const t = useTranslations('common');

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="animate-pulse bg-gray-200 dark:bg-gray-700 rounded-xl h-80"
          />
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400">{t('noResults')}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((item) => (
        <ShowcaseCard
          key={item.id}
          item={item}
          showActions={showActions}
          linkToProject={linkToProject}
          onClick={onSelect}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
