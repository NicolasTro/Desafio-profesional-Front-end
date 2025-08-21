import { cookies } from "next/headers";

export async function getTokenFromCookie() {
  const jar = await cookies();
  return jar.get("dm_token")?.value || null;
}
