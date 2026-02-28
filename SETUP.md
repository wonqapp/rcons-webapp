# RCONS — Инструкция по развёртыванию

## Что создано в этом пакете

```
config/
  services.ts     ← ШАГ 1: Полный конфиг услуг (мозг сайта)
  pages.ts        ← ШАГ 1: Конфиг статических страниц
  index.ts        ← ШАГ 1: Главный конфиг (siteConfig + siteMapForAI)

messages/
  ru.json         ← ШАГ 2: Русский (полный)
  en.json         ← ШАГ 2: Английский
  zh.json         ← ШАГ 2: Китайский
  kk.json         ← ШАГ 2: Казахский

app/
  [locale]/
    layout.tsx                          ← ШАГ 10: Корневой layout + metadata
    about/page.tsx                      ← ШАГ 4: О компании
    contacts/page.tsx                   ← ШАГ 4: Контакты
    resources/page.tsx                  ← ШАГ 4: Документы
    resources/sro/page.tsx              ← ШАГ 4: СРО
    resources/documents/page.tsx        ← ШАГ 4: Документы
    resources/disclosure/page.tsx       ← ШАГ 4: Раскрытие инфы
    resources/qualifications/page.tsx   ← ШАГ 4: Квалификации
    services/[category]/[service]/page.tsx ← ШАГ 3: Страница услуги
  api/
    contact/route.ts  ← ШАГ 8: Email API
    chat/route.ts     ← ШАГ 8: ИИ-чат API

components/
  navbar.tsx        ← ШАГ 5: Navbar из конфига
  Search.tsx        ← ШАГ 6: Поиск Fuse.js
  ContactForm.tsx   ← ШАГ 7: Форма с файлами
  AiChat.tsx        ← ШАГ 9: ИИ-чат виджет

.env.local.example  ← Переменные окружения
```

---

## Шаг 1: Скопируй файлы в проект

Скопируй файлы из этого архива в твой проект `rcons-webapp/src/`:

```
config/     → src/config/
messages/   → messages/       (в корне проекта, рядом с package.json)
app/        → src/app/
components/ → src/components/
```

---

## Шаг 2: Установи зависимости

```bash
# Поиск
npm install fuse.js

# Email (Resend — проще всего, есть бесплатный план 3000 писем/мес)
npm install resend

# Если хочешь Nodemailer вместо Resend — используй его, API route нужно поправить
```

---

## Шаг 3: Настрой .env.local

```bash
# Скопируй пример
cp .env.local.example .env.local

# Открой .env.local и заполни свои ключи
```

Минимальный `.env.local` для начала (без почты и ИИ — для разработки):
```
# Можно оставить пустым — в dev режиме всё логируется в консоль
```

---

## Шаг 4: Запусти проект

```bash
npm run dev
```

Открой http://localhost:3000

---

## Что будет работать сразу (без ключей):

- ✅ Навигация по всем страницам
- ✅ Страницы услуг с контентом
- ✅ Поиск по сайту (Fuse.js)
- ✅ Форма обратной связи (логирует в консоль)
- ✅ ИИ-чат (отвечает заглушкой с подсказкой настроить ключи)
- ✅ 4 языка

## Что нужно настроить для продакшна:

| Функция | Что нужно | Где получить |
|---------|-----------|--------------|
| Отправка email | RESEND_API_KEY | resend.com (бесплатно до 3000/мес) |
| ИИ-чат | OPENAI_API_KEY или YANDEX keys | platform.openai.com или console.cloud.yandex.ru |

---

## Как добавить новую услугу

1. Открой `src/config/services.ts`
2. Добавь в `servicesHierarchy`:
```typescript
{
  slug: "evaluation",
  titleKey: "services.evaluation.title",
  pages: [
    {
      slug: "business",
      titleKey: "services.evaluation.business.title",
      sections: [...]
    }
  ]
}
```
3. Добавь переводы в `messages/ru.json` (и другие языки)
4. Всё остальное (меню, sitemap, поиск, ИИ) обновится само ✅

---

## Как изменить контакты компании

Открой `src/config/index.ts`, поправь:
```typescript
company: {
  email: "info@rcons.ru",
  phone: "+7 (XXX) XXX-XX-XX",
  address: "г. Москва, ...",
  inn: "XXXXXXXXXX",
  ogrn: "XXXXXXXXXXXXX",
},
```

---

## Нужна помощь?

Скажи что конкретно — напишу код.
