// src/app/sitemap.ts
// ============================================================
// SITEMAP — автогенерация из конфига, все локали
// ============================================================

import { MetadataRoute } from "next";
import { siteConfig } from "@/config";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = siteConfig.url;
  const locales = siteConfig.locales;

  // 1. Статические страницы из конфига (главная, о нас, контакты и т.д.)
  const staticPaths = siteConfig.staticPages.map((p) => p.href);

  // 2. Страницы категорий (/services/audit и т.д.)
  const categoryPaths = siteConfig.services.map(
    (cat) => `/services/${cat.slug}`
  );

  // 3. Страницы типов (/services/audit/rsbu и т.д.)
  const typePaths = siteConfig.services.flatMap((cat) =>
    cat.types.map((type) => `/services/${cat.slug}/${type.slug}`)
  );

  // 4. Общий каталог услуг
  const allPaths = ["/services", ...staticPaths, ...categoryPaths, ...typePaths];

  return allPaths.flatMap((path) =>
    locales.map((locale) => ({
      url: `${baseUrl}/${locale}${path}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: path === "" ? 1.0 : path.startsWith("/services") ? 0.9 : 0.7,
      alternates: {
        languages: Object.fromEntries(
          locales.map((loc) => [loc, `${baseUrl}/${loc}${path}`])
        ),
      },
    }))
  );
}
