import { staticPages } from "@/config/pages";
import { getPricingByServiceId, type ServicePrice } from "@/config/pricing";
import { servicesHierarchy, type ServiceType } from "@/config/services";

interface ChatContextResult {
  summary: string;
  matchedServiceIds: string[];
}

interface ServiceContext {
  serviceId: string;
  titleKey: string;
  descriptionKey: string;
  keywords: string[];
  intents: string[];
}

const serviceContexts: ServiceContext[] = servicesHierarchy.flatMap((category) =>
  category.types.map((type: ServiceType) => ({
    serviceId: type.serviceId,
    titleKey: type.titleKey,
    descriptionKey: type.descriptionKey,
    keywords: type.searchKeywordsRu,
    intents: type.intentTags,
  })),
);

function normalize(text: string): string {
  return text.toLowerCase().trim();
}

function scoreText(text: string, haystack: string[]): number {
  const q = normalize(text);
  if (!q) return 0;

  let score = 0;
  for (const value of haystack) {
    const normalized = normalize(value);
    if (!normalized) continue;
    if (normalized === q) score += 100;
    else if (normalized.includes(q) || q.includes(normalized)) score += 30;
  }

  return score;
}

function formatPricingForPrompt(price: ServicePrice | null): string {
  if (!price) return "Цена: по запросу после брифа.";

  const top = price.tiers.slice(0, 3).map((tier) => {
    const unit = tier.unit === "month" ? " / мес" : tier.unit === "hour" ? " / час" : "";
    if (tier.pricingMode === "on_request" || typeof tier.amount !== "number") {
      return `${tier.label}: по запросу`;
    }

    const amount = new Intl.NumberFormat("ru-RU", {
      style: "currency",
      currency: tier.currency,
      maximumFractionDigits: 0,
    }).format(tier.amount);

    const prefix = tier.pricingMode === "from" ? "от " : "";
    return `${tier.label}: ${prefix}${amount}${unit}`;
  });

  return ["Цена:", ...top].join(" ");
}

export function buildChatContext(input: string, pathname?: string): ChatContextResult {
  const query = normalize(input);
  const directServiceId = pathname
    ?.split("/")
    .filter(Boolean)
    .slice(-3)
    .join("/")
    .replace(/^ru\//, "")
    .replace(/^en\//, "")
    .replace(/^kk\//, "")
    .replace(/^zh\//, "");

  const scored = serviceContexts
    .map((service) => {
      const titleTail = service.titleKey.split(".").slice(-2).join(" ");
      const descTail = service.descriptionKey.split(".").slice(-2).join(" ");
      const score =
        scoreText(query, service.keywords) +
        scoreText(query, service.intents) +
        scoreText(query, [titleTail, descTail, service.serviceId]);

      return { service, score };
    })
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map((entry) => entry.service.serviceId);

  const serviceIds = Array.from(new Set([directServiceId, ...scored].filter(Boolean))) as string[];

  const serviceSummary = serviceIds
    .slice(0, 3)
    .map((serviceId) => {
      const service = serviceContexts.find((item) => item.serviceId === serviceId);
      if (!service) return null;
      const pricing = getPricingByServiceId(serviceId);
      return `Услуга ${service.serviceId}. Ключи: ${service.keywords.slice(0, 4).join(", ")}. ${formatPricingForPrompt(pricing)}`;
    })
    .filter(Boolean)
    .join("\n");

  const pagesSummary = staticPages
    .slice(0, 4)
    .map((page) => `Страница ${page.canonicalPath}: ${page.titleKey}`)
    .join("; ");

  const summary = [
    serviceSummary || "Контекст услуги не определён. Дай общий ответ по услугам RCONS.",
    `Каркас сайта: ${pagesSummary}`,
    "Безопасность ответа: не давать категоричных юридических/налоговых выводов; в спорных кейсах рекомендовать консультацию.",
  ].join("\n");

  return {
    summary,
    matchedServiceIds: serviceIds,
  };
}

export function containsLegalRiskQuestion(input: string): boolean {
  const normalized = normalize(input);
  const riskTerms = [
    "гарантируй",
    "точно",
    "без риска",
    "суд",
    "уголов",
    "неплатеж",
    "уклонение",
    "обойти закон",
  ];

  return riskTerms.some((term) => normalized.includes(term));
}
