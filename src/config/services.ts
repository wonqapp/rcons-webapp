// src/config/services.ts
// ============================================================
// ПОЛНЫЙ СТЕК УСЛУГ — 4 уровня иерархии
//
// Уровень 1: Category   → slug категории     (audit, tax, ...)
// Уровень 2: Type       → slug типа/раздела  (rsbu, ifrs, ...)
// Уровень 3: Service    → id секции на стр.  (mandatory-audit, ...)
// Уровень 4: Detail     → подпункты/описание (в descriptionKey)
//
// URL: /services/[category]/[type]#[service-id]
// ============================================================

// ── ТИПЫ ──────────────────────────────────────────────────

export interface ServiceDetail {
  titleKey: string; // Подпункт внутри услуги (напр. "Аудит АО, ООО")
}

export interface ServiceItem {
  id: string;          // ID для якоря #mandatory-audit
  titleKey: string;
  descriptionKey: string; // Короткое описание "Ежегодная проверка..."
  tags: string[];      // Синонимы для поиска на всех языках
  details?: ServiceDetail[];
}

export interface ServiceType {
  slug: string;        // "rsbu" → URL: /services/audit/rsbu
  titleKey: string;
  services: ServiceItem[];
}

export interface ServiceCategory {
  slug: string;        // "audit" → URL: /services/audit
  titleKey: string;
  icon: string;        // Emoji или имя иконки
  types: ServiceType[];
}

// ── ДАННЫЕ ────────────────────────────────────────────────

