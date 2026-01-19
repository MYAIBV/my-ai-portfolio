'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import Input from '../ui/Input';
import Textarea from '../ui/Textarea';
import Button from '../ui/Button';
import { ShowcaseItem, Category, CATEGORIES, SupportedLocale } from '@/lib/types';
import { generateSlug, validateSlug } from '@/lib/slug';

interface ShowcaseFormProps {
  initialData?: Partial<ShowcaseItem>;
  onSubmit: (data: Omit<ShowcaseItem, 'id' | 'created_by' | 'created_at' | 'updated_at'>) => Promise<void>;
  isLoading?: boolean;
}

type Language = 'nl' | 'en';

const LANGUAGES: { code: Language; label: string }[] = [
  { code: 'nl', label: 'Nederlands' },
  { code: 'en', label: 'English' },
];

export default function ShowcaseForm({
  initialData,
  onSubmit,
  isLoading,
}: ShowcaseFormProps) {
  const t = useTranslations('showcase.form');
  const tCategories = useTranslations('categories');
  const tCommon = useTranslations('common');

  // Current language tab
  const [activeLanguage, setActiveLanguage] = useState<Language>('nl');

  // Multilingual content state
  const [titles, setTitles] = useState<Record<Language, string>>({
    nl: initialData?.title_nl || initialData?.title || '',
    en: initialData?.title_en || initialData?.title || '',
  });
  const [slugs, setSlugs] = useState<Record<Language, string>>({
    nl: initialData?.slug_nl || initialData?.slug || '',
    en: initialData?.slug_en || initialData?.slug || '',
  });
  const [slugsTouched, setSlugsTouched] = useState<Record<Language, boolean>>({
    nl: !!(initialData?.slug_nl || initialData?.slug),
    en: !!(initialData?.slug_en || initialData?.slug),
  });
  const [slugErrors, setSlugErrors] = useState<Record<Language, string>>({
    nl: '',
    en: '',
  });
  const [isCheckingSlug, setIsCheckingSlug] = useState<Record<Language, boolean>>({
    nl: false,
    en: false,
  });
  const [descriptions, setDescriptions] = useState<Record<Language, string>>({
    nl: initialData?.description_nl || initialData?.description || '',
    en: initialData?.description_en || initialData?.description || '',
  });

  // AI loading states
  const [isTranslating, setIsTranslating] = useState<Record<string, boolean>>({});
  const [isSuggesting, setIsSuggesting] = useState<Record<string, boolean>>({});

  // Other fields
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

  // Auto-generate slug when title changes (if slug hasn't been manually edited)
  useEffect(() => {
    LANGUAGES.forEach(({ code }) => {
      if (!slugsTouched[code] && titles[code]) {
        const generatedSlug = generateSlug(titles[code]);
        setSlugs(prev => ({ ...prev, [code]: generatedSlug }));
      }
    });
  }, [titles, slugsTouched]);

  // Validate slug and check uniqueness
  useEffect(() => {
    const lang = activeLanguage;
    const slug = slugs[lang];

    if (!slug) {
      setSlugErrors(prev => ({ ...prev, [lang]: '' }));
      return;
    }

    if (!validateSlug(slug)) {
      setSlugErrors(prev => ({ ...prev, [lang]: t('slugInvalid') }));
      return;
    }

    // Debounce uniqueness check
    const timeoutId = setTimeout(async () => {
      setIsCheckingSlug(prev => ({ ...prev, [lang]: true }));
      try {
        const res = await fetch(`/api/showcase/by-slug/${slug}?locale=${lang}`);
        if (res.ok) {
          const data = await res.json();
          // If we're editing and it's the same item, no conflict
          if (initialData?.id && data.item?.id === initialData.id) {
            setSlugErrors(prev => ({ ...prev, [lang]: '' }));
          } else {
            setSlugErrors(prev => ({ ...prev, [lang]: t('slugTaken') }));
          }
        } else {
          setSlugErrors(prev => ({ ...prev, [lang]: '' }));
        }
      } catch {
        setSlugErrors(prev => ({ ...prev, [lang]: '' }));
      } finally {
        setIsCheckingSlug(prev => ({ ...prev, [lang]: false }));
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [slugs, activeLanguage, initialData?.id, t]);

  const handleSlugChange = (lang: Language, value: string) => {
    // Normalize input: lowercase, replace spaces with hyphens
    const normalized = value.toLowerCase().replace(/\s+/g, '-');
    setSlugs(prev => ({ ...prev, [lang]: normalized }));
    setSlugsTouched(prev => ({ ...prev, [lang]: true }));
  };

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

  // AI: Translate content from one language to another
  const handleTranslate = async (field: 'title' | 'description', fromLang: Language) => {
    const toLang: Language = fromLang === 'nl' ? 'en' : 'nl';
    const key = `${field}_${fromLang}_${toLang}`;

    const text = field === 'title' ? titles[fromLang] : descriptions[fromLang];
    if (!text.trim()) return;

    setIsTranslating(prev => ({ ...prev, [key]: true }));
    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'translate',
          text,
          fromLang,
          toLang,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (field === 'title') {
          setTitles(prev => ({ ...prev, [toLang]: data.result }));
          // Also generate slug for the translated title if not touched
          if (!slugsTouched[toLang]) {
            setSlugs(prev => ({ ...prev, [toLang]: generateSlug(data.result) }));
          }
        } else {
          setDescriptions(prev => ({ ...prev, [toLang]: data.result }));
        }
      }
    } catch (error) {
      console.error('Translation error:', error);
    } finally {
      setIsTranslating(prev => ({ ...prev, [key]: false }));
    }
  };

  // AI: Suggest content
  const handleSuggest = async (field: 'title' | 'description', lang: Language) => {
    const key = `${field}_${lang}`;

    setIsSuggesting(prev => ({ ...prev, [key]: true }));
    try {
      const keywordList = keywords
        .split(',')
        .map((k) => k.trim())
        .filter((k) => k.length > 0);

      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'suggest',
          field,
          language: lang,
          context: {
            existingTitle: titles[lang],
            existingDescription: descriptions[lang],
            categories: categories.map(c => tCategories(c)),
            keywords: keywordList,
          },
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (field === 'title') {
          setTitles(prev => ({ ...prev, [lang]: data.result }));
          // Also generate slug for the suggested title if not touched
          if (!slugsTouched[lang]) {
            setSlugs(prev => ({ ...prev, [lang]: generateSlug(data.result) }));
          }
        } else {
          setDescriptions(prev => ({ ...prev, [lang]: data.result }));
        }
      }
    } catch (error) {
      console.error('Suggestion error:', error);
    } finally {
      setIsSuggesting(prev => ({ ...prev, [key]: false }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const keywordList = keywords
      .split(',')
      .map((k) => k.trim())
      .filter((k) => k.length > 0);

    await onSubmit({
      title: titles.nl, // Default to Dutch
      slug: slugs.nl,
      description: descriptions.nl,
      title_nl: titles.nl,
      title_en: titles.en,
      slug_nl: slugs.nl,
      slug_en: slugs.en,
      description_nl: descriptions.nl,
      description_en: descriptions.en,
      image_url: imageUrl,
      app_url: appUrl,
      categories,
      keywords: keywordList,
      is_public: isPublic,
    });
  };

  const otherLang: Language = activeLanguage === 'nl' ? 'en' : 'nl';
  const hasOtherLangContent = (field: 'title' | 'description') => {
    return field === 'title' ? titles[otherLang].trim() : descriptions[otherLang].trim();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Language Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="flex gap-4">
          {LANGUAGES.map(({ code, label }) => (
            <button
              key={code}
              type="button"
              onClick={() => setActiveLanguage(code)}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeLanguage === code
                  ? 'border-primary-600 text-primary-600 dark:border-primary-400 dark:text-primary-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              {label}
              {/* Show indicator if content exists */}
              {(titles[code] || descriptions[code]) && (
                <span className="ml-2 w-2 h-2 bg-green-500 rounded-full inline-block" />
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Row 1: Title and Slug */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              {t('title')} ({activeLanguage.toUpperCase()})
            </label>
            <div className="flex gap-1">
              <button
                type="button"
                onClick={() => handleSuggest('title', activeLanguage)}
                disabled={isSuggesting[`title_${activeLanguage}`]}
                className="text-xs px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded hover:bg-purple-200 dark:hover:bg-purple-900/50 disabled:opacity-50"
                title={t('aiSuggest')}
              >
                {isSuggesting[`title_${activeLanguage}`] ? '...' : t('aiSuggest')}
              </button>
              {hasOtherLangContent('title') && (
                <button
                  type="button"
                  onClick={() => handleTranslate('title', otherLang)}
                  disabled={isTranslating[`title_${otherLang}_${activeLanguage}`]}
                  className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded hover:bg-blue-200 dark:hover:bg-blue-900/50 disabled:opacity-50"
                  title={t('translateFrom', { lang: otherLang.toUpperCase() })}
                >
                  {isTranslating[`title_${otherLang}_${activeLanguage}`] ? '...' : t('translate')}
                </button>
              )}
            </div>
          </div>
          <Input
            placeholder={t('titlePlaceholder')}
            value={titles[activeLanguage]}
            onChange={(e) => setTitles(prev => ({ ...prev, [activeLanguage]: e.target.value }))}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('slug')} ({activeLanguage.toUpperCase()})
          </label>
          <Input
            placeholder={t('slugPlaceholder')}
            value={slugs[activeLanguage]}
            onChange={(e) => handleSlugChange(activeLanguage, e.target.value)}
            required
          />
          {slugErrors[activeLanguage] && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {slugErrors[activeLanguage]}
            </p>
          )}
          {!slugErrors[activeLanguage] && slugs[activeLanguage] && (
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {t('slugHelp')}: /{activeLanguage}/project/{slugs[activeLanguage]}
            </p>
          )}
          {isCheckingSlug[activeLanguage] && (
            <p className="mt-1 text-sm text-gray-400">
              {tCommon('loading')}
            </p>
          )}
        </div>
      </div>

      {/* Row 2: App URL */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label={t('appUrl')}
          type="url"
          placeholder={t('appUrlPlaceholder')}
          value={appUrl}
          onChange={(e) => setAppUrl(e.target.value)}
          required
        />
        <div className="hidden md:block" />
      </div>

      {/* Row 3: Description and Image */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              {t('description')} ({activeLanguage.toUpperCase()})
            </label>
            <div className="flex gap-1">
              <button
                type="button"
                onClick={() => handleSuggest('description', activeLanguage)}
                disabled={isSuggesting[`description_${activeLanguage}`]}
                className="text-xs px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded hover:bg-purple-200 dark:hover:bg-purple-900/50 disabled:opacity-50"
                title={t('aiSuggest')}
              >
                {isSuggesting[`description_${activeLanguage}`] ? '...' : t('aiSuggest')}
              </button>
              {hasOtherLangContent('description') && (
                <button
                  type="button"
                  onClick={() => handleTranslate('description', otherLang)}
                  disabled={isTranslating[`description_${otherLang}_${activeLanguage}`]}
                  className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded hover:bg-blue-200 dark:hover:bg-blue-900/50 disabled:opacity-50"
                  title={t('translateFrom', { lang: otherLang.toUpperCase() })}
                >
                  {isTranslating[`description_${otherLang}_${activeLanguage}`] ? '...' : t('translate')}
                </button>
              )}
            </div>
          </div>
          <Textarea
            placeholder={t('descriptionPlaceholder')}
            value={descriptions[activeLanguage]}
            onChange={(e) => setDescriptions(prev => ({ ...prev, [activeLanguage]: e.target.value }))}
            required
            rows={6}
          />
        </div>

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

      {/* Row 4: Categories */}
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

      {/* Row 5: Keywords and Visibility */}
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

      {/* Language completion indicator */}
      <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {t('languageStatus')}
        </p>
        <div className="flex gap-4">
          {LANGUAGES.map(({ code, label }) => {
            const isComplete = titles[code] && descriptions[code] && slugs[code];
            return (
              <div key={code} className="flex items-center gap-2">
                <span
                  className={`w-3 h-3 rounded-full ${
                    isComplete ? 'bg-green-500' : 'bg-yellow-500'
                  }`}
                />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {label}: {isComplete ? t('complete') : t('incomplete')}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
        <Button
          type="submit"
          variant="primary"
          isLoading={isLoading}
          disabled={!titles.nl || !titles.en || !descriptions.nl || !descriptions.en || !!slugErrors.nl || !!slugErrors.en}
        >
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
