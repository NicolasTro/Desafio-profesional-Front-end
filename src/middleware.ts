import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getTokenFromCookie } from "@/lib/auth";
import jwt from "jsonwebtoken";

export async function middleware(request: NextRequest) {
  const token = await getTokenFromCookie();
  const { pathname } = request.nextUrl;

  // Rutas públicas que no requieren autenticación
  const publicPaths = ["/", "/login", "/register", "/register/success"];

  // Si es una ruta pública, permite el acceso
  if (publicPaths.includes(pathname) || pathname.startsWith("/api/")) {
    return NextResponse.next();
  }

  // Si no hay token, redirige a login
  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Verificar si el token ha expirado
  try {
    const decoded = jwt.decode(token) as { exp?: number };
    if (decoded?.exp) {
      const now = Math.floor(Date.now() / 1000);
      if (decoded.exp <= now) {
        // Token expirado, redirige a login
        return NextResponse.redirect(new URL("/login", request.url));
      }
    }
  } catch (error) {
    console.error("Error decoding token in middleware:", error);
    // Si hay error en decodificación, redirige por seguridad
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Si hay token válido y no expirado, permite el acceso
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
