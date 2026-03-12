import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

const rl = new Map<string, { count: number; reset: number }>();

function rateLimit(ip: string, limit = 5, windowMs = 60_000): boolean {
  const now = Date.now();
  const entry = rl.get(ip);
  if (!entry || now > entry.reset) {
    rl.set(ip, { count: 1, reset: now + windowMs });
    return true;
  }

  if (entry.count >= limit) return false;
  entry.count += 1;
  return true;
}

function isAllowedCrawler(userAgent: string): boolean {
  const ua = userAgent.toLowerCase();
  return ua.includes("googlebot") || ua.includes("yandexbot") || ua.includes("yandeximages");
}

function isLikelyAutomatedAgent(userAgent: string): boolean {
  const ua = userAgent.toLowerCase();
  if (!ua) return true;
  if (isAllowedCrawler(ua)) return false;

  const botMarkers = ["bot", "crawler", "spider", "scrapy", "curl", "python-requests", "wget", "headless"];
  return botMarkers.some((marker) => ua.includes(marker));
}

setInterval(() => {
  const now = Date.now();
  for (const [key, val] of rl.entries()) {
    if (now > val.reset) rl.delete(key);
  }
}, 3_600_000);

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

const ALLOWED_MIME = new Set([
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
]);
const MAX_FILE_SIZE = 10 * 1024 * 1024;

