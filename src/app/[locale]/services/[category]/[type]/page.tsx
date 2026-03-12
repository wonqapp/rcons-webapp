// src/app/[locale]/services/[category]/[type]/page.tsx
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getCategoryBySlug, getTypeBySlug } from "@/config/services";
import { getPricing, formatPrice } from "@/config/pricing";
import ServiceSidebar from "@/components/ServiceSidebar";
import PriceCard from "@/components/PriceCard";
import Image from "next/image";

export default async function TypePage({
  params,
}: {
  params: Promise<{ locale: string; category: string; type: string }>;
}) {
  const { locale, category, type } = await params;
  setRequestLocale(locale);

  const catData = getCategoryBySlug(category);
  const typeData = getTypeBySlug(category, type);
  const priceData = getPricing(category, type);
  if (!catData || !typeData) notFound();

  const t = await getTranslations({ locale });
  const tiers =
    priceData?.tiers.map((tier) => {
      const match = tier.label.match(/(.*)\s\((.*)\)/);
      return {
        label: match ? match[1] : tier.label,
        hint: match ? match[2] : undefined,
        price: formatPrice(tier.price, tier.model),
      };
    }) || [];

  return (
    <main className="main-layout mx-auto  pb-24 px-0!  ">
      {/* Hero Section: убрали px-9, добавили p-8/p-12 для внутреннего контента */}
      <section className="relative w-full h-100  overflow-hidden bg-[#0a0a0a]  ">
        <Image
          src="/images/audit_city.jpg"
          alt="Background"
          fill
          priority
          className="object-cover z-0" // object-cover заменяет background-size: cover
        />

        {/* Затемнение (Overlay), чтобы текст читался */}
        <div className="absolute inset-0 bg-purple-950/10 z-10" />

        <div className="content-layout relative h-full flex flex-col justify-between content-layout pt-8 z-10">
          <nav className="flex items-center gap-2 text-[11px]  uppercase tracking-[0.2em] text-white/40">
            <Link href="/" className="hover:text-white transition-colors">
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
            <span className="text-white/60">{t(catData.titleKey as any)}</span>
          </nav>
          <h1 className="text-6xl md:text-6xl  font-sans text-ww  md:max-w-[70%]  ">
            {t(typeData.titleKey as any)}
          </h1>
        </div>
      </section>

      {/* Сетка контента: уменьшили gap до 12-16, чтобы Sidebar не уезжал слишком далеко */}
      <div className="content-layout grid lg:grid-cols-[1fr_300px] gap-12 lg:gap-16 items-start mt-2 md:mt-12">
        <div className="space-y-16 pt-8">
          <p className="text-[18px]  font-serif leading-relaxed opacity-90">
            {t(typeData.descriptionKey as any)}
          </p>
          <PriceCard tiers={tiers} note={priceData?.note} />
        </div>
        <ServiceSidebar category={catData} activeTypeSlug={type} />
      </div>
    </main>
  );
}
