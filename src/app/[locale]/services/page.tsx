import type { Metadata } from "next";
import Link from "next/link";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { siteConfig } from "@/config";
import { servicesHierarchy } from "@/config/services";

interface ServicesPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateStaticParams() {
  return siteConfig.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: ServicesPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale });

  return {
    title: t("nav.services"),
    description: t("pages.home.desc"),
  };
}

export default async function ServicesCatalogPage({ params }: ServicesPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale });
  const tr = (key: string) => t(key as Parameters<typeof t>[0]);

  return (
    <main className="max-w-6xl mx-auto px-6 py-10">
      <nav className="flex items-center gap-2 text-sm text-[#a8a49d] mb-10">
        <Link
          href={`/${locale}`}
          className="hover:text-[#1a1a18] transition-colors"
        >
          Главная
        </Link>
        <span>/</span>
        <span className="text-[#1a1a18]">{t("nav.services")}</span>
      </nav>

      <h1 className="text-5xl font-bold text-[#1a1a18] leading-[1.05] tracking-tight mb-10">
        {t("nav.services")}
      </h1>

      <div className="border-t border-[#1a1a18]/20">
        {servicesHierarchy.map((category) => (
          <Link
            key={category.slug}
            href={`/${locale}/services/${category.slug}`}
            className="group grid grid-cols-[1fr_auto] items-baseline py-5 border-b border-[#e8e6e1] gap-8 hover:border-[#1a1a18]/30 transition-colors"
          >
            <div>
              <p className="text-base text-[#1a1a18]">{tr(category.titleKey)}</p>
              <p className="text-sm text-[#a8a49d] mt-0.5 line-clamp-1">
                {tr(category.descriptionKey)}
              </p>
            </div>
            <span className="text-[#a8a49d] group-hover:text-[#1a1a18] transition-colors text-sm">
              →
            </span>
          </Link>
        ))}
      </div>
    </main>
  );
}
