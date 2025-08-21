import { NextResponse } from "next/server";
import { getTokenFromCookie } from "@/lib/auth";

export async function GET() {
  const token = await getTokenFromCookie();
  return NextResponse.json({ authenticated: Boolean(token) }, { status: 200 });
}
