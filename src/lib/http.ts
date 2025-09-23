import { DIGITALMONEY_API_BASE } from "./env";

export async function apiFetch(path: string, init?: RequestInit & { cacheMode?: RequestCache }) {
  const url = `${DIGITALMONEY_API_BASE}${path}`;
  
  const res = await fetch(url, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
    cache: init?.cacheMode ?? "no-store", // evita cachear respuestas por defecto
  });

  if (!res.ok) {
    // si está no autorizado (401), disparar evento para el front
    if (res.status === 401 && typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("session:expired"));
    }

    const text = await res.text().catch(() => "");
    throw new Error(`API ${path} failed: ${res.status} ${text}`);
  }

  const contentType = res.headers.get("content-type") || "";
  return contentType.includes("application/json") ? res.json() : res.text();
}
