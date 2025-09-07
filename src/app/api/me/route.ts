import { NextResponse } from "next/server";
import { getTokenFromCookie } from "@/lib/auth";
import { DIGITALMONEY_API_BASE } from "@/lib/env";
import jwt from 'jsonwebtoken';

export const runtime = 'nodejs';

interface JwtPayload {
  user_id?: string;
  id?: string;
  sub?: string;
  name?: string;
  email?: string;
  username?: string;
  // Agrega otros campos si es necesario
}

export async function GET() {
    
    
  try {
    
    const token = await getTokenFromCookie();
    console.log("Token found:", !!token);
    if (!token) {
      console.log("No token found in cookies");
      return NextResponse.json({ error: "No autorizado - no hay token" }, { status: 401 });
    }

    // Decodificar el token para obtener el user_id
    let decoded: JwtPayload | null = null;
    try {
      decoded = jwt.decode(token) as JwtPayload | null;
      console.log("Decoded JWT:", decoded);
    } catch (decodeError) {
      console.log("Error decoding JWT:", decodeError);
      return NextResponse.json(
        { error: "Token inválido - error al decodificar" },
        { status: 400 }
      );
    }

    if (!decoded) {
      console.log("Decoded token is null or invalid");
      return NextResponse.json(
        { error: "Token inválido - no se pudo decodificar" },
        { status: 400 }
      );
    }
    const userId = decoded.user_id || decoded.id || decoded.sub || decoded.username;
    console.log("Extracted user ID:", userId, "from field:", 
      decoded.user_id ? "user_id" : 
      decoded.id ? "id" : 
      decoded.sub ? "sub" : 
      decoded.username ? "username" : "none");

    if (!userId) {
      console.log("No user ID found in token");
      return NextResponse.json(
        { error: "Token inválido - no se encontró ID de usuario" },
        { status: 400 }
      );
    }
    console.log("DIGITALMONEY_API_BASE:", DIGITALMONEY_API_BASE);

    const apiUrl = `${DIGITALMONEY_API_BASE}/api/users/${userId}`;
    console.log("Calling external API:", apiUrl);

    const upstream = await fetch(apiUrl, {
      method: "GET",
      headers: {
        Authorization: token,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    console.log("External API response status:", upstream.status);

    if (!upstream.ok) {
      const errorText = await upstream.text();
      console.log("External API error:", errorText);
      return NextResponse.json(
        { error: "Error al obtener datos del usuario", details: errorText },
        { status: upstream.status }
      );
    }

    const userData = await upstream.json();
    console.log("User data received:", userData);
    
    const mappedUserData = {
      id: String(userData.id),
      name: userData.firstname ,
      lastname: userData.lastname,
      email: userData.email,
      dni: userData.dni,
      phone: userData.phone
    };
    
    console.log("Mapped user data:", mappedUserData);
    return NextResponse.json(mappedUserData, { status: 200 });
  } catch (error) {
    console.error("Error en /api/me:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: "Error interno del servidor", details: errorMessage },
      { status: 500 }
    );
  }
}
