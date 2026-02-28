// src/app/[locale]/page.tsx
// ============================================================
// ГЛАВНАЯ СТРАНИЦА
// ============================================================

import { setRequestLocale, getTranslations } from "next-intl/server";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "pages.home" });
  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <main>
      {/* TODO: Hero секция */}
      <section className="container mx-auto px-4 py-24 text-center">
        <h1 className="text-4xl font-bold mb-4">RCONS</h1>
        <p className="text-xl text-muted-foreground">
          Аудит · Налоги · Оценка · Юристы · Финансы
        </p>
      </section>

      {/* TODO: Блок категорий услуг */}
      {/* TODO: Блок преимуществ */}
      {/* TODO: CTA форма */}
    </main>
  );
}
