'use client';

import { useState, useEffect, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import SearchBar from '@/components/ui/SearchBar';
import ShowcaseGrid from '@/components/showcase/ShowcaseGrid';
import CategoryFilter from '@/components/showcase/CategoryFilter';
import { ShowcaseItem, Category, CATEGORIES } from '@/lib/types';

export default function HomePage() {
  const t = useTranslations('home');
  const [items, setItems] = useState<ShowcaseItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category | 'all'>('all');

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

  const filteredItems = useMemo(() => {
    let result = items;

    if (selectedCategory !== 'all') {
      result = result.filter((item) => item.categories.includes(selectedCategory));
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (item) =>
          item.title.toLowerCase().includes(query) ||
          item.description.toLowerCase().includes(query) ||
          item.keywords.some((k) => k.toLowerCase().includes(query))
      );
    }

    return result;
  }, [items, selectedCategory, searchQuery]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          {t('title')}
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400">
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

      <ShowcaseGrid items={filteredItems} isLoading={isLoading} />
    </div>
  );
}
