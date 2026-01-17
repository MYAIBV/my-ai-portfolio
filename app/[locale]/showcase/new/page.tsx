'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import Card from '@/components/ui/Card';
import ShowcaseForm from '@/components/showcase/ShowcaseForm';
import { useAuth } from '@/hooks/useAuth';

export default function NewShowcasePage() {
  const t = useTranslations('showcase');
  const locale = useLocale();
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push(`/${locale}/login`);
    }
  }, [authLoading, isAuthenticated, router, locale]);

  const handleSubmit = async (data: Parameters<typeof ShowcaseForm>[0]['onSubmit'] extends (data: infer D) => unknown ? D : never) => {
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/showcase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        router.push(`/${locale}/dashboard`);
      }
    } catch (error) {
      console.error('Error creating item:', error);
    } finally {
      setIsSubmitting(false);
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
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
        {t('addNew')}
      </h1>
      <Card variant="elevated" className="p-6">
        <ShowcaseForm onSubmit={handleSubmit} isLoading={isSubmitting} />
      </Card>
    </div>
  );
}
