// src/components/ContactForm.tsx
// ============================================================
// ФОРМА ОБРАТНОЙ СВЯЗИ с прикреплением файлов
// Отправляет на /api/contact → email через Resend/Nodemailer
// ============================================================

// src/components/ContactForm.tsx
"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { siteConfig } from "@/config";

interface Props {
  preselectedService?: string;
}

export default function ContactForm({ preselectedService }: Props) {
  const t = useTranslations("contact.form");
  const tCat = useTranslations("services");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    message: "",
    service: preselectedService ?? "",
  });
  const [attachment, setAttachment] = useState<File | null>(null);
  const [status, setStatus] = useState<
    "idle" | "sending" | "success" | "error"
  >("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});

  function set(field: string, value: string) {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }

  function validate() {
    const errs: Record<string, string> = {};
    if (!formData.name.trim()) errs.name = "Обязательное поле";
    if (!formData.email.trim()) errs.email = "Обязательное поле";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      errs.email = "Введите корректный email";
    if (!formData.message.trim()) errs.message = "Обязательное поле";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSubmit() {
    if (!validate()) return;
    setStatus("sending");

    const fd = new FormData();
    Object.entries(formData).forEach(([k, v]) => fd.append(k, v));
    if (attachment) fd.append("attachment", attachment);

    try {
      const res = await fetch("/api/contact", { method: "POST", body: fd });
      if (!res.ok) throw new Error();
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-xl border border-green-800 bg-green-950/40 p-6 text-center">
        <div className="text-2xl mb-2">✓</div>
        <p className="text-sm text-green-300">{t("success")}</p>
      </div>
    );
  }

  function getCatLabel(catTitleKey: string): string {
    // titleKey вида "services.audit.title" → namespace "services", ключ "audit.title"
    const key = catTitleKey.replace("services.", "") as Parameters<
      typeof tCat
    >[0];
    try {
      return tCat(key);
    } catch {
      return catTitleKey;
    }
  }

  function getTypeLabel(typeTitleKey: string): string {
    const key = typeTitleKey.replace("services.", "") as Parameters<
      typeof tCat
    >[0];
    try {
      return tCat(key);
    } catch {
      return typeTitleKey;
    }
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label={t("name")} error={errors.name} required>
          <input
            value={formData.name}
            onChange={(e) => set("name", e.target.value)}
            className={inputCls(!!errors.name)}
            placeholder={t("name")}
          />
        </Field>
        <Field label={t("email")} error={errors.email} required>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => set("email", e.target.value)}
            className={inputCls(!!errors.email)}
            placeholder="example@company.ru"
          />
        </Field>
        <Field label={t("phone")}>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => set("phone", e.target.value)}
            className={inputCls(false)}
            placeholder="+7 (___) ___-__-__"
          />
        </Field>
        <Field label={t("company")}>
          <input
            value={formData.company}
            onChange={(e) => set("company", e.target.value)}
            className={inputCls(false)}
            placeholder="ООО «Компания»"
          />
        </Field>
      </div>

      <Field label={t("service")}>
        <select
          value={formData.service}
          onChange={(e) => set("service", e.target.value)}
          className={inputCls(false) + " appearance-none cursor-pointer"}
        >
          <option value="">{t("servicePlaceholder")}</option>
          {siteConfig.services.map((cat) => (
            <optgroup key={cat.slug} label={getCatLabel(cat.titleKey)}>
              {cat.types.map((type) => (
                <option key={type.slug} value={`${cat.slug}/${type.slug}`}>
                  {getTypeLabel(type.titleKey)}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
      </Field>

      <Field label={t("message")} error={errors.message} required>
        <textarea
          value={formData.message}
          onChange={(e) => set("message", e.target.value)}
          className={inputCls(!!errors.message) + " min-h-[100px] resize-none"}
          placeholder="Опишите ваш запрос..."
        />
      </Field>

      <Field label={t("attachment")}>
        <div className="flex items-center gap-3 flex-wrap">
          <label className="cursor-pointer rounded-lg border border-zinc-700 px-3 py-2 text-sm text-zinc-400 hover:text-zinc-200 hover:border-zinc-500 transition-colors">
            {attachment ? attachment.name : "Выбрать файл"}
            <input
              type="file"
              accept=".pdf,.doc,.docx,.xls,.xlsx"
              className="hidden"
              onChange={(e) => setAttachment(e.target.files?.[0] ?? null)}
            />
          </label>
          {attachment && (
            <button
              onClick={() => setAttachment(null)}
              className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
            >
              Удалить
            </button>
          )}
          <span className="text-xs text-zinc-600">{t("attachmentHint")}</span>
        </div>
      </Field>

      {status === "error" && (
        <p className="text-sm text-red-400">{t("error")}</p>
      )}

      <div className="flex flex-col gap-2">
        <button
          onClick={handleSubmit}
          disabled={status === "sending"}
          className="w-full rounded-xl bg-zinc-100 text-zinc-900 px-6 py-3 text-sm font-medium hover:bg-white disabled:opacity-50 transition-colors"
        >
          {status === "sending" ? t("sending") : t("submit")}
        </button>
        <p className="text-xs text-zinc-600 text-center">{t("privacy")}</p>
      </div>
    </div>
  );
}

// ─── Вспомогательные компоненты ──────────────────────────────

function Field({
  label,
  children,
  error,
  required,
}: {
  label: string;
  children: React.ReactNode;
  error?: string;
  required?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs text-zinc-400">
        {label}
        {required && <span className="text-zinc-600 ml-0.5">*</span>}
      </label>
      {children}
      {error && <span className="text-xs text-red-400">{error}</span>}
    </div>
  );
}

function inputCls(hasError: boolean) {
  return [
    "w-full rounded-lg border bg-zinc-900 px-3 py-2 text-sm text-zinc-100",
    "placeholder-zinc-600 outline-none transition-colors focus:ring-1",
    hasError
      ? "border-red-700 focus:ring-red-700"
      : "border-zinc-700 focus:ring-zinc-500",
  ].join(" ");
}
