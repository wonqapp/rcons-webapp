"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import type { ServiceCategory } from "@/config/services";

interface Props {
  category: ServiceCategory;
  activeTypeSlug: string;
}

export default function ServiceSidebar({ category, activeTypeSlug }: Props) {
  const locale = useLocale();
  const t = useTranslations();

  return (
    <aside className="w-full lg:max-w-[300px]">
      <p className="text-[14px]  uppercase ">{t(category.titleKey as any)}</p>

      <nav className="flex flex-col border-l gap-6 mt-6">
        {category.types.map((type) => {
          const active = type.slug === activeTypeSlug;
          return (
            <Link
              key={type.slug}
              href={`/${locale}/services/${category.slug}/${type.slug}`}
              className={cn(
                " pl-6 border-l-3  border-bb text-[14px]  leading-snug transition-colors",
                active
                  ? "borde-bb text-foreground "
                  : "border-transparent text-muted hover:text-foreground hover:border-stroke",
              )}
            >
              {t(type.titleKey as any)}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
