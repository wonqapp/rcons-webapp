"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import { usePathname } from "next/navigation";
import { siteConfig } from "@/config";
import Search from "@/components/Search";
import Image from "next/image";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import { Search as SearchIcon, Languages, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

type Loc = (typeof siteConfig.locales)[number];

const triggerCls = cn(
  "bg-transparent hover:bg-transparent focus:bg-transparent data-[state=open]:bg-transparent !h-6",
  "text-[14px] font-normal hover:text-muted transition-colors",
  "p-0 gap-1.5 rounded-none shadow-none",
);

const linkCls =
  "text-[14px] font-normal hover:text-muted transition-colors !h-6 shadow-none hover:bg-transparent !rounded-none";

function DropItem({
  href,
  label,
  onClick,
}: {
  href: string;
  label: string;
  onClick?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="block px-4 py-2.5 text-[13px] hover:bg-accent rounded-md transition-colors"
    >
      {label}
    </Link>
  );
}

function Logo({ onClick }: { onClick: () => void }) {
  const locale = useLocale();
  return (
    <Link
      href={`/${locale}`}
      onClick={onClick}
      className="flex items-center gap-2 shrink-0"
    >
      <Image src="/logoN.svg" alt="РКОНС" width={66} height={24} priority />
    </Link>
  );
}

export default function Navbar() {
  const t = useTranslations();
  const locale = useLocale();
  const pathname = usePathname();

  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!langRef.current?.contains(e.target as Node)) setLangOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  function tr(k: string) {
    return t(k as Parameters<typeof t>[0]);
  }
  function closeAll() {
    setSearchOpen(false);
    setMobileOpen(false);
    setLangOpen(false);
  }

  const resourcesLinks = [
    {
      href: `/${locale}/resources/documents`,
      label: tr("pages.resources.documents.title"),
    },
    {
      href: `/${locale}/resources/sro`,
      label: tr("pages.resources.sro.title"),
    },
    {
      href: `/${locale}/resources/disclosure`,
      label: tr("pages.resources.disclosure.title"),
    },
    {
      href: `/${locale}/resources/qualifications`,
      label: tr("pages.resources.qualifications.title"),
    },
  ];

  return (
    <header className="sticky top-0 z-50 bg-bg-l">
      <div className="main-layout">
        <div className="content-layout flex items-center justify-between h-18">
          <Logo onClick={closeAll} />

          <div className="flex items-center gap-10">
            <button
              onClick={() => setSearchOpen((v) => !v)}
              className="hidden md:flex text-bb hover:text-muted transition-colors bg-transparent border-none cursor-pointer p-0"
              aria-label="Поиск"
            >
              <SearchIcon size={16} strokeWidth={1.8} />
            </button>

            <NavigationMenu viewport={false} className="hidden md:flex">
              <NavigationMenuList className="gap-6">
                {/* Услуги — только список категорий */}
                <NavigationMenuItem>
                  <NavigationMenuTrigger className={triggerCls}>
                    Услуги
                  </NavigationMenuTrigger>
                  <NavigationMenuContent className="w-[220px] p-2">
                    {siteConfig.services.map((cat) => (
                      <DropItem
                        key={cat.slug}
                        href={`/${locale}/services/${cat.slug}`}
                        label={tr(cat.titleKey)}
                        onClick={closeAll}
                      />
                    ))}
                    <div className="border-t mt-1 pt-1">
                      <DropItem
                        href={`/${locale}/services`}
                        label="Все услуги →"
                        onClick={closeAll}
                      />
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link href={`/${locale}/contacts`} className={linkCls}>
                      {tr("nav.contacts")}
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuTrigger className={triggerCls}>
                    {tr("nav.about")}
                  </NavigationMenuTrigger>
                  <NavigationMenuContent className="w-[200px] p-2">
                    <DropItem
                      href={`/${locale}/about`}
                      label="О компании"
                      onClick={closeAll}
                    />
                  </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuTrigger className={triggerCls}>
                    {tr("nav.resources")}
                  </NavigationMenuTrigger>
                  <NavigationMenuContent className="w-[240px] p-2">
                    {resourcesLinks.map((r) => (
                      <DropItem
                        key={r.href}
                        href={r.href}
                        label={r.label}
                        onClick={closeAll}
                      />
                    ))}
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>

            <Button
              asChild
              className="hidden md:inline-flex py-2 px-4 text-[14px] font-normal bg-bb text-ww rounded-none"
            >
              <Link href={`/${locale}/contacts`}>Связаться</Link>
            </Button>

            <div ref={langRef} className="relative hidden md:flex">
              <button
                onClick={() => setLangOpen((v) => !v)}
                className="text-bb hover:text-muted transition-colors p-0 bg-transparent border-none cursor-pointer"
                aria-label="Язык"
              >
                <Languages size={16} strokeWidth={1.6} />
              </button>
              {langOpen && (
                <div className="absolute right-0 top-[calc(100%+10px)] bg-bg-l border rounded-lg shadow-sm py-1 min-w-[72px] z-50">
                  {siteConfig.locales.map((loc: Loc) => (
                    <Link
                      key={loc}
                      href={pathname.replace(`/${locale}`, `/${loc}`)}
                      onClick={() => setLangOpen(false)}
                      className={cn(
                        "block px-3 py-1.5 text-[12px] transition-colors",
                        loc === locale
                          ? "font-semibold"
                          : "text-muted hover:text-foreground",
                      )}
                    >
                      {loc.toUpperCase()}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <button
              className="md:hidden text-muted hover:text-foreground transition-colors bg-transparent border-none cursor-pointer p-0"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="Меню"
            >
              {mobileOpen ? (
                <X size={20} strokeWidth={1.8} />
              ) : (
                <Menu size={20} strokeWidth={1.8} />
              )}
            </button>
          </div>
        </div>
      </div>

      {searchOpen && (
        <div className="border-t">
          <div className="main-layout">
            <div className="content-layout py-3">
              <Search onClose={() => setSearchOpen(false)} />
            </div>
          </div>
        </div>
      )}

      {mobileOpen && (
        <div className="md:hidden border-t">
          <div className="main-layout">
            <div className="content-layout py-4 flex flex-col gap-0">
              <button
                onClick={() => {
                  setSearchOpen((v) => !v);
                  setMobileOpen(false);
                }}
                className="flex items-center gap-2 text-[13px] text-muted hover:text-foreground px-1 py-2.5 transition-colors w-full bg-transparent border-none cursor-pointer"
              >
                <SearchIcon size={15} strokeWidth={1.8} />
                Поиск
              </button>

              <div className="border-t my-2" />

              <p className="text-[11px] font-semibold uppercase tracking-widest text-muted/50 px-1 py-2">
                Услуги
              </p>
              {siteConfig.services.map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/${locale}/services/${cat.slug}`}
                  onClick={closeAll}
                  className="text-[13px] text-muted hover:text-foreground px-1 py-2 transition-colors"
                >
                  {tr(cat.titleKey)}
                </Link>
              ))}

              <div className="border-t my-2" />

              {[
                { href: `/${locale}/contacts`, label: tr("nav.contacts") },
                { href: `/${locale}/about`, label: tr("nav.about") },
                { href: `/${locale}/resources`, label: tr("nav.resources") },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={closeAll}
                  className="text-[13px] text-muted hover:text-foreground px-1 py-2 transition-colors"
                >
                  {item.label}
                </Link>
              ))}

              <div className="border-t mt-2 pt-4 flex items-center justify-between">
                <div className="flex gap-3">
                  {siteConfig.locales.map((loc: Loc) => (
                    <Link
                      key={loc}
                      href={pathname.replace(`/${locale}`, `/${loc}`)}
                      onClick={closeAll}
                      className={cn(
                        "text-[12px]",
                        loc === locale ? "font-semibold" : "text-muted/40",
                      )}
                    >
                      {loc.toUpperCase()}
                    </Link>
                  ))}
                </div>
                <Button
                  asChild
                  className="h-8 px-4 text-[13px] rounded-none bg-bb text-ww font-normal"
                >
                  <Link href={`/${locale}/contacts`} onClick={closeAll}>
                    Связаться
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
