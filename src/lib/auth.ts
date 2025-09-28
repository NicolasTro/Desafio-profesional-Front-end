// Importa el helper de cookies de Next.js (Server Components) y la librería
// 'jsonwebtoken' para decodificar tokens JWT sin verificar la firma.
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

// Tipo que representa la forma esperada (parcial) del token decodificado.
// Se incluyen varias claves posibles (user_id, id, sub, username) porque
// diferentes backends usan distintos nombres para identificar al usuario.
export interface DecodedToken {
  user_id?: string;
  id?: string;
  sub?: string;
  username?: string;
  email?: string;
  exp?: number;
  // Permite otras propiedades adicionales que puedan venir en el token
  [key: string]: unknown;
}

// Lee la cookie 'dm_token' desde el contexto de Next.js (server-side).
// Devuelve el valor del token o null si no existe. La función usa el helper
// `cookies()` que es asíncrono en el runtime de Next.js.
export async function getTokenFromCookie(): Promise<string | null> {
  const jar = await cookies(); 
  const token = jar.get("dm_token");
  return token ? token.value : null;
}


// Obtiene el token de la cookie y lo decodifica (sin verificar firma) para
// extraer el id, email y la expiración (exp). Retorna null si no hay token
// o si la decodificación falla.
export async function getDecodedTokenFromCookie(): Promise<{ id?: string; email?: string; exp?: number } | null> {
  const token = await getTokenFromCookie();
  if (!token) return null;

  try {
    // jwt.decode permite decodificar el payload sin comprobar la firma.
    const decoded = jwt.decode(token) as DecodedToken | null;
    if (!decoded) return null;
    return {
      // Intentamos varias claves para obtener un identificador del usuario
      id: decoded.user_id || decoded.id || decoded.sub || decoded.username,
      // Usamos email o username como fallback para el correo
      email: decoded.email || decoded.username,
      exp: decoded.exp,
    };
  } catch (err) {
    // Log en servidor para ayudar a depurar tokens mal formados
    console.error("Error decoding token:", err);
    return null;
  }
}
