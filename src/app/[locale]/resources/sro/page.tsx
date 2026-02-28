// src/app/[locale]/resources/sro/page.tsx
import { setRequestLocale, getTranslations } from "next-intl/server";
import { siteConfig } from "@/config";
import type { Metadata } from "next";

interface Props { params: Promise<{ locale: string }> }

export async function generateStaticParams() {
  return siteConfig.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "pages.resources.sro" });
  const tMeta = await getTranslations({ locale, namespace: "metadata" });
  return {
    title: `${t("title")} | ${tMeta("siteName")}`,
    description: t("description"),
  };
}

export default async function SroPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "pages.resources.sro" });

  return (
    <main className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-4xl font-bold mb-4">{t("title")}</h1>
      <p className="text-muted-foreground mb-8">{t("description")}</p>
      {/* TODO: вставить свидетельство СРО, реквизиты организации */}
      <div className="bg-muted/50 rounded-xl p-8 text-center text-muted-foreground">
        🏛️ Здесь будет свидетельство о членстве в СРО и реквизиты организации
      </div>
    </main>
  );
}
