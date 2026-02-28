// src/app/api/contact/route.ts
// ============================================================
// API МАРШРУТ: Форма обратной связи
// Используем Resend для отправки email (можно заменить на Nodemailer)
// Установи: npm install resend
// Добавь в .env.local: RESEND_API_KEY=re_xxxx  CONTACT_EMAIL=info@rcons.ru
// ============================================================

import { NextRequest, NextResponse } from "next/server";

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const CONTACT_EMAIL = process.env.CONTACT_EMAIL ?? "info@rcons.ru";
const FROM_EMAIL = process.env.FROM_EMAIL ?? "noreply@rcons.ru";
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    // Получаем поля формы
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;
    const company = formData.get("company") as string;
    const message = formData.get("message") as string;

    // Валидация обязательных полей
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Обязательные поля: name, email, message" },
        { status: 400 }
      );
    }

    // Обработка файлов
    const files = formData.getAll("files") as File[];
    const attachments: Array<{ filename: string; content: string }> = [];

    for (const file of files) {
      if (file.size > MAX_FILE_SIZE) {
        return NextResponse.json(
          { error: `Файл слишком большой: ${file.name}` },
          { status: 400 }
        );
      }

      const buffer = await file.arrayBuffer();
      const base64 = Buffer.from(buffer).toString("base64");
      attachments.push({
        filename: file.name,
        content: base64,
      });
    }

    // Формируем HTML письмо
    const htmlBody = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1a1a1a; border-bottom: 2px solid #e2e8f0; padding-bottom: 12px;">
          Новый запрос с сайта RCONS
        </h2>
        
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
          <tr>
            <td style="padding: 8px 0; color: #666; width: 120px;">Имя:</td>
            <td style="padding: 8px 0; font-weight: 500;">${name}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #666;">Email:</td>
            <td style="padding: 8px 0;">
              <a href="mailto:${email}" style="color: #3b82f6;">${email}</a>
            </td>
          </tr>
          ${phone ? `
          <tr>
            <td style="padding: 8px 0; color: #666;">Телефон:</td>
            <td style="padding: 8px 0;">${phone}</td>
          </tr>` : ""}
          ${company ? `
          <tr>
            <td style="padding: 8px 0; color: #666;">Компания:</td>
            <td style="padding: 8px 0;">${company}</td>
          </tr>` : ""}
        </table>
        
        <div style="background: #f8fafc; border-left: 4px solid #3b82f6; padding: 16px; margin: 20px 0;">
          <p style="margin: 0; color: #333; white-space: pre-wrap;">${message}</p>
        </div>
        
        ${attachments.length > 0 ? `
        <p style="color: #666; margin-top: 20px;">
          📎 Прикреплено файлов: ${attachments.length}
        </p>` : ""}
        
        <p style="color: #999; font-size: 12px; margin-top: 30px; border-top: 1px solid #e2e8f0; padding-top: 16px;">
          Отправлено с сайта rcons.ru
        </p>
      </div>
    `;

    // Отправка через Resend
    if (!RESEND_API_KEY) {
      // В режиме разработки без API ключа — логируем и возвращаем успех
      console.log("📧 DEV MODE — email would be sent:", { name, email, message });
      return NextResponse.json({ ok: true, dev: true });
    }

    const resendResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: `RCONS Website <${FROM_EMAIL}>`,
        to: [CONTACT_EMAIL],
        reply_to: email,
        subject: `Запрос от ${name}${company ? ` (${company})` : ""}`,
        html: htmlBody,
        attachments,
      }),
    });

    if (!resendResponse.ok) {
      const error = await resendResponse.text();
      console.error("Resend error:", error);
      return NextResponse.json({ error: "Email service error" }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Contact API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
