"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import type { ServiceCategory } from "@/config/services";
import { cn } from "@/lib/utils";

interface Props {
  category: ServiceCategory;
  activeTypeSlug: string;
}

export default function ServiceSidebar({ category, activeTypeSlug }: Props) {
  const locale = useLocale();
  const t = useTranslations();
  const tr = (key: string) => t(key as Parameters<typeof t>[0]);

  return (
    <aside className="w-full lg:max-w-[300px] lg:sticky lg:top-6">
      <p className="text-[14px] uppercase">{tr(category.titleKey)}</p>

      <nav className="flex flex-col border-l gap-6 mt-6">
        {category.types.map((type) => {
          const active = type.slug === activeTypeSlug;

          return (
            <Link
              key={type.slug}
              href={`/${locale}/services/${category.slug}/${type.slug}`}
              className={cn(
                "pl-6 border-l-3 border-bb text-[14px] leading-snug transition-colors",
                active
                  ? "border-bb text-foreground"
                  : "border-transparent text-muted hover:text-foreground hover:border-stroke",
              )}
            >
              {tr(type.titleKey)}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
