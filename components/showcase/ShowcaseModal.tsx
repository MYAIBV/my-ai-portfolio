'use client';

import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import { useTranslations, useLocale } from 'next-intl';
import Button from '../ui/Button';
import { ShowcaseItem } from '@/lib/types';

interface ShowcaseModalProps {
  item: ShowcaseItem | null;
  onClose: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

export default function ShowcaseModal({ item, onClose, onEdit, onDelete }: ShowcaseModalProps) {
  const t = useTranslations('showcase');
  const tCommon = useTranslations('common');
  const locale = useLocale();
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const [objectPosition, setObjectPosition] = useState('center center');
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (item) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [item, onClose]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageContainerRef.current) return;

    const rect = imageContainerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    setObjectPosition(`${x}% ${y}%`);
  };

  if (!item) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      {/* Modal content - stacks on mobile, horizontal on desktop */}
      <div
        className="relative w-[95vw] md:w-[85vw] max-h-[90vh] md:h-[85vh] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row animate-in zoom-in-95 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/50 hover:bg-black/70 text-white transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Image - top on mobile, left side on desktop */}
        <div
          ref={imageContainerRef}
          className="relative w-full md:w-3/5 h-48 sm:h-64 md:h-full bg-slate-100 dark:bg-slate-800 flex-shrink-0 overflow-hidden"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
          onMouseMove={handleMouseMove}
        >
          {item.image_url ? (
            <Image
              src={item.image_url}
              alt={item.title}
              fill
              className="transition-[object-position] duration-100 ease-out"
              style={{
                objectFit: 'cover',
                objectPosition: isHovering ? objectPosition : 'center center',
              }}
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <svg
                className="w-24 h-24 text-slate-300 dark:text-slate-600"
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

          {/* Private badge */}
          {!item.is_public && (
            <span className="absolute top-4 left-4 px-3 py-1 text-sm font-medium bg-amber-100/90 text-amber-800 dark:bg-amber-900/90 dark:text-amber-200 rounded-full backdrop-blur-sm">
              {t('private')}
            </span>
          )}
        </div>

        {/* Content - bottom on mobile, right side on desktop */}
        <div className="w-full md:w-2/5 md:h-full p-4 sm:p-6 md:p-8 lg:p-12 overflow-y-auto">
          <div className="flex flex-col md:justify-center md:min-h-full">
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-2 md:mb-6">
              {item.title}
            </h2>

            <p className="text-sm sm:text-base md:text-xl lg:text-2xl text-slate-600 dark:text-slate-300 leading-relaxed mb-4 md:mb-8">
              {item.description}
            </p>

            {/* Action buttons */}
            <div className="md:mt-auto pt-2 md:pt-6 flex flex-wrap gap-3">
              {item.app_url && (
                <a
                  href={item.app_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block"
                >
                  <Button variant="primary" size="md" className="md:text-lg md:px-8 md:py-4">
                    {t('viewProject')}
                    <svg className="w-4 h-4 md:w-5 md:h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </Button>
                </a>
              )}
              <a
                href={`https://my-ai.nl/${locale}/contact`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block"
              >
                <Button variant="secondary" size="md" className="md:text-lg md:px-8 md:py-4">
                  {t('contactUs')}
                  <svg className="w-4 h-4 md:w-5 md:h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </Button>
              </a>
            </div>

            {/* Admin actions - only shown when callbacks are provided */}
            {(onEdit || onDelete) && (
              <div className="pt-4 mt-4 border-t border-slate-200 dark:border-slate-700 flex gap-3">
                {onEdit && (
                  <Button variant="secondary" size="sm" onClick={onEdit}>
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    {tCommon('edit')}
                  </Button>
                )}
                {onDelete && (
                  <Button variant="danger" size="sm" onClick={onDelete}>
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    {tCommon('delete')}
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
