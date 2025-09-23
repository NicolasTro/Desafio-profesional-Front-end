import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export interface DecodedToken {
  user_id?: string;
  id?: string;
  sub?: string;
  username?: string;
  email?: string;
  exp?: number;
  [key: string]: unknown;
}

export async function getTokenFromCookie(): Promise<string | null> {
  const jar = await cookies(); // ahora con await
  const token = jar.get("dm_token");
  return token ? token.value : null;
}

export async function getDecodedTokenFromCookie(): Promise<{ id?: string; email?: string; exp?: number } | null> {
  const token = await getTokenFromCookie();
  if (!token) return null;

  try {
    const decoded = jwt.decode(token) as DecodedToken | null;
    if (!decoded) return null;
    return {
      id: decoded.user_id || decoded.id || decoded.sub || decoded.username,
      email: decoded.email || decoded.username,
      exp: decoded.exp,
    };
  } catch (err) {
    console.error("Error decoding token:", err);
    return null;
  }
}
