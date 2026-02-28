// src/app/[locale]/services/page.tsx
// ============================================================
// КАТАЛОГ УСЛУГ — показывает все 8 категорий
// ============================================================

import { setRequestLocale, getTranslations } from "next-intl/server";
import { useTranslations } from "next-intl";
import Link from "next/link";
import type { Metadata } from "next";
import { siteConfig } from "@/config";

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "pages.services" });
  return { title: t("title"), description: t("desc") };
}

export default async function ServicesPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <main className="container mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold mb-10">Услуги</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {siteConfig.services.map((cat) => (
          <Link
            key={cat.slug}
            href={`/${locale}/services/${cat.slug}`}
            className="group block p-6 border rounded-xl hover:border-primary hover:shadow-md transition-all"
          >
            <div className="text-3xl mb-3">{cat.icon}</div>
            {/* TODO: использовать useTranslations для cat.titleKey */}
            <h2 className="text-xl font-semibold group-hover:text-primary transition-colors">
              {cat.titleKey}
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {cat.types.length} разделов · {cat.types.reduce((acc, t) => acc + t.services.length, 0)} услуг
            </p>
          </Link>
        ))}
      </div>
    </main>
  );
}
