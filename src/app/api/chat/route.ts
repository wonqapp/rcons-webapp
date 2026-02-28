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

import { NextRequest, NextResponse } from "next/server";
import { siteMapForAI } from "@/config";

const AI_PROVIDER = process.env.AI_PROVIDER ?? "openai";
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const YANDEX_GPT_API_KEY = process.env.YANDEX_GPT_API_KEY;
const YANDEX_FOLDER_ID = process.env.YANDEX_FOLDER_ID;

export const runtime = "edge"; // edge runtime для быстрого стрима

interface Message {
  role: "user" | "assistant";
  content: string;
}

export async function POST(request: NextRequest) {
  try {
    const { messages }: { messages: Message[] } = await request.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Invalid messages" }, { status: 400 });
    }

    // Ограничиваем историю — берём последние 10 сообщений
    const recentMessages = messages.slice(-10);

    // ============================================================
    // YANDEX GPT
    // ============================================================
    if (AI_PROVIDER === "yandex") {
      if (!YANDEX_GPT_API_KEY || !YANDEX_FOLDER_ID) {
        return NextResponse.json({ error: "YandexGPT not configured" }, { status: 500 });
      }

      const yandexBody = {
        modelUri: `gpt://${YANDEX_FOLDER_ID}/yandexgpt-lite/latest`,
        completionOptions: {
          stream: false, // YandexGPT lite не поддерживает стрим через REST
          temperature: 0.3,
          maxTokens: 500,
        },
        messages: [
          { role: "system", text: siteMapForAI },
          ...recentMessages.map((m) => ({
            role: m.role === "user" ? "user" : "assistant",
            text: m.content,
          })),
        ],
      };

      const res = await fetch(
        "https://llm.api.cloud.yandex.net/foundationModels/v1/completion",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Api-Key ${YANDEX_GPT_API_KEY}`,
          },
          body: JSON.stringify(yandexBody),
        }
      );

      if (!res.ok) {
        const err = await res.text();
        console.error("YandexGPT error:", err);
        return NextResponse.json({ error: "AI error" }, { status: 500 });
      }

      const data = await res.json();
      const text = data.result?.alternatives?.[0]?.message?.text ?? "Не удалось получить ответ";
      return NextResponse.json({ content: text });
    }

    // ============================================================
    // OPENAI (или совместимый — gpt-4o-mini дешевле всего)
    // ============================================================
    if (!OPENAI_API_KEY) {
      // DEV режим — заглушка
      return NextResponse.json({
        content: `[DEV] Вы спросили: "${recentMessages.at(-1)?.content}". Настройте OPENAI_API_KEY или YANDEX_GPT_API_KEY в .env.local`,
      });
    }

    const stream = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        max_tokens: 500,
        temperature: 0.3,
        stream: true,
        messages: [
          { role: "system", content: siteMapForAI },
          ...recentMessages,
        ],
      }),
    });

    if (!stream.ok) {
      const err = await stream.text();
      console.error("OpenAI error:", err);
      return NextResponse.json({ error: "AI error" }, { status: 500 });
    }

    // Прокидываем стрим напрямую клиенту
    return new NextResponse(stream.body, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
