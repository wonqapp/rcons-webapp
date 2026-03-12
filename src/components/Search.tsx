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
}

interface Props {
  onClose?: () => void;
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
    return siteConfig.search
      .filter((item) => {
        const title = getTitle(item.titleKey).toLowerCase();
        const desc = getDesc(item.descriptionKey).toLowerCase();
        const tags = item.tags.some((tag) => tag.toLowerCase().includes(q));
        return title.includes(q) || desc.includes(q) || tags;
      })
      .slice(0, 8);
  }, [query, getTitle, getDesc]);

  return (
    <div className="relative w-full max-w-xl mx-auto">
      <div className="flex items-center gap-2 border-b border-[#1a1a18] pb-2">
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          className="text-[#a8a49d] shrink-0"
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          ref={inputRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Найти услугу..."
          className="flex-1 bg-transparent text-sm text-[#1a1a18] placeholder-[#a8a49d] outline-none"
          onKeyDown={(e) => {
            if (e.key === "Escape") onClose?.();
          }}
        />
        {query && (
          <button
            onClick={() => setQuery("")}
            className="text-[#a8a49d] hover:text-[#1a1a18] transition-colors"
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
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-[#e8e6e1] rounded-xl shadow-lg shadow-black/5 overflow-hidden z-50">
          {results.map((item, i) => (
            <Link
              key={i}
              href={`/${locale}${item.href}`}
              onClick={onClose}
              className="flex flex-col gap-0.5 px-4 py-3 hover:bg-[#f7f6f3] transition-colors border-b border-[#f0ede8] last:border-0"
            >
              <span className="text-sm text-[#1a1a18]">
                {getTitle(item.titleKey)}
              </span>
              <span className="text-xs text-[#a8a49d] line-clamp-1">
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
