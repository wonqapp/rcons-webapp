import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import PriceCard from "@/components/PriceCard";
import ServiceSidebar from "@/components/ServiceSidebar";
import { siteConfig } from "@/config";
import { formatPrice, getPricing } from "@/config/pricing";
import { getAllTypePaths, getCategoryBySlug, getTypeBySlug } from "@/config/services";

interface TypePageProps {
  params: Promise<{ locale: string; category: string; type: string }>;
}

export async function generateStaticParams() {
  return siteConfig.locales.flatMap((locale) =>
    getAllTypePaths().map(({ category, type }) => ({ locale, category, type })),
  );
}

export async function generateMetadata({ params }: TypePageProps): Promise<Metadata> {
  const { locale, category, type } = await params;
  const t = await getTranslations({ locale });

  const categoryData = getCategoryBySlug(category);
  const typeData = getTypeBySlug(category, type);

  if (!categoryData || !typeData) {
    return {};
  }

  const tr = (key: string) => t(key as Parameters<typeof t>[0]);

  return {
    title: tr(typeData.titleKey),
    description: tr(typeData.descriptionKey),
  };
}

export default async function ServiceTypePage({ params }: TypePageProps) {
  const { locale, category, type } = await params;
  setRequestLocale(locale);

  const categoryData = getCategoryBySlug(category);
  const typeData = getTypeBySlug(category, type);

  if (!categoryData || !typeData) {
    notFound();
  }

  const priceData = getPricing(category, type);
  const t = await getTranslations({ locale });
  const tr = (key: string) => t(key as Parameters<typeof t>[0]);

  const tiers =
    priceData?.tiers.map((tier) => {
      const match = tier.label.match(/(.*)\s\((.*)\)/);
      return {
        label: match ? match[1] : tier.label,
        hint: match ? match[2] : undefined,
        price: formatPrice(tier.price, tier.model),
      };
    }) ?? [];

  return (
    <main className="main-layout mx-auto pb-24 px-0!">
      <section className="relative w-full h-100 overflow-hidden bg-[#0a0a0a]">
        <Image
          src="/images/audit_city.jpg"
          alt="Background"
          fill
          priority
          className="object-cover z-0"
        />

        <div className="absolute inset-0 bg-purple-950/10 z-10" />

        <div className="content-layout relative h-full flex flex-col justify-between pt-8 z-10">
          <nav className="flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-white/40">
            <Link href={`/${locale}`} className="hover:text-white transition-colors">
              Главная
            </Link>
            <span>/</span>
            <Link
              href={`/${locale}/services`}
              className="hover:text-white transition-colors"
            >
              Услуги
            </Link>
            <span>/</span>
            <Link
              href={`/${locale}/services/${categoryData.slug}`}
              className="hover:text-white transition-colors"
            >
              {tr(categoryData.titleKey)}
            </Link>
          </nav>
          <h1 className="text-6xl md:text-6xl font-sans text-ww md:max-w-[70%]">
            {tr(typeData.titleKey)}
          </h1>
        </div>
      </section>

      <div className="content-layout grid lg:grid-cols-[1fr_300px] gap-12 lg:gap-16 items-start mt-2 md:mt-12">
        <div className="space-y-16 pt-8">
          <p className="text-[18px] font-serif leading-relaxed opacity-90">
            {tr(typeData.descriptionKey)}
          </p>
          {tiers.length > 0 && (
            <PriceCard
              tiers={tiers}
              notes={[
                priceData?.note ??
                  "Объём работ определяется после бесплатной предварительной экспертизы",
                "Цены ориентировочные, фиксируются в договоре. Первичная консультация — бесплатно.",
                "Актуально на 2026 год · НДС по применимому режиму · Финальная стоимость после брифа",
              ]}
            />
          )}
        </div>

        <ServiceSidebar category={categoryData} activeTypeSlug={type} />
      </div>
    </main>
  );
}
