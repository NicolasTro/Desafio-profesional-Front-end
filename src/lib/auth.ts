import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

interface DecodedToken {
  user_id?: string;
  id?: string;
  sub?: string;
  username?: string;
  email?: string;
  exp?: number;
  [key: string]: unknown; // Para otros campos posibles en el JWT
}

export async function getTokenFromCookie() {
  const jar = await cookies();
  return jar.get("dm_token")?.value || null;
}

export async function getDecodedTokenFromCookie() {
  const token = await getTokenFromCookie();
  if (!token) return null;
  try {
    const decoded = jwt.decode(token) as DecodedToken | null;
    if (!decoded) return null;

    // Extraer id de posibles campos
    const id = decoded.user_id || decoded.id || decoded.sub || decoded.username;
    const email = decoded.email || decoded.username;
    const exp = decoded.exp;

    return { id, email, exp };
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
}
