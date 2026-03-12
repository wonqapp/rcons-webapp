// src/config/pricing.ts
// ============================================================
// ПРАЙС-ЛИСТ — привязан к slug услуги
// model: "fixed" | "from" | "monthly" | "individual"
// ============================================================

export type PriceModel = "fixed" | "from" | "monthly" | "individual";

export interface PriceTier {
  label: string; // "Малый бизнес (до 400 млн)"
  price: number; // числовое значение
  model: PriceModel;
}

export interface ServicePrice {
  slug: string; // category/type — совпадает с href
  tiers: PriceTier[];
  note?: string; // доп. сноска для конкретной услуги
}

export const pricing: ServicePrice[] = [
  // ─── АУДИТ ───────────────────────────────────────────────
  {
    slug: "audit/mandatory-rsbu",
    tiers: [
      {
        label: "Малый бизнес (выручка до 400 млн ₽)",
        price: 180_000,
        model: "from",
      },
      {
        label: "Средний бизнес (400 млн — 2 млрд ₽)",
        price: 380_000,
        model: "from",
      },
      {
        label: "Крупный бизнес (свыше 2 млрд ₽)",
        price: 700_000,
        model: "from",
      },
    ],
    note: "Объём работ определяется после бесплатной предварительной экспертизы",
  },
  {
    slug: "audit/mandatory-gup",
    tiers: [
      { label: "ГУП / МУП", price: 220_000, model: "from" },
      {
        label: "Организация с долей государства",
        price: 300_000,
        model: "from",
      },
    ],
  },
  {
    slug: "audit/mandatory-nko",
    tiers: [{ label: "НКО, фонд, ассоциация", price: 120_000, model: "from" }],
  },
  {
    slug: "audit/mandatory-developer",
    tiers: [{ label: "Застройщик (214-ФЗ)", price: 220_000, model: "from" }],
  },
  {
    slug: "audit/initiative",
    tiers: [{ label: "Инициативный аудит", price: 150_000, model: "from" }],
  },
  {
    slug: "audit/special-assignment",
    tiers: [
      { label: "Аудит по специальному заданию", price: 80_000, model: "from" },
    ],
  },
  {
    slug: "audit/tax-audit",
    tiers: [{ label: "Налоговый аудит", price: 120_000, model: "from" }],
  },
  {
    slug: "audit/strategic-programs",
    tiers: [
      { label: "Аудит программы стратразвития", price: 150_000, model: "from" },
    ],
  },
  {
    slug: "audit/pif",
    tiers: [
      {
        label: "Аудит ПИФ / управляющей компании",
        price: 200_000,
        model: "from",
      },
    ],
  },
  {
    slug: "audit/pension",
    tiers: [
      {
        label: "Подтверждение пенсионных накоплений",
        price: 180_000,
        model: "from",
      },
    ],
  },

  // ─── НАЛОГИ ──────────────────────────────────────────────
  {
    slug: "tax/consulting",
    tiers: [
      { label: "Устная консультация (1 час)", price: 6_000, model: "fixed" },
      { label: "Письменное заключение", price: 25_000, model: "from" },
    ],
  },
  {
    slug: "tax/subscription",
    tiers: [{ label: "Налоговый абонемент", price: 45_000, model: "monthly" }],
    note: "Объём услуг по абонементу фиксируется в договоре",
  },
  {
    slug: "tax/pre-inspection",
    tiers: [{ label: "Предпроверочный анализ", price: 80_000, model: "from" }],
  },
  {
    slug: "tax/inspection-support",
    tiers: [
      { label: "Камеральная проверка", price: 50_000, model: "from" },
      { label: "Выездная проверка", price: 120_000, model: "from" },
    ],
  },
  {
    slug: "tax/pre-trial",
    tiers: [
      {
        label: "Досудебное обжалование решений ФНС",
        price: 100_000,
        model: "from",
      },
    ],
  },
  {
    slug: "tax/vat-refund",
    tiers: [{ label: "Возмещение НДС", price: 80_000, model: "from" }],
  },
  {
    slug: "tax/restructuring",
    tiers: [
      { label: "Налоговая реструктуризация", price: 0, model: "individual" },
    ],
  },
  {
    slug: "tax/declaration",
    tiers: [
      {
        label: "Декларация 3-НДФЛ (стандартная)",
        price: 8_000,
        model: "fixed",
      },
      { label: "3-НДФЛ со сложными доходами", price: 18_000, model: "from" },
      {
        label: "Уведомление о КИК / иностранные счета",
        price: 30_000,
        model: "from",
      },
    ],
  },

  // ─── ОЦЕНКА ──────────────────────────────────────────────
  {
    slug: "valuation/business-valuation",
    tiers: [
      { label: "Малый бизнес", price: 80_000, model: "from" },
      { label: "Средний и крупный бизнес", price: 200_000, model: "from" },
    ],
  },
  {
    slug: "valuation/intangibles",
    tiers: [
      { label: "Оценка НМА (бренд, ПО, патент)", price: 70_000, model: "from" },
    ],
  },
  {
    slug: "valuation/ma-valuation",
    tiers: [
      { label: "Оценка для M&A / инвестора", price: 120_000, model: "from" },
    ],
  },
  {
    slug: "valuation/real-estate",
    tiers: [
      {
        label: "Оценка объекта коммерческой недвижимости",
        price: 30_000,
        model: "from",
      },
    ],
  },
  {
    slug: "valuation/land",
    tiers: [
      { label: "Оценка земельного участка", price: 20_000, model: "from" },
    ],
  },
  {
    slug: "valuation/vehicles",
    tiers: [
      { label: "Оценка транспортного средства", price: 8_000, model: "from" },
    ],
  },
  {
    slug: "valuation/equipment",
    tiers: [
      {
        label: "Оценка оборудования (до 10 ед.)",
        price: 25_000,
        model: "from",
      },
      {
        label: "Оценка оборудования (свыше 10 ед.)",
        price: 0,
        model: "individual",
      },
    ],
  },
  {
    slug: "valuation/cadastral",
    tiers: [
      {
        label: "Оспаривание кадастровой стоимости",
        price: 60_000,
        model: "from",
      },
    ],
    note: "Включает отчёт об оценке и сопровождение в комиссии Росреестра или суде",
  },
  {
    slug: "valuation/bank-valuation",
    tiers: [
      {
        label: "Оценка для банка (залог / кредитование)",
        price: 25_000,
        model: "from",
      },
    ],
  },
  {
    slug: "valuation/damage",
    tiers: [{ label: "Оценка ущерба / убытков", price: 80_000, model: "from" }],
  },

  // ─── DUE DILIGENCE ───────────────────────────────────────
  {
    slug: "due-diligence/financial-dd",
    tiers: [
      { label: "Малый бизнес", price: 200_000, model: "from" },
      { label: "Средний и крупный бизнес", price: 500_000, model: "from" },
    ],
  },
  {
    slug: "due-diligence/tax-dd",
    tiers: [
      { label: "Налоговый Due Diligence", price: 180_000, model: "from" },
    ],
  },
  {
    slug: "due-diligence/legal-dd",
    tiers: [
      { label: "Юридический Due Diligence", price: 200_000, model: "from" },
    ],
  },
  {
    slug: "due-diligence/operational-dd",
    tiers: [
      { label: "Операционный Due Diligence", price: 180_000, model: "from" },
    ],
  },
  {
    slug: "due-diligence/complex-dd",
    tiers: [
      {
        label: "Комплексный DD (все направления)",
        price: 700_000,
        model: "from",
      },
    ],
    note: "Единая команда, единый отчёт. M&A, инвестор, кредитование",
  },

  // ─── АУТСОРСИНГ ──────────────────────────────────────────
  {
    slug: "outsourcing/full-accounting",
    tiers: [
      { label: "До 50 операций в месяц", price: 18_000, model: "monthly" },
      { label: "50–200 операций в месяц", price: 35_000, model: "monthly" },
      { label: "Свыше 200 операций в месяц", price: 60_000, model: "monthly" },
    ],
  },
  {
    slug: "outsourcing/payroll",
    tiers: [
      { label: "До 10 сотрудников", price: 12_000, model: "monthly" },
      { label: "11–30 сотрудников", price: 20_000, model: "monthly" },
      { label: "Свыше 30 сотрудников", price: 0, model: "individual" },
    ],
  },
  {
    slug: "outsourcing/restoration",
    tiers: [
      {
        label: "Восстановление учёта (за период)",
        price: 40_000,
        model: "from",
      },
    ],
    note: "Стоимость зависит от объёма и состояния документов",
  },
  {
    slug: "outsourcing/zero-reporting",
    tiers: [{ label: "Нулевая отчётность", price: 5_000, model: "monthly" }],
  },
  {
    slug: "outsourcing/fsbu",
    tiers: [
      {
        label: "Переход на новые ФСБУ (методология)",
        price: 60_000,
        model: "from",
      },
    ],
  },
  {
    slug: "outsourcing/accounting-policy",
    tiers: [
      { label: "Разработка учётной политики", price: 40_000, model: "from" },
    ],
  },

  // ─── ФИНАНСОВЫЙ КОНСАЛТИНГ ───────────────────────────────
  {
    slug: "financial-consulting/analysis",
    tiers: [
      { label: "Финансовый анализ компании", price: 80_000, model: "from" },
    ],
  },
  {
    slug: "financial-consulting/business-planning",
    tiers: [
      {
        label: "Бизнес-план (для банка / инвестора)",
        price: 120_000,
        model: "from",
      },
    ],
  },
  {
    slug: "financial-consulting/modeling",
    tiers: [{ label: "Финансовая модель", price: 100_000, model: "from" }],
  },
  {
    slug: "financial-consulting/management-reporting",
    tiers: [
      {
        label: "Разработка управленческой отчётности",
        price: 150_000,
        model: "from",
      },
    ],
  },

  // ─── ЮРИДИЧЕСКИЕ УСЛУГИ ──────────────────────────────────
  {
    slug: "legal/legal-outsourcing",
    tiers: [
      { label: "Юридический аутсорсинг", price: 40_000, model: "monthly" },
    ],
  },
  {
    slug: "legal/litigation",
    tiers: [
      { label: "Арбитраж — первая инстанция", price: 120_000, model: "from" },
      { label: "Апелляция / кассация", price: 80_000, model: "from" },
    ],
  },
  {
    slug: "legal/bankruptcy",
    tiers: [
      { label: "Банкротство / ликвидация", price: 200_000, model: "from" },
    ],
  },
  {
    slug: "legal/corporate",
    tiers: [
      {
        label: "Корпоративная сделка (структурирование)",
        price: 150_000,
        model: "from",
      },
    ],
  },
];

// Хелперы
export function getPricing(
  categorySlug: string,
  typeSlug: string,
): ServicePrice | undefined {
  return pricing.find((p) => p.slug === `${categorySlug}/${typeSlug}`);
}

export function formatPrice(price: number, model: PriceModel): string {
  if (model === "individual" || price === 0) return "Индивидуально";
  const formatted = new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "RUB",
    maximumFractionDigits: 0,
  }).format(price);
  if (model === "from") return `от ${formatted}`;
  if (model === "monthly") return `от ${formatted} / мес`;
  return formatted; // fixed
}
