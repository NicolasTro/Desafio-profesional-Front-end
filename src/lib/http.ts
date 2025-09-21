import { DIGITALMONEY_API_BASE } from "./env";

export async function apiFetch(path: string, init?: RequestInit) {
  const url = `${DIGITALMONEY_API_BASE}${path}`;
  const res = await fetch(url, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
    cache: "no-store",
  });
  if (!res.ok) {
    
    if (res.status === 401) {
      try {
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("session:expired"));
        }
      } catch {
        // ignore
      }
    }
    const text = await res.text().catch(() => "");
    throw new Error(`API ${path} failed: ${res.status} ${text}`);
  }
  const contentType = res.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    return res.json();
  }
  return res.text();
}
