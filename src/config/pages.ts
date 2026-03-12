// src/config/pages.ts
// ============================================================
// СТАТИЧЕСКИЕ СТРАНИЦЫ — для поиска и sitemap
// ============================================================

export interface StaticPage {
  href: string;
  canonicalPath: string;
  titleKey: string;
  descriptionKey: string;
  ogImage: string;
  tags: string[];
  priority?: number;
}

export const staticPages: StaticPage[] = [
  {
    href: "/",
    canonicalPath: "/",
    titleKey: "pages.home.title",
    descriptionKey: "pages.home.desc",
    ogImage: "/images/hero-bg.jpg",
    tags: ["главная", "RCONS", "аудит", "консалтинг", "home", "首页"],
    priority: 1.0,
  },
  {
    href: "/services",
    canonicalPath: "/services",
    titleKey: "pages.services.title",
    descriptionKey: "pages.services.desc",
    ogImage: "/images/default-nav.jpg",
    tags: ["услуги", "аудит", "консалтинг", "RCONS", "services"],
    priority: 0.9,
  },
  {
    href: "/about",
    canonicalPath: "/about",
    titleKey: "pages.about.title",
    descriptionKey: "pages.about.desc",
    ogImage: "/images/default-nav.jpg",
    tags: [
      "о компании",
      "о нас",
      "RCONS",
      "about",
      "关于我们",
      "бизарыс туралы",
    ],
    priority: 0.8,
  },
  {
    href: "/contacts",
    canonicalPath: "/contacts",
    titleKey: "pages.contacts.title",
    descriptionKey: "pages.contacts.desc",
    ogImage: "/images/default-nav.jpg",
    tags: ["контакты", "связаться", "телефон", "почта", "contacts", "联系我们"],
    priority: 0.8,
  },
  {
    href: "/resources",
    canonicalPath: "/resources",
    titleKey: "pages.resources.title",
    descriptionKey: "pages.resources.desc",
    ogImage: "/images/default-nav.jpg",
    tags: ["ресурсы", "документы", "информация", "resources"],
    priority: 0.6,
  },
  {
    href: "/resources/documents",
    canonicalPath: "/resources/documents",
    titleKey: "pages.resources.documents.title",
    descriptionKey: "pages.resources.documents.desc",
    ogImage: "/images/default-nav.jpg",
    tags: [
      "документы",
      "нормативные документы",
      "скачать",
      "documents",
      "文件",
    ],
    priority: 0.6,
  },
  {
    href: "/resources/sro",
    canonicalPath: "/resources/sro",
    titleKey: "pages.resources.sro.title",
    descriptionKey: "pages.resources.sro.desc",
    ogImage: "/images/default-nav.jpg",
    tags: [
      "СРО",
      "саморегулируемая организация",
      "членство",
      "SRO",
      "self-regulatory",
      "行业协会",
    ],
    priority: 0.6,
  },
  {
    href: "/resources/disclosure",
    canonicalPath: "/resources/disclosure",
    titleKey: "pages.resources.disclosure.title",
    descriptionKey: "pages.resources.disclosure.desc",
    ogImage: "/images/default-nav.jpg",
    tags: ["раскрытие информации", "прозрачность", "disclosure", "信息披露"],
    priority: 0.6,
  },
  {
    href: "/resources/qualifications",
    canonicalPath: "/resources/qualifications",
    titleKey: "pages.resources.qualifications.title",
    descriptionKey: "pages.resources.qualifications.desc",
    ogImage: "/images/default-nav.jpg",
    tags: [
      "квалификации",
      "сертификаты",
      "аттестаты",
      "аудиторы",
      "qualifications",
      "资质认证",
    ],
    priority: 0.6,
  },
];

export interface StaticSearchIndexItem {
  titleKey: string;
  descriptionKey: string;
  href: string;
  category: "static";
  type: "page";
  tags: string[];
  searchKeywordsRu: string[];
  intentTags: string[];
  industryTags: string[];
  entityType: "page";
}

// Плоский индекс для поиска (совместим с searchIndex из services.ts)
export const staticSearchIndex: StaticSearchIndexItem[] = staticPages.map((page) => ({
  titleKey: page.titleKey,
  descriptionKey: page.descriptionKey,
  href: page.href,
  category: "static",
  type: "page",
  tags: page.tags,
  searchKeywordsRu: page.tags,
  intentTags: ["контент сайта", "информация", "навигация"],
  industryTags: ["аудит", "консалтинг"],
  entityType: "page",
}));
