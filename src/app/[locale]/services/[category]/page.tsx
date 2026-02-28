// src/app/[locale]/services/[category]/page.tsx
// ============================================================
// СТРАНИЦА КАТЕГОРИИ (напр. /services/audit)
// Показывает все типы внутри категории
// ============================================================

import { setRequestLocale, getTranslations } from "next-intl/server";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getCategoryBySlug, servicesHierarchy } from "@/config/services";

interface Props {
  params: Promise<{ locale: string; category: string }>;
}

// Говорим Next.js какие категории генерировать статически
export function generateStaticParams() {
  return servicesHierarchy.map((cat) => ({ category: cat.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, category } = await params;
  const cat = getCategoryBySlug(category);
  if (!cat) return {};
  const t = await getTranslations({ locale, namespace: cat.titleKey });
  return { title: String(t) };
}

export default async function CategoryPage({ params }: Props) {
  const { locale, category } = await params;
  setRequestLocale(locale);

  const cat = getCategoryBySlug(category);
  if (!cat) notFound();

  return (
    <main className="container mx-auto px-4 py-16">
      {/* Хлебные крошки */}
      <nav className="text-sm text-muted-foreground mb-6">
        <Link href={`/${locale}/services`} className="hover:underline">Услуги</Link>
        {" / "}
        <span>{cat.icon} {cat.titleKey}</span>
      </nav>

      <h1 className="text-3xl font-bold mb-10">
        {cat.icon} {cat.titleKey}
      </h1>

      {/* Типы услуг внутри категории */}
      <div className="space-y-6">
        {cat.types.map((type) => (
          <Link
            key={type.slug}
            href={`/${locale}/services/${category}/${type.slug}`}
            className="group block p-6 border rounded-xl hover:border-primary hover:shadow-md transition-all"
          >
            <h2 className="text-xl font-semibold group-hover:text-primary transition-colors">
              {type.titleKey}
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {type.services.length} услуг →
            </p>
            {/* Превью первых 3 услуг */}
            <ul className="mt-3 space-y-1">
              {type.services.slice(0, 3).map((service) => (
                <li key={service.id} className="text-sm text-muted-foreground">
                  · {service.titleKey}
                </li>
              ))}
              {type.services.length > 3 && (
                <li className="text-sm text-muted-foreground">
                  · и ещё {type.services.length - 3}...
                </li>
              )}
            </ul>
          </Link>
        ))}
      </div>
    </main>
  );
}
