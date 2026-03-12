// src/config/index.ts
// ============================================================
// ГЛАВНЫЙ КОНФИГ САЙТА
// ============================================================

// src/config/index.ts
import { servicesHierarchy, searchIndex } from "./services";
import { staticPages, staticSearchIndex } from "./pages";

export const siteConfig = {
  name: "RCONS",
  url: "https://rcons.ru",
  locales: ["ru", "en", "kk", "zh"] as const,
  defaultLocale: "ru",
  company: {
    email: "info@rcons.ru",
    phone: "+7 (XXX) XXX-XX-XX",
    address: "Москва",
    inn: "XXXXXXXXXX",
  },
  nav: [
    { titleKey: "nav.services", href: "/services" },
    { titleKey: "nav.about", href: "/about" },
    { titleKey: "nav.resources", href: "/resources" },
    { titleKey: "nav.contacts", href: "/contacts" },
  ],
  services: servicesHierarchy, // ← только один раз
  search: [...searchIndex, ...staticSearchIndex],
  staticPages,
};

export type SiteConfig = typeof siteConfig;
