// src/app/[locale]/about/page.tsx
import { setRequestLocale, getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { siteConfig } from "@/config";

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateStaticParams() {
  return siteConfig.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "pages.about" });
  const tMeta = await getTranslations({ locale, namespace: "metadata" });
  return {
    title: `${t("title")} | ${tMeta("siteName")}`,
    description: t("description"),
    openGraph: {
      title: `${t("title")} | ${tMeta("siteName")}`,
      description: t("description"),
      url: `${siteConfig.url}/${locale}/about`,
    },
  };
}

export default async function AboutPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "pages.about" });

  return (
    <main className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-4xl font-bold mb-6">{t("title")}</h1>
      <p className="text-xl text-muted-foreground mb-12">{t("description")}</p>

      {/* TODO: добавить блоки: история, команда, лицензии, ценности */}
      <div className="grid gap-8">
        <section className="bg-muted/50 rounded-xl p-8">
          <h2 className="text-2xl font-semibold mb-4">🏗️ Placeholder</h2>
          <p className="text-muted-foreground">
            Здесь будет контент о компании — история, команда, ценности.
            Добавь контент в messages/ru.json и вставь сюда.
          </p>
        </section>
      </div>
    </main>
  );
}
