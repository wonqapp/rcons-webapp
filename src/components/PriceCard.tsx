"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export interface PriceTier {
  label: string;
  hint?: string;
  price: string;
}

interface Props {
  tiers: PriceTier[];
  notes?: [string, string, string];
  ctaLabel?: string;
  onCta?: () => void;
}

const DEFAULT_NOTES: [string, string, string] = [
  "Объём работ определяется после бесплатной предварительной экспертизы",
  "Цены ориентировочные, фиксируются в договоре. Первичная консультация — бесплатно.",
  "Действуют с 01.01.2026 · НДС не облагается (УСН) · Ответственность застрахована",
];

// Выделяет **...** без лишних зависимостей
function InlineNote({ text }: { text: string }) {
  const parts = text.split(/\*\*(.*?)\*\*/g);
  return (
    <>
      {parts.map((p, i) =>
        i % 2 === 1 ? (
          <strong key={i} className="text-foreground">
            {p}
          </strong>
        ) : (
          p
        ),
      )}
    </>
  );
}

export default function PriceCard({
  tiers,
  notes = DEFAULT_NOTES,
  ctaLabel = "Получить расчет",
  onCta,
}: Props) {
  const [sent, setSent] = useState(false);
  const [note, subNote, legalNote] = notes;

  function handleCta() {
    if (onCta) return onCta();
    setSent(true);
    setTimeout(() => setSent(false), 3000);
  }

  return (
    <div className="w-full mt-10">
      {/* Header */}
      <div className="flex justify-between pb-2  text-xs  uppercase tracking-widest text-muted">
        <span>Услуга</span>
        <span>Цена</span>
      </div>

      {/* Rows */}
      <div className="">
        {tiers.map((tier, i) => (
          <div
            key={i}
            className="flex justify-between items-baseline py-5   transition-colors border-b"
          >
            <div className="flex items-baseline gap-2">
              <span className=" text-[16px] ">{tier.label}</span>
              {tier.hint && (
                <span className="text-[14px] text-muted">({tier.hint})</span>
              )}
            </div>
            <span className=" text-[15px] ">{tier.price}</span>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="flex  text-[14px] justify-between   gap-6 pt-8 items-end md:items-start ">
        <div className="space-y-1 max-w-xl">
          <p className=" leading-relaxed text-muted hidden md:flex">{note}</p>
          <p className=" leading-relaxed text-muted  hidden md:flex">
            <InlineNote text={subNote} />
          </p>
          <p className=" text-muted/50 pt-0.5">{legalNote}</p>
        </div>

        <Button
          onClick={handleCta}
          variant={sent ? "default" : "outline"}
          className="shrink-0 h-10 px-4 !rounded-none font-normal text-[14px] bg-bggrey border-none "
        >
          {sent ? "Отправлено" : ctaLabel}
        </Button>
      </div>
    </div>
  );
}
