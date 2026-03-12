// src/app/[locale]/services/[category]/page.tsx
// ============================================================
// СТРАНИЦА КАТЕГОРИИ (напр. /services/audit)
// Показывает все типы внутри категории
// ============================================================

// src/app/[locale]/services/[category]/page.tsx
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { siteConfig } from "@/config";
import { getCategoryBySlug } from "@/config/services";

interface Props {
  params: Promise<{ locale: string; category: string; type: string }>;
}

export default async function TypePage({ params }: Props) {
  const { locale, category, type } = await params;
  setRequestLocale(locale);

  const catData = getCategoryBySlug(category);
  const typeData = getTypeBySlug(category, type);
  const priceData = getPricing(category, type);

  if (!catData || !typeData) notFound();

  const t = await getTranslations({ locale });

  // Трансформация данных из конфига под интерфейс PriceCard
  const tiers =
    priceData?.tiers.map((tier) => {
      // Извлекаем текст в скобках для hint, если он есть
      const match = tier.label.match(/(.*)\s\((.*)\)/);
      return {
        label: match ? match[1] : tier.label,
        hint: match ? match[2] : undefined,
        price: formatPrice(tier.price, tier.model),
      };
    }) || [];

  return (
    <main className="main-layout pt-10 pb-24">
      {/* Hero Section */}
      <section className="relative w-full aspect-[21/9] md:aspect-[3/1] overflow-hidden bg-zinc-900 mb-16 shadow-2xl">
        {/* Градиент должен быть absolute, чтобы не занимать место в потоке */}
        <div className="absolute inset-0 opacity-40 bg-gradient-to-tr from-black to-transparent z-0" />

        {/* Контентный слой */}
        <div className="relative z-10 h-full flex flex-col p-10 md:p-20 justify-between">
          <nav className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-wider text-white/60">
            <Link
              href={`/${locale}`}
              className="hover:text-white transition-colors"
            >
              Главная
            </Link>
            <span>/</span>
            <Link
              href={`/${locale}/services`}
              className="hover:text-white transition-colors"
            >
              Услуги
            </Link>
            <span>/</span>
            <Link
              href={`/${locale}/services/${category}`}
              className="hover:text-white transition-colors"
            >
              {t(catData.titleKey as any)}
            </Link>
          </nav>

          <h1 className="text-3xl md:text-5xl font-serif text-white max-w-3xl leading-[1.15] tracking-tight">
            {t(typeData.titleKey as any)}
          </h1>
        </div>
      </section>

      <div className="grid lg:grid-cols-[1fr_300px] gap-16 items-start">
        <div className="space-y-12">
          {/* Description */}
          <div className="prose prose-zinc max-w-none">
            <p className="text-lg text-[#1c1c1a] leading-relaxed font-sans opacity-90">
              {t(typeData.descriptionKey as any)}
            </p>
          </div>

          {/* Price Component */}
          {tiers.length > 0 && (
            <PriceCard
              tiers={tiers}
              note={priceData?.note}
              ctaLabel="Получить расчёт"
            />
          )}
        </div>

        {/* Sidebar */}
        <ServiceSidebar category={catData} activeTypeSlug={type} />
      </div>
    </main>
  );
}
