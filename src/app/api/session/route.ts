import { NextResponse } from "next/server";
import { getTokenFromCookie, getDecodedTokenFromCookie } from "@/lib/auth";

export async function GET() {
  const token = await getTokenFromCookie();
  const userInfo = await getDecodedTokenFromCookie();
  return NextResponse.json({ authenticated: Boolean(token), userInfo }, { status: 200 });
}
