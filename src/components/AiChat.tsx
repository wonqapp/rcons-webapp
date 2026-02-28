"use client";
// src/components/AiChat.tsx
// ============================================================
// ИИ-ПОМОЩНИК — плавающий виджет
// Стримит ответы, поддерживает историю диалога
// Умеет направить пользователя в нужный раздел сайта
// ============================================================

import { useState, useRef, useEffect, useCallback } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/routing";
import { useLocale } from "next-intl";

interface Message {
  role: "user" | "assistant";
  content: string;
}

// Парсим ссылки в тексте ответа — ИИ может написать /services/audit/rsbu
// Превращаем их в кликабельные элементы
function parseLinks(text: string, onNavigate: (href: string) => void) {
  const parts = text.split(/(\/(services|resources|about|contacts)[^\s,\.\)]*)/g);
  return parts.map((part, i) => {
    if (part.match(/^\/(services|resources|about|contacts)/)) {
      return (
        <button
          key={i}
          onClick={() => onNavigate(part)}
          className="text-primary underline hover:no-underline"
        >
          {part}
        </button>
      );
    }
    return part;
  });
}

export default function AiChat() {
  const t = useTranslations("chat");
  const router = useRouter();
  const locale = useLocale();

  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Скролл вниз при новом сообщении
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // Фокус при открытии
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100);
      // Приветствие при первом открытии
      if (messages.length === 0) {
        setMessages([{ role: "assistant", content: t("greeting") }]);
      }
    }
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  const navigate = useCallback((href: string) => {
    router.push(href as never);
    setOpen(false);
  }, [router]);

  // ============================================================
  // Отправка сообщения
  // ============================================================
  const sendMessage = useCallback(async () => {
    const text = input.trim();
    if (!text || loading) return;

    setInput("");
    const userMessage: Message = { role: "user", content: text };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });

      if (!res.ok) throw new Error("API error");

      const contentType = res.headers.get("content-type") ?? "";

      // ============================================================
      // Стриминг (OpenAI SSE)
      // ============================================================
      if (contentType.includes("text/event-stream")) {
        const assistantMessage: Message = { role: "assistant", content: "" };
        setMessages((prev) => [...prev, assistantMessage]);
        setLoading(false);

        const reader = res.body!.getReader();
        const decoder = new TextDecoder();
        let buffer = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() ?? "";

          for (const line of lines) {
            if (!line.startsWith("data: ")) continue;
            const data = line.slice(6);
            if (data === "[DONE]") continue;

            try {
              const parsed = JSON.parse(data);
              const delta = parsed.choices?.[0]?.delta?.content;
              if (delta) {
                setMessages((prev) => {
                  const updated = [...prev];
                  updated[updated.length - 1] = {
                    ...updated[updated.length - 1],
                    content: updated[updated.length - 1].content + delta,
                  };
                  return updated;
                });
              }
            } catch {
              // пропускаем невалидный JSON
            }
          }
        }
      } else {
        // ============================================================
        // Обычный JSON ответ (YandexGPT или DEV режим)
        // ============================================================
        const data = await res.json();
        setLoading(false);
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: data.content ?? "Извините, произошла ошибка." },
        ]);
      }
    } catch (error) {
      console.error("Chat error:", error);
      setLoading(false);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Извините, произошла ошибка. Пожалуйста, напишите нам на info@rcons.ru",
        },
      ]);
    }
  }, [input, loading, messages]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {/* ПЛАВАЮЩАЯ КНОПКА */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-primary text-primary-foreground rounded-full px-4 py-3 shadow-lg hover:shadow-xl hover:bg-primary/90 transition-all"
        aria-label={t("open")}
      >
        {open ? (
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        )}
        <span className="text-sm font-medium">{open ? t("close") : t("open")}</span>
      </button>

      {/* ЧАТ ОКНО */}
      {open && (
        <div className="fixed bottom-20 right-6 z-50 w-80 sm:w-96 bg-background border rounded-2xl shadow-2xl flex flex-col overflow-hidden"
          style={{ maxHeight: "70vh" }}>

          {/* ШАПКА */}
          <div className="flex items-center gap-3 px-4 py-3 border-b bg-primary text-primary-foreground">
            <div className="h-8 w-8 rounded-full bg-primary-foreground/20 flex items-center justify-center text-sm">
              🤖
            </div>
            <div>
              <p className="font-medium text-sm">{t("title")}</p>
              <p className="text-xs opacity-75">RCONS</p>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="ml-auto opacity-75 hover:opacity-100"
              aria-label="Close"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* СООБЩЕНИЯ */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm leading-relaxed ${
                    msg.role === "user"
                      ? "bg-primary text-primary-foreground rounded-br-sm"
                      : "bg-muted rounded-bl-sm"
                  }`}
                >
                  {msg.role === "assistant"
                    ? parseLinks(msg.content, navigate)
                    : msg.content}
                </div>
              </div>
            ))}

            {/* ИНДИКАТОР ЗАГРУЗКИ */}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-muted rounded-2xl rounded-bl-sm px-4 py-3">
                  <div className="flex gap-1">
                    <span className="h-2 w-2 rounded-full bg-muted-foreground/50 animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="h-2 w-2 rounded-full bg-muted-foreground/50 animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="h-2 w-2 rounded-full bg-muted-foreground/50 animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* БЫСТРЫЕ ВОПРОСЫ (если чат пустой) */}
          {messages.length <= 1 && !loading && (
            <div className="px-4 pb-2 flex flex-wrap gap-2">
              {[
                "Нужен обязательный аудит",
                "Налоговая оптимизация",
                "Аудит по МСФО",
                "Контакты компании",
              ].map((q) => (
                <button
                  key={q}
                  onClick={() => {
                    setInput(q);
                    setTimeout(() => sendMessage(), 0);
                  }}
                  className="text-xs bg-muted hover:bg-accent rounded-full px-3 py-1.5 transition-colors text-left"
                >
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* ИНПУТ */}
          <div className="border-t p-3 flex items-end gap-2">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={t("placeholder")}
              rows={1}
              className="flex-1 bg-muted rounded-xl px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary max-h-24 overflow-y-auto"
              style={{ minHeight: "40px" }}
            />
            <button
              onClick={sendMessage}
              disabled={!input.trim() || loading}
              className="h-10 w-10 rounded-xl bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shrink-0"
              aria-label="Send"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </>
  );
}
