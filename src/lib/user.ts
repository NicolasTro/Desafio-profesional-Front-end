import jwt from "jsonwebtoken";
import { DIGITALMONEY_API_BASE } from "./env";

interface JwtPayload {
  user_id?: string;
  id?: string;
  sub?: string;
  name?: string;
  email?: string;
  username?: string;
  exp?: number;
  [key: string]: unknown;
}

export type UserData = {
  id: string;
  name?: string | null;
  lastname?: string | null;
  email?: string | null;
  dni?: string | null;
  phone?: string | null;
};

export interface UpstreamError extends Error {
  status?: number;
  details?: string;
}


export async function fetchUserFromToken(token: string): Promise<UserData> {
  // decode token to extract user id
  let decoded: JwtPayload | null = null;
  try {
    decoded = jwt.decode(token) as JwtPayload | null;
  } catch {
    throw new Error("Token inválido - error al decodificar");
  }

  if (!decoded) throw new Error("Token inválido - no se pudo decodificar");

  const userId = decoded.user_id || decoded.id || decoded.sub || decoded.username;
  if (!userId) throw new Error("Token inválido - no se encontró ID de usuario");

  const apiUrl = `${DIGITALMONEY_API_BASE}/api/users/${userId}`;

  const upstream = await fetch(apiUrl, {
    method: "GET",
    headers: {
      Authorization: token,
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  if (!upstream.ok) {
    const txt = await upstream.text().catch(() => "");
    const upstreamErr: UpstreamError = new Error(
      "Error al obtener datos del usuario: " + txt,
    ) as UpstreamError;
    upstreamErr.status = upstream.status;
    upstreamErr.details = txt;
    throw upstreamErr;
  }

  const userData = await upstream.json();

  return {
    id: String(userData.id),
    name: userData.firstname ?? null,
    lastname: userData.lastname ?? null,
    email: userData.email ?? null,
    dni: userData.dni ?? null,
    phone: userData.phone ?? null,
  };
}

export default fetchUserFromToken;
