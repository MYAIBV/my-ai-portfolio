'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import Button from '../ui/Button';
import { ShowcaseItem } from '@/lib/types';

interface ShowcaseModalProps {
  item: ShowcaseItem | null;
  onClose: () => void;
}

export default function ShowcaseModal({ item, onClose }: ShowcaseModalProps) {
  const t = useTranslations('showcase');

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

  if (!item) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      {/* Modal content - horizontal layout, 85% screen size */}
      <div
        className="relative w-[85vw] h-[85vh] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row animate-in zoom-in-95 duration-300"
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

        {/* Image - left side */}
        <div className="relative w-full md:w-3/5 h-64 md:h-full bg-slate-100 dark:bg-slate-800 flex-shrink-0">
          {item.image_url ? (
            <Image
              src={item.image_url}
              alt={item.title}
              fill
              className="object-cover"
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

        {/* Content - right side */}
        <div className="w-full md:w-2/5 h-full p-8 sm:p-12 overflow-y-auto flex flex-col justify-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-6">
            {item.title}
          </h2>

          <p className="text-xl sm:text-2xl text-slate-600 dark:text-slate-300 leading-relaxed mb-8">
            {item.description}
          </p>

          {/* Open app button */}
          <div className="mt-auto pt-6">
            <a
              href={item.app_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block"
            >
              <Button variant="primary" size="lg" className="text-lg px-8 py-4">
                {t('viewProject')}
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </Button>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
