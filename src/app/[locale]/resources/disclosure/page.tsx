import { setRequestLocale, getTranslations } from "next-intl/server";
import { siteConfig } from "@/config";
import type { Metadata } from "next";
import React from 'react';

interface Props { params: Promise<{ locale: string }> }

export async function generateStaticParams() {
  return siteConfig.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "pages.resources.disclosure" });
  const tMeta = await getTranslations({ locale, namespace: "metadata" });
  return {
    title: `${t("title")} | ${tMeta("siteName")}`,
    description: t("description")
  };
}

function RconsDoomerContent() {
  return (
    <div className="min-h-screen bg-[#0a0a0c] text-[#d4d4d8] font-sans selection:bg-[#27272a] relative overflow-x-hidden">
      {/* СЛОЙ ШУМА */}
      <div className="noise-overlay fixed inset-0 pointer-events-none opacity-[0.04] z-50"></div>

      <header className="flex items-center justify-between px-8 py-10 border-b border-[#1f1f22] relative z-10">
        <div className="text-2xl font-semibold tracking-tighter text-[#f4f4f5]">rcons</div>
        <nav className="hidden md:flex gap-10 text-[13px] tracking-[0.1em] uppercase text-[#71717a]">
          <a href="#" className="hover:text-white transition-colors">Раскрытие</a>
          <a href="#" className="hover:text-white transition-colors">Услуги</a>
          <a href="#" className="hover:text-white transition-colors">О нас</a>
        </nav>
        <button className="text-xs tracking-widest uppercase px-6 py-2 border border-[#27272a] rounded-sm hover:bg-[#f4f4f5] hover:text-[#0a0a0c] transition-all">
          Связаться
        </button>
      </header>

      <main className="max-w-6xl mx-auto px-8 pt-40 pb-32 relative z-10">
        <h1 className="text-6xl md:text-8xl font-medium tracking-tight text-[#f4f4f5] mb-8 leading-[0.9]">
          Экономический <br/> индекс
        </h1>
        <p className="text-xl md:text-2xl text-[#a1a1aa] max-w-xl leading-relaxed font-light">
          Анализируя, как RconsAI используется по всей экономике.
        </p>
      </main>

      <section className="max-w-6xl mx-auto px-8 pb-40 grid md:grid-cols-2 gap-6 relative z-10">
        <div className="p-8 bg-[#0e0e11] border border-[#1f1f22] hover:border-[#3f3f46] transition-colors flex flex-col justify-between min-h-[250px]">
          <div>
            <h3 className="text-xl text-[#e4e4e7] mb-4">Объявления</h3>
            <p className="text-[#a1a1aa] text-sm leading-relaxed">
              Предлагаем антропное экономическое будущее...
            </p>
          </div>
          <a href="#" className="text-sm text-[#71717a] hover:text-[#f4f4f5] uppercase tracking-wider mt-8 block">
            Читать далее →
          </a>
        </div>
        <div className="p-8 bg-[#0e0e11] border border-[#1f1f22] hover:border-[#3f3f46] transition-colors flex flex-col justify-between min-h-[250px]">
          <div>
            <h3 className="text-xl text-[#e4e4e7] mb-4">Конфиденциальность</h3>
            <p className="text-[#a1a1aa] text-sm leading-relaxed">
              Система анализа данных с полным сохранением приватности.
            </p>
          </div>
          <a href="#" className="text-sm text-[#71717a] hover:text-[#f4f4f5] uppercase tracking-wider mt-8 block">
            Читать далее →
          </a>
        </div>
      </section>
    </div>
  );
}

export default async function Page({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <RconsDoomerContent />;
}
