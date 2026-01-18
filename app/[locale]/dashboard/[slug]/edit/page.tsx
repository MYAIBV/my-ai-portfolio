'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import Card from '@/components/ui/Card';
import ShowcaseForm from '@/components/showcase/ShowcaseForm';
import { useAuth } from '@/hooks/useAuth';
import { ShowcaseItem } from '@/lib/types';

interface EditShowcasePageProps {
  params: { slug: string };
}

export default function EditShowcasePage({ params }: EditShowcasePageProps) {
  const t = useTranslations('showcase');
  const locale = useLocale();
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();

  const [item, setItem] = useState<ShowcaseItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push(`/${locale}/login`);
    }
  }, [authLoading, isAuthenticated, router, locale]);

  useEffect(() => {
    async function fetchItem() {
      try {
        // First try to fetch by slug
        const res = await fetch(`/api/showcase/by-slug/${params.slug}`);
        if (res.ok) {
          const data = await res.json();
          setItem(data.item);
        } else {
          // If not found by slug, the slug might be an ID (for backward compatibility)
          const idRes = await fetch(`/api/showcase/${params.slug}`);
          if (idRes.ok) {
            const data = await idRes.json();
            setItem(data.item);
          } else {
            router.push(`/${locale}/dashboard`);
          }
        }
      } catch (error) {
        console.error('Error fetching item:', error);
        router.push(`/${locale}/dashboard`);
      } finally {
        setIsLoading(false);
      }
    }

    if (isAuthenticated) {
      fetchItem();
    }
  }, [isAuthenticated, params.slug, router, locale]);

  const handleSubmit = async (data: Parameters<typeof ShowcaseForm>[0]['onSubmit'] extends (data: infer D) => unknown ? D : never) => {
    if (!item) return;

    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/showcase/${item.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        const updatedData = await res.json();
        // Redirect to dashboard, or if slug changed, update URL
        if (updatedData.item.slug !== params.slug) {
          router.push(`/${locale}/dashboard`);
        } else {
          router.push(`/${locale}/dashboard`);
        }
      }
    } catch (error) {
      console.error('Error updating item:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (authLoading || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!isAuthenticated || !item) {
    return null;
  }

  return (
    <div className="max-w-[1440px] mx-auto px-6 md:px-12 py-12">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
        {t('editProject')}
      </h1>
      <Card variant="elevated" className="p-6 sm:p-8">
        <ShowcaseForm
          initialData={item}
          onSubmit={handleSubmit}
          isLoading={isSubmitting}
        />
      </Card>
    </div>
  );
}
