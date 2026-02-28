import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://rcons.ru";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/_next/",
          "/_vercel/",
          "/admin/",
          "/private/",
          "/search?",
          "/*?utm_=",
          "/*?fbclid=",
          "/*?gclid=",
          "/*?yclid=",
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