export async function POST(request: NextRequest) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "unknown";

  if (!rateLimit(ip)) {
    return NextResponse.json(
      { error: "Слишком много запросов. Попробуйте через минуту." },
      { status: 429 },
    );
  }

  try {
    const userAgent = request.headers.get("user-agent") ?? "";
    if (isLikelyAutomatedAgent(userAgent)) {
      return NextResponse.json(
        { error: "Запрос заблокирован антиспам-фильтром" },
        { status: 403 },
      );
    }

    const formData = await request.formData();

    const name = (formData.get("name") as string | null)?.trim() ?? "";
    const email = (formData.get("email") as string | null)?.trim() ?? "";
    const phone = (formData.get("phone") as string | null)?.trim() ?? "";
    const company = (formData.get("company") as string | null)?.trim() ?? "";
    const message = (formData.get("message") as string | null)?.trim() ?? "";
    const service = (formData.get("service") as string | null)?.trim() ?? "";
    const consent = (formData.get("consent") as string | null)?.trim() ?? "";
    const website = (formData.get("website") as string | null)?.trim() ?? "";
    const formStartedAtRaw = (formData.get("formStartedAt") as string | null)?.trim() ?? "";
    const attachment = formData.get("attachment") as File | null;

    if (website) {
      return NextResponse.json({ success: true });
    }

    const formStartedAt = Number(formStartedAtRaw);
    if (!Number.isFinite(formStartedAt) || Date.now() - formStartedAt < 2_500) {
      return NextResponse.json(
        { error: "Проверка антибот не пройдена" },
        { status: 400 },
      );
    }

    const errors: Record<string, string> = {};
    if (!name) errors.name = "Обязательное поле";
    if (!email) errors.email = "Обязательное поле";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = "Некорректный email";
    if (!message) errors.message = "Обязательное поле";
    if (message.length > 5000) errors.message = "Сообщение слишком длинное";
    if (name.length > 200) errors.name = "Имя слишком длинное";
    if (consent !== "true") errors.consent = "Требуется согласие на обработку ПДн";

    if (Object.keys(errors).length > 0) {
      return NextResponse.json({ errors }, { status: 400 });
    }

    const attachments: Array<{ filename: string; content: Buffer; contentType: string }> = [];
    if (attachment && attachment.size > 0) {
      if (attachment.size > MAX_FILE_SIZE) {
        return NextResponse.json({ error: "Файл превышает 10 МБ" }, { status: 400 });
      }
      if (!ALLOWED_MIME.has(attachment.type)) {
        return NextResponse.json(
          { error: "Недопустимый тип файла. Разрешены: PDF, Word, Excel" },
          { status: 400 },
        );
      }

      const safeName = attachment.name.replace(/[^a-zA-Z0-9._\-а-яёА-ЯЁ]/g, "_");
      const buffer = Buffer.from(await attachment.arrayBuffer());
      attachments.push({
        filename: safeName,
        content: buffer,
        contentType: attachment.type,
      });
    }

    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      return NextResponse.json(
        { error: "Ошибка конфигурации сервера" },
        { status: 500 },
      );
    }

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST ?? "smtp.yandex.ru",
      port: Number(process.env.SMTP_PORT ?? 465),
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const safeFields = {
      name: escapeHtml(name),
      email: escapeHtml(email),
      phone: escapeHtml(phone),
      company: escapeHtml(company),
      message: escapeHtml(message).replace(/\n/g, "<br>"),
      service: escapeHtml(service),
    };

    const sentAt = new Date().toLocaleString("ru-RU", {
      timeZone: "Europe/Moscow",
    });

    await transporter.sendMail({
      from: `"Сайт RCONS" <${process.env.SMTP_USER}>`,
      to: process.env.CONTACT_EMAIL ?? "info@rcons.ru",
      replyTo: email,
      subject: `Заявка: ${safeFields.name}${company ? ` (${safeFields.company})` : ""}`,
      html: `
        <!DOCTYPE html>
        <html lang="ru">
        <body style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;color:#1a1a1a;">
          <h2 style="color:#0a0a0c;border-bottom:2px solid #e5e7eb;padding-bottom:12px;">Новая заявка с сайта rcons.ru</h2>
          <table style="width:100%;border-collapse:collapse;">
            <tr><td style="padding:8px 0;color:#6b7280;width:120px;">Имя</td><td style="padding:8px 0;font-weight:600;">${safeFields.name}</td></tr>
            <tr><td style="padding:8px 0;color:#6b7280;">Email</td><td style="padding:8px 0;"><a href="mailto:${safeFields.email}">${safeFields.email}</a></td></tr>
            ${phone ? `<tr><td style="padding:8px 0;color:#6b7280;">Телефон</td><td style="padding:8px 0;">${safeFields.phone}</td></tr>` : ""}
            ${company ? `<tr><td style="padding:8px 0;color:#6b7280;">Компания</td><td style="padding:8px 0;">${safeFields.company}</td></tr>` : ""}
            ${service ? `<tr><td style="padding:8px 0;color:#6b7280;">Услуга</td><td style="padding:8px 0;">${safeFields.service}</td></tr>` : ""}
          </table>
          <div style="margin-top:16px;padding:16px;background:#f9fafb;border-radius:8px;">
            <p style="margin:0 0 8px;color:#6b7280;font-size:13px;">Сообщение:</p>
            <p style="margin:0;line-height:1.6;">${safeFields.message}</p>
          </div>
          <p style="margin-top:24px;color:#9ca3af;font-size:12px;">Отправлено: ${sentAt} · IP: ${escapeHtml(ip)}</p>
        </body>
        </html>
      `,
      attachments,
    });

    await transporter.sendMail({
      from: `"RCONS" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "Ваша заявка получена — RCONS",
      html: `
        <!DOCTYPE html>
        <html lang="ru">
        <body style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;color:#1a1a1a;">
          <h2 style="color:#0a0a0c;">Заявка получена</h2>
          <p>Здравствуйте, ${safeFields.name}!</p>
          <p>Мы получили вашу заявку и свяжемся с вами в течение <strong>1 рабочего дня</strong>.</p>
          ${service ? `<p>Интересующая услуга: <strong>${safeFields.service}</strong></p>` : ""}
          <p>Если у вас срочный вопрос — напишите напрямую: <a href="mailto:info@rcons.ru">info@rcons.ru</a></p>
          <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0;">
          <p style="color:#6b7280;font-size:13px;">С уважением,<br>Команда RCONS</p>
        </body>
        </html>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact API error:", error);
    return NextResponse.json(
      { error: "Внутренняя ошибка сервера" },
      { status: 500 },
    );
  }
}
