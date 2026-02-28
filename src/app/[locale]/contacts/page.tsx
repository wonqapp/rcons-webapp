// src/app/[locale]/contacts/page.tsx
import { setRequestLocale, getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { siteConfig } from "@/config";
import ContactForm from "@/components/ContactForm";

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateStaticParams() {
  return siteConfig.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "pages.contacts" });
  const tMeta = await getTranslations({ locale, namespace: "metadata" });
  return {
    title: `${t("title")} | ${tMeta("siteName")}`,
    description: t("description"),
  };
}

export default async function ContactsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "pages.contacts" });

  return (
    <main className="container mx-auto px-4 py-12 max-w-5xl">
      <h1 className="text-4xl font-bold mb-6">{t("title")}</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Реквизиты */}
        <div>
          <h2 className="text-xl font-semibold mb-6">Контактная информация</h2>
          <div className="space-y-4 text-muted-foreground">
            <div>
              <p className="font-medium text-foreground">Email</p>
              <a
                href={`mailto:${siteConfig.company.email}`}
                className="hover:text-primary transition-colors"
              >
                {siteConfig.company.email}
              </a>
            </div>
            <div>
              <p className="font-medium text-foreground">Телефон</p>
              <a
                href={`tel:${siteConfig.company.phone}`}
                className="hover:text-primary transition-colors"
              >
                {siteConfig.company.phone}
              </a>
            </div>
            <div>
              <p className="font-medium text-foreground">Адрес</p>
              <p>{siteConfig.company.address}</p>
            </div>
            <div>
              <p className="font-medium text-foreground">ИНН</p>
              <p>{siteConfig.company.inn}</p>
            </div>
          </div>
        </div>

        {/* Форма */}
        <ContactForm />
      </div>
    </main>
  );
}
