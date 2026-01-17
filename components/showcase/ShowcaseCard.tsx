'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';
import Button from '../ui/Button';
import { ShowcaseItem } from '@/lib/types';

interface ShowcaseCardProps {
  item: ShowcaseItem;
  showActions?: boolean;
  onClick?: (item: ShowcaseItem) => void;
  onEdit?: (item: ShowcaseItem) => void;
  onDelete?: (item: ShowcaseItem) => void;
}

export default function ShowcaseCard({
  item,
  showActions,
  onClick,
  onEdit,
  onDelete,
}: ShowcaseCardProps) {
  const t = useTranslations('showcase');
  const tCommon = useTranslations('common');

  return (
    <div
      className="relative h-72 rounded-xl overflow-hidden group cursor-pointer shadow-lg dark:shadow-gray-900/30"
      onClick={() => onClick?.(item)}
    >
      {/* Background Image */}
      <div className="absolute inset-0 bg-gray-100 dark:bg-gray-700">
        {item.image_url ? (
          <Image
            src={item.image_url}
            alt={item.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
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
      </div>

      {/* Private badge */}
      {!item.is_public && (
        <span className="absolute top-3 right-3 z-10 px-2 py-1 text-xs font-medium bg-amber-100/90 text-amber-800 dark:bg-amber-900/90 dark:text-amber-200 rounded-full backdrop-blur-sm">
          {t('private')}
        </span>
      )}

      {/* Content overlay - bottom only by default, expands on hover */}
      <div className="absolute inset-x-0 bottom-0 bg-black/60 translate-y-[calc(100%-3.5rem)] group-hover:translate-y-0 transition-transform duration-300 ease-out">
        <div className="p-4 flex flex-col">
          {/* Title - always visible */}
          <h3 className="text-lg font-semibold text-white mb-1">
            {item.title}
          </h3>

          {/* Description - revealed on hover */}
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
          <p className="text-sm text-gray-200 mb-3 line-clamp-2">
            {item.description}
          </p>

          {showActions && (
            <div className="flex gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit?.(item);
                }}
              >
                {tCommon('edit')}
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete?.(item);
                }}
              >
                {tCommon('delete')}
              </Button>
            </div>
          )}
        </div>
        </div>
      </div>
    </div>
  );
}
