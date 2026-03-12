/**
 * @description CTA-блок в нижней части страницы услуги.
 * Ведёт на форму контактов. Принимает locale для корректных ссылок.
 */
import Link from "next/link";

interface ServiceCTAProps {
  locale: string;
  /** Название услуги для персонализированного заголовка */
  serviceTitle: string;
}

export default function ServiceCTA({ locale, serviceTitle }: ServiceCTAProps) {
  return (
    <section className="py-12 border-t border-[--color-border]">
      <div className="bg-[--color-surface-alt] rounded-2xl px-8 py-10 flex flex-col md:flex-row md:items-center gap-6 md:gap-12">
        {/* Текст */}
        <div className="flex-1">
          <p className="text-[11px] uppercase tracking-[0.15em] text-[--color-text-muted] mb-2">
            Следующий шаг
          </p>
          <h2 className="text-xl md:text-2xl font-sans font-semibold text-[--color-text-primary] leading-snug">
            Обсудим вашу задачу
          </h2>
          <p className="mt-2 text-[14px] text-[--color-text-muted] leading-relaxed max-w-md">
            Расскажите о ситуации — мы оценим объём работ и предложим
            оптимальный формат для «{serviceTitle}».
          </p>
        </div>

        {/* Кнопки */}
        <div className="flex flex-col sm:flex-row gap-3 shrink-0">
          <Link
            href={`/${locale}/contacts`}
            className="btn-primary text-center"
          >
            Оставить заявку
          </Link>
          <a href="tel:+74951234567" className="btn-outline text-center">
            Позвонить
          </a>
        </div>
      </div>
    </section>
  );
}
