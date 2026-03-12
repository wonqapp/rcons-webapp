// src/app/[locale]/services/page.tsx
// ============================================================
// КАТАЛОГ УСЛУГ — показывает все 8 категорий
// ============================================================

// src/app/[locale]/services/page.tsx
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { siteConfig } from "@/config";
import { getCategoryBySlug } from "@/config/services";

interface Props {
  params: Promise<{ locale: string; category: string }>;
}

export async function generateStaticParams() {
  return siteConfig.locales.flatMap((locale) =>
    siteConfig.services.map((cat) => ({ locale, category: cat.slug })),
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, category } = await params;
  const cat = getCategoryBySlug(category);
  if (!cat) return {};
  const t = await getTranslations({ locale });
  return {
    title: t(cat.titleKey as Parameters<typeof t>[0]),
    description: t(cat.descriptionKey as Parameters<typeof t>[0]),
  };
}

export default async function CategoryPage({ params }: Props) {
  const { locale, category } = await params;
  setRequestLocale(locale);

  const cat = getCategoryBySlug(category);
  if (!cat) notFound();

  const t = await getTranslations({ locale });

  function tr(key: string): string {
    return t(key as Parameters<typeof t>[0]);
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-[#a8a49d] mb-10">
        <Link
          href={`/${locale}/services`}
          className="hover:text-[#1a1a18] transition-colors"
        >
          Все услуги
        </Link>
        <span>/</span>
        <span className="text-[#1a1a18]">{tr(cat.titleKey)}</span>
      </nav>

      <h1 className="text-5xl font-bold text-[#1a1a18] leading-[1.05] tracking-tight mb-10">
        {tr(cat.titleKey)}
      </h1>
      <p className="text-base text-[#6b6860] leading-relaxed max-w-2xl mb-14">
        {tr(cat.descriptionKey)}
      </p>

      {/* Список услуг как таблица */}
      <div className="border-t border-[#1a1a18]/20">
        {cat.types.map((type) => (
          <Link
            key={type.slug}
            href={`/${locale}/services/${category}/${type.slug}`}
            className="group grid grid-cols-[1fr_auto] items-baseline py-5 border-b border-[#e8e6e1] gap-8 hover:border-[#1a1a18]/30 transition-colors"
          >
            <div>
              <p className="text-base text-[#1a1a18] group-hover:text-[#1a1a18] transition-colors">
                {tr(type.titleKey)}
              </p>
              <p className="text-sm text-[#a8a49d] mt-0.5 line-clamp-1">
                {tr(type.descriptionKey)}
              </p>
            </div>
            <span className="text-[#a8a49d] group-hover:text-[#1a1a18] transition-colors text-sm">
              →
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
