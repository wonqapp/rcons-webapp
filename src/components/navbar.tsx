"use client";
// src/components/navbar.tsx
// ============================================================
// NAVBAR — меню генерируется автоматически из siteConfig
// Добавь услугу в config/services.ts → появится в меню
// ============================================================

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Link, usePathname } from "@/i18n/routing";
import { siteConfig } from "@/config";
import Search from "./Search";

export default function Navbar() {
  const t = useTranslations();
  const locale = useLocale();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [resourcesOpen, setResourcesOpen] = useState(false);

  const isActive = (href: string) => pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">

        {/* ЛОГОТИП */}
        <Link href="/" className="flex items-center gap-2 font-bold text-xl">
          <img src="/logo.svg" alt="RCONS" className="h-8 w-auto" />
          <span className="hidden sm:inline">RCONS</span>
        </Link>

        {/* ДЕСКТОП МЕНЮ */}
        <nav className="hidden md:flex items-center gap-1" aria-label="Main navigation">

          {/* УСЛУГИ — дропдаун из конфига */}
          <div className="relative" onMouseLeave={() => setServicesOpen(false)}>
            <button
              className={`flex items-center gap-1 px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-accent ${
                isActive("/services") ? "text-primary" : "text-foreground"
              }`}
              onMouseEnter={() => setServicesOpen(true)}
              aria-expanded={servicesOpen}
            >
              {t("nav.services")}
              <svg className={`h-4 w-4 transition-transform ${servicesOpen ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {servicesOpen && (
              <div className="absolute top-full left-0 mt-1 w-72 bg-background border rounded-xl shadow-lg p-2 z-50">
                {siteConfig.services.map((cat) => (
                  <div key={cat.slug} className="mb-2">
                    <p className="px-3 py-1 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      {t(cat.titleKey as never)}
                    </p>
                    {cat.pages.map((page) => (
                      <Link
                        key={page.slug}
                        href={`/services/${cat.slug}/${page.slug}` as never}
                        className="block px-3 py-2 text-sm rounded-lg hover:bg-accent transition-colors"
                        onClick={() => setServicesOpen(false)}
                      >
                        {t(page.titleKey as never)}
                      </Link>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* РЕСУРСЫ — дропдаун */}
          <div className="relative" onMouseLeave={() => setResourcesOpen(false)}>
            <button
              className={`flex items-center gap-1 px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-accent ${
                isActive("/resources") ? "text-primary" : "text-foreground"
              }`}
              onMouseEnter={() => setResourcesOpen(true)}
              aria-expanded={resourcesOpen}
            >
              {t("nav.resources")}
              <svg className={`h-4 w-4 transition-transform ${resourcesOpen ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {resourcesOpen && (
              <div className="absolute top-full left-0 mt-1 w-56 bg-background border rounded-xl shadow-lg p-2 z-50">
                {[
                  { href: "/resources/documents", key: "pages.resources.documents.title" },
                  { href: "/resources/sro", key: "pages.resources.sro.title" },
                  { href: "/resources/disclosure", key: "pages.resources.disclosure.title" },
                  { href: "/resources/qualifications", key: "pages.resources.qualifications.title" },
                ].map((item) => (
                  <Link
                    key={item.href}
                    href={item.href as never}
                    className="block px-3 py-2 text-sm rounded-lg hover:bg-accent transition-colors"
                    onClick={() => setResourcesOpen(false)}
                  >
                    {t(item.key as never)}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* О КОМПАНИИ, КОНТАКТЫ */}
          {siteConfig.nav
            .filter((item) => !["nav.resources"].includes(item.titleKey))
            .map((item) => (
              <Link
                key={item.href}
                href={item.href as never}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-accent ${
                  isActive(item.href) ? "text-primary" : "text-foreground"
                }`}
              >
                {t(item.titleKey as never)}
              </Link>
            ))}
        </nav>

        {/* ПРАВАЯ ЧАСТЬ: ПОИСК + ПЕРЕКЛЮЧАТЕЛЬ ЯЗЫКА */}
        <div className="flex items-center gap-2">
          <Search />
          <LocaleSwitcher />

          {/* БУРГЕР (мобильный) */}
          <button
            className="md:hidden p-2 rounded-md hover:bg-accent"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* МОБИЛЬНОЕ МЕНЮ */}
      {mobileOpen && (
        <div className="md:hidden border-t bg-background px-4 py-4 space-y-1">
          {/* Услуги */}
          <p className="px-3 py-1 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            {t("nav.services")}
          </p>
          {siteConfig.services.flatMap((cat) =>
            cat.pages.map((page) => (
              <Link
                key={page.slug}
                href={`/services/${cat.slug}/${page.slug}` as never}
                className="block px-3 py-2 text-sm rounded-lg hover:bg-accent"
                onClick={() => setMobileOpen(false)}
              >
                {t(page.titleKey as never)}
              </Link>
            ))
          )}
          <div className="border-t my-2" />
          {/* Остальные */}
          {siteConfig.nav.map((item) => (
            <Link
              key={item.href}
              href={item.href as never}
              className="block px-3 py-2 text-sm rounded-lg hover:bg-accent"
              onClick={() => setMobileOpen(false)}
            >
              {t(item.titleKey as never)}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}

// ============================================================
// ПЕРЕКЛЮЧАТЕЛЬ ЯЗЫКА
// ============================================================
function LocaleSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();

  const localeLabels: Record<string, string> = {
    ru: "RU",
    en: "EN",
    kk: "KK",
    zh: "中",
  };

  return (
    <div className="flex items-center gap-1 text-xs">
      {siteConfig.locales.map((loc) => (
        <Link
          key={loc}
          href={pathname as never}
          locale={loc}
          className={`px-2 py-1 rounded transition-colors ${
            loc === locale
              ? "bg-primary text-primary-foreground font-medium"
              : "hover:bg-accent text-muted-foreground hover:text-foreground"
          }`}
        >
          {localeLabels[loc]}
        </Link>
      ))}
    </div>
  );
}
