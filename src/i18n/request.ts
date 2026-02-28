import { getRequestConfig } from "next-intl/server";
import { routing } from "@/i18n/routing";

// Создаем тип на лету из массива в конфиге ('ru' | 'en')
type Locale = (typeof routing.locales)[number];

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  // Проверяем, входит ли полученная локаль в наш список без использования any
  if (!locale || !routing.locales.includes(locale as Locale)) {
    locale = routing.defaultLocale;
  }

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
  };
});
