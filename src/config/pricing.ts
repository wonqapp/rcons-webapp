// src/config/pricing.ts
// ============================================================
// ПРАЙС-ЛИСТ — привязан к slug услуги
// model: "fixed" | "from" | "monthly" | "individual"
// ============================================================

export type PricingMode = "fixed" | "from" | "on_request";
export type PriceUnit = "project" | "month" | "hour";

export interface PriceTier {
  label: string;
  pricingMode: PricingMode;
  amount?: number;
  currency: "RUB";
  unit?: PriceUnit;
}

export interface ServicePrice {
  serviceId: string; // category/type — совпадает с href
  tiers: PriceTier[];
  note?: string; // доп. сноска для конкретной услуги
}

interface LegacyPriceTier {
  label: string;
  price: number;
  model: "fixed" | "from" | "monthly" | "individual";
}

interface LegacyServicePrice {
  serviceId: string;
  tiers: LegacyPriceTier[];
  note?: string;
}

const pricingLegacy: LegacyServicePrice[] = [

  // ─── АУДИТ ───────────────────────────────────────────────
  {
    serviceId: "audit/mandatory-rsbu",
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
    serviceId: "audit/mandatory-gup",
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
    serviceId: "audit/mandatory-nko",
    tiers: [{ label: "НКО, фонд, ассоциация", price: 120_000, model: "from" }],
  },
  {
    serviceId: "audit/mandatory-developer",
    tiers: [{ label: "Застройщик (214-ФЗ)", price: 220_000, model: "from" }],
  },
  {
    serviceId: "audit/initiative",
    tiers: [{ label: "Инициативный аудит", price: 150_000, model: "from" }],
  },
  {
    serviceId: "audit/special-assignment",
    tiers: [
      { label: "Аудит по специальному заданию", price: 80_000, model: "from" },
    ],
  },
  {
    serviceId: "audit/tax-audit",
    tiers: [{ label: "Налоговый аудит", price: 120_000, model: "from" }],
  },
  {
    serviceId: "audit/strategic-programs",
    tiers: [
      { label: "Аудит программы стратразвития", price: 150_000, model: "from" },
    ],
  },
  {
    serviceId: "audit/pif",
    tiers: [
      {
        label: "Аудит ПИФ / управляющей компании",
        price: 200_000,
        model: "from",
      },
    ],
  },
  {
    serviceId: "audit/pension",
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
    serviceId: "tax/consulting",
    tiers: [
      { label: "Устная консультация (1 час)", price: 6_000, model: "fixed" },
      { label: "Письменное заключение", price: 25_000, model: "from" },
    ],
  },
  {
    serviceId: "tax/subscription",
    tiers: [{ label: "Налоговый абонемент", price: 45_000, model: "monthly" }],
    note: "Объём услуг по абонементу фиксируется в договоре",
  },
  {
    serviceId: "tax/pre-inspection",
    tiers: [{ label: "Предпроверочный анализ", price: 80_000, model: "from" }],
  },
  {
    serviceId: "tax/inspection-support",
    tiers: [
      { label: "Камеральная проверка", price: 50_000, model: "from" },
      { label: "Выездная проверка", price: 120_000, model: "from" },
    ],
  },
  {
    serviceId: "tax/pre-trial",
    tiers: [
      {
        label: "Досудебное обжалование решений ФНС",
        price: 100_000,
        model: "from",
      },
    ],
  },
  {
    serviceId: "tax/vat-refund",
    tiers: [{ label: "Возмещение НДС", price: 80_000, model: "from" }],
  },
  {
    serviceId: "tax/restructuring",
    tiers: [
      { label: "Налоговая реструктуризация", price: 0, model: "individual" },
    ],
  },
  {
    serviceId: "tax/declaration",
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
    serviceId: "valuation/business-valuation",
    tiers: [
      { label: "Малый бизнес", price: 80_000, model: "from" },
      { label: "Средний и крупный бизнес", price: 200_000, model: "from" },
    ],
  },
  {
    serviceId: "valuation/intangibles",
    tiers: [
      { label: "Оценка НМА (бренд, ПО, патент)", price: 70_000, model: "from" },
    ],
  },
  {
    serviceId: "valuation/real-estate",
    tiers: [
      {
        label: "Оценка объекта коммерческой недвижимости",
        price: 30_000,
        model: "from",
      },
    ],
  },
  {
    serviceId: "valuation/land",
    tiers: [
      { label: "Оценка земельного участка", price: 20_000, model: "from" },
    ],
  },
  {
    serviceId: "valuation/vehicles",
    tiers: [
      { label: "Оценка транспортного средства", price: 8_000, model: "from" },
    ],
  },
  {
    serviceId: "valuation/equipment",
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
    serviceId: "valuation/cadastral",
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
    serviceId: "valuation/bank-valuation",
    tiers: [
      {
        label: "Оценка для банка (залог / кредитование)",
        price: 25_000,
        model: "from",
      },
    ],
  },
  {
    serviceId: "valuation/damage",
    tiers: [{ label: "Оценка ущерба / убытков", price: 80_000, model: "from" }],
  },

  // ─── DUE DILIGENCE ───────────────────────────────────────
  {
    serviceId: "due-diligence/financial-dd",
    tiers: [
      { label: "Малый бизнес", price: 200_000, model: "from" },
      { label: "Средний и крупный бизнес", price: 500_000, model: "from" },
    ],
  },
  {
    serviceId: "due-diligence/tax-dd",
    tiers: [
      { label: "Налоговый Due Diligence", price: 180_000, model: "from" },
    ],
  },
  {
    serviceId: "due-diligence/legal-dd",
    tiers: [
      { label: "Юридический Due Diligence", price: 200_000, model: "from" },
    ],
  },
  {
    serviceId: "due-diligence/operational-dd",
    tiers: [
      { label: "Операционный Due Diligence", price: 180_000, model: "from" },
    ],
  },
  {
    serviceId: "due-diligence/complex-dd",
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
    serviceId: "outsourcing/full-accounting",
    tiers: [
      { label: "До 50 операций в месяц", price: 18_000, model: "monthly" },
      { label: "50–200 операций в месяц", price: 35_000, model: "monthly" },
      { label: "Свыше 200 операций в месяц", price: 60_000, model: "monthly" },
    ],
  },
  {
    serviceId: "outsourcing/payroll",
    tiers: [
      { label: "До 10 сотрудников", price: 12_000, model: "monthly" },
      { label: "11–30 сотрудников", price: 20_000, model: "monthly" },
      { label: "Свыше 30 сотрудников", price: 0, model: "individual" },
    ],
  },
  {
    serviceId: "outsourcing/restoration",
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
    serviceId: "outsourcing/zero-reporting",
    tiers: [{ label: "Нулевая отчётность", price: 5_000, model: "monthly" }],
  },
  {
    serviceId: "outsourcing/fsbu",
    tiers: [
      {
        label: "Переход на новые ФСБУ (методология)",
        price: 60_000,
        model: "from",
      },
    ],
  },
  {
    serviceId: "outsourcing/accounting-policy",
    tiers: [
      { label: "Разработка учётной политики", price: 40_000, model: "from" },
    ],
  },

  // ─── ФИНАНСОВЫЙ КОНСАЛТИНГ ───────────────────────────────
  {
    serviceId: "financial-consulting/analysis",
    tiers: [
      { label: "Финансовый анализ компании", price: 80_000, model: "from" },
    ],
  },
  {
    serviceId: "financial-consulting/business-planning",
    tiers: [
      {
        label: "Бизнес-план (для банка / инвестора)",
        price: 120_000,
        model: "from",
      },
    ],
  },
  {
    serviceId: "financial-consulting/modeling",
    tiers: [{ label: "Финансовая модель", price: 100_000, model: "from" }],
  },
  {
    serviceId: "financial-consulting/management-reporting",
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
    serviceId: "legal/legal-outsourcing",
    tiers: [
      { label: "Юридический аутсорсинг", price: 40_000, model: "monthly" },
    ],
  },
  {
    serviceId: "legal/litigation",
    tiers: [
      { label: "Арбитраж — первая инстанция", price: 120_000, model: "from" },
      { label: "Апелляция / кассация", price: 80_000, model: "from" },
    ],
  },
  {
    serviceId: "legal/bankruptcy",
    tiers: [
      { label: "Банкротство / ликвидация", price: 200_000, model: "from" },
    ],
  },
  {
    serviceId: "legal/corporate",
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
function normalizePricingMode(model: LegacyPriceTier["model"]): PricingMode {
  if (model === "individual") return "on_request";
  if (model === "monthly") return "from";
  return model;
}

function normalizeTier(tier: LegacyPriceTier): PriceTier {
  return {
    label: tier.label,
    pricingMode: normalizePricingMode(tier.model),
    amount: tier.model === "individual" ? undefined : tier.price,
    currency: "RUB",
    unit: tier.model === "monthly" ? "month" : "project",
  };
}

export const pricing: ServicePrice[] = pricingLegacy.map((item) => ({
  serviceId: item.serviceId,
  note: item.note,
  tiers: item.tiers.map(normalizeTier),
}));

export function getPricingByServiceId(serviceId: string): ServicePrice | null {
  return pricing.find((p) => p.serviceId === serviceId) ?? null;
}

export function getPricing(categorySlug: string, typeSlug: string): ServicePrice | null {
  return getPricingByServiceId(`${categorySlug}/${typeSlug}`);
}

export function formatPrice(tier: PriceTier): string {
  if (tier.pricingMode === "on_request" || typeof tier.amount !== "number") {
    return "По запросу";
  }

  const formatted = new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: tier.currency,
    maximumFractionDigits: 0,
  }).format(tier.amount);

  if (tier.pricingMode === "from") {
    return tier.unit === "month" ? `от ${formatted} / мес` : `от ${formatted}`;
  }

  if (tier.unit === "hour") {
    return `${formatted} / час`;
  }

  return formatted;
}
