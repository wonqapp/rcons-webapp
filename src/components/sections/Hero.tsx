"use client";

import { useTranslations } from "next-intl";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";
import { ArrowRight } from "lucide-react";

export function Hero() {
  const t = useTranslations("HomePage.hero");

  return (
    <section className="relative min-h-[80vh] w-full flex items-center overflow-hidden bg-black text-white">
      {/* Фоновое изображение с оверлеем */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/hero-bg.jpg" // Убедись, что картинка лежит тут
          alt="Business building"
          fill
          className="object-cover opacity-60"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
      </div>

      <div className="container relative z-10 mx-auto px-4 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-end">
          {/* Левая колонка: Цифры и заголовок */}
          <div className="lg:col-span-8 space-y-12">
            <div className="flex gap-12 md:gap-20">
              <div className="space-y-1">
                <span className="block text-5xl md:text-6xl font-light italic">
                  28
                </span>
                <span className="text-xs uppercase tracking-widest opacity-70 leading-tight">
                  {t("stats.years_exp") || "лет опыта"}
                </span>
              </div>
              <div className="space-y-1">
                <span className="block text-5xl md:text-6xl font-light italic">
                  3 200+
                </span>
                <span className="text-xs uppercase tracking-widest opacity-70 leading-tight">
                  {t("stats.consultations") || "консультаций"}
                </span>
              </div>
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-medium leading-[1.1] tracking-tight text-balance">
              Совместная защита, служение и построение более безопасного_
            </h1>
          </div>

          {/* Правая колонка: Описание и кнопка */}
          <div className="lg:col-span-4 space-y-8 lg:pb-4">
            <p className="text-lg md:text-xl font-light leading-relaxed opacity-90 border-l border-white/20 pl-6">
              Аудит, консалтинг, оценка и IT-решения, которые помогают компаниям
              снижать риски, оптимизировать налоги и строить будущее.
            </p>

            <div className="flex flex-col sm:flex-row lg:flex-col gap-6 items-start">
              <Button
                asChild
                variant="outline"
                size="lg"
                className="bg-white text-black hover:bg-white/90 border-none rounded-none h-14 px-8 group"
              >
                <Link href="/contacts" className="flex items-center gap-2">
                  Связаться с нами
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <span className="text-sm font-light opacity-60 italic">
                Работаем с 1995 года
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
