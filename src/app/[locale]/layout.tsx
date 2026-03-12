// src/app/[locale]/layout.tsx
// ============================================================
// КОРНЕВОЙ LAYOUT — применяется ко всем страницам
// Подключает: Navbar, AiChat виджет, i18n провайдер, metadata
// ============================================================

// src/app/[locale]/layout.tsx
import { NextIntlClientProvider } from "next-intl";
import {
  getMessages,
  getTranslations,
  setRequestLocale,
} from "next-intl/server";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Inter, Noto_Serif } from "next/font/google";
import { routing } from "@/i18n/routing";
import { siteConfig } from "@/config";
import Navbar from "@/components/navbar";
import AiChat from "@/components/AiChat";
import "@/app/globals.css";

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-sans",
  display: "swap",
});

const noto_serif = Noto_Serif({
  subsets: ["latin", "cyrillic"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-serif",
  display: "swap",
});

interface Props {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });
  return {
    title: { default: t("defaultTitle"), template: `%s — ${t("siteName")}` },
    description: t("defaultDescription"),
    metadataBase: new URL(siteConfig.url),
  };
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;
  if (!routing.locales.includes(locale as (typeof routing.locales)[number]))
    notFound();

  const messages = await getMessages();

  return (
    /* 1. Добавляем обе переменные в className html */
    <html
      lang={locale}
      suppressHydrationWarning
      className={`${inter.variable} ${noto_serif.variable}`}
    >
      {/* 2. Убираем инлайновые стили с body, всё управление теперь в globals.css */}
      <body className="antialiased bg-bg-l">
        <NextIntlClientProvider messages={messages}>
          <Navbar />
          {children}
          {/* 3. Рекомендую заменить инлайновый footer на Tailwind классы:
              className="border-t border-[#dddbd7] mt-20 py-7" */}
          <footer className="border-t border-[--color-border-light] mt-20 py-7">
            <div className="main-layout flex justify-between items-center">
              <span className="text-[12px] text-[#aaa]">
                © {new Date().getFullYear()} RCONS
              </span>
              <div className="flex gap-5">
                <a
                  href={`/${locale}/resources/disclosure`}
                  className="text-[12px] text-[#aaa]"
                >
                  Раскрытие информации
                </a>
                <a
                  href={`/${locale}/resources/sro`}
                  className="text-[12px] text-[#aaa]"
                >
                  СРО
                </a>
                <a
                  href="mailto:info@rcons.ru"
                  className="text-[12px] text-[#aaa]"
                >
                  info@rcons.ru
                </a>
              </div>
            </div>
          </footer>
          <AiChat />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
