import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {jwtDecode} from "jwt-decode";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("dm_token")?.value;
  const { pathname } = req.nextUrl;

  // Rutas públicas que no requieren autenticación
  const publicPaths = ["/", "/login", "/register", "/register/success"];
  if (publicPaths.includes(pathname) || pathname.startsWith("/api/")) {
    return NextResponse.next();
  }

  // Si no hay token → redirigir a login
  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Validar expiración
  try {
    const decoded = jwtDecode<{ exp?: number }>(token);
    if (decoded.exp && decoded.exp <= Date.now() / 1000) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  } catch {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Si todo bien, seguir
  return NextResponse.next();
}

// Configuración: aplica a todo salvo estáticos, imágenes y favicon
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
