'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import SearchBar from '@/components/ui/SearchBar';
import ShowcaseGrid from '@/components/showcase/ShowcaseGrid';
import ShowcaseModal from '@/components/showcase/ShowcaseModal';
import CategoryFilter from '@/components/showcase/CategoryFilter';
import VisibilityFilter, { VisibilityOption } from '@/components/showcase/VisibilityFilter';
import { ShowcaseItem, Category, CATEGORIES } from '@/lib/types';
import { useAuth } from '@/hooks/useAuth';
import { generateSlug } from '@/lib/slug';

interface DashboardSlugPageProps {
  params: { slug: string };
}

export default function DashboardSlugPage({ params }: DashboardSlugPageProps) {
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
  const [selectedVisibility, setSelectedVisibility] = useState<VisibilityOption>('all');
  const [selectedItem, setSelectedItem] = useState<ShowcaseItem | null>(null);
  const [deleteModal, setDeleteModal] = useState<ShowcaseItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push(`/${locale}/login`);
    }
  }, [authLoading, isAuthenticated, router, locale]);

  // Fetch initial item by slug
  useEffect(() => {
    async function fetchInitialItem() {
      try {
        const res = await fetch(`/api/showcase/by-slug/${params.slug}`);
        if (res.ok) {
          const data = await res.json();
          setSelectedItem(data.item);
        }
      } catch (error) {
        console.error('Error fetching item by slug:', error);
      }
    }

    if (isAuthenticated && params.slug) {
      fetchInitialItem();
    }
  }, [isAuthenticated, params.slug]);

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

  // Get slug for item (use existing slug or generate from title)
  const getItemSlug = useCallback((item: ShowcaseItem) => {
    return item.slug || generateSlug(item.title);
  }, []);

  // Handle selecting an item - update URL to dashboard slug
  const handleSelectItem = useCallback((item: ShowcaseItem) => {
    setSelectedItem(item);
    const slug = getItemSlug(item);
    window.history.pushState(
      { modal: true, slug },
      '',
      `/${locale}/dashboard/${slug}`
    );
  }, [locale, getItemSlug]);

  // Handle closing modal - revert URL to dashboard
  const handleCloseModal = useCallback(() => {
    setSelectedItem(null);
    window.history.pushState(null, '', `/${locale}/dashboard`);
  }, [locale]);

  // Handle browser back button
  useEffect(() => {
    const handlePopState = () => {
      if (window.location.pathname === `/${locale}/dashboard`) {
        setSelectedItem(null);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [locale]);

  const filteredItems = useMemo(() => {
    let result = items;

    if (selectedCategory !== 'all') {
      result = result.filter((item) => item.categories.includes(selectedCategory));
    }

    if (selectedVisibility !== 'all') {
      const isPublic = selectedVisibility === 'public';
      result = result.filter((item) => item.is_public === isPublic);
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
  }, [items, selectedCategory, selectedVisibility, searchQuery]);

  const handleEdit = useCallback((item: ShowcaseItem) => {
    const slug = getItemSlug(item);
    router.push(`/${locale}/dashboard/${slug}/edit`);
  }, [locale, router, getItemSlug]);

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
        if (selectedItem?.id === deleteModal.id) {
          handleCloseModal();
        }
      }
    } catch (error) {
      console.error('Error deleting item:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleModalEdit = useCallback(() => {
    if (selectedItem) {
      handleEdit(selectedItem);
    }
  }, [selectedItem, handleEdit]);

  const handleModalDelete = useCallback(() => {
    if (selectedItem) {
      setDeleteModal(selectedItem);
    }
  }, [selectedItem]);

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
    <div className="max-w-[1440px] mx-auto px-6 md:px-12 py-12">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            {t('title')}
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            {t('subtitle')}
          </p>
        </div>
        <Link href={`/${locale}/showcase/new`}>
          <Button variant="primary">{tShowcase('addNew')}</Button>
        </Link>
      </div>

      <div className="mb-8 space-y-4">
        <SearchBar value={searchQuery} onChange={setSearchQuery} />
        <div className="flex flex-wrap gap-4">
          <CategoryFilter
            categories={CATEGORIES}
            selected={selectedCategory}
            onChange={setSelectedCategory}
          />
          <div className="flex items-center gap-2 border-l border-slate-200 dark:border-slate-700 pl-4">
            <VisibilityFilter
              selected={selectedVisibility}
              onChange={setSelectedVisibility}
            />
          </div>
        </div>
      </div>

      <div className="mb-4 text-sm text-slate-500 dark:text-slate-400">
        {t('allProjects')}: {filteredItems.length}
      </div>

      <ShowcaseGrid
        items={filteredItems}
        isLoading={isLoading}
        showActions
        onSelect={handleSelectItem}
        onEdit={handleEdit}
        onDelete={(item) => setDeleteModal(item)}
      />

      <ShowcaseModal
        item={selectedItem}
        onClose={handleCloseModal}
        onEdit={handleModalEdit}
        onDelete={handleModalDelete}
      />

      <Modal
        isOpen={!!deleteModal}
        onClose={() => setDeleteModal(null)}
        title={tShowcase('deleteProject')}
      >
        <p className="text-slate-600 dark:text-slate-400 mb-6">
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
