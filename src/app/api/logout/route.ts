import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
  const jar = await cookies();
  jar.set("dm_token", "", { httpOnly: true, maxAge: 0, path: "/" });
  return NextResponse.json({ ok: true });
}
