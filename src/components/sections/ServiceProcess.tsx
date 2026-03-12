/**
 * @description Секция "Как проходит услуга" — нумерованные этапы процесса.
 * Используется на detail-страницах услуг.
 */
import type { ProcessStep } from "@/config/content";

interface ServiceProcessProps {
  title: string;
  steps: ProcessStep[];
}

export default function ServiceProcess({ title, steps }: ServiceProcessProps) {
  if (!steps.length) return null;

  return (
    <section className="py-12 border-t border-[--color-border]">
      <h2 className="text-2xl font-sans font-semibold text-[--color-text-primary] mb-8">
        {title}
      </h2>

      <ol className="space-y-0">
        {steps.map((step, index) => (
          <li key={index} className="flex gap-6 group">
            {/* Линия + номер */}
            <div className="flex flex-col items-center shrink-0 w-8">
              <span className="flex items-center justify-center w-8 h-8 rounded-full border border-[--color-border] text-[13px] font-medium text-[--color-text-muted] bg-white shrink-0 z-10">
                {index + 1}
              </span>
              {index < steps.length - 1 && (
                <div className="w-px flex-1 bg-[--color-border] my-1" />
              )}
            </div>

            {/* Контент */}
            <div className={`pb-8 ${index === steps.length - 1 ? "pb-0" : ""}`}>
              <h3 className="text-[15px] font-medium text-[--color-text-primary] mb-1">
                {step.title}
              </h3>
              <p className="text-[14px] text-[--color-text-muted] leading-relaxed">
                {step.desc}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