export const servicesHierarchy: ServiceCategory[] = [

  // ═══════════════════════════════════════════════════════
  // 1. АУДИТ
  // ═══════════════════════════════════════════════════════
  {
    slug: "audit",
    titleKey: "services.audit.title",
    icon: "🔍",
    types: [
      // ── 1.1 РСБУ
      {
        slug: "rsbu",
        titleKey: "services.audit.rsbu.title",
        services: [
          {
            id: "mandatory-audit",
            titleKey: "services.audit.rsbu.mandatory.title",
            descriptionKey: "services.audit.rsbu.mandatory.desc",
            tags: ["обязательный аудит", "аудиторское заключение", "МСА", "mandatory audit", "statutory audit", "obligatory audit", "法定审计", "міндетті аудит"],
            details: [
              { titleKey: "services.audit.rsbu.mandatory.d1" }, // АО, ООО
              { titleKey: "services.audit.rsbu.mandatory.d2" }, // ГУП МУП
              { titleKey: "services.audit.rsbu.mandatory.d3" }, // Фонды
              { titleKey: "services.audit.rsbu.mandatory.d4" }, // Застройщики 214-ФЗ
              { titleKey: "services.audit.rsbu.mandatory.d5" }, // Оператор лотереи
              { titleKey: "services.audit.rsbu.mandatory.d6" }, // Туроператор
              { titleKey: "services.audit.rsbu.mandatory.d7" }, // Иностранные НКО
              { titleKey: "services.audit.rsbu.mandatory.d8" }, // Доля РФ
              { titleKey: "services.audit.rsbu.mandatory.d9" }, // Доля субъектов РФ
              { titleKey: "services.audit.rsbu.mandatory.d10"}, // ПАО
              { titleKey: "services.audit.rsbu.mandatory.d11"}, // Программа стратегии АО
              { titleKey: "services.audit.rsbu.mandatory.d12"}, // Консолидированная ФГУП
            ],
          },
          {
            id: "initiative-audit",
            titleKey: "services.audit.rsbu.initiative.title",
            descriptionKey: "services.audit.rsbu.initiative.desc",
            tags: ["инициативный аудит", "добровольный аудит", "voluntary audit", "initiative audit", "主动审计", "бастамалы аудит"],
          },
          {
            id: "insured-audit",
            titleKey: "services.audit.rsbu.insured.title",
            descriptionKey: "services.audit.rsbu.insured.desc",
            tags: ["аудит со страховкой", "страховка ФНС", "защита от штрафов", "insured audit", "带保险的审计"],
          },
          {
            id: "express-audit",
            titleKey: "services.audit.rsbu.express.title",
            descriptionKey: "services.audit.rsbu.express.desc",
            tags: ["экспресс-аудит", "быстрый аудит", "5-7 дней", "express audit", "fast audit", "快速审计"],
          },
          {
            id: "audit-2425",
            titleKey: "services.audit.rsbu.audit2425.title",
            descriptionKey: "services.audit.rsbu.audit2425.desc",
            tags: ["аудит 2024", "аудит 2025", "закрытие периода", "прошлые периоды", "audit 2024 2025"],
          },
        ],
      },

      // ── 1.2 МСФО / IFRS
      {
        slug: "ifrs",
        titleKey: "services.audit.ifrs.title",
        services: [
          {
            id: "ifrs-audit",
            titleKey: "services.audit.ifrs.audit.title",
            descriptionKey: "services.audit.ifrs.audit.desc",
            tags: ["МСФО", "IFRS", "международные стандарты", "аудит МСФО", "IFRS audit", "国际财务报告准则", "ХҚЕС аудиті"],
          },
          {
            id: "transformation",
            titleKey: "services.audit.ifrs.transformation.title",
            descriptionKey: "services.audit.ifrs.transformation.desc",
            tags: ["трансформация РСБУ МСФО", "перекладка отчетности", "RSBU to IFRS", "transformation", "财务报表转换"],
          },
          {
            id: "consolidation",
            titleKey: "services.audit.ifrs.consolidation.title",
            descriptionKey: "services.audit.ifrs.consolidation.desc",
            tags: ["консолидация", "дочерние компании", "холдинг", "группа компаний", "consolidation", "合并报表"],
          },
          {
            id: "first-application",
            titleKey: "services.audit.ifrs.firstapp.title",
            descriptionKey: "services.audit.ifrs.firstapp.desc",
            tags: ["первое применение МСФО", "IFRS 1", "переход на МСФО", "first-time adoption"],
          },
          {
            id: "friendly-jurisdictions",
            titleKey: "services.audit.ifrs.friendly.title",
            descriptionKey: "services.audit.ifrs.friendly.desc",
            tags: ["ОАЭ", "Китай", "Турция", "дружественные юрисдикции", "UAE audit", "China audit", "Dubai", "аудит за рубежом"],
          },
          {
            id: "brics",
            titleKey: "services.audit.ifrs.brics.title",
            descriptionKey: "services.audit.ifrs.brics.desc",
            tags: ["BRICS", "CAS", "Ind AS", "Китай стандарты", "Индия стандарты", "БРИКС отчетность"],
          },
          {
            id: "one-time-consulting",
            titleKey: "services.audit.ifrs.onetimeconsulting.title",
            descriptionKey: "services.audit.ifrs.onetimeconsulting.desc",
            tags: ["налог на сверхприбыль", "windfall tax", "разовые изъятия", "консалтинг"],
          },
        ],
      },

      // ── 1.3 Специальный аудит
      {
        slug: "special",
        titleKey: "services.audit.special.title",
        services: [
          {
            id: "management-audit",
            titleKey: "services.audit.special.management.title",
            descriptionKey: "services.audit.special.management.desc",
            tags: ["управленческий учет", "аудит для владельца", "management audit", "внутренний контроль"],
          },
          {
            id: "concession-audit",
            titleKey: "services.audit.special.concession.title",
            descriptionKey: "services.audit.special.concession.desc",
            tags: ["концессия", "концессионные соглашения", "concession audit", "государственные контракты"],
          },
          {
            id: "special-tasks-audit",
            titleKey: "services.audit.special.tasks.title",
            descriptionKey: "services.audit.special.tasks.desc",
            tags: ["аудит по техзаданию", "законность сделок", "подтверждение прав собственности"],
          },
          {
            id: "special-reporting",
            titleKey: "services.audit.special.reporting.title",
            descriptionKey: "services.audit.special.reporting.desc",
            tags: ["специальная отчетность", "нестандартная отчетность"],
          },
          {
            id: "partial-audit",
            titleKey: "services.audit.special.partial.title",
            descriptionKey: "services.audit.special.partial.desc",
            tags: ["аудит части отчетности", "выборочный аудит", "partial audit"],
          },
          {
            id: "hr-audit",
            titleKey: "services.audit.special.hr.title",
            descriptionKey: "services.audit.special.hr.desc",
            tags: ["кадровый аудит", "HR аудит", "трудовые отношения", "HR audit", "人力资源审计"],
          },
          {
            id: "due-diligence",
            titleKey: "services.audit.special.dd.title",
            descriptionKey: "services.audit.special.dd.desc",
            tags: ["due diligence", "комплексная проверка", "проверка бизнеса перед покупкой", "M&A", "尽职调查", "ДД"],
          },
          {
            id: "inventory",
            titleKey: "services.audit.special.inventory.title",
            descriptionKey: "services.audit.special.inventory.desc",
            tags: ["инвентаризация", "пересчет активов", "независимая инвентаризация", "inventory", "资产盘点"],
          },
          {
            id: "grants-audit",
            titleKey: "services.audit.special.grants.title",
            descriptionKey: "services.audit.special.grants.desc",
            tags: ["аудит грантов", "целевые средства", "фонды", "государственное финансирование", "grants audit"],
          },
          {
            id: "dpr-audit",
            titleKey: "services.audit.special.dpr.title",
            descriptionKey: "services.audit.special.dpr.desc",
            tags: ["ДПР", "программа развития", "долгосрочный план", "госкомпании", "стратегия"],
          },
          {
            id: "esg",
            titleKey: "services.audit.special.esg.title",
            descriptionKey: "services.audit.special.esg.desc",
            tags: ["ESG", "устойчивое развитие", "экология", "социальная ответственность", "ESG verification", "环境社会治理"],
          },
        ],
      },
    ],
  },

  // ═══════════════════════════════════════════════════════
  // 2. НАЛОГИ
  // ═══════════════════════════════════════════════════════
  {
    slug: "tax",
    titleKey: "services.tax.title",
    icon: "📊",
    types: [
      // ── 2.1 Комплаенс
      {
        slug: "compliance",
        titleKey: "services.tax.compliance.title",
        services: [
          {
            id: "tax-audit",
            titleKey: "services.tax.compliance.taxaudit.title",
            descriptionKey: "services.tax.compliance.taxaudit.desc",
            tags: ["налоговый аудит", "переплаты", "доначисления", "риски ФНС", "tax audit", "税务审计"],
          },
          {
            id: "tax-subscription",
            titleKey: "services.tax.compliance.subscription.title",
            descriptionKey: "services.tax.compliance.subscription.desc",
            tags: ["налоговый абонемент", "горячая линия", "консультации бухгалтерии", "tax subscription"],
          },
          {
            id: "pre-check-diagnostics",
            titleKey: "services.tax.compliance.precheck.title",
            descriptionKey: "services.tax.compliance.precheck.desc",
            tags: ["диагностика перед проверкой", "имитация проверки ФНС", "предпроверочный анализ", "pre-tax audit"],
          },
          {
            id: "tax-monitoring",
            titleKey: "services.tax.compliance.monitoring.title",
            descriptionKey: "services.tax.compliance.monitoring.desc",
            tags: ["налоговый мониторинг", "ФНС база данных", "онлайн-контроль", "tax monitoring", "税务监控"],
          },
        ],
      },

      // ── 2.1.1 Крипто
      {
        slug: "crypto",
        titleKey: "services.tax.crypto.title",
        services: [
          {
            id: "crypto-tax",
            titleKey: "services.tax.crypto.tax.title",
            descriptionKey: "services.tax.crypto.tax.desc",
            tags: ["криптовалюта", "ЦФА", "майнинг", "трейдинг", "crypto tax", "blockchain", "NFT", "加密货币税"],
          },
          {
            id: "proof-of-reserves",
            titleKey: "services.tax.crypto.por.title",
            descriptionKey: "services.tax.crypto.por.desc",
            tags: ["Proof of Reserves", "POR", "криптоактивы", "кошельки", "подтверждение резервов"],
          },
        ],
      },

      // ── 2.2 Споры
      {
        slug: "disputes",
        titleKey: "services.tax.disputes.title",
        services: [
          {
            id: "audit-support",
            titleKey: "services.tax.disputes.support.title",
            descriptionKey: "services.tax.disputes.support.desc",
            tags: ["сопровождение проверок", "налоговая проверка", "защита при проверке", "tax inspection support"],
          },
          {
            id: "interrogation-prep",
            titleKey: "services.tax.disputes.interrogation.title",
            descriptionKey: "services.tax.disputes.interrogation.desc",
            tags: ["допрос ИФНС", "подготовка к допросу", "инструктаж сотрудников", "налоговая"],
          },
          {
            id: "pre-trial-appeal",
            titleKey: "services.tax.disputes.pretrial.title",
            descriptionKey: "services.tax.disputes.pretrial.desc",
            tags: ["досудебное обжалование", "апелляция ИФНС", "вышестоящая налоговая", "pre-trial tax appeal"],
          },
          {
            id: "court-disputes",
            titleKey: "services.tax.disputes.court.title",
            descriptionKey: "services.tax.disputes.court.desc",
            tags: ["налоговые споры в суде", "арбитражный суд", "tax court", "судебная защита"],
          },
          {
            id: "vat-refund",
            titleKey: "services.tax.disputes.vatrefund.title",
            descriptionKey: "services.tax.disputes.vatrefund.desc",
            tags: ["возмещение НДС", "возврат НДС", "VAT refund", "НДС из бюджета", "增值税退税"],
          },
        ],
      },

      // ── 2.3 Международка
      {
        slug: "international",
        titleKey: "services.tax.international.title",
        services: [
          {
            id: "transfer-pricing",
            titleKey: "services.tax.international.tp.title",
            descriptionKey: "services.tax.international.tp.desc",
            tags: ["трансфертное ценообразование", "ТЦО", "transfer pricing", "внутригрупповые сделки", "转让定价"],
          },
          {
            id: "cfc-management",
            titleKey: "services.tax.international.cfc.title",
            descriptionKey: "services.tax.international.cfc.desc",
            tags: ["КИК", "контролируемые иностранные компании", "CFC", "отчетность КИК", "受控外国公司"],
          },
          {
            id: "tax-ma",
            titleKey: "services.tax.international.ma.title",
            descriptionKey: "services.tax.international.ma.desc",
            tags: ["налоговое сопровождение сделок", "M&A налоги", "покупка бизнеса налоги", "tax M&A", "并购税务"],
          },
          {
            id: "relocation",
            titleKey: "services.tax.international.relocation.title",
            descriptionKey: "services.tax.international.relocation.desc",
            tags: ["релокация", "перевод бизнеса", "ОАЭ", "Азия", "налоги при переезде", "business relocation", "UAE", "阿联酋"],
          },
        ],
      },

      // ── 2.4 Private Tax
      {
        slug: "private",
        titleKey: "services.tax.private.title",
        services: [
          {
            id: "personal-tax-return",
            titleKey: "services.tax.private.personal.title",
            descriptionKey: "services.tax.private.personal.desc",
            tags: ["3-НДФЛ", "декларация физлица", "доходы за рубежом", "КИК физлицо", "personal income tax", "个人所得税"],
          },
          {
            id: "tax-inheritance",
            titleKey: "services.tax.private.inheritance.title",
            descriptionKey: "services.tax.private.inheritance.desc",
            tags: ["налоговое наследство", "передача капитала", "наследование бизнеса", "tax inheritance", "遗产税"],
          },
        ],
      },
    ],
  },

  // ═══════════════════════════════════════════════════════
  // 3. ОЦЕНКА
  // ═══════════════════════════════════════════════════════
  {
    slug: "valuation",
    titleKey: "services.valuation.title",
    icon: "💼",
    types: [
      // ── 3.1 Бизнес
      {
        slug: "business",
        titleKey: "services.valuation.business.title",
        services: [
          {
            id: "enterprise-valuation",
            titleKey: "services.valuation.business.enterprise.title",
            descriptionKey: "services.valuation.business.enterprise.desc",
            tags: ["оценка бизнеса", "рыночная цена компании", "business valuation", "стоимость предприятия", "企业估值"],
          },
          {
            id: "shares-valuation",
            titleKey: "services.valuation.business.shares.title",
            descriptionKey: "services.valuation.business.shares.desc",
            tags: ["оценка акций", "оценка долей", "стоимость доли", "shares valuation", "股权估值"],
          },
          {
            id: "startup-valuation",
            titleKey: "services.valuation.business.startup.title",
            descriptionKey: "services.valuation.business.startup.desc",
            tags: ["оценка стартапа", "startup valuation", "предпосевная стоимость", "инвестиции стартап", "创业公司估值"],
          },
        ],
      },

      // ── 3.2 Недвижимость
      {
        slug: "realestate",
        titleKey: "services.valuation.realestate.title",
        services: [
          {
            id: "commercial-property",
            titleKey: "services.valuation.realestate.commercial.title",
            descriptionKey: "services.valuation.realestate.commercial.desc",
            tags: ["оценка недвижимости", "коммерческая недвижимость", "склад", "офис", "ТЦ", "commercial property valuation", "商业地产估值"],
          },
          {
            id: "cadastre-dispute",
            titleKey: "services.valuation.realestate.cadastre.title",
            descriptionKey: "services.valuation.realestate.cadastre.desc",
            tags: ["кадастровая стоимость", "оспаривание кадастра", "снижение налога на имущество", "cadastral value dispute"],
          },
          {
            id: "collateral-valuation",
            titleKey: "services.valuation.realestate.collateral.title",
            descriptionKey: "services.valuation.realestate.collateral.desc",
            tags: ["оценка для залога", "банк", "кредит", "Сбербанк", "collateral valuation", "mortgage valuation"],
          },
        ],
      },

      // ── 3.3 Активы
      {
        slug: "assets",
        titleKey: "services.valuation.assets.title",
        services: [
          {
            id: "equipment-valuation",
            titleKey: "services.valuation.assets.equipment.title",
            descriptionKey: "services.valuation.assets.equipment.desc",
            tags: ["оценка оборудования", "оценка транспорта", "спецтехника", "machinery valuation", "equipment appraisal", "设备估值"],
          },
          {
            id: "it-brands-valuation",
            titleKey: "services.valuation.assets.itbrands.title",
            descriptionKey: "services.valuation.assets.itbrands.desc",
            tags: ["оценка товарных знаков", "нематериальные активы", "бренд", "патент", "ПО", "IP valuation", "brand valuation", "知识产权估值"],
          },
          {
            id: "impairment-test",
            titleKey: "services.valuation.assets.impairment.title",
            descriptionKey: "services.valuation.assets.impairment.desc",
            tags: ["тест на обесценение", "IAS 36", "МСФО обесценение", "impairment test", "减值测试"],
          },
        ],
      },
    ],
  },

  // ═══════════════════════════════════════════════════════
  // 4. ЮРИСТЫ
  // ═══════════════════════════════════════════════════════
  {
    slug: "legal",
    titleKey: "services.legal.title",
    icon: "⚖️",
    types: [
      // ── 4.1 Корпоратив
      {
        slug: "corporate",
        titleKey: "services.legal.corporate.title",
        services: [
          {
            id: "legal-dd",
            titleKey: "services.legal.corporate.legaldd.title",
            descriptionKey: "services.legal.corporate.legaldd.desc",
            tags: ["Legal Due Diligence", "юридическая проверка", "чистота компании", "legal due diligence", "法律尽职调查"],
          },
          {
            id: "shareholder-agreements",
            titleKey: "services.legal.corporate.shareholders.title",
            descriptionKey: "services.legal.corporate.shareholders.desc",
            tags: ["акционерное соглашение", "корпоративный договор", "партнерское соглашение", "SHA", "股东协议"],
          },
          {
            id: "reorganization",
            titleKey: "services.legal.corporate.reorganization.title",
            descriptionKey: "services.legal.corporate.reorganization.desc",
            tags: ["реорганизация", "ликвидация", "слияние", "закрытие компании", "реструктуризация", "reorganization", "企业重组"],
          },
        ],
      },

      // ── 4.2 Суды
      {
        slug: "courts",
        titleKey: "services.legal.courts.title",
        services: [
          {
            id: "arbitration",
            titleKey: "services.legal.courts.arbitration.title",
            descriptionKey: "services.legal.courts.arbitration.desc",
            tags: ["арбитражные споры", "суд с контрагентом", "взыскание долга", "arbitration", "коммерческий спор", "商业仲裁"],
          },
          {
            id: "bankruptcy",
            titleKey: "services.legal.courts.bankruptcy.title",
            descriptionKey: "services.legal.courts.bankruptcy.desc",
            tags: ["банкротство", "процедура банкротства", "долги компании", "bankruptcy", "破产程序"],
          },
          {
            id: "subsidiary-protection",
            titleKey: "services.legal.courts.subsidiary.title",
            descriptionKey: "services.legal.courts.subsidiary.desc",
            tags: ["субсидиарная ответственность", "защита директора", "личное имущество директора", "субсидиарка", "subsidiary liability"],
          },
        ],
      },

      // ── 4.3 Специальное право
      {
        slug: "special-law",
        titleKey: "services.legal.speciallaw.title",
        services: [
          {
            id: "land-law",
            titleKey: "services.legal.speciallaw.land.title",
            descriptionKey: "services.legal.speciallaw.land.desc",
            tags: ["земельное право", "оформление участков", "перевод категории земель", "land law"],
          },
          {
            id: "sanctions-compliance",
            titleKey: "services.legal.speciallaw.sanctions.title",
            descriptionKey: "services.legal.speciallaw.sanctions.desc",
            tags: ["санкции", "санкционный комплаенс", "международные санкции", "sanctions compliance", "制裁合规"],
          },
          {
            id: "data-protection",
            titleKey: "services.legal.speciallaw.dataprotection.title",
            descriptionKey: "services.legal.speciallaw.dataprotection.desc",
            tags: ["152-ФЗ", "персональные данные", "ПДн", "GDPR", "защита данных", "data protection", "个人数据保护"],
          },
          {
            id: "criminal-defense",
            titleKey: "services.legal.speciallaw.criminal.title",
            descriptionKey: "services.legal.speciallaw.criminal.desc",
            tags: ["уголовная защита", "ОБЭП", "экономические преступления", "адвокат", "criminal defense", "刑事辩护"],
          },
        ],
      },
    ],
  },

  // ═══════════════════════════════════════════════════════
  // 5. ФИНАНСЫ / DD
  // ═══════════════════════════════════════════════════════
  {
    slug: "finance",
    titleKey: "services.finance.title",
    icon: "📈",
    types: [
      // ── 5.1 Due Diligence
      {
        slug: "dd",
        titleKey: "services.finance.dd.title",
        services: [
          {
            id: "financial-dd",
            titleKey: "services.finance.dd.financial.title",
            descriptionKey: "services.finance.dd.financial.desc",
            tags: ["Financial Due Diligence", "финансовый дью дилидженс", "качество прибыли", "QoE", "financial due diligence", "财务尽职调查"],
          },
          {
            id: "forensic",
            titleKey: "services.finance.dd.forensic.title",
            descriptionKey: "services.finance.dd.forensic.desc",
            tags: ["форензик", "расследование мошенничества", "откаты", "forensic accounting", "fraud investigation", "法证会计"],
          },
        ],
      },

      // ── 5.1.1 ВЭД
      {
        slug: "foreign-trade",
        titleKey: "services.finance.foreigntrade.title",
        services: [
          {
            id: "supply-chains",
            titleKey: "services.finance.foreigntrade.supply.title",
            descriptionKey: "services.finance.foreigntrade.supply.desc",
            tags: ["цепочки поставок", "логистика через третьи страны", "параллельный импорт", "supply chains", "供应链"],
          },
          {
            id: "currency-control",
            titleKey: "services.finance.foreigntrade.currency.title",
            descriptionKey: "services.finance.foreigntrade.currency.desc",
            tags: ["валютный контроль", "юань", "дирхам", "международные платежи", "currency control", "外汇控制"],
          },
        ],
      },

      // ── 5.2 Менеджмент
      {
        slug: "management",
        titleKey: "services.finance.management.title",
        services: [
          {
            id: "dashboards",
            titleKey: "services.finance.management.dashboards.title",
            descriptionKey: "services.finance.management.dashboards.desc",
            tags: ["дашборды", "BI", "бизнес-аналитика", "отчетность для руководителя", "dashboards", "business intelligence", "商业智能"],
          },
          {
            id: "financial-modeling",
            titleKey: "services.finance.management.modeling.title",
            descriptionKey: "services.finance.management.modeling.desc",
            tags: ["финансовое моделирование", "прогноз денежных потоков", "DCF", "financial model", "财务模型"],
          },
          {
            id: "ipo-prep",
            titleKey: "services.finance.management.ipo.title",
            descriptionKey: "services.finance.management.ipo.desc",
            tags: ["IPO", "выход на биржу", "подготовка к IPO", "публичное размещение", "IPO preparation", "上市准备"],
          },
        ],
      },

      // ── 5.3 Риски
      {
        slug: "risks",
        titleKey: "services.finance.risks.title",
        services: [
          {
            id: "internal-control",
            titleKey: "services.finance.risks.internalcontrol.title",
            descriptionKey: "services.finance.risks.internalcontrol.desc",
            tags: ["внутренний контроль", "СВК", "система внутреннего контроля", "internal control", "内部控制"],
          },
          {
            id: "cost-optimization",
            titleKey: "services.finance.risks.costopt.title",
            descriptionKey: "services.finance.risks.costopt.desc",
            tags: ["оптимизация затрат", "Cost Cutting", "сокращение расходов", "cost optimization", "成本优化"],
          },
        ],
      },
    ],
  },

  // ═══════════════════════════════════════════════════════
  // 6. АУТСОРСИНГ
  // ═══════════════════════════════════════════════════════
  {
    slug: "outsourcing",
    titleKey: "services.outsourcing.title",
    icon: "🤝",
    types: [
      // ── 6.1 Бухгалтерия
      {
        slug: "accounting",
        titleKey: "services.outsourcing.accounting.title",
        services: [
          {
            id: "cfo-function",
            titleKey: "services.outsourcing.accounting.cfo.title",
            descriptionKey: "services.outsourcing.accounting.cfo.desc",
            tags: ["аутсорсинг бухгалтерии", "функция главбуха", "ведение учета", "accounting outsourcing", "会计外包"],
          },
          {
            id: "restore-accounting",
            titleKey: "services.outsourcing.accounting.restore.title",
            descriptionKey: "services.outsourcing.accounting.restore.desc",
            tags: ["восстановление учета", "запущенная бухгалтерия", "accounting restoration", "恢复会计"],
          },
          {
            id: "new-fsbu",
            titleKey: "services.outsourcing.accounting.fsbu.title",
            descriptionKey: "services.outsourcing.accounting.fsbu.desc",
            tags: ["ФСБУ 6", "ФСБУ 25", "ФСБУ 14", "ФСБУ 28", "новые стандарты учета", "FSBU", "российские стандарты"],
          },
        ],
      },

      // ── 6.2 Кадры
      {
        slug: "hr",
        titleKey: "services.outsourcing.hr.title",
        services: [
          {
            id: "payroll",
            titleKey: "services.outsourcing.hr.payroll.title",
            descriptionKey: "services.outsourcing.hr.payroll.desc",
            tags: ["расчет зарплаты", "аутсорсинг зарплаты", "ФОТ", "payroll outsourcing", "工资外包"],
          },
          {
            id: "hr-compliance",
            titleKey: "services.outsourcing.hr.compliance.title",
            descriptionKey: "services.outsourcing.hr.compliance.desc",
            tags: ["кадровый аудит", "трудинспекция", "трудовые договора", "HR compliance", "劳动合规"],
          },
          {
            id: "kpi-motivation",
            titleKey: "services.outsourcing.hr.kpi.title",
            descriptionKey: "services.outsourcing.hr.kpi.desc",
            tags: ["KPI", "система мотивации", "премии", "бонусы", "KPI system", "绩效管理"],
          },
        ],
      },
    ],
  },

  // ═══════════════════════════════════════════════════════
  // 7. IT-КОНСАЛТИНГ
  // ═══════════════════════════════════════════════════════
  {
    slug: "it",
    titleKey: "services.it.title",
    icon: "💻",
    types: [
      // ── 7.1 1С
      {
        slug: "1c",
        titleKey: "services.it.1c.title",
        services: [
          {
            id: "erp-implementation",
            titleKey: "services.it.1c.erp.title",
            descriptionKey: "services.it.1c.erp.desc",
            tags: ["1С", "1С ERP", "автоматизация", "внедрение 1С", "ERP", "управление предприятием", "1C implementation"],
          },
          {
            id: "ifrs-automation",
            titleKey: "services.it.1c.ifrsauto.title",
            descriptionKey: "services.it.1c.ifrsauto.desc",
            tags: ["автоматизация МСФО", "1С МСФО", "IFRS automation", "сбор отчетности"],
          },
        ],
      },

      // ── 7.2 Security
      {
        slug: "security",
        titleKey: "services.it.security.title",
        services: [
          {
            id: "it-audit",
            titleKey: "services.it.security.itaudit.title",
            descriptionKey: "services.it.security.itaudit.desc",
            tags: ["IT аудит", "уязвимости", "корпоративная сеть", "IT audit", "信息安全审计"],
          },
          {
            id: "cybersecurity",
            titleKey: "services.it.security.cyber.title",
            descriptionKey: "services.it.security.cyber.desc",
            tags: ["кибербезопасность", "защита от хакеров", "утечка данных", "cybersecurity", "网络安全"],
          },
        ],
      },
    ],
  },

  // ═══════════════════════════════════════════════════════
  // 8. ГОСУДАРСТВО (GR)
  // ═══════════════════════════════════════════════════════
  {
    slug: "government",
    titleKey: "services.government.title",
    icon: "🏛️",
    types: [
      // ── 8.1 ГОЗ
      {
        slug: "goz",
        titleKey: "services.government.goz.title",
        services: [
          {
            id: "goz-support",
            titleKey: "services.government.goz.support.title",
            descriptionKey: "services.government.goz.support.desc",
            tags: ["ГОЗ", "гособоронзаказ", "раздельный учет ГОЗ", "defense order accounting", "государственный оборонный заказ"],
          },
        ],
      },

      // ── 8.2 Казначейство
      {
        slug: "treasury",
        titleKey: "services.government.treasury.title",
        services: [
          {
            id: "treasury-support",
            titleKey: "services.government.treasury.support.title",
            descriptionKey: "services.government.treasury.support.desc",
            tags: ["казначейское сопровождение", "лицевые счета", "казначейство", "treasury support", "государственные платежи"],
          },
        ],
      },

      // ── 8.3 Льготы
      {
        slug: "benefits",
        titleKey: "services.government.benefits.title",
        services: [
          {
            id: "investment-benefits",
            titleKey: "services.government.benefits.investment.title",
            descriptionKey: "services.government.benefits.investment.desc",
            tags: ["СЗПК", "СПИК 2.0", "инвестиционные льготы", "налоговые льготы", "investment incentives", "投资优惠"],
          },
          {
            id: "sez-tor",
            titleKey: "services.government.benefits.sez.title",
            descriptionKey: "services.government.benefits.sez.desc",
            tags: ["ОЭЗ", "ТОР", "особые экономические зоны", "налоговые каникулы", "SEZ", "FEZ", "经济特区"],
          },
        ],
      },
    ],
  },
];

