"use client";
// src/components/ContactForm.tsx
// ============================================================
// ФОРМА ОБРАТНОЙ СВЯЗИ с прикреплением файлов
// Отправляет на /api/contact → email через Resend/Nodemailer
// ============================================================

import { useState, useRef, useCallback } from "react";
import { useTranslations } from "next-intl";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "image/jpeg",
  "image/png",
];

type FormState = "idle" | "loading" | "success" | "error";

export default function ContactForm() {
  const t = useTranslations("contact.form");

  const [state, setState] = useState<FormState>("idle");
  const [files, setFiles] = useState<File[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const [fileError, setFileError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formRef = useRef<HTMLFormElement>(null);

  // ============================================================
  // Обработка файлов
  // ============================================================
  const validateAndAddFiles = useCallback((newFiles: FileList | File[]) => {
    setFileError("");
    const valid: File[] = [];

    Array.from(newFiles).forEach((file) => {
      if (!ALLOWED_TYPES.includes(file.type)) {
        setFileError(`Тип файла не поддерживается: ${file.name}`);
        return;
      }
      if (file.size > MAX_FILE_SIZE) {
        setFileError(`Файл слишком большой (max 10MB): ${file.name}`);
        return;
      }
      valid.push(file);
    });

    setFiles((prev) => [...prev, ...valid]);
  }, []);

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      validateAndAddFiles(e.dataTransfer.files);
    },
    [validateAndAddFiles]
  );

  // ============================================================
  // Отправка формы
  // ============================================================
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setState("loading");

    const formData = new FormData(e.currentTarget);
    files.forEach((file) => formData.append("files", file));

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Server error");

      setState("success");
      formRef.current?.reset();
      setFiles([]);
    } catch {
      setState("error");
    }
  };

  if (state === "success") {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="text-5xl mb-4">✅</div>
        <p className="text-lg font-medium mb-2">Сообщение отправлено!</p>
        <p className="text-muted-foreground text-sm">{t("success")}</p>
        <button
          onClick={() => setState("idle")}
          className="mt-6 text-sm text-primary hover:underline"
        >
          Отправить ещё
        </button>
      </div>
    );
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-xl font-semibold mb-6">{t("title")}</h2>

      {/* ИМЯ + EMAIL */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="name">
            {t("name")} <span className="text-destructive">*</span>
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            className="w-full rounded-lg border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="email">
            {t("email")} <span className="text-destructive">*</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="w-full rounded-lg border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      {/* ТЕЛЕФОН + КОМПАНИЯ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="phone">
            {t("phone")}
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            className="w-full rounded-lg border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="company">
            {t("company")}
          </label>
          <input
            id="company"
            name="company"
            type="text"
            className="w-full rounded-lg border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      {/* СООБЩЕНИЕ */}
      <div>
        <label className="block text-sm font-medium mb-1" htmlFor="message">
          {t("message")} <span className="text-destructive">*</span>
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={4}
          className="w-full rounded-lg border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none"
        />
      </div>

      {/* ПРИКРЕПЛЕНИЕ ФАЙЛОВ */}
      <div>
        <label className="block text-sm font-medium mb-2">{t("attachment")}</label>

        {/* Зона drag&drop */}
        <div
          className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
            dragOver
              ? "border-primary bg-primary/5"
              : "border-muted-foreground/25 hover:border-primary/50"
          }`}
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
        >
          <div className="text-2xl mb-2">📎</div>
          <p className="text-sm text-muted-foreground">
            Перетащите файлы или <span className="text-primary underline">выберите</span>
          </p>
          <p className="text-xs text-muted-foreground mt-1">{t("attachmentHint")}</p>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
            className="hidden"
            onChange={(e) => e.target.files && validateAndAddFiles(e.target.files)}
          />
        </div>

        {/* Ошибка файла */}
        {fileError && (
          <p className="text-xs text-destructive mt-1">{fileError}</p>
        )}

        {/* Список прикреплённых файлов */}
        {files.length > 0 && (
          <ul className="mt-3 space-y-2">
            {files.map((file, index) => (
              <li
                key={index}
                className="flex items-center justify-between text-sm bg-muted rounded-lg px-3 py-2"
              >
                <span className="truncate">{file.name}</span>
                <button
                  type="button"
                  onClick={() => removeFile(index)}
                  className="ml-2 text-muted-foreground hover:text-destructive shrink-0"
                  aria-label="Remove file"
                >
                  ✕
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* ОШИБКА ОТПРАВКИ */}
      {state === "error" && (
        <p className="text-sm text-destructive">{t("error")}</p>
      )}

      {/* КНОПКА ОТПРАВКИ */}
      <button
        type="submit"
        disabled={state === "loading"}
        className="w-full rounded-lg bg-primary px-4 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {state === "loading" ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
            {t("sending")}
          </span>
        ) : (
          t("submit")
        )}
      </button>
    </form>
  );
}
