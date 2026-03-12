// src/config/pages.ts
// ============================================================
// СТАТИЧЕСКИЕ СТРАНИЦЫ — для поиска и sitemap
// ============================================================

export interface StaticPage {
  href: string;
  titleKey: string;
  descriptionKey: string;
  tags: string[];
  priority?: number;
}

export const staticPages: StaticPage[] = [
  {
    href: "/",
    titleKey: "pages.home.title",
    descriptionKey: "pages.home.desc",
    tags: ["главная", "RCONS", "аудит", "консалтинг", "home", "首页"],
    priority: 1.0,
  },
  {
    href: "/about",
    titleKey: "pages.about.title",
    descriptionKey: "pages.about.desc",
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
    titleKey: "pages.contacts.title",
    descriptionKey: "pages.contacts.desc",
    tags: ["контакты", "связаться", "телефон", "почта", "contacts", "联系我们"],
    priority: 0.8,
  },
  {
    href: "/resources",
    titleKey: "pages.resources.title",
    descriptionKey: "pages.resources.desc",
    tags: ["ресурсы", "документы", "информация", "resources"],
    priority: 0.6,
  },
  {
    href: "/resources/documents",
    titleKey: "pages.resources.documents.title",
    descriptionKey: "pages.resources.documents.desc",
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
    titleKey: "pages.resources.sro.title",
    descriptionKey: "pages.resources.sro.desc",
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
    titleKey: "pages.resources.disclosure.title",
    descriptionKey: "pages.resources.disclosure.desc",
    tags: ["раскрытие информации", "прозрачность", "disclosure", "信息披露"],
    priority: 0.6,
  },
  {
    href: "/resources/qualifications",
    titleKey: "pages.resources.qualifications.title",
    descriptionKey: "pages.resources.qualifications.desc",
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

// Плоский индекс для поиска (совместим с searchIndex из services.ts)
export const staticSearchIndex = staticPages.map((page) => ({
  titleKey: page.titleKey,
  descriptionKey: page.descriptionKey,
  href: page.href,
  category: "static",
  type: "",
  tags: page.tags,
}));
