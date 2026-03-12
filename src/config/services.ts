// src/config/services.ts
// ============================================================
// ИЕРАРХИЯ УСЛУГ
// URL: /services/[category]/[type]
// ============================================================

export interface ServiceType {
  slug: string;
  titleKey: string;
  descriptionKey: string;
}

export interface ServiceCategory {
  slug: string;
  titleKey: string;
  descriptionKey: string;
  icon: string;
  types: ServiceType[];
}

export type ServiceCategorySlug = ServiceCategory["slug"];
export type ServiceTypeSlug = ServiceType["slug"];

export const servicesHierarchy: ServiceCategory[] = [
  {
    slug: "audit",
    titleKey: "services.audit.title",
    descriptionKey: "services.audit.desc",
    icon: "ClipboardCheck",
    types: [
      {
        slug: "mandatory-rsbu",
        titleKey: "services.audit.mandatory-rsbu.title",
        descriptionKey: "services.audit.mandatory-rsbu.desc",
      },
      {
        slug: "mandatory-gup",
        titleKey: "services.audit.mandatory-gup.title",
        descriptionKey: "services.audit.mandatory-gup.desc",
      },
      {
        slug: "mandatory-nko",
        titleKey: "services.audit.mandatory-nko.title",
        descriptionKey: "services.audit.mandatory-nko.desc",
      },
      {
        slug: "mandatory-developer",
        titleKey: "services.audit.mandatory-developer.title",
        descriptionKey: "services.audit.mandatory-developer.desc",
      },
      {
        slug: "initiative",
        titleKey: "services.audit.initiative.title",
        descriptionKey: "services.audit.initiative.desc",
      },
      {
        slug: "special-assignment",
        titleKey: "services.audit.special-assignment.title",
        descriptionKey: "services.audit.special-assignment.desc",
      },
      {
        slug: "tax-audit",
        titleKey: "services.audit.tax-audit.title",
        descriptionKey: "services.audit.tax-audit.desc",
      },
      {
        slug: "strategic-programs",
        titleKey: "services.audit.strategic-programs.title",
        descriptionKey: "services.audit.strategic-programs.desc",
      },
      {
        slug: "pif",
        titleKey: "services.audit.pif.title",
        descriptionKey: "services.audit.pif.desc",
      },
      {
        slug: "pension",
        titleKey: "services.audit.pension.title",
        descriptionKey: "services.audit.pension.desc",
      },
    ],
  },
  {
    slug: "tax",
    titleKey: "services.tax.title",
    descriptionKey: "services.tax.desc",
    icon: "Receipt",
    types: [
      {
        slug: "consulting",
        titleKey: "services.tax.consulting.title",
        descriptionKey: "services.tax.consulting.desc",
      },
      {
        slug: "subscription",
        titleKey: "services.tax.subscription.title",
        descriptionKey: "services.tax.subscription.desc",
      },
      {
        slug: "pre-inspection",
        titleKey: "services.tax.pre-inspection.title",
        descriptionKey: "services.tax.pre-inspection.desc",
      },
      {
        slug: "inspection-support",
        titleKey: "services.tax.inspection-support.title",
        descriptionKey: "services.tax.inspection-support.desc",
      },
      {
        slug: "pre-trial",
        titleKey: "services.tax.pre-trial.title",
        descriptionKey: "services.tax.pre-trial.desc",
      },
      {
        slug: "vat-refund",
        titleKey: "services.tax.vat-refund.title",
        descriptionKey: "services.tax.vat-refund.desc",
      },
      {
        slug: "restructuring",
        titleKey: "services.tax.restructuring.title",
        descriptionKey: "services.tax.restructuring.desc",
      },
      {
        slug: "declaration",
        titleKey: "services.tax.declaration.title",
        descriptionKey: "services.tax.declaration.desc",
      },
    ],
  },
  {
    slug: "valuation",
    titleKey: "services.valuation.title",
    descriptionKey: "services.valuation.desc",
    icon: "TrendingUp",
    types: [
      {
        slug: "business-valuation",
        titleKey: "services.valuation.business-valuation.title",
        descriptionKey: "services.valuation.business-valuation.desc",
      },
      {
        slug: "intangibles",
        titleKey: "services.valuation.intangibles.title",
        descriptionKey: "services.valuation.intangibles.desc",
      },
      {
        slug: "real-estate",
        titleKey: "services.valuation.real-estate.title",
        descriptionKey: "services.valuation.real-estate.desc",
      },
      {
        slug: "land",
        titleKey: "services.valuation.land.title",
        descriptionKey: "services.valuation.land.desc",
      },
      {
        slug: "vehicles",
        titleKey: "services.valuation.vehicles.title",
        descriptionKey: "services.valuation.vehicles.desc",
      },
      {
        slug: "equipment",
        titleKey: "services.valuation.equipment.title",
        descriptionKey: "services.valuation.equipment.desc",
      },
      {
        slug: "cadastral",
        titleKey: "services.valuation.cadastral.title",
        descriptionKey: "services.valuation.cadastral.desc",
      },
      {
        slug: "bank-valuation",
        titleKey: "services.valuation.bank-valuation.title",
        descriptionKey: "services.valuation.bank-valuation.desc",
      },
      {
        slug: "damage",
        titleKey: "services.valuation.damage.title",
        descriptionKey: "services.valuation.damage.desc",
      },
    ],
  },
  {
    slug: "due-diligence",
    titleKey: "services.due-diligence.title",
    descriptionKey: "services.due-diligence.desc",
    icon: "Search",
    types: [
      {
        slug: "financial-dd",
        titleKey: "services.due-diligence.financial-dd.title",
        descriptionKey: "services.due-diligence.financial-dd.desc",
      },
      {
        slug: "tax-dd",
        titleKey: "services.due-diligence.tax-dd.title",
        descriptionKey: "services.due-diligence.tax-dd.desc",
      },
      {
        slug: "legal-dd",
        titleKey: "services.due-diligence.legal-dd.title",
        descriptionKey: "services.due-diligence.legal-dd.desc",
      },
      {
        slug: "operational-dd",
        titleKey: "services.due-diligence.operational-dd.title",
        descriptionKey: "services.due-diligence.operational-dd.desc",
      },
      {
        slug: "complex-dd",
        titleKey: "services.due-diligence.complex-dd.title",
        descriptionKey: "services.due-diligence.complex-dd.desc",
      },
    ],
  },
  {
    slug: "outsourcing",
    titleKey: "services.outsourcing.title",
    descriptionKey: "services.outsourcing.desc",
    icon: "BookOpen",
    types: [
      {
        slug: "full-accounting",
        titleKey: "services.outsourcing.full-accounting.title",
        descriptionKey: "services.outsourcing.full-accounting.desc",
      },
      {
        slug: "payroll",
        titleKey: "services.outsourcing.payroll.title",
        descriptionKey: "services.outsourcing.payroll.desc",
      },
      {
        slug: "restoration",
        titleKey: "services.outsourcing.restoration.title",
        descriptionKey: "services.outsourcing.restoration.desc",
      },
      {
        slug: "zero-reporting",
        titleKey: "services.outsourcing.zero-reporting.title",
        descriptionKey: "services.outsourcing.zero-reporting.desc",
      },
      {
        slug: "fsbu",
        titleKey: "services.outsourcing.fsbu.title",
        descriptionKey: "services.outsourcing.fsbu.desc",
      },
      {
        slug: "accounting-policy",
        titleKey: "services.outsourcing.accounting-policy.title",
        descriptionKey: "services.outsourcing.accounting-policy.desc",
      },
    ],
  },
  {
    slug: "financial-consulting",
    titleKey: "services.financial-consulting.title",
    descriptionKey: "services.financial-consulting.desc",
    icon: "BarChart2",
    types: [
      {
        slug: "analysis",
        titleKey: "services.financial-consulting.analysis.title",
        descriptionKey: "services.financial-consulting.analysis.desc",
      },
      {
        slug: "business-planning",
        titleKey: "services.financial-consulting.business-planning.title",
        descriptionKey: "services.financial-consulting.business-planning.desc",
      },
      {
        slug: "modeling",
        titleKey: "services.financial-consulting.modeling.title",
        descriptionKey: "services.financial-consulting.modeling.desc",
      },
      {
        slug: "management-reporting",
        titleKey: "services.financial-consulting.management-reporting.title",
        descriptionKey:
          "services.financial-consulting.management-reporting.desc",
      },
    ],
  },
  {
    slug: "legal",
    titleKey: "services.legal.title",
    descriptionKey: "services.legal.desc",
    icon: "Scale",
    types: [
      {
        slug: "legal-outsourcing",
        titleKey: "services.legal.legal-outsourcing.title",
        descriptionKey: "services.legal.legal-outsourcing.desc",
      },
      {
        slug: "litigation",
        titleKey: "services.legal.litigation.title",
        descriptionKey: "services.legal.litigation.desc",
      },
      {
        slug: "bankruptcy",
        titleKey: "services.legal.bankruptcy.title",
        descriptionKey: "services.legal.bankruptcy.desc",
      },
      {
        slug: "corporate",
        titleKey: "services.legal.corporate.title",
        descriptionKey: "services.legal.corporate.desc",
      },
    ],
  },
];

export const searchIndex = servicesHierarchy.flatMap((category) =>
  category.types.map((type) => ({
    titleKey: type.titleKey,
    descriptionKey: type.descriptionKey,
    href: `/services/${category.slug}/${type.slug}`,
    category: category.slug,
    categoryTitleKey: category.titleKey,
    type: type.slug,
    tags: [] as string[],
  })),
);

export function getCategoryBySlug(slug: string): ServiceCategory | null {
  return servicesHierarchy.find((category) => category.slug === slug) ?? null;
}

export function getTypeBySlug(
  categorySlug: string,
  typeSlug: string,
): ServiceType | null {
  return (
    getCategoryBySlug(categorySlug)?.types.find((type) => type.slug === typeSlug) ??
    null
  );
}

export function getAllCategoryPaths(): { category: string }[] {
  return servicesHierarchy.map((category) => ({ category: category.slug }));
}

export function getAllTypePaths(): { category: string; type: string }[] {
  return servicesHierarchy.flatMap((category) =>
    category.types.map((type) => ({ category: category.slug, type: type.slug })),
  );
}
