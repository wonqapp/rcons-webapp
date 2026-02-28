// src/app/[locale]/services/[category]/[type]/page.tsx
// ============================================================
// СТРАНИЦА ТИПА УСЛУГ (напр. /services/audit/rsbu)
// Каждая услуга = секция с якорем #service-id
// ============================================================
// ⚠️  ВАЖНО: переименуй папку [service] → [type] в проводнике
// ============================================================

import { setRequestLocale } from "next-intl/server";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getTypeBySlug, getAllTypePaths } from "@/config/services";

interface Props {
  params: Promise<{ locale: string; category: string; type: string }>;
}

// Генерируем все комбинации category+type статически
export function generateStaticParams() {
  return getAllTypePaths();
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category, type } = await params;
  const t = getTypeBySlug(category, type);
  if (!t) return {};
  return {
    title: t.titleKey, // TODO: перевести через getTranslations
  };
}

export default async function TypePage({ params }: Props) {
  const { locale, category, type } = await params;
  setRequestLocale(locale);

  const typeData = getTypeBySlug(category, type);
  if (!typeData) notFound();

  return (
    <main className="container mx-auto px-4 py-16 max-w-4xl">

      {/* Хлебные крошки */}
      <nav className="text-sm text-muted-foreground mb-6 flex gap-2">
        <Link href={`/${locale}/services`} className="hover:underline">Услуги</Link>
        <span>/</span>
        <Link href={`/${locale}/services/${category}`} className="hover:underline capitalize">{category}</Link>
        <span>/</span>
        <span>{typeData.titleKey}</span>
      </nav>

      {/* Заголовок страницы */}
      <h1 className="text-3xl font-bold mb-4">{typeData.titleKey}</h1>

      {/* Быстрая навигация по секциям */}
      <nav className="flex flex-wrap gap-2 mb-12 p-4 bg-muted rounded-lg">
        {typeData.services.map((service) => (
          <a
            key={service.id}
            href={`#${service.id}`}
            className="text-sm px-3 py-1 rounded-full bg-background border hover:border-primary hover:text-primary transition-colors"
          >
            {service.titleKey}
          </a>
        ))}
      </nav>

      {/* Секции услуг */}
      <div className="space-y-16">
        {typeData.services.map((service) => (
          <section key={service.id} id={service.id} className="scroll-mt-24">
            <h2 className="text-2xl font-semibold mb-3">{service.titleKey}</h2>
            <p className="text-muted-foreground mb-6">{service.descriptionKey}</p>

            {/* Подпункты (если есть) */}
            {service.details && service.details.length > 0 && (
              <ul className="space-y-2 border-l-2 border-primary/20 pl-4">
                {service.details.map((detail, i) => (
                  <li key={i} className="text-sm text-muted-foreground">
                    {detail.titleKey}
                  </li>
                ))}
              </ul>
            )}

            {/* CTA */}
            <div className="mt-6">
              <Link
                href={`/${locale}/contacts`}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm hover:opacity-90 transition-opacity"
              >
                Получить консультацию →
              </Link>
            </div>

            <hr className="mt-16 border-border" />
          </section>
        ))}
      </div>

    </main>
  );
}
