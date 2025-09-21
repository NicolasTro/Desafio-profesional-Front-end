import { NextResponse } from "next/server";
import { getTokenFromCookie } from "@/lib/auth";
import { DIGITALMONEY_API_BASE } from "@/lib/env";
import jwt from "jsonwebtoken";

export const runtime = "nodejs";

interface DecodedToken {
  username?: string;
  user_id?: string;
  id?: string;
  sub?: string;
}

export async function GET() {
  try {
    console.log("API /account called");

    // Obtener el token del cookie
    const token = await getTokenFromCookie();
    if (!token) {
      console.log("No token found");
      return NextResponse.json({ error: "No token found" }, { status: 401 });
    }
    console.log("Token found: true");

    // Decodificar el JWT
    let decoded: DecodedToken | null = null;
    try {
      decoded = jwt.decode(token) as DecodedToken | null;
      console.log("Decoded JWT:", decoded);
    } catch (error) {
      console.log("Error decoding JWT:", error);
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    // Extraer el user ID (usando username como en /api/me)
    const userId =
      decoded?.username || decoded?.user_id || decoded?.id || decoded?.sub;
    if (!userId) {
      console.log("No user ID found in token");
      return NextResponse.json(
        { error: "No user ID in token" },
        { status: 401 },
      );
    }
    console.log("Extracted user ID:", userId, "from field: username");

    // Llamar a la API externa
    const externalUrl = `${DIGITALMONEY_API_BASE}/api/account`;
    console.log("Calling external API:", externalUrl);

    const response = await fetch(externalUrl, {
      method: "GET",
      headers: {
        Authorization: token,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    console.log("External API response status:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.log("External API error:", errorText);
      return NextResponse.json(
        { error: "Failed to fetch account data" },
        { status: response.status },
      );
    }

    const accountData = await response.json();
    console.log("api/account:", accountData);

    // Devolver los datos de la cuenta
    return NextResponse.json(accountData);
  } catch (error) {
    console.error("Error in /api/account:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
