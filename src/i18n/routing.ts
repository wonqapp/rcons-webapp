import { defineRouting } from "next-intl/routing";
import { createNavigation } from "next-intl/navigation";

export const routing = defineRouting({
  // Список поддерживаемых языков
  // ru - Русский (главный/по умолчанию)
  // zh - Китайский
  // en - Английский
  // kk - Казахский
  locales: ["ru", "zh", "en", "kk"],

  // Русский - основной язык
  defaultLocale: "ru",
});

// Экспортируем обертки над стандартными компонентами Next.js для работы с локалями
export const { Link, redirect, usePathname, useRouter } =
  createNavigation(routing);

// Тип для локалей
export type Locale = (typeof routing.locales)[number];

// Настройки языков для SEO и мета-тегов
export const localeConfig = {
  ru: {
    name: "Русский",
    nativeName: "Русский",
    direction: "ltr" as const,
    ogLocale: "ru_RU",
  },
  zh: {
    name: "Chinese",
    nativeName: "中文",
    direction: "ltr" as const,
    ogLocale: "zh_CN",
  },
  en: {
    name: "English",
    nativeName: "English",
    direction: "ltr" as const,
    ogLocale: "en_US",
  },
  kk: {
    name: "Kazakh",
    nativeName: "Қазақша",
    direction: "ltr" as const,
    ogLocale: "kk_KZ",
  },
};
