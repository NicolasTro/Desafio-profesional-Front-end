export async function fetchMe() {
  const res = await fetch("/api/session", {
    method: "GET",
    headers: { Accept: "application/json" },
    credentials: "include",
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || `HTTP ${res.status}`);
  }
  const payload = await res.json();
  if (!payload || !payload.authenticated) return null;
  return payload.user ?? null;
}
