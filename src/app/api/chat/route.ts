import { NextRequest, NextResponse } from "next/server";
import { buildChatContext, containsLegalRiskQuestion } from "@/lib/chat-context";

const YANDEX_API_URL =
  "https://llm.api.cloud.yandex.net/foundationModels/v1/completion";

const chatRl = new Map<string, { count: number; reset: number }>();

function rateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = chatRl.get(ip);
  if (!entry || now > entry.reset) {
    chatRl.set(ip, { count: 1, reset: now + 60_000 });
    return true;
  }

  if (entry.count >= 20) return false;
  entry.count += 1;
  return true;
}

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

function buildSystemPrompt(input: string, contextSummary: string): string {
  const legalRiskDisclaimer = containsLegalRiskQuestion(input)
    ? "Вопрос содержит правовой/рисковый контекст: добавь дисклеймер, что это не индивидуальная юридическая/налоговая консультация."
    : "Если вопрос затрагивает право/налоги, добавь краткий дисклеймер."

  return `Ты — помощник аудиторско-консалтинговой компании RCONS.

Контекст сайта (только внутренние данные):
${contextSummary}

Правила ответа:
1) Отвечай на языке пользователя, кратко (до 6 предложений).
2) Не придумывай цены/сроки, используй только контекст выше.
3) Не давай инструкций по обходу закона, сокрытию налогов или иным противоправным действиям.
4) ${legalRiskDisclaimer}
5) Если данных недостаточно — честно скажи и предложи написать на info@rcons.ru.`;
}

export async function POST(request: NextRequest) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "unknown";

  if (!rateLimit(ip)) {
    return NextResponse.json(
      { error: "Слишком много запросов. Подождите минуту." },
      { status: 429 },
    );
  }

  try {
    const body = (await request.json()) as {
      messages?: unknown[];
      pathname?: string;
    };

    const rawMessages = Array.isArray(body?.messages) ? body.messages : [];

    const messages: ChatMessage[] = rawMessages
      .filter(
        (m): m is ChatMessage =>
          typeof m === "object" &&
          m !== null &&
          "role" in m &&
          "content" in m &&
          ((m as ChatMessage).role === "user" || (m as ChatMessage).role === "assistant"),
      )
      .slice(-10)
      .map((m) => ({
        role: m.role,
        content: String(m.content).slice(0, 1200),
      }));

    if (messages.length === 0) {
      return NextResponse.json({ error: "Пустой запрос" }, { status: 400 });
    }

    if (!process.env.YANDEX_API_KEY || !process.env.YANDEX_FOLDER_ID) {
      return NextResponse.json(
        { error: "ИИ-помощник временно недоступен" },
        { status: 503 },
      );
    }

    const lastUserMessage = [...messages].reverse().find((m) => m.role === "user")?.content ?? "";
    const chatContext = buildChatContext(lastUserMessage, body?.pathname);

    const systemPrompt = buildSystemPrompt(lastUserMessage, chatContext.summary);

    const yandexPayload = {
      modelUri: `gpt://${process.env.YANDEX_FOLDER_ID}/yandexgpt/latest`,
      completionOptions: {
        stream: false,
        temperature: 0.25,
        maxTokens: 550,
      },
      messages: [
        { role: "system", text: systemPrompt },
        ...messages.map((m) => ({
          role: m.role,
          text: m.content,
        })),
      ],
    };

    const response = await fetch(YANDEX_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Api-Key ${process.env.YANDEX_API_KEY}`,
        "x-folder-id": process.env.YANDEX_FOLDER_ID,
      },
      body: JSON.stringify(yandexPayload),
      cache: "no-store",
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("YandexGPT error:", response.status, errText);
      return NextResponse.json(
        { error: "Ошибка сервиса ИИ" },
        { status: 502 },
      );
    }

    const data = (await response.json()) as {
      result?: {
        alternatives?: Array<{
          message?: { text?: string };
        }>;
      };
    };

    const content =
      data?.result?.alternatives?.[0]?.message?.text?.trim() ||
      "Извините, я не смог сформировать ответ. Напишите на info@rcons.ru.";

    return NextResponse.json({
      content,
      matchedServiceIds: chatContext.matchedServiceIds,
    });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: "Внутренняя ошибка сервера" },
      { status: 500 },
    );
  }
}
