"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";
import { siteConfig } from "@/config";

interface SearchItem {
  titleKey: string;
  descriptionKey: string;
  href: string;
  category: string;
  type: string;
  tags: string[];
  searchKeywordsRu?: string[];
  intentTags?: string[];
  industryTags?: string[];
  entityType?: "service" | "page";
}

interface RankedResult {
  item: SearchItem;
  score: number;
}

interface Props {
  onClose?: () => void;
}

function rankItem(
  item: SearchItem,
  query: string,
  getTitle: (key: string) => string,
  getDesc: (key: string) => string,
): number {
  const q = query.trim().toLowerCase();
  if (!q) return 0;

  const title = getTitle(item.titleKey).toLowerCase();
  const desc = getDesc(item.descriptionKey).toLowerCase();
  const keywords = (item.searchKeywordsRu ?? []).map((v) => v.toLowerCase());
  const intents = (item.intentTags ?? []).map((v) => v.toLowerCase());
  const industries = (item.industryTags ?? []).map((v) => v.toLowerCase());
  const tags = (item.tags ?? []).map((v) => v.toLowerCase());

  let score = 0;

  if (title === q) score += 100;
  if (title.startsWith(q)) score += 75;
  if (title.includes(q)) score += 60;

  if (keywords.some((k) => k === q)) score += 55;
  if (keywords.some((k) => k.includes(q))) score += 40;

  if (intents.some((i) => i === q)) score += 35;
  if (intents.some((i) => i.includes(q))) score += 30;

  if (tags.some((t) => t.includes(q))) score += 25;
  if (industries.some((i) => i.includes(q))) score += 20;
  if (desc.includes(q)) score += 15;

  return score;
}

export default function Search({ onClose }: Props) {
  const t = useTranslations();
  const locale = useLocale();
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const getTitle = useCallback(
    (key: string): string => {
      try {
        return t(key as Parameters<typeof t>[0]);
      } catch {
        return key;
      }
    },
    [t],
  );

  const getDesc = useCallback(
    (key: string): string => {
      try {
        return t(key as Parameters<typeof t>[0]);
      } catch {
        return "";
      }
    },
    [t],
  );

  const results = useMemo<SearchItem[]>(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];

    const ranked: RankedResult[] = siteConfig.search
      .map((item) => ({ item, score: rankItem(item, q, getTitle, getDesc) }))
      .filter(({ score }) => score > 0)
      .sort((a, b) => b.score - a.score);

    return ranked.slice(0, 8).map(({ item }) => item);
  }, [query, getTitle, getDesc]);

  return (
    <div className="relative w-full max-w-xl mx-auto">
      <div className="flex items-center gap-2  py-2">
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          className="text-muted shrink-0"
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          ref={inputRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Найти услугу..."
          className="flex-1 bg-transparent text-sm  placeholder-muted outline-none"
          onKeyDown={(e) => {
            if (e.key === "Escape") onClose?.();
          }}
        />
        {query && (
          <button
            onClick={() => setQuery("")}
            className="text-muted hover:text-text-primary transition-colors"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        )}
      </div>

      {results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-bg-l border border-border  shadow-lg shadow-black/5 overflow-hidden z-50">
          {results.map((item, i) => (
            <Link
              key={i}
              href={`/${locale}${item.href}`}
              onClick={onClose}
              className="flex flex-col gap-0.5 px-4 py-3 hover:bg-bggrey transition-colors border-b border-border last:border-0"
            >
              <span className="text-[11px] uppercase tracking-[0.15em] text-[#a8a49d]">
                {item.entityType === "page" ? "Страница" : "Услуга"}
              </span>
              <span className="text-sm">{getTitle(item.titleKey)}</span>
              <span className="text-xs text-muted line-clamp-1">
                {getDesc(item.descriptionKey)}
              </span>
            </Link>
          ))}
        </div>
      )}

      {query.trim() && results.length === 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-[#e8e6e1] rounded-xl px-4 py-3 z-50">
          <span className="text-sm text-[#a8a49d]">Ничего не найдено</span>
        </div>
      )}
    </div>
  );
}
