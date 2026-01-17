'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import SearchBar from '@/components/ui/SearchBar';
import ShowcaseGrid from '@/components/showcase/ShowcaseGrid';
import CategoryFilter from '@/components/showcase/CategoryFilter';
import { ShowcaseItem, Category, CATEGORIES } from '@/lib/types';
import { useAuth } from '@/hooks/useAuth';

export default function DashboardPage() {
  const t = useTranslations('dashboard');
  const tCommon = useTranslations('common');
  const tShowcase = useTranslations('showcase');
  const locale = useLocale();
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();

  const [items, setItems] = useState<ShowcaseItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category | 'all'>('all');
  const [deleteModal, setDeleteModal] = useState<ShowcaseItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push(`/${locale}/login`);
    }
  }, [authLoading, isAuthenticated, router, locale]);

  useEffect(() => {
    async function fetchItems() {
      try {
        const res = await fetch('/api/showcase');
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

    if (isAuthenticated) {
      fetchItems();
    }
  }, [isAuthenticated]);

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

  const handleEdit = (item: ShowcaseItem) => {
    router.push(`/${locale}/showcase/${item.id}/edit`);
  };

  const handleDelete = async () => {
    if (!deleteModal) return;

    setIsDeleting(true);
    try {
      const res = await fetch(`/api/showcase/${deleteModal.id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setItems((prev) => prev.filter((item) => item.id !== deleteModal.id));
        setDeleteModal(null);
      }
    } catch (error) {
      console.error('Error deleting item:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {t('title')}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {t('subtitle')}
          </p>
        </div>
        <Link href={`/${locale}/showcase/new`}>
          <Button variant="primary">{tShowcase('addNew')}</Button>
        </Link>
      </div>

      <div className="mb-8 space-y-4">
        <SearchBar value={searchQuery} onChange={setSearchQuery} />
        <CategoryFilter
          categories={CATEGORIES}
          selected={selectedCategory}
          onChange={setSelectedCategory}
        />
      </div>

      <div className="mb-4 text-sm text-gray-500 dark:text-gray-400">
        {t('allProjects')}: {filteredItems.length}
      </div>

      <ShowcaseGrid
        items={filteredItems}
        isLoading={isLoading}
        showActions
        onEdit={handleEdit}
        onDelete={(item) => setDeleteModal(item)}
      />

      <Modal
        isOpen={!!deleteModal}
        onClose={() => setDeleteModal(null)}
        title={tShowcase('deleteProject')}
      >
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          {tShowcase('deleteConfirm')}
        </p>
        <div className="flex gap-3 justify-end">
          <Button variant="secondary" onClick={() => setDeleteModal(null)}>
            {tCommon('cancel')}
          </Button>
          <Button
            variant="danger"
            onClick={handleDelete}
            isLoading={isDeleting}
          >
            {tCommon('delete')}
          </Button>
        </div>
      </Modal>
    </div>
  );
}