// ============================================================
// ПОИСКОВЫЙ ИНДЕКС — плоский список для Fuse.js
// Включает все уровни: типы, услуги (с тегами)
// ============================================================
export const searchIndex = servicesHierarchy.flatMap((cat) =>
  cat.types.flatMap((type) => [
    // Сам тип (страница)
    {
      titleKey: type.titleKey,
      href: `/services/${cat.slug}/${type.slug}`,
      category: cat.slug,
      type: type.slug,
      tags: [],
    },
    // Каждая услуга (секция на странице)
    ...type.services.map((service) => ({
      titleKey: service.titleKey,
      descriptionKey: service.descriptionKey,
      href: `/services/${cat.slug}/${type.slug}#${service.id}`,
      category: cat.slug,
      type: type.slug,
      tags: service.tags,
    })),
  ])
);

// ============================================================
// ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ
// ============================================================

/** Найти категорию по slug */
export function getCategoryBySlug(slug: string): ServiceCategory | undefined {
  return servicesHierarchy.find((cat) => cat.slug === slug);
}

/** Найти тип по slugам категории и типа */
export function getTypeBySlug(categorySlug: string, typeSlug: string): ServiceType | undefined {
  return getCategoryBySlug(categorySlug)?.types.find((t) => t.slug === typeSlug);
}

/** generateStaticParams для [category]/[type] */
export function getAllTypePaths() {
  return servicesHierarchy.flatMap((cat) =>
    cat.types.map((type) => ({
      category: cat.slug,
      type: type.slug,
    }))
  );
}
