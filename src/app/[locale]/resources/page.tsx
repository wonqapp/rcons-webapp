// src/app/[locale]/resources/page.tsx
import { setRequestLocale, getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { siteConfig } from "@/config";
import { Link } from "@/i18n/routing";

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateStaticParams() {
  return siteConfig.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "pages.resources" });
  const tMeta = await getTranslations({ locale, namespace: "metadata" });
  return {
    title: `${t("title")} | ${tMeta("siteName")}`,
    description: t("description"),
  };
}

const resourceLinks = [
  { href: "/resources/documents", titleKey: "pages.resources.documents.title", descKey: "pages.resources.documents.description", icon: "📄" },
  { href: "/resources/sro", titleKey: "pages.resources.sro.title", descKey: "pages.resources.sro.description", icon: "🏛️" },
  { href: "/resources/disclosure", titleKey: "pages.resources.disclosure.title", descKey: "pages.resources.disclosure.description", icon: "📋" },
  { href: "/resources/qualifications", titleKey: "pages.resources.qualifications.title", descKey: "pages.resources.qualifications.description", icon: "🎓" },
];

export default async function ResourcesPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale });

  return (
    <main className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-4xl font-bold mb-4">{t("pages.resources.title")}</h1>
      <p className="text-xl text-muted-foreground mb-12">{t("pages.resources.description")}</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {resourceLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href as "/resources/documents"}
            className="block bg-card border rounded-xl p-6 hover:border-primary hover:shadow-sm transition-all group"
          >
            <span className="text-3xl mb-3 block">{link.icon}</span>
            <h2 className="font-semibold mb-2 group-hover:text-primary transition-colors">
              {t(link.titleKey as never)}
            </h2>
            <p className="text-sm text-muted-foreground">
              {t(link.descKey as never)}
            </p>
          </Link>
        ))}
      </div>
    </main>
  );
}
