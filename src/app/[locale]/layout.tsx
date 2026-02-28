// src/app/[locale]/layout.tsx
// ============================================================
// КОРНЕВОЙ LAYOUT — применяется ко всем страницам
// Подключает: Navbar, AiChat виджет, i18n провайдер, metadata
// ============================================================

import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { siteConfig } from "@/config";
import Navbar from "@/components/navbar";
import AiChat from "@/components/AiChat";
import "@/app/globals.css"

interface Props {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

// ============================================================
// generateStaticParams — говорим Next.js какие локали генерировать
// ============================================================
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

// ============================================================
// generateMetadata — дефолтные SEO мета-теги для всего сайта
// Каждая страница может переопределить через свой generateMetadata
// ============================================================
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });

  return {
    title: {
      default: t("defaultTitle"),
      template: `%s | ${t("siteName")}`, // "О компании | RCONS"
    },
    description: t("defaultDescription"),
    metadataBase: new URL(siteConfig.url),
    openGraph: {
      type: "website",
      siteName: t("siteName"),
      locale,
    },
    robots: {
      index: true,
      follow: true,
    },
    // Alternate language tags для SEO (важно для многоязычных сайтов)
    alternates: {
      languages: Object.fromEntries(
        siteConfig.locales.map((loc) => [loc, `${siteConfig.url}/${loc}`])
      ),
    },
  };
}

// ============================================================
// LAYOUT КОМПОНЕНТ
// ============================================================
export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  // Проверяем что локаль поддерживается
  if (!routing.locales.includes(locale as (typeof routing.locales)[number])) {
    notFound();
  }

  // Включаем статическую генерацию
  setRequestLocale(locale);

  // Загружаем переводы для клиентских компонентов
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className="min-h-screen bg-background font-sans antialiased">
        <NextIntlClientProvider messages={messages}>
          {/* Навигация */}
          <Navbar />

          {/* Основной контент */}
          <div className="min-h-[calc(100vh-4rem)]">
            {children}
          </div>

          {/* Футер — TODO: вынести в отдельный компонент */}
          <footer className="border-t py-8 mt-16">
            <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
              <p>© {new Date().getFullYear()} RCONS. Все права защищены.</p>
              <p className="mt-1">
                <a href={`/${locale}/resources/disclosure`} className="hover:underline">
                  Раскрытие информации
                </a>
                {" · "}
                <a href={`/${locale}/resources/sro`} className="hover:underline">
                  СРО
                </a>
              </p>
            </div>
          </footer>

          {/* ИИ-помощник — плавающий виджет */}
          <AiChat />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
