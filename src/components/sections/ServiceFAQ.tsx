/**
 * @description FAQ-секция на странице услуги.
 * Использует shadcn Accordion для раскрываемых ответов.
 */
"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import type { FaqItem } from "@/config/content";

interface ServiceFAQProps {
  title: string;
  items: FaqItem[];
}

export default function ServiceFAQ({ title, items }: ServiceFAQProps) {
  if (!items.length) return null;

  return (
    <section className="py-12 border-t border-[--color-border]">
      <h2 className="text-2xl font-sans font-semibold text-[--color-text-primary] mb-6">
        {title}
      </h2>

      <Accordion type="single" collapsible className="space-y-1">
        {items.map((item, index) => (
          <AccordionItem
            key={index}
            value={`faq-${index}`}
            className="border border-[--color-border] rounded-lg px-4 data-[state=open]:bg-[--color-surface-alt] transition-colors"
          >
            <AccordionTrigger className="text-[15px] font-medium text-[--color-text-primary] py-4 hover:no-underline text-left">
              {item.question}
            </AccordionTrigger>
            <AccordionContent className="text-[14px] text-[--color-text-muted] leading-relaxed pb-4">
              {item.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}
