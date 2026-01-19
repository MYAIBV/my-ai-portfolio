'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import SearchBar from '@/components/ui/SearchBar';
import ShowcaseGrid from '@/components/showcase/ShowcaseGrid';
import ShowcaseModal from '@/components/showcase/ShowcaseModal';
import CategoryFilter from '@/components/showcase/CategoryFilter';
import { ShowcaseItem, Category, CATEGORIES, SupportedLocale, getLocalizedContent } from '@/lib/types';

export default function HomePage() {
  const t = useTranslations('home');
  const locale = useLocale() as SupportedLocale;
  const [items, setItems] = useState<ShowcaseItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category | 'all'>('all');
  const [selectedItem, setSelectedItem] = useState<ShowcaseItem | null>(null);

  useEffect(() => {
    async function fetchItems() {
      try {
        const res = await fetch('/api/showcase?public=true');
        if (res.ok) {
          const data = await res.json();
          setItems(data.items);
        }
      } catch (error) {
        console.error('Error fetching items:', error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchItems();
  }, []);

  // Handle selecting an item - update URL to project slug
  const handleSelectItem = useCallback((item: ShowcaseItem) => {
    setSelectedItem(item);
    // Use locale-specific slug if available
    const localizedContent = item.title_nl && item.title_en
      ? getLocalizedContent(item, locale)
      : { slug: item.slug };
    const slug = localizedContent.slug || item.slug;

    if (slug) {
      window.history.pushState(
        { modal: true, slug },
        '',
        `/${locale}/project/${slug}`
      );
    }
  }, [locale]);

  // Handle closing modal - revert URL to homepage
  const handleCloseModal = useCallback(() => {
    setSelectedItem(null);
    window.history.pushState(null, '', `/${locale}`);
  }, [locale]);

  // Handle browser back button
  useEffect(() => {
    const handlePopState = () => {
      // If we're back on the homepage, close the modal
      if (!window.location.pathname.includes('/project/')) {
        setSelectedItem(null);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const filteredItems = useMemo(() => {
    let result = items;

    if (selectedCategory !== 'all') {
      result = result.filter((item) => item.categories.includes(selectedCategory));
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter((item) => {
        // Get localized content for searching
        const localizedContent = item.title_nl && item.title_en
          ? getLocalizedContent(item, locale)
          : { title: item.title, description: item.description };

        return (
          localizedContent.title.toLowerCase().includes(query) ||
          localizedContent.description.toLowerCase().includes(query) ||
          item.keywords.some((k) => k.toLowerCase().includes(query))
        );
      });
    }

    return result;
  }, [items, selectedCategory, searchQuery, locale]);

  return (
    <div className="max-w-[1440px] mx-auto px-6 md:px-12 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
          {t('title')}
        </h1>
        <p className="text-xl text-slate-600 dark:text-slate-400">
          {t('subtitle')}
        </p>
      </div>

      <div className="mb-8 space-y-4">
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder={t('searchPlaceholder')}
        />
        <CategoryFilter
          categories={CATEGORIES}
          selected={selectedCategory}
          onChange={setSelectedCategory}
        />
      </div>

      <ShowcaseGrid
        items={filteredItems}
        isLoading={isLoading}
        onSelect={handleSelectItem}
      />

      <ShowcaseModal
        item={selectedItem}
        onClose={handleCloseModal}
      />
    </div>
  );
}
