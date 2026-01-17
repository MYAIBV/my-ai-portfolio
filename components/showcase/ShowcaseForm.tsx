'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import Input from '../ui/Input';
import Textarea from '../ui/Textarea';
import Button from '../ui/Button';
import { ShowcaseItem, Category, CATEGORIES } from '@/lib/types';

interface ShowcaseFormProps {
  initialData?: Partial<ShowcaseItem>;
  onSubmit: (data: Omit<ShowcaseItem, 'id' | 'created_by' | 'created_at' | 'updated_at'>) => Promise<void>;
  isLoading?: boolean;
}

export default function ShowcaseForm({
  initialData,
  onSubmit,
  isLoading,
}: ShowcaseFormProps) {
  const t = useTranslations('showcase.form');
  const tCategories = useTranslations('categories');
  const tCommon = useTranslations('common');

  const [title, setTitle] = useState(initialData?.title || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [appUrl, setAppUrl] = useState(initialData?.app_url || '');
  const [imageUrl, setImageUrl] = useState(initialData?.image_url || '');
  const [categories, setCategories] = useState<Category[]>(
    initialData?.categories || []
  );
  const [keywords, setKeywords] = useState(
    initialData?.keywords?.join(', ') || ''
  );
  const [isPublic, setIsPublic] = useState(initialData?.is_public ?? true);
  const [isUploading, setIsUploading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCategoryToggle = (cat: Category) => {
    setCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        setImageUrl(data.url);
      } else {
        console.error('Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const keywordList = keywords
      .split(',')
      .map((k) => k.trim())
      .filter((k) => k.length > 0);

    await onSubmit({
      title,
      description,
      image_url: imageUrl,
      app_url: appUrl,
      categories,
      keywords: keywordList,
      is_public: isPublic,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Row 1: Title and App URL */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label={t('title')}
          placeholder={t('titlePlaceholder')}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <Input
          label={t('appUrl')}
          type="url"
          placeholder={t('appUrlPlaceholder')}
          value={appUrl}
          onChange={(e) => setAppUrl(e.target.value)}
          required
        />
      </div>

      {/* Row 2: Description and Image */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Textarea
          label={t('description')}
          placeholder={t('descriptionPlaceholder')}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          rows={6}
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('image')}
          </label>
          <div
            onClick={() => fileInputRef.current?.click()}
            className="relative w-full aspect-video rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-primary-500 dark:hover:border-primary-500 transition-colors cursor-pointer group"
          >
            {imageUrl ? (
              <>
                <Image
                  src={imageUrl}
                  alt="Preview"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="text-white text-sm font-medium">
                    {t('changeImage')}
                  </span>
                </div>
              </>
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400 group-hover:text-primary-500 transition-colors">
                <svg
                  className="w-10 h-10 mb-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <span className="text-sm font-medium">{t('uploadImage')}</span>
                {isUploading && (
                  <div className="absolute inset-0 bg-white/80 dark:bg-gray-900/80 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                  </div>
                )}
              </div>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
        </div>
      </div>

      {/* Row 3: Categories (full width) */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {t('categories')}
        </label>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => handleCategoryToggle(cat)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                categories.includes(cat)
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              {tCategories(cat)}
            </button>
          ))}
        </div>
      </div>

      {/* Row 4: Keywords and Visibility */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label={t('keywords')}
          placeholder={t('keywordsPlaceholder')}
          value={keywords}
          onChange={(e) => setKeywords(e.target.value)}
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('visibility')}
          </label>
          <div className="flex gap-4 h-10 items-center">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="visibility"
                checked={isPublic}
                onChange={() => setIsPublic(true)}
                className="w-4 h-4 text-primary-600"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                {useTranslations('showcase')('public')}
              </span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="visibility"
                checked={!isPublic}
                onChange={() => setIsPublic(false)}
                className="w-4 h-4 text-primary-600"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                {useTranslations('showcase')('private')}
              </span>
            </label>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
        <Button type="submit" variant="primary" isLoading={isLoading}>
          {tCommon('save')}
        </Button>
        <Button
          type="button"
          variant="secondary"
          onClick={() => window.history.back()}
        >
          {tCommon('cancel')}
        </Button>
      </div>
    </form>
  );
}
