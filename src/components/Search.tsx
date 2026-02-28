"use client";
// src/components/Search.tsx
// ============================================================
// ПОИСК — Fuse.js fuzzy search
// Резолвит titleKey → реальный текст для текущей локали
// Поддерживает: опечатки, частичное совпадение
// Установи: npm install fuse.js
// ============================================================

import { useState, useEffect, useRef, useCallback } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/routing";
import { siteConfig } from "@/config";

// Типы
interface SearchItem {
  title: string;
  description?: string;
  href: string;
  category: string;
}

// Иконки по категориям
const categoryIcons: Record<string, string> = {
  audit: "🔍",
  tax: "📊",
  main: "📄",
  resources: "🏛️",
};

export default function Search() {
  const t = useTranslations();
  const tCommon = useTranslations("common.search");
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchItem[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // ============================================================
  // Строим поисковый индекс из конфига
  // Резолвируем titleKey → реальный текст
  // ============================================================
  const buildIndex = useCallback((): SearchItem[] => {
    return siteConfig.search.map((item) => {
      // Безопасно достаём перевод — если ключ не найден, fallback к href
      let title = item.href;
      let description = "";
      try {
        title = t(item.titleKey as never);
      } catch {
        title = item.href;
      }
      if ("descriptionKey" in item) {
        try {
          description = t((item as { descriptionKey: string }).descriptionKey as never);
        } catch {
          description = "";
        }
      }
      return {
        title,
        description,
        href: item.href,
        category: item.category,
      };
    });
  }, [t]);

  // ============================================================
  // Поиск через Fuse.js (динамический импорт чтоб не грузить сразу)
  // ============================================================
  useEffect(() => {
    if (!open || !query.trim()) {
      setResults([]);
      setSelectedIndex(0);
      return;
    }

    const searchItems = buildIndex();

    // Динамически грузим Fuse только когда нужен поиск
    import("fuse.js").then(({ default: Fuse }) => {
      const fuse = new Fuse(searchItems, {
        keys: [
          { name: "title", weight: 0.7 },
          { name: "description", weight: 0.3 },
        ],
        threshold: 0.4, // 0 = точное, 1 = совпадает всё
        includeScore: true,
        minMatchCharLength: 2,
      });

      const searchResults = fuse.search(query).slice(0, 8);
      setResults(searchResults.map((r) => r.item));
      setSelectedIndex(0);
    });
  }, [query, open, buildIndex]);

  // Открытие по Ctrl+K / Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setOpen(true);
      }
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Фокус при открытии
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery("");
    }
  }, [open]);

  // Клик вне — закрыть
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  // Навигация стрелками + Enter
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && results[selectedIndex]) {
      navigateTo(results[selectedIndex].href);
    }
  };

  const navigateTo = (href: string) => {
    router.push(href as never);
    setOpen(false);
  };

  return (
    <>
      {/* КНОПКА ОТКРЫТИЯ */}
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 px-3 py-1.5 text-sm rounded-lg border border-input bg-background hover:bg-accent transition-colors text-muted-foreground"
        aria-label="Search"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <span className="hidden sm:inline">{tCommon("placeholder")}</span>
        <kbd className="hidden sm:inline text-xs bg-muted px-1.5 py-0.5 rounded text-muted-foreground">
          ⌘K
        </kbd>
      </button>

      {/* МОДАЛ ПОИСКА */}
      {open && (
        <div className="fixed inset-0 z-[100] bg-background/80 backdrop-blur-sm flex items-start justify-center pt-[20vh]">
          <div
            ref={containerRef}
            className="w-full max-w-lg mx-4 bg-background border rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* INPUT */}
            <div className="flex items-center gap-3 px-4 py-3 border-b">
              <svg className="h-5 w-5 text-muted-foreground shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={tCommon("placeholder")}
                className="flex-1 bg-transparent outline-none text-sm"
              />
              {query && (
                <button onClick={() => setQuery("")} className="text-muted-foreground hover:text-foreground">
                  ✕
                </button>
              )}
            </div>

            {/* РЕЗУЛЬТАТЫ */}
            <div className="max-h-80 overflow-y-auto">
              {query && results.length === 0 && (
                <p className="px-4 py-8 text-center text-sm text-muted-foreground">
                  {tCommon("noResults")} «{query}»
                </p>
              )}

              {results.length > 0 && (
                <div className="py-2">
                  <p className="px-4 py-1 text-xs text-muted-foreground font-medium">
                    {tCommon("results")}
                  </p>
                  {results.map((item, index) => (
                    <button
                      key={item.href}
                      onClick={() => navigateTo(item.href)}
                      className={`w-full flex items-start gap-3 px-4 py-3 text-left transition-colors ${
                        index === selectedIndex ? "bg-accent" : "hover:bg-accent/50"
                      }`}
                    >
                      <span className="text-lg shrink-0">
                        {categoryIcons[item.category] ?? "📄"}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{item.title}</p>
                        {item.description && (
                          <p className="text-xs text-muted-foreground truncate mt-0.5">
                            {item.description}
                          </p>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {!query && (
                <div className="px-4 py-8 text-center text-sm text-muted-foreground">
                  <p>Начните вводить запрос...</p>
                  <p className="text-xs mt-2">↑↓ навигация · Enter перейти · Esc закрыть</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
