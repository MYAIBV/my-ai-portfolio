'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { ShowcaseItem } from '@/lib/types';

interface ShowcaseCardProps {
  item: ShowcaseItem;
  showActions?: boolean;
  onEdit?: (item: ShowcaseItem) => void;
  onDelete?: (item: ShowcaseItem) => void;
}

export default function ShowcaseCard({
  item,
  showActions,
  onEdit,
  onDelete,
}: ShowcaseCardProps) {
  const t = useTranslations('showcase');
  const tCommon = useTranslations('common');
  const tCategories = useTranslations('categories');

  return (
    <Card variant="elevated" className="flex flex-col overflow-hidden group">
      <div className="relative h-48 bg-gray-100 dark:bg-gray-700 overflow-hidden">
        {item.image_url ? (
          <Image
            src={item.image_url}
            alt={item.title}
            fill
            className="object-cover transition-transform group-hover:scale-105"
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <svg
              className="w-16 h-16 text-gray-300 dark:text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        )}
        {!item.is_public && (
          <span className="absolute top-2 right-2 px-2 py-1 text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200 rounded-full">
            {t('private')}
          </span>
        )}
      </div>

      <div className="flex-1 p-4 flex flex-col">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          {item.title}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
          {item.description}
        </p>

        <div className="flex flex-wrap gap-1 mb-4">
          {item.categories.map((cat) => (
            <span
              key={cat}
              className="px-2 py-0.5 text-xs font-medium bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300 rounded-full"
            >
              {tCategories(cat)}
            </span>
          ))}
        </div>

        <div className="mt-auto flex gap-2">
          <a
            href={item.app_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1"
          >
            <Button variant="primary" size="sm" className="w-full">
              {t('viewProject')}
            </Button>
          </a>
          {showActions && (
            <>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => onEdit?.(item)}
              >
                {tCommon('edit')}
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={() => onDelete?.(item)}
              >
                {tCommon('delete')}
              </Button>
            </>
          )}
        </div>
      </div>
    </Card>
  );
}
