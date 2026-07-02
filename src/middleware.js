import { defineMiddleware } from "astro:middleware";

export const onRequest = defineMiddleware(async (context, next) => {
  const response = await next();
  const contentType = response.headers.get("content-type");
  if (contentType && contentType.includes("text/html")) {
    let html = await response.text();
    html = html.replace(/href="\/([^".#?]+)"/g, (match, p) => `href="/${p.replace(/\/+$/, '')}/"`);
    return new Response(html, { status: response.status, headers: response.headers });
  }
  return response;
});