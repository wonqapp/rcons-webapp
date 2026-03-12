import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { siteConfig } from "@/config";
import { getAllCategoryPaths, getCategoryBySlug } from "@/config/services";

interface CategoryPageProps {
  params: Promise<{ locale: string; category: string }>;
}

export async function generateStaticParams() {
  return siteConfig.locales.flatMap((locale) =>
    getAllCategoryPaths().map(({ category }) => ({ locale, category })),
  );
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { locale, category } = await params;
  const t = await getTranslations({ locale });
  const categoryData = getCategoryBySlug(category);

  if (!categoryData) {
    return {};
  }

  const tr = (key: string) => t(key as Parameters<typeof t>[0]);

  return {
    title: tr(categoryData.titleKey),
    description: tr(categoryData.descriptionKey),
  };
}

export default async function ServicesCategoryPage({ params }: CategoryPageProps) {
  const { locale, category } = await params;
  setRequestLocale(locale);

  const categoryData = getCategoryBySlug(category);
  if (!categoryData) {
    notFound();
  }

  const t = await getTranslations({ locale });
  const tr = (key: string) => t(key as Parameters<typeof t>[0]);

  return (
    <main className="max-w-6xl mx-auto px-6 py-10">
      <nav className="flex items-center gap-2 text-sm text-[#a8a49d] mb-10">
        <Link
          href={`/${locale}/services`}
          className="hover:text-[#1a1a18] transition-colors"
        >
          {t("nav.services")}
        </Link>
        <span>/</span>
        <span className="text-[#1a1a18]">{tr(categoryData.titleKey)}</span>
      </nav>

      <h1 className="text-5xl font-bold text-[#1a1a18] leading-[1.05] tracking-tight mb-10">
        {tr(categoryData.titleKey)}
      </h1>
      <p className="text-base text-[#6b6860] leading-relaxed max-w-2xl mb-14">
        {tr(categoryData.descriptionKey)}
      </p>

      <div className="border-t border-[#1a1a18]/20">
        {categoryData.types.map((serviceType) => (
          <Link
            key={serviceType.slug}
            href={`/${locale}/services/${categoryData.slug}/${serviceType.slug}`}
            className="group grid grid-cols-[1fr_auto] items-baseline py-5 border-b border-[#e8e6e1] gap-8 hover:border-[#1a1a18]/30 transition-colors"
          >
            <div>
              <p className="text-base text-[#1a1a18]">{tr(serviceType.titleKey)}</p>
              <p className="text-sm text-[#a8a49d] mt-0.5 line-clamp-1">
                {tr(serviceType.descriptionKey)}
              </p>
            </div>
            <span className="text-[#a8a49d] group-hover:text-[#1a1a18] transition-colors text-sm">
              →
            </span>
          </Link>
        ))}
      </div>
    </main>
  );
}
