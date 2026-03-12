// src/app/api/chat/route.ts
// ============================================================
// API МАРШРУТ: ИИ-помощник
// Используем OpenAI-совместимый API (YandexGPT или OpenAI)
//
// Для YandexGPT:
//   YANDEX_GPT_API_KEY=your_key  YANDEX_FOLDER_ID=your_folder
//   AI_PROVIDER=yandex
//
// Для OpenAI:
//   OPENAI_API_KEY=sk-xxx
//   AI_PROVIDER=openai (или оставить пустым)
// ============================================================
// src/app/api/chat/route.ts
// src/app/api/chat/route.ts
import { NextRequest, NextResponse } from "next/server";

const YANDEX_API_URL =
  "https://llm.api.cloud.yandex.net/foundationModels/v1/completion";

// ─── Rate limiting для чата ──────────────────────────────────
const chatRl = new Map<string, { count: number; reset: number }>();

function rateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = chatRl.get(ip);
  if (!entry || now > entry.reset) {
    chatRl.set(ip, { count: 1, reset: now + 60_000 });
    return true;
  }
  if (entry.count >= 20) return false; // 20 сообщений в минуту
  entry.count++;
  return true;
}

const SYSTEM_PROMPT = `Ты — профессиональный помощник аудиторско-консалтинговой компании RCONS (rcons.ru).

Компетенции RCONS:
— Аудит: обязательный по РСБУ (ООО, АО, ПАО, ГУП, МУП, НКО, застройщики 214-ФЗ), инициативный, налоговый, ПИФ, пенсионные накопления
— Налоги: консалтинг, абонемент, предпроверочный анализ, сопровождение проверок ФНС, досудебное обжалование, возмещение НДС, 3-НДФЛ, КИК
— Оценка: бизнеса, акций, долей, НМА, недвижимости, земли, транспорта, оборудования, кадастровая стоимость, ущерб
— Due Diligence: финансовый, налоговый, юридический, операционный, комплексный (M&A, инвестор, кредитование)
— Аутсорсинг учёта: полное ведение, зарплата, восстановление, нулевая отчётность, ФСБУ
— Финансовый консалтинг: анализ, бизнес-планирование, моделирование, управленческая отчётность
— Юридические услуги: аутсорсинг, арбитраж, банкротство, корпоративное право

Правила:
1. Отвечай кратко и по делу (3–5 предложений максимум)
2. Если вопрос выходит за рамки компетенции RCONS — вежливо скажи об этом
3. Для срочных вопросов рекомендуй: info@rcons.ru
4. Отвечай на языке вопроса
5. Не придумывай цены и сроки — направляй к менеджеру`;

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export async function POST(request: NextRequest) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

  if (!rateLimit(ip)) {
    return NextResponse.json(
      { error: "Слишком много запросов. Подождите минуту." },
      { status: 429 },
    );
  }

  try {
    const body = await request.json();
    const rawMessages: unknown[] = Array.isArray(body?.messages)
      ? body.messages
      : [];

    // Лимит истории и длины сообщений
    const messages: ChatMessage[] = rawMessages
      .filter(
        (m): m is ChatMessage =>
          (typeof m === "object" &&
            m !== null &&
            "role" in m &&
            "content" in m &&
            (m as ChatMessage).role === "user") ||
          (m as ChatMessage).role === "assistant",
      )
      .slice(-10) // последние 10 сообщений
      .map((m) => ({
        role: m.role,
        content: String(m.content).slice(0, 1000), // макс 1000 символов на сообщение
      }));

    if (messages.length === 0) {
      return NextResponse.json({ error: "Пустой запрос" }, { status: 400 });
    }

    if (!process.env.YANDEX_API_KEY || !process.env.YANDEX_FOLDER_ID) {
      console.error("Yandex AI not configured");
      return NextResponse.json(
        { error: "ИИ-помощник временно недоступен" },
        { status: 503 },
      );
    }

    const response = await fetch(YANDEX_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Api-Key ${process.env.YANDEX_API_KEY}`,
        "x-folder-id": process.env.YANDEX_FOLDER_ID,
      },
      body: JSON.stringify({
        modelUri: `gpt://${process.env.YANDEX_FOLDER_ID}/yandexgpt-lite`,
        completionOptions: {
          stream: false,
          temperature: 0.3,
          maxTokens: 600,
        },
        messages: [
          { role: "system", text: SYSTEM_PROMPT },
          ...messages.map((m) => ({
            role: m.role === "assistant" ? "assistant" : "user",
            text: m.content,
          })),
        ],
      }),
      signal: AbortSignal.timeout(15_000), // таймаут 15 секунд
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("Yandex API error:", response.status, errText);
      return NextResponse.json(
        { error: "Ошибка ИИ-сервиса. Попробуйте позже." },
        { status: 502 },
      );
    }

    const data = await response.json();
    const text: string =
      data?.result?.alternatives?.[0]?.message?.text ??
      "Не удалось получить ответ.";

    return NextResponse.json({ content: text });
  } catch (error: unknown) {
    if (error instanceof Error && error.name === "TimeoutError") {
      return NextResponse.json(
        { error: "Время ожидания истекло. Попробуйте ещё раз." },
        { status: 504 },
      );
    }
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: "Внутренняя ошибка сервера" },
      { status: 500 },
    );
  }
}
