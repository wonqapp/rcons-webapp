// src/proxy.ts
// ============================================================
// PROXY (Next.js 16+) — i18n роутинг + CSP заголовки
// Next.js 16: файл называется proxy.ts, функция — proxy
// Удали src/middleware.ts если он есть — нужен только этот файл
// ============================================================

import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { NextRequest } from "next/server";

const intlProxy = createMiddleware(routing);

export function proxy(request: NextRequest) {
  const response = intlProxy(request);

  const nonce = Buffer.from(crypto.randomUUID()).toString("base64");
  const cspHeader = `
    default-src 'self';
    script-src 'self' 'unsafe-eval' 'unsafe-inline' 'nonce-${nonce}';
    style-src 'self' 'unsafe-inline';
    img-src 'self' blob: data:;
    font-src 'self';
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    upgrade-insecure-requests;
  `
    .replace(/\s{2,}/g, " ")
    .trim();

  response.headers.set("Content-Security-Policy", cspHeader);

  return response;
}

export const config = {
  matcher: [
    "/",
    "/((?!api|_next/static|_next/image|assets|favicon.ico|sw.js|.*\\..*).*)",
    "/(ru|en|kk|zh)/:path*",
  ],
};
